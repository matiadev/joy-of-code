---
title: SvelteKit Endpoints
description: Learn what are SvelteKit endpoints and when to use standalone endpoints and page endpoints or both.
slug: sveltekit-endpoints
published: '2022-7-28'
category: sveltekit
draft: true
---

{% youtube id="XnVxDLTgCgo" title="SvelteKit Endpoints" %}

## Table of Contents

## Introduction

> ⚠️ The post is outdated since the [breaking SvelteKit changes](https://www.youtube.com/watch?v=eVFcGA-15LA) but I'm going to update the post once things are more stable.

In this post I'm going to explain what are SvelteKit endpoints and when to use standalone endpoints and page endpoints or both.

If you want to try it out yourself you can [find the repository on GitHub](https://github.com/joysofcode/sveltekit-endpoints) or [open it on StackBlitz](http://stackblitz.com/github/joysofcode/sveltekit-endpoints) requiring no setup.

I'm going to mostly talk about SvelteKit endpoints but if you just started learning SvelteKit I have a [SvelteKit For Beginners](https://joyofcode.xyz/sveltekit-for-beginners) series and if you're curious I also wrote [Learn How SvelteKit Works](https://joyofcode.xyz/learn-how-sveltekit-works).

## What Are Endpoints?

An endpoint is a way to interact with another machine on the internet that returns a specific HTTP response to a HTTP request.

Let's say for example you wanted some placeholder images in which case you could use [JSONPlaceholder](https://jsonplaceholder.typicode.com/) that provides fake data using a [REST API](https://en.wikipedia.org/wiki/Representational_state_transfer).

The url looks like [https://jsonplaceholder.typicode.com/photos](https://jsonplaceholder.typicode.com/photos) and it returns a JSON response of key-value pairs.

Using a backend framework like [Express](https://expressjs.com/) you can create an API endpoint where you can get data from anywhere and have complete control over what you return.

```js:example.js showLineNumbers
import express from 'express'

const app = express()
const port = 3000

app.get('/photos', async (req, res) => {
	const response = await fetch(
		'https://jsonplaceholder.typicode.com/photos'
	)
	const photos = await response.json()
	res.json(photos.slice(0, 100))
})

app.listen(port)
```

The endpoint returns a set amount of results but you can let the user pass the amount such as `/photos?amount=10` extending the functionality of the original API but also shape the data anyhow you want.

> 🐿️ If you're using an older version of Node that doesn't support the Fetch API you have to install the `node-fetch` package.

If you visit [api.example.com/photos](http://api.example.com/photos) you can see the JSON response and now you have an API endpoint you can consume on the frontend to display some placeholder images.

## SvelteKit Endpoints

Instead of having a separate backend and frontend SvelteKit combines them together into one cute package.

Instead of specifying a `/photos` endpoint like in the Express example in SvelteKit you just create a `photos.json.ts` file in your `routes` folder that becomes available at [example.com/photos](https://www.notion.so/Add-motion-to-your-apps-with-a-single-line-of-code-using-AutoAnimate-cd3a1853875249ecb89d7831e87bcb96).

> Endpoints are modules written in `.js` (or `.ts`) files that export request handler functions corresponding to HTTP methods.

This has multiple benefits from being able to talk to a database or reading from a file system because it runs on the backend which wouldn't be possible on the frontend.

SvelteKit endpoints work by exporting [request handler](https://kit.svelte.dev/docs/types#sveltejs-kit-requesthandler) functions that correspond to [HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods).

```ts:example.js showLineNumbers
export function POST(event) {...}
export function PUT(event) {...}
export function PATCH(event) {...}
export function DELETE(event) {...}
```

The job of these functions is to return a response that includes the status, headers and body of the response.

Using a modern web framework like SvelteKit you knowledge is transferable because you're going to spend more time learning web fundamentals on [MDN](https://developer.mozilla.org/) than learning framework specific abstractions.

## Standalone Endpoints

In SvelteKit you can create a standalone endpoint like in the Express example that you can expose to the world or consume it yourself.

Standalone endpoints can have an optional file extension like `photos/index.json.ts` making it available at [example.com/photos.json](http://example.com/photos.json) — it could also be other things such as XML or images and it sets the proper response headers where using `photos/index.ts` is directly available at [example.com/photos](http://example.com/photos.json).

Let's look at the same Express example in SvelteKit.

```ts:photos/index.json.ts showLineNumbers
import type { RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async () => {
	const response = await fetch(
		'https://jsonplaceholder.typicode.com/photos'
	)
	const photos = await response.json()

	return {
		body: {
			photos: photos.slice(0, 100)
		}
	}
}
```

Anyone can use the API at [example.com/photos.json](http://example.com/photos.json) if that's what you want but we can also consume it on the frontend using the `load` function that runs before the page is created and returns the page `props`.

```svelte:photos/index.svelte showLineNumbers
<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit'

	export const load: Load = async ({ fetch }) => {
		const response = await fetch('/photos.json')
		const { photos } = await response.json()

		return {
			props: { photos }
		}
	}
</script>

<script lang="ts">
	import type { Photo } from '$lib/types'

	export let photos: Photo[]
</script>

<h1>Photos</h1>

<div class="grid">
	{#each photos as photo}
		<a sveltekit:prefetch href="/photos/{photo.id}">
			<img src={photo.thumbnailUrl} alt={photo.title} />
		</a>
	{/each}
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.4rem;
	}
</style>
```

If you visit the `/photos` route at [example.com/photos](http://example.com/photos) you should see a list of placeholder images.

The types come from `lib/types/index.ts` but you can ignore the types if you don't care about TypeScript.

```ts:lib/types/index.ts showLineNumbers
export type Photo = {
	albumId: number
	id: number
	title: string
	url: string
	thumbnailUrl: string
}
```

Using `load` to fetch data from an external API is great but we can't talk to the database or read from the file system because it runs on the server and client and it's pure boilerplate if you already wrote the same code inside a standalone endpoint.

## Page Endpoints

In the previous example we created a standalone endpoint that fetches some placeholder images and shows them when you visit the photos page.

If your goal isn't to create a public facing API to be consumed by multiple pages and the only thing that cares about the data is your page then you should use a page endpoint.

{% img src="sveltekit-endpoints.webp" alt="Sveltekit endpoints guide" %}

The only change you have to do is rename the `index.json.ts` to `index.ts` to convert a standalone endpoint to a page endpoint and remove the redundant boilerplate code from `index.svelte`.

```ts:photos/index.ts showLineNumbers
import type { RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async () => {
	const response = await fetch('https://jsonplaceholder.typicode.com/photos')
	const photos = await response.json()

	return {
		body: {
			photos: photos.slice(0, 100)
		}
	}
}
```

Anything you return from the page endpoint inside `body` is going to get passed as props to the page.

```svelte:photos/index.svelte showLineNumbers
<script lang="ts">
	import type { Photo } from '$lib/types'

	export let photos: Photo[]
</script>

<h1>Photos</h1>

<div class="grid">
	{#each photos as photo}
		<a sveltekit:prefetch href="/photos/{photo.id}">
			<img src={photo.thumbnailUrl} alt={photo.title} />
		</a>
	{/each}
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.4rem;
	}
</style>
```

This is awesome! 😄

Page endpoints are powerful because they enable progressive enhancement for forms because a form has it's own endpoint among other things.

The `action` attribute isn't required on the form because it shares the same endpoint.

```svelte:example.svelte showLineNumbers
import { enhanceForm } from '$lib/actions/form'

<form method="post" use:enhanceForm>
	<input type="text" name="user" />
	<button type="submit">Submit</button>
</form>
```

```ts:example.ts showLineNumbers
export const POST: RequestHandler = async ({ request }) => {
	const form = await request.formData()
	const user = form.get('user')
	return {}
}
```

If JavaScript is available on the page the form action is going to be used but if JavaScript fails for whatever reason it's going to work like a regular form.

If you want to learn how to use progressive enhancement you can look at the default example when you initialize a new SvelteKit project.

## Cases For Using Them Together

You learned when to use a standalone endpoint and a page endpoint but sometimes you want to use both.

I want to be able to show a single photo.

```ts:photos/[id].ts showLineNumbers
import type { RequestHandler } from './__types/[id]'

export const GET: RequestHandler = async ({ params }) => {
	const response = await fetch(
		`https://jsonplaceholder.typicode.com/photos/${params.id}`
	)
	const photo = await response.json()

	return {
		body: { photo }
	}
}
```

```svelte:photos/[id].svelte ShowLineNumbers
<script lang="ts">
	import type { Photo } from '$lib/types'

	export let photo: Photo
</script>

<h1>{photo.title}</h1>
<img src={photo.url} alt={photo.title} />
```

If you visit [example.com/photos/1](http://example.com/photos/1) it works great but what if you wanted to navigate to the page only after the image is loaded to prevent flickering?

{% video src="flicker.mp4" %}

You can pass the `props` from the page endpoint to the `load` function and load the image before navigating to the page — pretend `loadImage` is some function imported from utils.

```svelte:photos/[id].svelte
<script context="module" lang="ts">
	import { browser } from '$app/env'
	import type { Load } from '@sveltejs/kit'

	// utils/loadImage.ts
	async function loadImage(src: string) {
		await new Promise((resolve, reject) => {
			const img = new Image()
			img.onload = () => resolve('Loaded')
			img.onerror = () => reject(new Error('Failed to load image'))
			img.src = src
		})
	}

	export const load: Load = async ({ props }) => {
		if (browser) {
			await loadImage(props.photo.url)
		}

		return { props }
	}
</script>

<script lang="ts">
	import type { Photo } from '$lib/types'

	export let photo: Photo
</script>

<h1>{photo.title}</h1>
<img src={photo.url} alt={photo.title} />
```

Thanks to `sveltekit:prefetch` when you hover over or press the image link the image starts to download and is already loaded before you navigate if you look at the network tab.

{% img src="prefetch.webp" alt="Network tab showing the image prefetching" %}

This solves the flickering because the image wasn't loaded yet.

{% video src="without-flicker.mp4" %}

Another example is setting [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) HTTP headers for the page because you have to set it on the HTML document and not the page endpoint to be cached on a [content-delivery network](https://en.wikipedia.org/wiki/Content_delivery_network).

This only caches the data.

```ts:example.ts showLineNumbers
import type { RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ params }) => {
	return {
		status: 200,
		body: { data: [1, 2, 3, 4] },
		headers: {
      'Cache-Control': 's-maxage=60',
		},
	}
}
```

This is going to cache the HTML document.

```svelte:example.svelte showLineNumbers
<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit'

  export const load: Load = ({ props }) => {
    return {
      props,
      cache: { maxage: 60 },
    }
  }
</script>
```

I use this method for the page you're reading! I encourage you to open the network tab to see it in action.

Hope you learned about the difference between standalone endpoints and page endpoints and know when to use each one or both if you need it.

Thanks for reading! 🏄️
