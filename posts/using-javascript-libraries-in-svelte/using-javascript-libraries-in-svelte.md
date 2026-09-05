---
title: Using JavaScript Libraries In Svelte
description: The Svelte ecosystem covers the entire JavaScript ecosystem since Svelte gives you control over the DOM without requiring any glue code compared to React.
slug: using-javascript-libraries-in-svelte
published: '2023-09-15'
category: svelte
---

<script lang="ts">
	import Embed from '#lib/components/embed.svelte'
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="N9OjaQ0XtKQ" title="Using JavaScript Libraries In Svelte" />

## Table of Contents

## The Svelte Ecosystem

The Svelte ecosystem covers the entire JavaScript ecosystem because Svelte gives you control over the DOM without requiring any glue code compared to a framework like React.

You don't need a specific Svelte library for something if it doesn't exist, instead you can take advantage of the entire [npm](https://www.npmjs.com/) JavaScript ecosystem, and use an existing JavaScript library.

<Embed src="https://www.sveltelab.dev/3ukxxq4a3fss7dd?files=.%2Fsrc%2Froutes%2F%2Bpage.svelte" title="Using JavaScript Libraries In Svelte" />

In this post I'm going to cover how to use third party JavaScript libraries in SvelteKit and ways to solve problems you're going to encounter along the way.

That being said you can Sveltify any JavaScript library and publish it as a package which I'm going to cover in another post.

## Why Do I Get "Window Is Not Defined?"

Before I get into an actual example I want to show you how to fix import problems you might encounter in SvelteKit.

If you import a JavaScript library that uses a browser API like `window`, it's going to throw an error in SvelteKit because the code runs on the server where the API doesn't exist.

The code might seem like it works if you import it and save the file, but once you reload the page you're going to see the `window is not defined` error since the code runs on the server.

```ts:src/lib/index.ts showLineNumbers
export function greet() {
  window.alert('hi')
}
```

```svelte:+page.svelte showLineNumbers
<script lang="ts">
  import { greet } from '$lib'

  greet() // oops! 💩
</script>
```

You can use `onMount` to wait for the DOM to load and run the code.

```svelte:+page.svelte showLineNumbers
<script lang="ts">
  import { onMount } from 'svelte'
  import { greet } from '$lib'

  onMount(() => {
    greet() // 👍️
  })
</script>
```

This works great but sometimes a JavaScript library can do unexpected things such as invoking a browser API during initialization which causes an error just by importing it.

```ts:src/lib/index.ts showLineNumbers
export function greet() {
	window.alert('hi')
}

window.alert('setup')
```

```svelte:+page.svelte showLineNumbers
<script lang="ts">
  import { greet } from '$lib' // oops! 💩
</script>
```

To solve this problem you can use a [dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) inside `onMount`.

```svelte:+page.svelte showLineNumbers
<script lang="ts">
	import { onMount } from 'svelte'

	onMount(async () => {
		const { greet } = await import('$lib')
		greet() // 👍️
	})
</script>
```

If you're making a single-page application (SPA) and don't care about server-side rendering (SSR), you can disable SSR across your app, or for an individual page which eliminates these problems.

```ts:src/routes/+layout.ts showLineNumbers
// disable SSR for entire app
export const ssr = false
```

```ts:src/routes/+page.ts showLineNumbers
// disable SSR for the page
export const ssr = false
```

## Using Third Party JavaScript Libraries

I'm going to use the framework agnostic JavaScript animation library [Motion One](https://motion.dev/) to demonstrate how to use a third party JavaScript library with Svelte.

Most JavaScript libraries need to query the DOM for an element to perform a task, if you just read the docs for your library and try it out, you're going to see it just works.

```svelte:+page.svelte showLineNumbers
<script lang="ts">
	import { onMount } from 'svelte'
	import { animate, stagger } from 'motion'

  // wait for the DOM to load
	onMount(() => {
    // query the DOM
		const letters = document.querySelectorAll('.letter')
    // use the API as usual
		animate(
			letters,
			{ color: 'orangered', y: [0, 30, -60, 0], rotate: 360 },
			{ duration: 1, delay: stagger(0.1), repeat: Infinity }
		)
	})
</script>

<h1 class="letters">
	{#each 'Svelte'.split('') as letter}
		<span class="letter">{letter}</span>
	{/each}
</h1>

<style>
	.letters {
		display: flex;
		gap: 0.5rem;
		font-size: 4rem;
		font-weight: 600;
		text-transform: uppercase;

		& .letter {
			display: inline-block;
		}
	}
</style>
```

This works, but querying the DOM yourself is not a great idea and I advise against doing it outside Svelte actions, because as your app grows, it's harder to reuse and might cause problems.

## Using the Bind Directive

Instead of querying the DOM yourself, you can use the `bind:this` element directive to get a reference to a DOM node.

```svelte:example.svelte showLineNumbers
<script lang="ts">
  let letter: HTMLSpanElement
</script>

<span bind:this={letter} class="letter">
  {letter}
</span>
```

This works great for a single element but in this case we need to use an array.

```svelte:+page.svelte {5,9,18} showLineNumbers
<script lang="ts">
	import { onMount } from 'svelte'
	import { animate, stagger } from 'motion'

	let letters: HTMLSpanElement[] = []

	onMount(() => {
		animate(
			letters,
			{ color: 'orangered', y: [0, 30, -60, 0], rotate: 360 },
			{ duration: 1, delay: stagger(0.1), repeat: Infinity }
		)
	})
</script>

<h1 class="letters">
	{#each 'Svelte'.split('') as letter, i}
		<span bind:this={letters[i]} class="letter">
			{letter}
		</span>
	{/each}
</h1>
<!-- ... -->
```

Awesome! 😄

## Using Svelte Actions

That being said I would love to make the code reusable. Instead of creating a component, you can use [Svelte actions](https://svelte.dev/docs/element-directives#use-action) by using the `use:action` directive.

A Svelte action is just a reusable piece of code used to attach some behavior to an element.

```svelte:example.svelte showLineNumbers
<h1 use:animateText>
	Svelte
</h1>
```

I'm going to create an `animateText` action and use it on the container with `use:animateText`.

```svelte:+page.svelte {4-10,13} showLineNumbers
<script lang="ts">
	import { animate, stagger } from 'motion'

	function animateText(element: HTMLDivElement) {
		animate(
			[...element.children],
			{ color: 'orangered', y: [0, 30, -60, 0], rotate: 360 },
			{ duration: 1, delay: stagger(0.1), repeat: Infinity }
		)
	}
</script>

<h1 use:animateText class="letters">
	{#each 'Svelte'.split('') as letter}
		<span class="letter">{letter}</span>
	{/each}
</h1>
<!-- ... -->
```

You can take this a step further and have the entire logic inside the `animateText` Svelte action since it's just JavaScript.

```svelte:+page.svelte showLineNumbers
<script lang="ts">
	import { animate, stagger } from 'motion'

	function animateText(element: HTMLDivElement) {
		const text = element.innerText.trim().split('')

		element.innerHTML = ''

		text.forEach(letter => {
			element.innerHTML += `
        <span class="letter">${letter}</span>
      `
		})

		animate(
			[...element.children],
			{ color: 'orangered', y: [0, 30, -60, 0], rotate: 360 },
			{ duration: 1, delay: stagger(0.1), repeat: Infinity }
		)
	}
</script>

<h1 use:animateText class="letters">
	Svelte
</h1>
<!-- ... -->
```

You can also pass parameters to the Svelte action.

```svelte:+page.svelte {6,20,27} showLineNumbers
<script lang="ts">
	import { animate, stagger } from 'motion'

	function animateText(
    element: HTMLDivElement,
    { color } = { color: 'orangered' }
  ) {
		const text = element.innerText.split('')

		element.innerHTML = ''

		text.forEach((letter) => {
			element.innerHTML += `
        <span class="letter">${letter}</span>
      `
		})

		animate(
			[...element.children],
			{ color, y: [0, 30, -60, 0], rotate: 360 },
			{ duration: 1, delay: stagger(0.1), repeat: Infinity }
		)
	}
</script>

<h1
  use:animateText={{ color: 'red' }}
  class="letters"
>
  Svelte
</h1>
<!-- ... -->
```

You can even include the styles inside the Svelte action if you want, but I think you already understand the power of Svelte actions.

Svelte actions are another easy way to get a reference to an element, and then inside your action you can do regular DOM manipulations since it's just JavaScript.
