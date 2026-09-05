---
title: The New Svelte Attachments Feature Explained
description: Svelte released a new @attach feature, which is the onMount for elements that replaces Svelte actions.
slug: svelte-attachments-explained
published: '2025-05-16'
category: svelte
---

<script lang="ts">
	import Card from '#lib/components/card.svelte'
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="9PREEREiPAE" title="Svelte Attachments" />

## Table of Contents

## Lifecycle Functions

Svelte released a new [@attach](https://svelte.dev/docs/svelte/@attach) feature which are functions that run when an element is created in the DOM, and you can return a cleanup function when they're removed.

I like to think of them as `onMount` functions for elements, and in this post I'm going to show you why you would use them.

A common use for lifecycle functions is integrating a third-party JavaScript library, so I'm going to use the JavaScript animation library [GSAP](https://gsap.com/) in the examples. You can try the examples in the [Svelte playground](https://svelte.dev/playground).

Let's start by creating a box:

```svelte:app.svelte
<script>
  import { gsap } from 'gsap'
</script>

<div class="box"></div>

<style>
  .box {
    width: 100px;
    aspect-ratio: 1;
    background: aqua;
    border-radius: 8px;
  }
</style>
```

To box element doesn't exist yet in the DOM, so we have to pass a callback to the `onMount` component lifecycle function which runs after the element is created.

Then we can query the element and animate it using GSAP:

```svelte:app.svelte
<script>
  import { onMount } from 'svelte'
  import { gsap } from 'gsap'

  onMount(() => {
    // ⚠️ not the most reliable method
    const box = document.querySelector('.box')
    gsap.to(box, { rotation: 360, duration: 2 })
  })
</script>
```

Instead of using the `querySelector()` method, we can use the `bind:` directive to bind the element to a variable, and then we can use that variable to animate the element:

```svelte:app.svelte
<script>
  import { onMount } from 'svelte'
  import { gsap } from 'gsap'

  let box

  onMount(() => {
    gsap.to(box, { rotation: 360, duration: 2 })
  })
</script>

<div bind:this={box} class="box"></div>
```

You can also use an `$effect` to animate the element. Effects run after the component is created, but if you pass a reactive value to the `$effect` it will be tracked, so you have to use the `untrack()` function to untrack it:

```svelte:app.svelte
<script>
  import { untrack } from 'svelte'
  import { gsap } from 'gsap'

  let box
  let rotation = $state(360)

  $effect(() => {
    untrack(() => {
      // 😫 oops!
      gsap.to(box, { rotation, duration: 2 })
    })
  })
</script>

<div bind:this={box} class="box"></div>
```

The `$effect` rune isn't a replacement for `onMount` even if they look similar. Effects and their cleanup function rerun each time the value updates. This is just so you know what methods are available to you.

To be honest, I use `$effect` most of the time, because I know how it works.

## Svelte Actions (Element-Level Lifecycle Functions)

If `onMount` is a component-level lifecycle function, then a [Svelte action](https://joyofcode.xyz/svelte-actions-guide) is an element-level lifecycle function.

A Svelte action is a normal JavaScript function that runs when the element is created. It only works when you use it with the `use:` directive.

Here's the same GSAP example using a Svelte action:

```svelte:app.svelte
<script>
  import { gsap } from 'gsap'

  function to(element, options) {
    gsap.to(element, options)
  }
</script>

<div use:to={{ rotation: 360, duration: 2 }} class="box">
```

The `to` action has the `element` as the first argument, and the `options` as the second argument. You can return an `update` function or use an `$effect` for updates which brings us to their disadvantages.

Svelte actions are one of my favorite underrated Svelte features, but they're not perfect:

```svelte:actions
<!-- 😔 unusual syntax where the element is implicitly passed -->
<div use:action={options}>

<!-- 😔 must be declared elsewhere -->
<div use:createAction()>

<!-- 😔 can't be used inline -->
<div use:action={(element) => ...}>

<!-- 😔 have to use `update` or `$effect` for updates -->
<div use:action={value}>

<!-- 😔 can't be conditionally applied -->
<div FLAG && use:action>

<!-- 😔 can't be spread -->
<div {...props}>

<!-- 😔 can't be used on components -->
<Component use:action />
```

Let's look at how the `@attach` feature solves these problems.

## Svelte Attachments Are The New Svelte Actions

A Svelte attachment is also just a normal JavaScript function that runs when then element is created, and optionally runs a cleanup function when it's removed.

This example creates a `banana` function to show the naming is not important, and then uses it with the `@attach` directive:

```svelte:app.svelte
<script>
  function banana(element) {
    console.log('🫡 element created')
    return () => console.log('🧹 element removed')
  }
</script>

<div {@attach banana}></div>
```

You can use **inline attachments** for a quick reference to an element, avoiding the entire ceremony around creating a function:

```svelte:app.svelte
<div {@attach (element) => console.log(element)}>
```

Here's the GSAP example as a Svelte attachment:

```svelte:app.svelte
<script>
  import { gsap } from 'gsap'

  function to(element) {
    gsap.to(element, { rotation: 360, duration: 2 })
  }
</script>

<div {@attach to} class="box"></div>
```

If you want to pass your own arguments like `options`, you can return the attachment function:

```svelte:app.svelte
<script>
  import { gsap } from 'gsap'

  function to(options) {
    return (element) => {
      gsap.to(element, options)
    }
  }
</script>

<div {@attach to({ rotation: 360, duration: 2 })} class="box"></div>
```

<Card type="info">This pattern is also called a thunk. A thunk is a function that delays some work until it's needed, rather than performing it immediately.</Card>

You can have multiple attachments. In this example we're using the `Draggable` plugin from GSAP to make the box draggable:

```svelte:app.svelte
<script>
  import { gsap } from 'gsap'
  import { Draggable } from 'gsap/Draggable'

  gsap.registerPlugin(Draggable)

  function drag(options) {
    return (element) => {
      Draggable.create(element, options)
    }
  }
  // ...
</script>

<div
  {@attach to({ rotation: 360, duration: 2 })}
  {@attach drag({ type: 'x,y' })}
  class="box"
>
```

Attachments are part of the template tracking context. This means if you read a reactive value inside the attachment, it's going to rerun each time the value changes (you can use a nested `$effect` to only rerun that):

```svelte:app.svelte
<script>
  let value = $state(0)
	setInterval(() => value++, 1000)
</script>

<!-- tracking context -->
<div {@attach (element) => {
  // reading the value inside `$effect` reruns  it
	console.log(value)

  // alternatively read value inside nested effect
  $effect(() => {
		console.log(value)
	})
}}>
```

Let's use the `ScrambleTextPlugin` from GSAP to create a `scramble` function that accepts a text and options. The `text` value is reactive, so any changes to it will cause the text to be scrambled:

```svelte:app.svelte
<script>
  import { gsap } from 'gsap'
  import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

  gsap.registerPlugin(ScrambleTextPlugin)

  // ⚠️ attachments live inside of `$effect`
  function scramble(text, options) {
    return (element) => {
      gsap.to(element, {
        duration: 2,
        scrambleText: text,
        ...options
      })
    }
  }

  let text = $state('Svelte')
</script>

<!-- tracking context -->
<input type="text" bind:value={text} />
<div {@attach scramble(text)}></div>
```

These are just functions, so you can do whatever you want in theory. Here I created a typed `createAnimation` function which returns a `to` attachment with the GSAP animation, and a `play` function to play the animation:

```svelte:app.svelte
<script lang="ts">
  import { gsap } from 'gsap'

  function createAnimation(options: gsap.TweenVars = {}) {
    let animation: gsap.core.Tween

    return {
      to(): Attachment {
        return (element) => {
          animation = gsap.to(element, options)
        }
      },
      play() {
        animation.play()
      }
    }
  }

  const { to, play } = createAnimation({
    rotation: 360,
    duration: 2,
    easing: 'power3.inOut',
    paused: true
  })
</script>

<div {@attach to()} class="box"></div>
<button onclick={() => play()}>Play</button>
```

This is very cool for something like a UI library where you want to easily add some behaviour to elements. One idea I want to try out involves an attachment that animates UI changes using the [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API).

I was also thinking if you could use Svelte attachments to create an animation timeline with GSAP?

```svelte:app.svelte
<script>
  import { gsap } from 'gsap'

  function createTimeline(options) {
    let timeline = gsap.timeline({ paused: true, ...options })
		let position = $state(0)

		$effect(() => {
			timeline.seek(position)
		})

		timeline.eventCallback('onUpdate', () => {
	    position = timeline.time()
	  })

    return {
      add(options) {
        return (element) => {
          timeline.to(element, options)
        }
      },
      get controls() { return timeline },
			get position() { return position },
			set position(v) { position = v },
    }
  }

  const timeline = createTimeline()
</script>

<div {@attach timeline.add({ x: 400, duration: 1 })}></div>
<div {@attach timeline.add({ x: 400, duration: 2 })}></div>
<div {@attach timeline.add({ x: 400, duration: 1 })}></div>

<button onclick={() => timeline.controls.play()}>Play</button>

<label>
	<input
    type="range"
    bind:value={timeline.position}
    min={0}
    max={4}
    step={0.1}
  />
	{timeline.position.toFixed(1)}s
</label>

<style>
	div {
		width: 100px;
		aspect-ratio: 1;
		margin-block-end: 0.5rem;
		background: aqua;
		border-radius: 8px;
	}
</style>
```

That's it! Let's recap:

```svelte:attachments
<!-- 😄 improved syntax -->
<div {@attach fn}></div>

<!-- 😄 can be declared anywhere -->
<div {@attach createAttachment()}>

<!-- 😄 can be used inline -->
<div {@attach (element) => ...}>

<!-- 😄 reactive by default -->
<div {@attach fn(state)}>

<!-- 😄 can be conditionally applied -->
<div {@attach FLAG && fn}>

<!-- 😄 can be spread -->
<div {...props}>

<!-- 😄 can be used on components -->
<Component {@attach fn} />
```

I didn't show every example, but you can [read the docs](https://svelte.dev/docs/svelte/@attach) to learn more, like how to create attachments programmatically.

If you need ideas, how about a link attachment that opens an `<iframe>` with the preview on hover, or an attachment that tracks the cursor position inside an element?

Stay inspired! 😄
