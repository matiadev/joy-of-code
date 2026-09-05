---
title: Page Versus Standalone Endpoints In SvelteKit
description: Learn when to use page versus standalone API endpoints in SvelteKit.
slug: using-sveltekit-endpoints
published: '2023-05-05'
category: sveltekit
---

<script lang="ts">
	import Embed from '#lib/components/embed.svelte'
	import Image from '#lib/components/image.svelte'
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="8OmsVZuuQMc" title="Using SvelteKit Endpoints" />

## Table of Contents

## Oops, I Guess We’re Full-Stack Developers Now

Based on the amount of questions I get the most confusing part of SvelteKit is when to use standalone endpoints versus using page endpoints.

> 🔥 If you started learning SvelteKit and feel lost you can watch [Complete SvelteKit Course For Building Modern Web Apps](https://www.youtube.com/watch?v=MoGkX4RvZ38) on YouTube or read and watch the parts here. You can support my work by subscribing and [becoming a patron](https://patreon.com/joyofcode).

This is not surprising because SvelteKit blurs the line between frontend and backend which means it's not clear how the data flows.

There's a great talk by [@chriscoyier](https://twitter.com/chriscoyier) titled [Oops, I Guess We’re Full-Stack Developers Now](https://www.youtube.com/watch?v=lFOfQsi5ye0) worth watching which observed this trend early.

<YouTube id="lFOfQsi5ye0" title="Oops, I Guess We’re Full-Stack Developers Now" />

**Before you continue** I want to you to take a deep breath, relax and stop caring about best practices because it's a pointless pursuit many are paralyzed by when learning and instead **try and break things**.

## Try It Yourself

If you're reading this post and haven't seen the video here are the examples for everything I used in the video, so you can try it out yourself.

<Embed src="https://stackblitz.com/github/joysofcode/using-sveltekit-endpoints?ctl=1&embed=1&file=src%2Froutes%2F%2Bpage.svelte&title=Using SvelteKit Endpoints" title="Using SvelteKit Endpoints" />

## Client-Side Rendering

I'm going to briefly go over rendering methods, so you understand how data loading fits into it.

You might be familiar with the next example if you ever worked on a single page application (SPA) which uses client-side rendering (CSR).

<Image src="csr.webp" alt="Client-side rendering" />

This is a typical single-page application style which uses JavaScript
to render content also known as client-side rendering.

```svelte:src/routes/+page.svelte showLineNumbers
<script lang="ts">
	async function getPosts() {
		const response = await fetch('https://jsonplaceholder.typicode.com/posts')
		return response.json()
	}

	let posts = getPosts()
</script>

{#await posts}
  <p>Loading...</p>
{:then posts}
  <ul>
    {#each data.posts as post}
      <li>{post.title}</li>
    {/each}
  </ul>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
```

Keep in mind this is a **valid** approach even in SvelteKit that has a focus on **server-side rendering** if you ever need to run some code on the client (I use this method to get the [latest views count for the posts](https://github.com/mattcroat/joy-of-code/blob/5bc65f2fed2ae81f67a9f28c3c2b74dfe8bf8069/src/lib/ui/posts.svelte) while the posts are prerendered).

That being said this is is a worse user experience because JavaScript has to load for the page first and you can't make credentialed requests without a server.

## Page Endpoints

A page in SvelteKit follows the rule of two like the Sith in Star Wars where the master `+page.svelte` file always has an apprentice `+page.ts` or `+page.server.ts` file to get the data for the page.

> 🐿️ While you can use `+page.svelte` on its own a `+page.ts` or `+page.server.ts` file does **nothing** on its own.

If you want to load the data before rendering the page you have to use a **page endpoint** which returns HTML on the first page visit and uses JSON data when the client-side router loads in SvelteKit for a SPA experience.

<Image src="ssr.webp" alt="Server-side rendering" />

You can use use `+page.server.ts` if you need access to the
file system, database, or have secrets.

```ts:src/routes/+page.ts showLineNumbers
async function getPosts() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  return response.json()
}

export async function load() {
  return {
    posts: await getPosts()
  }
}
```

The page component gets rendered twice:

- first time on the server to get data using SSR
- second time on the client to restore JavaScript on the page
  in a process called hydration

```svelte:src/routes/+page.svelte showLineNumbers
<script>
  export let data
</script>

<ul>
	{#each data.posts as post}
		<li>{post.title}</li>
	{/each}
</ul>
```

Page endpoints are great for rendering dynamic data.

<Image src="dynamic.webp" alt="Dynamic data" />

```ts:src/routes/[id]/+page.ts showLineNumbers
async function getPost(id: string) {
	const response = await fetch(
		`https://jsonplaceholder.typicode.com/posts/${id}`
	)
	return response.json()
}

export async function load({ params }) {
	return {
		post: await getPost(params.id),
	}
}
```

```svelte:src/routes/[id]/+page.svelte showLineNumbers
<script>
	export let data
</script>

<h2>{data.post.title}</h2>
<p>{data.post.body}</p>
```

I mentioned the rule of two but in rare cases you can have a `+page.svelte` file with a `+page.server.ts` and `+page.ts` file.

This can be useful if you want to defer navigation until an image is loaded.

```ts:src/routes/images/+page.ts showLineNumbers
async function getImages(limit: number) {
	const response = await fetch('https://jsonplaceholder.typicode.com/photos')
	const images = await response.json()
	return images.slice(0, limit)
}

export async function load() {
	return {
		images: await getImages(20),
	}
}
```

```svelte:src/routes/images/+page.svelte showLineNumbers
<script lang="ts">
	export let data
</script>

<section>
	{#each data.images as image}
		<a class="image" href="images/{image.id}">
			<img src={image.url} alt={image.title} />
		</a>
	{/each}
</section>

<style>
	section {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--size-3);
	}
</style>
```

I'm going to get the image on the server but pass the returned `data` to the `load` function on the client.

```ts:src/routes/images/[id]/+page.server.ts showLineNumbers
async function getImage(id: string) {
	const response = await fetch(
		`https://jsonplaceholder.typicode.com/photos/${id}`
	)
	return response.json()
}

export async function load({ params }) {
	return {
		image: await getImage(params.id),
	}
}
```

You can run a `load` function on the client to defer navigation until the image is loaded.

```ts:src/routes/images/[id]/+page.ts showLineNumbers
import { browser } from '$app/environment'

async function loadImage(url: string) {
	return new Promise((resolve) => {
		const image = new Image()
		image.onload = () => resolve(image)
		image.src = url
	})
}

export async function load({ data }) {
	if (browser) {
		await loadImage(data.image.url)
	}

	return { data }
}
```

```svelte:src/routes/images/[id]/+page.svelte showLineNumbers
<script lang="ts">
	export let data
</script>

<img src={data.image.url} alt={data.image.title} />
```

A `load` function exported from a `+page.ts` and `+layout.ts` file is considered a **universal `load` function** while a `load` function exported from `+page.server.ts` and `+layout.server.ts` is considered a **server `load` function**.

This is important because they return different things:

- **universal `load` function** can only return an object which can have **any values** including things like **Svelte components**
- **server `load` function** can only return things that can be serialized with [devalue](https://github.com/rich-harris/devalue) like JSON, `BigInt`, `Date`, `Map`, `Set` and `RegExp` and **promises** for streaming

This is awesome because besides returning regular data you can use `+page.ts` to return a Svelte component over the server if you need to.

```svelte:src/routes/counter.svelte showLineNumbers
<script lang="ts">
	let count = 0
	let increment = () => count += 1
</script>

<button on:click={increment}>
	{count}
</button>
```

```ts:src/routes/+page.ts showLineNumbers
import Counter from './counter.svelte'

export async function load() {
	return {
		title: 'Universal load functions',
		component: Counter,
	}
}
```

```svelte:src/routes/+page.svelte showLineNumbers
<script lang="ts">
	export let data
</script>

<h1>{data.title}</h1>

<svelte:component this={data.component} />
```

Using `+page.server.ts` you can only return data that can be serialized with **devalue**.

```ts:src/routes/+page.server.ts showLineNumbers
export async function load() {
	return {
		title: 'Server load functions',
		bigint: BigInt(9007199254740991n),
		date: new Date(),
		map: new Map(),
		set: new Set(),
		regex: /([A-Z])\w+/g,
	}
}
```

What makes SvelteKit truly great is how you're able to access data in routes which I cover in great detail in [SvelteKit API Endpoints And Loading Data For Pages](https://joyofcode.xyz/sveltekit-loading-data).

Returning data from a child `load` function is going to update the SvelteKit `$page.data` store you can subscribe to in a parent layout for things like SEO or anything else.

```ts:src/routes/child/+page.ts showLineNumbers
export async function load() {
	return {
		title: 'Title',
		description: 'Description',
	}
}
```

```svelte:src/routes/child/+page.svelte showLineNumbers
<script>
	export let data
</script>

<h2>{data.title}</h2>
<p>{data.description}</p>
```

```svelte:src/routes/+layout.svelte showLineNumbers
<script>
	import { page } from '$app/stores'
</script>

<svelte:head>
	<title>{$page.data.title}</title>
	<meta name="description" content={$page.data.description} />
</svelte:head>

<h1>Accessing child data</h1>

<slot />
```

Another reason for using page endpoints are [SvelteKit form actions](https://kit.svelte.dev/docs/form-actions) which is an `actions` object you can export from `+page.server.ts` with methods that `POST` data to the server.

```ts:src/routes/+page.server.ts showLineNumbers
import { fail } from '@sveltejs/kit'

export const actions = {
	async login({ request }) {
		const data = await request.formData()
		const email = data.get('email')
		const password = data.get('password')

		if (!email || password !== '1234') {
			return fail(400, { email, invalid: true })
		}
	},
	async register() {
		// ...
	},
}
```

```svelte:src/routes/+page.svelte showLineNumbers
<script lang="ts">
	import { enhance } from '$app/forms'

	export let form
</script>

<h1>Form actions</h1>

<form method="POST" action="?/login" use:enhance>
	{#if form?.invalid}
		<p class="error">Invalid credentials.</p>
	{/if}

	<label for="email">
		Email
		<input name="email" type="email" value={form?.email ?? ''} />
	</label>

	<label for="password">
		Password
		<input name="password" type="password" />
	</label>

	<button type="submit">Log in</button>
	<button type="submit" formaction="?/register">
    Register
  </button>
</form>
```

You could use a **standalone endpoint** for forms but then you have to manage data fetching and error handling with JavaScript yourself which SvelteKit does for you including **progressive enhancement** but you can [read or watch more about working with forms in SvelteKit](https://joyofcode.xyz/working-with-forms-in-sveltekit).

## Standalone Endpoints

A standalone endpoint can be used by **multiple routes** of your app and can even serve as a **REST API** inside your app our outside your app if you include [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) headers.

<Image src="standalone.webp" alt="Standalone endpoint" />

You have access to every [HTTP request method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) inside `+server.ts` to make a complete REST API.

```ts:src/routes/example/+server.ts showLineNumbers
export async function GET(requestEvent) {}
export async function POST(requestEvent) {}
export async function PUT(requestEvent) {}
export async function PATCH(requestEvent) {}
export async function DELETE(requestEvent) {}
```

This can be simple as a `GET` endpoint that returns a random number.

```ts:src/routes/api/random-number/+server.ts showLineNumbers
export async function GET({ url }) {
	const max = Number(url.searchParams.get('max') ?? 1)
	const randomNumber = Math.random() * max
	return new Response(String(randomNumber))
}
```

You can pass the max range you want like `/api/random-number?max=10` or it defaults to `1`.

```svelte:src/routes/+page.svelte showLineNumbers
<script lang="ts">
	let randomNumber = 0

	async function getRandomNumber() {
		const response = await fetch('/api/random-number')
		randomNumber = await response.json()
	}
</script>

<h1>Random number</h1>
<h2>{randomNumber}</h2>

<button on:click={getRandomNumber}>🎲</button>
```

Need to return XML data for a feed? A standalone endpoint can return **anything**.

```ts:src/routes/rss.xml/+server.ts showLineNumbers
export async function GET() {
	const headers = { 'Content-Type': 'application/xml' }

	const xml = `
    <?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>Joy of Code</title>
        <link>https://joyofcode.xyz/</link>
        <description>Digital garden growing curious minds with content related to web development and design.</description>
      </channel>
    </rss>
	`.trim()

	return new Response(xml, { headers })
}
```

If you need an actual RSS feed [here is how I implemented mine](https://github.com/mattcroat/joy-of-code/blob/main/src/routes/rss.xml/%2Bserver.ts) which you can use.

You could make an image API like [Cloudinary](https://cloudinary.com/) for transforming images or for generating a **CSV** or **PDF** file.

```ts:src/routes/download/+server.ts showLineNumbers
import PDFDocument from 'pdfkit'

export async function GET() {
	const pdf = new PDFDocument()
	pdf.text('Hey friends! 👋', 100, 100)
	pdf.end()

	return new Response(pdf, {
		headers: {
			'Content-type': 'application/pdf',
			'Content-Disposition': 'attachment; filename=awesome.pdf',
		},
	})
}
```

Standalone endpoints are great for reusable code like a posts API where you can pass the range you want over the URL or filter posts based on the category or who authored it.

```ts:src/routes/api/posts/+server.ts showLineNumbers
import { json } from '@sveltejs/kit'

async function getPosts({ start = 0, end = 10, userId = null }) {
	const response = await fetch('https://jsonplaceholder.typicode.com/posts')
	const posts: Post[] = await response.json()

	if (userId) {
		const userIdPosts = posts.filter((user) => user.userId === userId)
		return userIdPosts.slice(start, end)
	} else {
		return posts.slice(start, end)
	}
}

export async function GET({ url }) {
	const start = Number(url.searchParams.get('start')) || 0
	const end = Number(url.searchParams.get('end')) || 10
	const userId = Number(url.searchParams.get('userId')) || null

	const posts = await getPosts({ start, end, userId })

	return json(posts)
}
```

## Server-Only Modules

One last thing worth mentioning are **server-only modules** which are great for preventing importing sensitive data into your frontend code.

I have an entire post on [using environment variables with SvelteKit](https://joyofcode.xyz/sveltekit-environment-variables) if you need it.

Besides using environment variables for secrets you can also make using them more secure by using a `.server` file like `secrets.server.ts` or placing them inside a `lib/server` folder you can import as `$lib/server/secrets.ts`.

You should now have more confidence and understanding how to use SvelteKit endpoints.

You can learn more about [SvelteKit API endpoints and loading data for pages](https://joyofcode.xyz/sveltekit-loading-data) and [understand how data flows in SvelteKit](https://joyofcode.xyz/sveltekit-data-flow).
