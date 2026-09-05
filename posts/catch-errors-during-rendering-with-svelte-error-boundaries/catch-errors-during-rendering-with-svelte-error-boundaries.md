---
title: Catch Errors During Rendering With Svelte Error Boundaries
description: Learn how to catch errors during rendering with Svelte error boundaries.
slug: catch-errors-during-rendering-with-svelte-error-boundaries
published: '2024-12-04'
category: svelte
---

<script lang="ts">
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="MMK9tR4pH2A" title="Svelte Error Boundaries" />

## Table of Contents

## Catching Errors During Rendering

SvelteKit has a concept of [error boundaries](https://svelte.dev/docs/kit/routing#error) that catch errors from the server so if a nested route explodes it renders the nearest `+error.svelte` page instead of crashing the entire app.

Svelte error boundaries are like that, but for catching errors during rendering at a component level.

Unexpected errors can leave your app in a broken state where the only option left for the user is to reload the app:

```svelte:routes/+page.svelte
<script lang="ts">
  function explode() {
    throw new Error('💣️')
  }

  let count = $state(0)
</script>

{count > 4 ? explode() : null}

<button onclick={() => count++}>
  {count}
</button>
```

You can use the `<svelte:boundary>` element to contain errors inside the boundary:

```svelte:routes/+page.svelte
<svelte:boundary>
  <!-- code that throws an error -->
  {count > 4 ? explode() : null}

  <!-- component that throws an error  -->
  <Component />

  <button onclick={() => count++}>
    {count}
  </button>
</svelte:boundary>
```

For the boundary to work, you need to either pass the `onerror` or `failed` prop to it. You can use the `onerror` handler to catch errors and send them to some service:

```svelte:routes/+page.svelte
<svelte:boundary onerror={(error, reset) => console.log('💥')}>
  {count > 4 ? explode() : null}

  <button onclick={() => count++}>
    {count}
  </button>
</svelte:boundary>
```

If there's an error inside the `onerror` function or if you rethrow the error, it's going to be caught by a parent boundary:

```svelte:routes/+page.svelte
<svelte:boundary onerror={() => console.log('💥')}>
  <svelte:boundary onerror={error => throw error}>
    <!-- ... -->
  </svelte:boundary>
</svelte:boundary>
```

**Error boundaries are not a replacement for regular error handling**, but they're a great way to catch and log potential errors for code you don't control.

## Rendering Fallback Content

If an error happens inside the boundary, the contents will be removed from the DOM, but you can use a fallback instead if you provide a `failed` snippet as a prop:

```svelte:routes/+page.svelte
{#snippet failed()}
  <p>fallback</p>
{/snippet}

<!-- passing the snippet explicitly -->
<svelte:boundary {failed}>
  <!-- ... -->
</svelte:boundary>

<!-- passing the snippet implicitly -->
<svelte:boundary>
  <!-- ... -->
  {#snippet failed()}
    <p>fallback</p>
  {/snippet}
</svelte:boundary>
```

The `failed` snippet has an `error` argument for rendering the error message and `reset` argument to recreate the contents:

```svelte:routes/+page.svelte
<svelte:boundary>
  {#snippet failed(error: any, reset: () => void)}
    <p>{error.message}</p>
    <button onclick={reset}>reset</button>
  {/snippet}
</svelte:boundary>
```

Here's how it looks with our example:

```svelte:routes/+page.svelte
<script lang="ts">
  function explode() {
    throw new Error('💣️')
  }

  let count = $state(0)
</script>

<svelte:boundary>
  {count > 4 ? explode() : null}

  <button onclick={() => count++}>
    {count}
  </button>

  {#snippet failed(error: any, reset: () => void)}
    <p>{error.message}</p>
    <button onclick={() => {
      count = 0
      reset()
    }}>
      reset
    </button>
  {/snippet}
</svelte:boundary>
```

## Handling Errors Outside The Error Boundary

The `onerror` function is called with two arguments `error` and `reset` you can use to handle errors outside the error boundary:

```svelte:routes/+page.svelte
<script lang="ts">
	let error = $state(null)
	let reset = $state(() => {})

	function onerror(e: any, r: () => void) {
		error = e
		reset = r
	}
</script>

<svelte:boundary {onerror}>
  {count > 4 ? explode() : null}

  <button onclick={() => count++}>
    {count}
  </button>
</svelte:boundary>

{#if error}
	<button onclick={() => {
		error = null
		reset()
	}}>
		reset
	</button>
{/if}
```

## Errors Aren't Caught On The Server And Outside The Rendering Process

**Error boundaries don't run on the server** since any problem during server-side rendering (SSR) should be handled by as you, but you can't always control what happens on the client.

If you need a reminder, the `+page.svelte` component is rendered on the server during server-side rendering and client during hydration:

```svelte:routes/+page.svelte
<script lang="ts">
  // this won't be caught during SSR
  throw new Error('💣️')
</script>

<svelte:boundary>
  <!-- ... -->
</svelte:boundary>
```

**Errors that happen outside the rendering process** like timers and event handlers aren't caught by error boundaries:

```svelte:routes/+page.svelte
<script lang="ts">
  // this won't be caught
  setTimeout(() => {
    throw new Error('💣️')
  }, 1000)
</script>

<svelte:boundary>
  <button onclick={() => {
    // this won't be caught
    throw new Error('💣️')
  }}>
    I dare you
  </button>
</svelte:boundary>
```

That's everything you should know about Svelte error boundaries.

It might not look that interesting, but it unlocks future features and async rendering patterns like [suspense boundaries](https://react.dev/reference/react/Suspense) from React in Svelte.
