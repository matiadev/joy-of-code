---
title: Avoid Async Effects In Svelte
description: Learn how to use async functions inside effects in Svelte.
slug: avoid-async-effects-in-svelte
published: '2024-11-20'
category: svelte
---

<script lang="ts">
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="XsYyruvbNVc" title="Avoid Async Effects In Svelte" />

## Table of Contents

## Side Effects In Svelte

If you want to do a side effect in Svelte like fetching data or logging a reactive value to the console when it updates, you can use the `$effect` rune:

```svelte:+page.svelte
<script lang="ts">
  let count = $state(0)

  $effect(() => {
    console.log(count)
  })
</script>
```

If you return a function from `$effect`, it will be called before the effect re-runs and before it's destroyed:

```svelte:+page.svelte
<script lang="ts">
  let count = $state(0)

  $effect(() => {
    console.log(count)
    return = () => console.log('cleanup')
  })
</script>
```

> Effects run on the [microtask queue](https://developer.mozilla.org/en-US/docs/Web/API/Window/queueMicrotask) when everything else is done.

In the past you would use the legacy `onMount` function to run some code when the component mounts:

```svelte:+page.svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte'

  // do something when the component is ready
  $effect(() => {
    console.log('mounted')
    return () => console.log('cleanup')
  })

  // this works the same
  onMount(() => {
    console.log('mounted')
    return () => console.log('cleanup')
  })

  // there's also `onDestroy`
  onDestroy(() => console.log('cleanup'))
</script>
```

The examples look the same but they're not, and you have to be careful with dependencies inside `$effect` and [untrack](https://svelte.dev/docs/svelte/svelte#untrack) values you don't want to track.

## Avoid Async Effects

Let's say you have some asynchronous code, so it would also make sense to mark the function that you pass to `$effect` as `async`:

```svelte:+page.svelte
<script lang="ts">
  let count = $state(0)

  $effect(async () => {
    console.log(count)
    return () => console.log('cleanup')
  })
</script>
```

The cleanup function never runs because an async function returns a promise that Svelte doesn't expect and can't resolve for you:

```ts:example.ts
let banana = async () => '🍌'
console.log(banana()) // Promise {<fulfilled>: '🍌'}
```

I assume this is probably because having async effects would cause race conditions, so you would need async versions of these runes like `$asyncEffect`.

## Asynchronously Read Values Are Ignored

What's also interesting is that if we read the Svelte docs on [understanding dependencies](https://svelte.dev/docs/svelte/$effect#Understanding-dependencies), it says:

> "Values that are read asynchronously — after an `await` or inside a `setTimeout`, for example — **will not be tracked**.

The values **after** `await` or **inside** `setTimeout` and `then` are not going to be tracked by Svelte:

```svelte:+page.svelte
<script lang="ts">
  let count = $state(0)

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  $effect(async () => {
    await sleep(1000)
    console.log(count) // untracked
  })

  $effect(() => {
    sleep(1000).then(() => {
      console.log(count) // untracked
    })
  })

  $effect(() => {
    setTimeout(() => {
      console.log(count) // untracked
    })
  })
</script>
```

If you want to track those values, you could use a poor man's dependency array inside `$effect`:

```ts:+page.svelte
$effect(async () => {
  // has to be before `await`
  count
})

$effect(() => {
  // has to be outside `setTimeout` or `then`
  count
})
```

## Awaiting Promises Inside Effects

Instead of passing an async function to `$effect`, you can invoke an async function inside an effect or invoke `then` on the promise:

```svelte:+page.svelte
<script lang="ts">
  let count = $state(0)

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  // a) using an async function
  $effect(() => {
    // this can be from anywhere
    async function logCount() {
      await sleep(1000)
      console.log(count)
    }
    // invoke the async function
    logCount()
  })

  // b) using `then`
  $effect(() => {
    sleep(1000).then(() => {
      console.log(count)
    })
  })

  // c) using an immediately invoked function (IIFE)
  $effect(() => {
    (async () {
      await sleep(1000)
      console.log(count)
    })()
  })
</script>
```

That's it! 👍️

Keep in mind, these examples aren't meant to be reactive, but only show how to use async code inside an effect.
