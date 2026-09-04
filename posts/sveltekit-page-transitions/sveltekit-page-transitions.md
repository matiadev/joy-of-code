---
title: SvelteKit Page Transitions
description: Learn how to do page transitions in SvelteKit.
slug: sveltekit-page-transitions
published: '2023-4-7'
category: sveltekit
---

{% youtube id="gkw1wFIXM_8" title="SvelteKit Page Transitions" %}

## Table of Contents

## SvelteKit Transitions

In SvelteKit a page is just a component meaning whatever you're able to do with components you can do to a page which makes transitions simple.

Before you can add the transition you have to know when a page has changed which you can do by exporting a `url` prop from a `+layout.ts` or `+layout.server.ts` file.

```ts:src/routes/+layout.ts showLineNumbers
export function load({ url }) {
  return {
    url: url.pathname,
  }
}
```

If you're curious why I'm not using the `$page` store you can watch the video where I explain why it doesn't work.

Inside the root layout you can wrap `<slot/>` with a `#key ...` block which takes a value that when changed destroys and recreates the contents and plays the transition.

```svelte:src/routes/+layout.svelte showLineNumbers
<script lang="ts">
  import { fly } from 'svelte/transition'

  export let data
</script>

{#key data.url}
  <div
    in:fly={{ x: -200, duration: 300, delay: 300 }}
    out:fly={{ x: 200, duration: 300 }}
  >
    <slot />
  </div>
{/key}
```

The `delay` is required for the entering transition to not overlap with the leaving transition if you use both or `transition:fly` which is the same thing.

You're done! 🥳

## Custom Transitions

You can spice up your transition by creating a custom transition in Svelte which is just a [Svelte action](https://svelte.dev/docs#template-syntax-element-directives-use-action) that returns a transition object.

I'm going to create a `transition.svelte` component that uses a `flush` transition.

```svelte:src/lib/transition.svelte showLineNumbers
<script lang="ts">
  import { cubicIn } from 'svelte/easing'
  import type { EasingFunction, TransitionConfig } from 'svelte/transition'

  import { playFlush } from '$lib/sounds'

  export let key: string
  export let duration = 300

  type Params = {
    delay?: number
    duration?: number
    easing?: EasingFunction
  }
  type Options = {
    direction?: 'in' | 'out' | 'both'
  }

  function flush(
    node: Element,
    { delay = 0, duration = 300, easing = cubicIn }: Params = {},
    { direction = 'both' }: Options = {}
  ): TransitionConfig {
    direction === 'out' && playFlush()

    return {
      delay,
      duration,
      easing,
      css: (t) => `
        scale: ${t};
        rotate: ${t}turn;
      `,
    }
  }
</script>

{#key key}
  <div
    in:flush={{ duration, delay: duration }}
    out:flush={{ duration }}
  >
    <slot />
  </div>
{/key}

```

Here's the code for the sound if you want to give it a try.

```ts:src/lib/sounds.ts showLineNumbers
export function playFlush() {
  const url = 'https://cdn.pixabay.com/audio/2021/08/09/audio_e2a6340055.mp3'
  const audio = new Audio(url)
  audio.volume = 0.5
  audio.play()
}
```

This type of transition creates a regular CSS animation from the `css` function you return where you get access to `t` which is a value from `0` to `1` and `u` which is the opposite meaning it goes from `1` to `0`.

You can think of `t` as **time** but it's **not the duration** of the transition but the end and start. An easing for example is just some fancy math that changes the numbers in that range to something else. Here's a great [ease visualizer for easing functions in Svelte](https://svelte.dev/examples/easing).

This is also how the [default Svelte transitions](https://svelte.dev/docs#run-time-svelte-transition) are implemented which you can find in the documentation.

```svelte:src/routes/+layout.svelte showLineNumbers
<script lang="ts">
  import PageTransition from '$lib/transition.svelte'

  export let data
</script>

<PageTransition key={data.url} duration={2000}>
  <slot />
</PageTransition>
```

You can name the imported component anything you want.
