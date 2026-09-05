---
title: Using SvelteKit For Web Scraping
description: Using SvelteKit for web scraping to make an API for GitHub contributions.
slug: sveltekit-web-scraping
published: '2023-08-24'
category: sveltekit
---

<script lang="ts">
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="T-lBPpeokfY" title="Using SvelteKit For Web Scraping" />

## Table of Contents

## Web Scraping

I was working on a project where I used [Threlte](https://threlte.xyz/) to make a 3D visualization of GitHub contributions using the undocumented [GitHub Skyline API](https://skyline.github.com/) I yoinked from the network tab which unceremoniously died soon after. 😂

That one is on me, but the other options I had looked lame, and required authentication to use the GitHub API for a worse result.

Using scraping responsibly is a great excuse to practice DOM and data manipulation, which is most of what you do as a web developer, and you only get the data you care about.

You can find the code on [GitHub](https://github.com/joysofcode/sveltekit-web-scraping).

## The Mark

I encourage you to open your GitHub contributions at [https://github.com/user](https://github.com/user).

The first thing I do is open the network tab and look at any fetch requests, but no luck because the entire page is server-side rendered. This means we can't yoink the JSON response and have to fetch and parse the HTML instead.

No big deal.

To figure out how to scrape the data we need to examine the contributions inside the elements tab. The GitHub contributions are a table with seven rows. Each row represents days in the week from Sunday to Saturday.

```svelte:example.html showLineNumbers
<table>
  <!-- Sundays -->
  <tr>
    <td>
      <span>No contributions on Sunday, January 2, 2022</span>
    <td>
    <td>
      <span>1 contribution on Sunday, January 9, 2022</span>
    <td>
    <!-- ... -->
  </tr>
  <!-- ... -->
</table>
```

I propose we query the rows first, then loop over the rows to grab the days and the content inside of them, which can be parsed however you want.

There's other interesting things if you poke around the DOM such as the `data-graph-url` attribute which points to [https://github.com/users/mattcroat/contributions](https://github.com/users/mattcroat/contributions) and only shows the HTML for the table.

Notice how the URL changes when you change the year to update the GitHub contribution graph to [https://github.com/mattcroat?tab=overview&from=2022-12-01&to=2022-12-31](https://github.com/mattcroat?tab=overview&from=2022-12-01&to=2022-12-31) which can be used as our API.

Knowing this it's not a far reach to make an educated guess if we can use the query parameters for [https://github.com/users/mattcroat/contributions?from=2022-12-01&to=2022-12-31](https://github.com/users/mattcroat/contributions?from=2022-12-01&to=2022-12-31) which turns out you can.

I prefer the second option, because it gives us only what we care about, there's less amount of data to send over the wire which is a more responsible thing to do.

## Querying And Parsing The Data

If you try fetching the data on the client the request is going to be blocked by [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) for security reasons.

```svelte:src/routes/+page.svelte showLineNumbers
<script>
	import { onMount } from 'svelte'

	onMount(async () => {
		await fetch('https://github.com/mattcroat')
	})
</script>
```

> Access to fetch at 'https://github.com/mattcroat' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

**CORS** is only enforced by the browser which means we can use the server by creating a standalone API endpoint in SvelteKit.

I'm going to create a standalone endpoint in SvelteKit by creating a `+server.ts` route.

```ts:src/routes/[user]/[year]/+server.ts showLineNumbers
export async function GET({ params }) {
  return new Response('API endpoint')
}
```

Instead of using a dynamic route to get the `params` from `user/year` you could use query parameters `?user=user&year=year` if you want.

Let's fetch the contributions.

```ts:src/routes/[user]/[year]/+server.ts showLineNumbers
import type { RouteParams } from './$types.js'

async function getContributions({ user, year }: RouteParams) {
	const api = `https://github.com/users/${user}/contributions?from=${year}-12-01&to=${year}-12-31`
	const response = await fetch(api)

	if (!response.ok) {
		throw new Error(`Failed to fetch: ${response.status}`)
	}

	return await response.text()
}
```

The response is only text and while you could use regular expressions I would prefer to query the elements, but the DOM doesn't exist on the server.

There are popular libraries for creating a fake DOM you can query on the server like [Cheerio](https://github.com/cheeriojs/cheerio) but I'm going to use [linkedom](https://github.com/WebReflection/linkedom) because it doesn't depend on Node, and you can install the package with `npm i linkedom`.

I'm going to query and loop over the rows, then query and loop over the days. I'm going to use `.split()` on the contents to turn it into an array and get the data we need instead of using regular expressions.

```ts:example.ts showLineNumbers
// turn string into an array
'No contributions on Sunday, January 2, 2022'.split(' ')

// get the data
['No', 'contributions', 'on', 'Sunday,', 'January', '2,', '2022']
```

Knowing this we can parse the contributions.

```ts:src/routes/[user]/[year]/+server.ts showLineNumbers
import { parseHTML } from 'linkedom'

function parseContributions(html: string) {
	const { document } = parseHTML(html)

	const rows = document.querySelectorAll<HTMLTableRowElement>('tbody > tr')

	const contributions = []

	for (const row of rows) {
		const days = row.querySelectorAll<HTMLTableCellElement>('td:not(.ContributionCalendar-label)')

		const currentRow = []

		for (const day of days) {
			const data = day.innerText.split(' ')

			if (data.length > 1) {
				const contribution = {
					count: data[0] === 'No' ? 0 : +data[0],
					month: data[3],
					day: data[4].replace('.', ''),
					level: +day.dataset.level!,
				}
				currentRow.push(contribution)
			} else {
				currentRow.push(null)
			}
		}

		contributions.push(currentRow)
	}

	return contributions
}
```

The only thing left to do is return a JSON response.

```ts:src/routes/[user]/[year]/+server.ts showLineNumbers
import { json } from '@sveltejs/kit'

export async function GET({ params }) {
	const html = await getContributions(params)
	return json(parseContributions(html))
}
```

If you're going to host a public API, you can use cache-control headers and allow others to make a request to it.

```ts:src/routes/[user]/[year]/+server.ts showLineNumbers
export async function GET({ params, setHeaders }) {
	setHeaders({
		'Access-Control-Allow-Origin': '*', // allow CORS
		'Cache-Control': `public, s-maxage=${60 * 60 * 24 * 365}`, // one year
	})

	const html = await getContributions(params)
	return json(parseContributions(html))
}
```

## Showing The Contributions Graph

Let's recreate the GitHub contributions graph.

I'm going to use server-side rendering in SvelteKit but you can fetch the data on the client if you want.

```ts:src/routes/+page.ts showLineNumbers
export async function load({ fetch }) {
	const contributions = await (await fetch('mattcroat/2022')).json()
	return { contributions }
}
```

The only thing left to do is loop over the contributions.

```svelte:src/routes/+page.svelte showLineNumbers
<script lang="ts">
	export let data
</script>

<svelte:head>
	<title>GitHub API</title>
</svelte:head>

<h1>GitHub Contributions</h1>

<table>
	{#each data.contributions as row}
		<tr>
			{#each row as day}
				<td data-level={day?.level} />
			{/each}
		</tr>
	{/each}
</table>

<style>
	:global(html, body) {
		height: 100%;
	}

	:global(body) {
		display: grid;
		place-content: center;
		font-family: sans-serif;
		color: hsl(220 10% 98%);
		background-color: hsl(220 10% 10%);
	}

	h1 {
		text-align: center;
	}

	td {
		padding: 0.4rem;
		border-radius: 2px;

		&[data-level='0'] {
			background-color: #2c333b;
		}

		&[data-level='1'] {
			background-color: #00442a;
		}

		&[data-level='2'] {
			background-color: #006d35;
		}

		&[data-level='3'] {
			background-color: #00a648;
		}

		&[data-level='4'] {
			background-color: #00d35c;
		}
	}
</style>
```

That's it! 😄
