---
title: Sharing State Without Props And Events In Svelte
description: Learn how to share state without props and events using the Svelte Context API.
slug: master-the-svelte-context-api
published: '2024-11-22'
category: svelte
---

<script lang="ts">
	import Embed from '#lib/components/embed.svelte'
	import Image from '#lib/components/image.svelte'
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="XBVujg6Fn3A" title="Master The Svelte Context API" />

## Table of Contents

## The Prop Drilling Problem

You might have heard of the term "prop drilling", which describes sending the same data from a parent component through every child component even if only one component cares about it:

```svelte:example
<A>
  <B {prop}>
    <C {prop}>
      <D {prop} /> <!-- only this component cares about `prop` -->
    </C>
  </B>
</A>
```

This is tedious, but Svelte provides the [Context API](https://svelte.dev/docs/svelte/context) to share state between components without using props and events which looks like this:

```svelte:example
<A> <!-- set context in parent -->
  <B>
    <C>
      <D /> <!-- get context in child -->
    </C>
  </B>
</A>
```

In this post, we're going to create a naive implementation of the Context API from scratch to understand how it works at a basic level, and then we're going to learn how the Svelte Context API works.

## Creating Your Own Context API

Let's pretend the Context API doesn't exist.

In this example, we want to pass `banana` from component `<A>` to component `<D>`, but unfortunately we also have to pass it through every nested child component `<B>` and `<C>`:

```svelte:passing-props
<!-- src/routes/+page.svelte -->
<script lang="ts">
	import A from '/A.svelte'
</script>

<A />

<!-- src/routes/A.svelte -->
<script lang="ts">
	import B from './B.svelte'

	const banana = $state({ value: '🍌' })
</script>

<B {banana} />

<!-- src/routes/B.svelte -->
<script lang="ts">
	import C from './C.svelte'

	let { banana } = $props()
</script>

<C {banana} />

<!-- src/routes/C.svelte -->
<script lang="ts">
	import D from './D.svelte'

	let { banana } = $props()
</script>

<D {banana} />

<!-- src/routes/D.svelte -->
<script lang="ts">
	let { banana } = $props()
</script>

<pre>{JSON.stringify(banana, null, 2)}</pre>
```

Let's create the same functions the Svelte Context API provides, which are `setContext`, `getContext`, `hasContext`, and `getAllContexts`:

```ts:src/routes/context-at-home.ts
// using a Map object for storing key-value pairs
const context = new Map()

// sets the value inside the Map
export function setContext(key: any, value: any) {
	context.set(key, value)
}

// gets the value from the Map
export function getContext(key: any) {
	return context.get(key)
}

// checks if the Map has the value
export function hasContext(key: any) {
	return context.has(key)
}

// returns the Map object
export function getAllContexts() {
	return context
}
```

Why use the Svelte Context API when we have context at home, right?

This is only a naive implementation of how Svelte implements the Context API, but as you can see, the Context API is just a JavaScript [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) object that holds key-value pairs.

The major difference is that **Svelte scopes the context to the component tree**, so it's only available to the parent and its children.

Let's set the context in the parent component `<A>` and get the context in the deeply nested child component `<D>` removing the need for passing `banana` to child components:

```svelte:using-context {3,8,29,31,34}
<!-- src/routes/A.svelte -->
<script lang="ts">
  import { setContext } from './context-at-home'
	import B from './B.svelte'

	const banana = $state({ value: '🍌' })

  setContext('banana', banana)
</script>

<B />

<!-- src/routes/B.svelte -->
<script lang="ts">
	import C from './C.svelte'
</script>

<C />

<!-- src/routes/C.svelte -->
<script lang="ts">
	import D from './D.svelte'
</script>

<D />

<!-- src/routes/D.svelte -->
<script lang="ts">
  import { getContext, getAllContexts } from './context-at-home'

  console.log(getContext('banana')) // Proxy(Object) {value: '🍌'}
</script>

<pre>{JSON.stringify([...getAllContexts()], null, 2)}</pre>
```

This is how the Context API works at a basic level, and you can see it's not magic.

## The Svelte Context API

To use Svelte's Context API, the only thing we have to change is the import:

```svelte:svelte-context {3,15}
<!-- src/routes/A.svelte -->
<script lang="ts">
  import { setContext } from 'svelte'
	import B from './B.svelte'

	const banana = $state({ value: '🍌' })

  setContext('banana', banana)
</script>

<B />

<!-- src/routes/D.svelte -->
<script lang="ts">
  import { getContext, getAllContexts } from 'svelte'

  console.log(getContext('banana')) // Proxy(Object) {value: '🍌'}
</script>

<pre>{JSON.stringify([...getAllContexts()], null, 2)}</pre>
```

## Global State Versus Context

To understand the drawback of using global state compared to using context, we need to understand how Svelte's Context API works.

<Image src="context-api.webp" alt="Svelte component tree using the Context API" />

In this example, we set the context inside component `<A>` and ask for it in component `<D>` where Svelte is going to walk up the component tree until it finds the context — if we set the context inside component `<B>` it would only be available to that component and its children.

**The context is scoped to the component tree**, so it's only available to the parent and its children, where global state makes more sense for state used by the entire app:

```ts:config.ts
// global state
export const config = $state({ theme: 'dark' })
```

Using global state is unsafe on the server if you're using SvelteKit because it could be shared between sessions and users, but you can [pass state with context](https://svelte.dev/docs/kit/state-management#Using-stores-with-context) safely to those components.

## Passing Reactive State To Context

In our example, the `banana` is already reactive because Svelte uses a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object under the hood for objects and arrays that turns properties into signals:

```svelte:src/routes/A.svelte
<script lang="ts">
	import { setContext } from 'svelte'
	import B from './B.svelte'

	// Proxy
	const banana = $state({ value: '🍌' })

	setContext('banana', banana)
</script>

<input type="text" bind:value={banana.value} />

<B />
```

If you pass a string primitive, it won't be magically reactive:

```svelte:src/routes/A.svelte
<script lang="ts">
	import { setContext } from 'svelte'
	import B from './B.svelte'

	let banana = $state('🍌')

  // 👎️ this won't work
  setContext('banana', banana)
</script>

<B />
```

This is because it's going to use the value at the time it was created if we look at the compiled Svelte code:

```js:output
import * as $ from 'internals'

// signal
let banana = $.state('🍌')
// get the value of the signal
setContext('key', $.get(banana))
```

You can pass functions, classes or accessors to read and write to the value:

```svelte:src/routes/A.svelte
<script lang="ts">
	import { setContext } from 'svelte'
	import B from './B.svelte'

	let banana = $state('🍌')

	// 👍 using functions
	setContext('banana', {
		getBanana() { return banana },
		updateBanana(value) { banana = value },
	})

	// 👍 using classes
	class Banana {
		value = $state('🍌')
	}
	setContext('banana', { banana: new Banana() })

	// 👍 using accesors
	setContext('banana', {
		get banana() { return banana },
		set banana(value) { banana = value },
	})
</script>

<B />
```

Now you can access these methods in child components and update the context:

```svelte:src/routes/D.svelte
<script lang="ts">
	import { getContext } from 'svelte'

	// 👍 using accesors
	const context = getContext<{ banana: string }>('banana')
</script>

<input type="text" bind:value={context.banana} />

{context.banana}
```

## Use A Unique Key For Context

Let's look at why using a string for the context key could get you into trouble and why you should use a unique key.

Here's an example of using a string for the context key:

```svelte:example
<script lang="ts">
	import { getAllContexts, setContext } from 'svelte'

	// 💣️
	const key = 'fruit'
	setContext(key, '🍌')

	console.log(getAllContexts()) // Map(1) {'fruit' => '🍌'}
</script>
```

The problem with using a string for the context key is if you set the context with the same key from another library or your own code, it's going to overwrite the value:

```svelte:example
<script lang="ts">
	import { getAllContexts, setContext } from 'svelte'

	const bananaKey = 'fruit'
	setContext(bananaKey, '🍌')

	console.log(getAllContexts()) // Map(1) {'fruit' => '🍌'}

	// 💥 oops
	const appleKey = 'fruit'
	setContext(appleKey, '🍎')

	console.log(getAllContexts()) // Map(1) {'fruit' => '🍎'}
</script>
```

To avoid this, use a [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) object to create a unique key:

```svelte:example
<script lang="ts">
	import { getAllContexts, setContext } from 'svelte'

	const bananaKey = Symbol('fruit')
	setContext(bananaKey, '🍌')

	console.log(getAllContexts()) // Map(1) {'fruit' => '🍌'}

	const appleKey = Symbol('fruit')
	setContext(appleKey, '🍎')

	// Map(2) {Symbol(fruit) => '🍌', Symbol(fruit) => '🍎'}
	console.log(getAllContexts())
</script>
```

This works because no two objects or Symbols are the same in JavaScript, but Symbols are more appropriate because they were made for this reason:

```ts:example
const objA = { key: 'fruit' }
const objB = { key: 'fruit' }

const symA = Symbol('fruit')
const symB = Symbol('fruit')

objA === objB // false
symA === symB // false
```

So if you don't want your context to be overwritten by accident, use a unique key.

## Encapsulating And Typing Context

You can [encapsulate the context logic](https://svelte.dev/docs/svelte/context#Encapsulating-context-interactions) and provide better types instead of using `setContext` and `getContext` directly:

```ts:src/routes/context.ts
import { setContext, getContext } from 'svelte'

type Fruit = string

const key = Symbol('fruit')

export function setFruitContext(context: Fruit) {
	setContext(key, context)
}

export function getFruitContext(): Fruit {
	return getContext(key) as Fruit
}
```

## Practical Example Of Using The Context API

<Embed src="https://stackblitz.com/github/joysofcode/svelte-context-api?ctl=1&embed=1&file=src%2Froutes%2F%2Bpage.svelte&title=Svelte Context API" title="Svelte Context API" />

> You can find the code on [GitHub](https://github.com/joysofcode/svelte-context-api).

I have a `<Canvas>` and `<Square>` component that need to talk to each other.

You have to bind the `<Canvas>` component instance to `canvas` and pass it to the `<Square>` component so you can have access to it:

```svelte:src/routes/+page.svelte {5,8,15}
<script lang="ts">
	import { Canvas, Square } from '$lib/canvas'
	import { gradient } from '$lib/utils'

	let canvas: ReturnType<typeof Canvas>
</script>

<Canvas bind:this={canvas} width={800} height={800}>
	{#each Array(10) as _, col}
		{#each Array(10) as _, row}
			{@const size = 800 / 10}
			{@const x = col * size}
			{@const y = row * size}
			{@const fillStyle = gradient(col, row)}
			<Square {canvas} {x} {y} {size} {fillStyle} strokeStyle="#000" />
		{/each}
	{/each}
</Canvas>
```

The `<Square>` component needs access to the `addItem` function from the `<Canvas>` component:

```svelte:src/lib/canvas/Canvas.svelte {12-18}
<script lang="ts">
	import { type Snippet } from 'svelte'
	import { SvelteSet } from 'svelte/reactivity'

	type Props = { width: number; height: number; children?: Snippet }
	type Draw = (ctx: CanvasRenderingContext2D) => void

	let { width, height, children }: Props = $props()
	let canvas: HTMLCanvasElement
	let items = new SvelteSet<Draw>()

	export function addItem(draw: Draw) {
		$effect(() => {
			items.add(draw)
			// runs when destroyed
			return () => items.delete(draw)
		})
	}

	$effect(() => {
		const ctx = canvas.getContext('2d')!
		ctx.clearRect(0, 0, width, height)
		items.forEach((draw) => draw(ctx))
	})
</script>

<canvas bind:this={canvas} {width} {height}>
	{@render children?.()}
</canvas>
```

Inside the `<Square>` component, we need to use an effect to wait for the component to be ready and then add the `draw` function to the `items` set:

```svelte:src/lib/canvas/Square.svelte {15-17}
<script lang="ts">
	import type Canvas from './Canvas.svelte'

	type Props = {
		canvas: ReturnType<typeof Canvas>
		x: number
		y: number
		size: number
		fillStyle?: string
		strokeStyle?: string
	}

	let { canvas, x, y, size, fillStyle, strokeStyle }: Props = $props()

	$effect(() => {
		canvas?.addItem(draw)
	})

	function draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = fillStyle ?? ''
		ctx.lineWidth = 2
		ctx.strokeStyle = strokeStyle ?? ''

		if (strokeStyle) {
			ctx.strokeRect(x, y, size, size)
		}

		if (fillStyle) {
			ctx.fillRect(x, y, size, size)
		}
	}
</script>
```

Let's fix this by using the Context API:

```ts:src/lib/canvas/context.ts
import { setContext, getContext } from 'svelte'

type Draw = (ctx: CanvasRenderingContext2D) => void
type Canvas = { addItem: (draw: Draw) => void }

const canvasKey = Symbol('canvas')

export function setCanvasContext(context: Canvas) {
	setContext(canvasKey, context)
}

export function getCanvasContext(): Canvas {
	return getContext(canvasKey) as Canvas
}
```

Let's update the `<Canvas>` component and the `<Square>` component to use the Context API:

```svelte:src/lib/canvas/Canvas.svelte {4,13}
<script lang="ts">
	import { type Snippet } from 'svelte'
	import { SvelteSet } from 'svelte/reactivity'
	import { setCanvasContext } from './context'

	type Props = { width: number; height: number; children?: Snippet }
	type Draw = (ctx: CanvasRenderingContext2D) => void

	let { width, height, children }: Props = $props()
	let canvas: HTMLCanvasElement
	let items = new SvelteSet<Draw>()

	setCanvasContext({ addItem })

	function addItem(draw: Draw) {
		$effect(() => {
			items.add(draw)
			// runs when destroyed
			return () => items.delete(draw)
		})
	}

	$effect(() => {
		const ctx = canvas.getContext('2d')!
		ctx.clearRect(0, 0, width, height)
		items.forEach((draw) => draw(ctx))
	})
</script>

<canvas bind:this={canvas} {width} {height}>
	{@render children?.()}
</canvas>
```

```svelte:src/lib/canvas/Square.svelte {2,8}
<script lang="ts">
	import { getCanvasContext } from './context'

	type Props = { x: number; y: number; size: number; fillStyle?: string; strokeStyle?: string }

	let { x, y, size, fillStyle, strokeStyle }: Props = $props()

	getCanvasContext().addItem(draw)

	function draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = fillStyle ?? ''
		ctx.lineWidth = 2
		ctx.strokeStyle = strokeStyle ?? ''

		if (strokeStyle) {
			ctx.strokeRect(x, y, size, size)
		}

		if (fillStyle) {
			ctx.fillRect(x, y, size, size)
		}
	}
</script>
```

🪄 Let's clean up the code where we use the `<Canvas>` and `<Square>` components:

```svelte:src/routes/+page.svelte
<script lang="ts">
	import { Canvas, Square } from '$lib/canvas'
	import { gradient } from '$lib/utils'
</script>

<Canvas width={800} height={800}>
	{#each Array(10) as _, col}
		{#each Array(10) as _, row}
			{@const size = 800 / 10}
			{@const x = col * size}
			{@const y = row * size}
			{@const fillStyle = gradient(col, row)}
			<Square {x} {y} {size} {fillStyle} strokeStyle="#000" />
		{/each}
	{/each}
</Canvas>
```

That's it! 😄

The Context API is a powerful tool that can help you share state between deeply nested components, but it's not a replacement for props and events, so use it only if you need it.
