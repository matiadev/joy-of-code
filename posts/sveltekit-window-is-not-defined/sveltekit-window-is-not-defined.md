---
title: How To Deal With "Window Is Not Defined" In SvelteKit
description: How to deal with the "window is not defined" error in SvelteKit.
slug: sveltekit-window-is-not-defined
published: '2022-12-14'
category: sveltekit
---

<script lang="ts">
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="l1AB5f0Xyd4" title="How To Solve Window Is Not Defined In SvelteKit" />

## Table of Contents

## The Problem

SvelteKit pages are components that run on the server and client which causes problems if a package you're using tries to invoke a method on the `window` object or `self` that doesn't exist on the server.

## Using The Browser Import

Let's say for example this is some library code.

```ts:greet.ts showLineNumbers
export function greet() {
  window.alert('Hello')
}
```

If you import it everything works fine until you try to invoke the function. Refreshing the page causes an error because it tries to run the code on the server.

```svelte:+page.svelte showLineNumbers
<script lang="ts">
  import { greet } from 'greet'

  greet() // 💩
</script>
```

You can use the `onMount` lifecycle function or the `browser` module from SvelteKit to make sure the code runs in the browser and only then run it.

```svelte:+page.svelte showLineNumbers
<script lang="ts">
  import { browser } from '$app/environment'
  import { greet } from 'greet'

  if (browser) {
    greet() // 👍️
  }
</script>
```

You could also use [Svelte actions](https://learn.svelte.dev/tutorial/actions) since they're element-level lifecycle functions.

```svelte:+page.svelte showLineNumbers
<script>
  import { greet } from 'greet'
</script>

<div use:greet />
```

## Using Dynamic Imports

What do you do when the import already runs some code that causes trouble?

```ts:greet.ts showLineNumbers
export function greet() {
  window.alert('Hello')
}

window.alert('💩')
```

This is the issue I ran into and the answer is [dynamic imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import).

Dynamic imports let you load a module asynchronously using the `import` keyword and it returns a promise which fulfills to an object containing all the exports from the module.

```svelte:+page.svelte showLineNumbers
<script lang="ts">
  import { onMount } from 'svelte'

  onMount(async () => {
    const Greet = await import('greet')
    Greet.greet()
  })
</script>
```

That's it! 😄
