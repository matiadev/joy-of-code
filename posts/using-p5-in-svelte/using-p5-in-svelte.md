---
title: Make Art Using Code With P5.js And Svelte
description: Learn how to use p5.js and integrate older CommonJS libraries in Svelte
slug: using-p5-in-svelte
published: '2026-03-18'
category: svelte
---

<script lang="ts">
	import YouTube from '$lib/components/youtube.svelte'
</script>

<YouTube id="97bD9ZHwv2U" title="Using P5.js In Svelte" />

## Table of Contents

## Motivation

This all started when someone asked how to use [p5.js](https://p5js.org/) in Svelte. While there's already a `p5-svelte` library, it's inactive and has a memory leak. So I decided to make a simple wrapper myself and fix some of the issues.

Even though I don't use p5.js regularly, when I think of p5.js, I think of Dan Shiffman from [The Coding Train](https://www.youtube.com/@TheCodingTrain), which has a special place in my heart. He also has a fantastic book on creative coding called [The Nature of Code](https://natureofcode.com/) which you can read for free online.

I'm also going to show you how to make old [CommonJS](https://nodejs.org/api/modules.html) libraries work in Svelte which uses [ESM](https://nodejs.org/api/esm.html).

## What Is P5?

p5.js is a creative coding library which makes it simple to work with the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API). Here's an example in **global mode** where you specify the `setup` and `draw` functions:

```js:sketch.js
function setup() {
	createCanvas(400, 400)
	noStroke()
}

function draw() {
	background(200)
	x = lerp(x, mouseX, 0.05)
	y = lerp(y, mouseY, 0.05)
	fill(255)
	circle(x, y, 100)
}
```

You can try the example in the [p5.js editor](https://editor.p5js.org/) and you're going to see an interactive canvas where you can drag the circle around.

## Using P5 In Svelte

To use p5.js in Svelte install the `@sveltecraft/p5-svelte` package using your favorite package manager inside your project:

```bash:terminal
npm i @sveltecraft/p5-svelte
```

In this example we import the `P5Sketch` component (you can name it whatever you want since it's just a default export) and the `Sketch` type from `@sveltecraft/p5-svelte`:

```svelte:+page.svelte
<script lang="ts">
	import P5Sketch, { type Sketch } from '@sveltecraft/p5-svelte'

	let x = 0
	let y = 0
	let diameter = $state(100)

	const sketch: Sketch = (p) => {
		p.setup = () => {
			p.createCanvas(800, 600)
			p.noStroke()
		}
		p.draw = () => {
			p.background(10)
			x = p.lerp(x, p.mouseX, 0.05)
			y = p.lerp(y, p.mouseY, 0.05)
			p.fill(255)
			p.circle(x, y, diameter)
		}
	}
</script>

<P5Sketch {sketch} />
```

We're using [instance mode](https://github.com/processing/p5.js/wiki/Global-and-instance-mode) here, which allows us to create multiple p5 sketches. Pass the sketch to the `<P5Sketch>` component and you're done.

The `diameter` variable doesn't actually need to be reactive since the draw loop runs continuously, but it demonstrates that Svelte reactivity works seamlessly.

Once you're done, start the development server with `npm run dev` and navigate to `localhost`. You'll see a working p5.js example in Svelte.

## Using Addons

Using older addons like `p5.sound` can be tricky because they're not part of p5.js anymore, but they're standalone packages which also lack types.

The new version of p5.js preloads assets inside `setup` instead of `preload`:

```svelte:+page.svelte
<script lang="ts">
	import P5Sketch, { type Sketch } from '@sveltecraft/p5-svelte'

	// custom sound type
	type SoundFile = {
		play: () => void
	}

	// @ts-expect-error addon lacks types
	const addons = [() => import('p5.sound')]

	const sketch: Sketch = (p) => {
		// store sound reference
		let sound: SoundFile
		p.setup = async () => {
			// preload sound
			sound = await (p as any).loadSound('./sfx.mp3')
			p.createCanvas(400, 400)
		}
		p.draw = () => {
			p.background(10)
		}
		p.mousePressed = () => {
			// play sound
			sound.play()
		}
	}
</script>

<P5Sketch {sketch} {addons} />
```

The reason we use dynamic imports is because addons like `p5.sound` look for a global instance of p5 on the `window`. The library handles setting up `window.p5` for you and makes sure addons are properly registered.

## Using Older Libraries In Svelte

While p5.js is starting the move to ESM, it uses CJS packages that throw a wrench if you try to import it:

```svelte:P5Sketch.svelte
<script lang="ts">
	// 💣 error
	import p5 from 'p5'
</script>
```

In that case you should use a [dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) which also makes it safe for server-side rendering in SvelteKit when used inside `onMount` or `$effect` since it loads the library on the client:

```svelte:P5Sketch.svelte
<script lang="ts">
	// ...
	async function setup() {
		// destructure the default export and rename it
		const { default: p5 } = await import('p5')

		// this is where we handle the addons
		if (props.addons?.length) {
			// some addons look for `window.p5` so we create it
			(window as unknown as Window & { p5: typeof p5 }).p5 = p5
			// make sure the addons are properly registered
			await Promise.all(props.addons.map((addon) => addon?.()))
		}

		// create p5 instance and pass it to `sketch`
		instance = new p5((p) => props.sketch(p), target)
	}

	$effect(() => {
		// invoke the setup
		setup().catch((err) => console.error(err))
		// return cleanup
		return () => instance?.remove?.()
	})
</script>
```

An often mistake I see people make is passing an `async` callback to `onMount` or `$effect` when they want to do a cleanup after the component is removed:

```svelte:P5Sketch.svelte
<script lang="ts">
	import { onMount } from 'svelte'

	// ❌ don't do this
	onMount(async () => {
		// the cleanup won't run
		return () => console.log('🧹 cleanup')
	})

	// ❌ don't do this
	$effect(async () => {
		// the cleanup won't run
		return () => console.log('🧹 cleanup')
	})
</script>
```

Returning a promise prevents the cleanup from running, leading to a memory leak. Instead, use a separate `async` function, the `.then` method, or an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE).

```svelte:P5Sketch.svelte
<script lang="ts">
	async function setup() {
		// ...
	}

	$effect(() => {
		// 1. using an async function
		setup()
	})

	$effect(() => {
		// 2. using `.then` if you need to resolve the promise
		setup().then((result) => {
			// ...
		})
	})

	$effect(() => {
		// 3. using an IIFE
		(async () => {
			// ...
		})()
	})
</script>
```

That's everything you need to know to use p5.js in Svelte. If you find any issues, feel free to file them on [GitHub](https://github.com/matiadev/p5-svelte).
