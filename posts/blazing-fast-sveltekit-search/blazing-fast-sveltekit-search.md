---
title: How To Make A Blazing Fast SvelteKit Search
description: Simple but powerful search with zero network requests at no cost using FlexSearch.
slug: blazing-fast-sveltekit-search
published: '2024-02-20'
category: sveltekit
---

<script lang="ts">
	import Embed from '#lib/components/embed.svelte'
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="llGupgNwmIk" title="Blazing Fast SvelteKit Search" />

## Table of Contents

## Introduction

In this post I'm going to show you how you can easily create the same search I use on this site using [FlexSearch](https://github.com/nextapps-de/flexsearch) inspired by the search on the [Svelte](https://svelte.dev/) site.

<Embed src="https://stackblitz.com/github/joysofcode/sveltekit-flexsearch?ctl=1&embed=1&file=src%2Froutes%2F%2Bpage.svelte&view=preview&title=SvelteKit Search" title="SvelteKit Search" />

You can find the code on [GitHub](https://github.com/joysofcode/sveltekit-flexsearch).

## Project Setup

The only dependency you need is `flexsearch` which is a light text search engine used to index, and search content.

```shell:terminal
npm i flexsearch
```

Inside your SvelteKit project create these files.

```shell:tree
src/
├── lib/
│   └── search.ts
└── routes/
    ├── search.json/
    │   └── +server.ts
    └── +page.svelte
```

- `search.ts` is going to house our indexing and search logic
- `search.json` is an endpoint that's going to serve the prerendered content as JSON for indexing (this avoids having to write to a JSON file)
- `+page.svelte` is where the search UI lives

The naming, and placement of these files is not important outside the usual SvelteKit conventions for creating routes.

## Preparing The Data

You can find [example posts](https://github.com/joysofcode/sveltekit-flexsearch/blob/main/src/routes/search.json/posts.json) in the repo if you want to try it out.

Here I'm just importing the posts and serving them as JSON, but you probably like me have Markdown content that you want to import and strip into plain text.

```ts:routes/search.json/+server.ts showLineNumbers
import { json } from '@sveltejs/kit'
import posts from './posts.json'

export const prerender = true

export async function GET() {
	return json(posts)
}
```

If you need an example [here is how I've done it](https://github.com/mattcroat/joy-of-code/blob/main/src/routes/api/search/%2Bserver.ts), but I suggest you use a [npm package to remove Markdown](https://www.npmjs.com/search?q=remove%20markdown).

## Creating The Search Index

Creating the search index is simple, and most of the work revolves around replacing the matched text with the `<mark>` element.

```ts:lib/search.ts showLineNumbers
import FlexSearch from 'flexsearch'

let postsIndex: FlexSearch.Index
let posts: Post[]

export function createPostsIndex(data: Post[]) {
  // create the posts index
	postsIndex = new FlexSearch.Index({ tokenize: 'forward' })

	data.forEach((post, i) => {
    // index the title and content together
		const item = `${post.title} ${post.content}`
    // add the item to the index 👍️
		postsIndex.add(i, item)
	})

	posts = data
}
```

The `tokenize` option sets how strict you want the search to be. You would have to type `foobar` to match the entire word because it's `strict` by default. Using the `forward` option typing `fo` would match `fo`obar.

## Creating The Search Function

Next let's write the search function.

```ts:lib/search.ts showLineNumbers
export function searchPostsIndex(searchTerm: string) {
  // escape special regex characters
	const match = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  // return matching post indexes 💪
	const results = postsIndex.search(match)

	return results
    // filter the posts based on the matched index
		.map((index) => posts[index as number])
    // you can do whatever you want at this point 👌
		.map(({ slug, title, content }) => {
			return {
				slug,
        // replace match in title with a marker
				title: replaceTextWithMarker(title, match),
        // match words in post and replace matches with marker
				content: getMatches(content, match),
			}
		})
}
```

The `\\$&` expression returns the escaped character where `\\` represents the escape character, and `$&` is the matched string.

## Replacing Matches With A Marker

To replace the matched words with a `<mark>` element, we need to find the word indexes for the match inside the post, and return them.

```ts:lib/search.ts showLineNumbers
function getMatches(text: string, searchTerm: string, limit = 1) {
	// create dynamic regex 😎
	const regex = new RegExp(searchTerm, 'gi')
  // word indexes
	const indexes = []
  // matches count
	let matches = 0
  // current match in loop
	let match

	while ((match = regex.exec(text)) !== null && matches < limit) {
		// push that shit
    indexes.push(match.index)
		// increment matches
		matches++
	}

  // take the word index...
	return indexes.map((index) => {
    // go back 20 characters
		const start = index - 20
    // go forward 80 characters
		const end = index + 80
    // yoink the text
		const excerpt = text.substring(start, end).trim()
    // return excerpt 🤝
		return `...${replaceTextWithMarker(excerpt, searchTerm)}...`
	})
}

function replaceTextWithMarker(text: string, match: string) {
  // create dynamic regex 😎
	const regex = new RegExp(match, 'gi')
  // preserves the text casing 🤙
	return text.replaceAll(regex, (match) => `<mark>${match}</mark>`)
}
```

I love to use `substring` over `slice` in this case because you don't have to worry if the index is out of bounds since a negative index is going to be `0`.

The reason we create a dynamic regex using `new RegExp` is because you can't pass a variable to a regex literal `/searchTerm/gi`.

By default I return one match from the post, but you can return as many as you want, and loop over them.

## Creating The Search UI

The only thing left to do is put everything together.

```svelte:routes/+page.svelte showLineNumbers
<script lang="ts">
	import { onMount } from 'svelte'
	import { createPostsIndex, searchPostsIndex } from '$lib/search'

	let search: 'loading' | 'ready' = 'loading'
	let searchTerm = ''
	let results = []

	onMount(async () => {
    // get the posts
		const posts = await fetch('/search.json').then((res) => res.json())
		// create search index
    createPostsIndex(posts)
    // we're in business 🤝
		search = 'ready'
	})

	$: if (search === 'ready') {
    // runs each time `searchTerm` updates
		results = searchPostsIndex(searchTerm)
	}
</script>

{#if search === 'ready'}
	<div class="search">
		<input
			bind:value={searchTerm}
			placeholder="Search"
			autocomplete="off"
			spellcheck="false"
			type="search"
		/>

		<div class="results">
			{#if results}
				<ul>
					{#each results as result}
						<li>
							<a href="/{result.slug}">
								{@html result.title}
							</a>
							<p>{@html result.content}</p>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
{/if}
```

You can find the [search styles](https://github.com/joysofcode/sveltekit-flexsearch/blob/main/src/routes/%2Bpage.svelte) in the example repo but that's it! 👏

## Using A Web Worker

If you have a lot of content, you might start to notice the UI starting to feel less responsive because the amount of work is blocking the main JavaScript thread, which is a perfect use case for the [Web Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers).

A web worker (not to be confused with service worker) is a way to run your code in the background, separate from the main thread, and send and receive messages from the worker.

Here is some example code.

```ts:search-worker.ts showLineNumbers
import { createPostsIndex, searchPostsIndex } from './search'

// listen for messages
addEventListener('message', async (e) => {
	const { type, payload } = e.data

	if (type === 'load') {
    // get the posts data
		const posts = await fetch('/api/search').then((res) => res.json())
		// create search index
    createPostsIndex(posts)
    // we're in business 🤝
		postMessage({ type: 'ready' })
	}

	if (type === 'search') {
    // get search term
		const searchTerm = payload.searchTerm
    // search posts index
		const results = searchPostsIndex(searchTerm)
    // send message with results and search term
		postMessage({ type: 'results', payload: { results, searchTerm } })
	}
})
```

The computation now happens in a separate background thread, separate from the main thread of our app.

```svelte:+page.svelte showLineNumbers
<script lang="ts">
  // Vite has a special import for workers
  import SearchWorker from './search-worker?worker'

	let search: 'idle' | 'load' | 'ready' = 'idle'
	let searchTerm = ''
	let results: Result[] = []
	let searchWorker: Worker

  onMount(() => {
    // create worker
    searchWorker = new SearchWorker()
    // listen for messages
    searchWorker.addEventListener('message', (e) => {
      const { type, payload } = e.data
      type === 'ready' && (search = 'ready')
      type === 'results' && (results = payload.results)
    })
    // initialize when the component mounts
    searchWorker.postMessage({ type: 'load' })
  })

	$: if (search === 'ready') {
		// update results
		searchWorker.postMessage({ type: 'search', payload: { searchTerm } })
	}
</script>
```

You can see the [complete code](https://github.com/mattcroat/joy-of-code/tree/main/src/lib/ui/header/search) how I implemented it for the search on my site. That's it, hope you learned something! 😄
