---
title: The Best Svelte SVG Animation Library
description: Learn how to make the best SVG animation library using existing Svelte features inspired by other animation libraries.
slug: svg-animation-library
published: '2023-11-03'
category: svelte
---

<script lang="ts">
	import Embed from '#lib/components/embed.svelte'
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="_jWnyJRKOvU" title="The Best Svelte SVG Animation Library" />

## Table of Contents

## Motivation

Inspired by [Motion Canvas](https://motioncanvas.io/), I made the presentational framework [Animotion](https://animotion.pages.dev/) for making animated videos using code, instead of having to learn animation software.

Animotion is only responsible for animating layout transitions, and code blocks between slides. Instead of recording and matching the audio to a timeline, you record the voicover over the slides.

You can use any JavaScript animation library in your slides, but I always wanted a bespoke animation library that complements Animotion.

<Embed src="https://stackblitz.com/github/joysofcode/motion-svg?ctl=1&embed=1&file=src%2Froutes%2F%2Bpage.svelte&title=Motion SVG" title="Motion SVG" />

You can find the code on [GitHub](https://github.com/joysofcode/motion-svg).

I thought about it for months, and explored everything I could think of such as a [declarative timeline using the Web Animations API](https://x.com/joyofcodedev/status/1716406230074171538), but nothing felt right — only to realize that Motion Canvas was right all along.

## Animation Library Foundations

In Motion Canvas every animatable value is a [signal](https://motioncanvas.io/docs/signals/), which represents a value that changes over time.

It uses [generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) to describe and play animations.

```ts:example showLineNumbers
export default makeScene2D(function* (view) {
  const circle = createRef<Circle>()

  view.add(
    <Circle
      ref={circle}
      x={-300}
      width={240}
      height={240}
      fill="#e13238"
    />
  )

  yield* tween(2, value => {
    circle().position.x(map(-300, 300, value))
  })
})
```

You don't have to understand generators, but the example above animates the `x` coordinate of the circle from `-300` to `300` over `2` seconds by creating a tween that yields the value over time.

Motion Canvas uses the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) to draw graphics, but I'm going to use [SVGs](https://developer.mozilla.org/en-US/docs/Web/SVG) because it already has everything you need to draw shapes, and animate their values.

Svelte already has a `tweened` and `spring` [Svelte store](https://joyofcode.xyz/svelte-stores-guide) to define values that change over time.

```svelte:example showLineNumbers
<script>
	import { tweened } from 'svelte/motion'

	// value that changes over time
	const circle = tweened({ cx: -300 })

	// update value over 2 seconds
	circle.set({ cx: 300 }, { duration: 2000 })
</script>

<svg width="100%" height="100%" viewBox="-300 -300 600 600">
	<circle cx={$circle.cx} cy={0} r={40} fill="#e13238" />
</svg>
```

I quickly learned that animating CSS keyframes using the Web Animations API isn't enough, because you can't tween every value like the SVG `viewBox` to create interesting camera effects.

You can't interpolate strings, but Svelte gives you the option to pass in your own interpolation function.

This means you can use the [d3-interpolate](https://github.com/d3/d3-interpolate) package to interpolate between numbers, colors, strings, arrays, and objects.

```svelte:example {4,9} showLineNumbers
<script>
	import { tweened } from 'svelte/motion'
	import { cubicInOut } from 'svelte/easing'
	import { interpolate } from 'd3-interpolate'

	const circle = tweened({ cx: -300, fill: '#fff' }, {
		duration: 2000,
	  easing: cubicInOut,
	  interpolate,
	})

	circle.set({ cx: 300, fill: '#e13238' })
</script>

<svg width="100%" height="100%" viewBox="-300 -300 600 600">
	<circle cx={$circle.cx} cy={0} r={40} fill={$circle.fill} />
</svg>
```

The `tweened` store returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), which means you can use the `await` keyword to wait until the animation is done.

```svelte:example {14-15} showLineNumbers
<script>
	import { onMount } from 'svelte'
	import { tweened } from 'svelte/motion'
	import { cubicInOut } from 'svelte/easing'
	import { interpolate } from 'd3-interpolate'

	const circle = tweened({ cx: -300, fill: '#fff' }, {
		duration: 2000,
	  easing: cubicInOut,
	  interpolate,
	})

	onMount(async () => {
		await circle.set({ cx: 300, fill: '#e13238' })
		await circle.set({ cx: -300, fill: '#e13238' })
	})
</script>

<svg width="100%" height="100%" viewBox="-300 -300 600 600">
	<circle cx={$circle.cx} cy={0} r={40} fill={$circle.fill} />
</svg>
```

To avoid repeating the values for every animation, I'm going to use the store's `update` method, and merge the old and new values.

```ts:example showLineNumbers
onMount(async () => {
	await circle.update(prev => ({ ...prev, cx: 300, fill: '#e13238' }))
	await circle.update(prev => ({ ...prev, cx: -300 }))
})
```

Being able to tween values, and run animations in sequence is the foundation of every animation library.

## The Animation Library

This is great, but doing any slightly more complex animation is going to be tedious.

I want to be able to define values that change over time, and chain animations together using a `.to` method inspired by the [GSAP](https://gsap.com/) animation library.

```svelte:+page.svelte showLineNumbers
<script lang="ts">
	import { onMount } from 'svelte'

	function animate(fn) {
		onMount(fn)
	}

	animate(async () => {
		await circle
			.to({ cx: 300, fill: '#e13238' })
			.to({ cx: -300 })
	})
</script>
```

The `animate` function is just a wrapper around `onMount` to make things prettier, if you want to publish this as a library.

I'm going to wrap the `tweened` store inside of a `signal` function, creating a custom Svelte store you can subscribe to.

```svelte:+page.svelte {6-15,17,20} showLineNumbers
<script lang="ts">
	import { tweened } from 'svelte/motion'
	import { cubicInOut } from 'svelte/easing'
	import { interpolate } from 'd3-interpolate'

	function signal(values, options = { duration: 1000, easing: cubicInOut, interpolate }) {
		const { subscribe, update } = tweened(values, options)

		function to(values, options) {
			update(prev => ({ ...prev, ...values }))
			return this
		}

  	return { subscribe, to }
	}

	const circle = signal({ cx: -300, fill: '#fff' })

	animate(async () => {
		await circle.to({ cx: 300, fill: '#e13238' })
	})
</script>
```

To chain animations we simply return `this`, which returns a reference to itself. This doesn't work yet, because we update the store immediately, and it animates to the last position.

Making the `.to` method `async` and using `await` would not work, because it returns a Promise.

```ts:example showLineNumbers
async function to(values, options) {
	await update(prev => ({ ...prev, ...values }))
	return this
}
```

To solve this problem I'm going to create a `tasks` queue, and push the animations inside of it to play them later. For promise chaining to work, you can return a `then` method which makes an object [thenable](https://javascript.info/promise-chaining).

Using `.to` we push animations into a queue, and then we can run them in sequence using `await` because the object is thenable.

```svelte:+page.svelte {5,8,12-17,19} showLineNumbers
<script lang="ts">
	function signal(values, options = { duration: 1000, interpolate: interpolate, easing: cubicInOut }) {
		const { subscribe, update } = tweened(values, options)

		let tasks = []

		function to(values, options) {
			tasks.push(() => update(prev => ({ ...prev, ...values }), options))
			return this
		}

		async function then(resolve) {
			for (const task of tasks) {
				await task()
			}
			resolve()
		}

  	return { subscribe, to, then }
	}

	const circle = signal({ cx: -300, fill: '#fff' })

	animate(async () => {
		await circle
			.to({ cx: 300, fill: '#e13238' })
			.to({ cx: -300 })
	})
</script>
```

If you log `tasks`, you can see `then` runs after the last task has been pushed.

```ts:example showLineNumbers
async function then(resolve) {
	console.log(tasks) // [() => update(...), () => update(...)]
}
```

There is a bug in the code. If you repeat the animation, it's going to play three times, because we forgot to clear the `tasks`.

```ts:example showLineNumbers
animate(async () => {
	await circle
		.to({ cx: 300, fill: '#e13238' })
		.to({ cx: -300 })

	await circle
		.to({ cx: 300, fill: '#e13238' })
		.to({ cx: -300 })
})
```

In these sort of scenarios, it's easier to use a `debugger` statement, to understand how your code runs.

```ts:example {2} showLineNumbers
async function then(resolve) {
	debugger
	for (const task of tasks) {
		await task()
	}
	resolve()
}
```

You can see the entire application state, and find the problem quicker.

```ts:+page.svelte {5} showLineNumbers
async function then(resolve) {
	for (const task of tasks) {
		await task()
	}
	tasks = []
	resolve()
}
```

That's it! 😄

## Playing Animations At The Same Time

To play animations at the same time, we can use the [Promise.all()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) method, which takes an array of promises, and returns a single Promise.

```svelte:+page.svelte {6-9} showLineNumbers
<script lang="ts">
	const circle = signal({ cx: -300, r: 40, fill: '#fff' })
	const text = signal({ opacity: 0 })

	animate(async () => {
		Promise.all([
			circle.to({ cx: 300, r: 80, fill: '#e13238' }),
			text.to({ opacity: 1 }, { duration: 2000 })
		])
	})
</script>

<svg width="100%" height="100%" viewBox="-300 -300 600 600">
	<circle cx={$circle.cx} cy={0} r={$circle.r} fill={$circle.fill} />
	<text
		x={$circle.cx}
		y={$circle.cy}
		opacity={$text.opacity}
		font-size={$circle.r * 0.4}
		text-anchor="middle"
		dominant-baseline="middle"
	>
		Motion
	</text>
</svg>
```

This is tedious to write, so we can create a helper function.

```svelte:+page.svelte showLineNumbers
<script lang="ts">
	function all(...animations) {
  	return Promise.all(animations)
	}

	animate(async () => {
		all(
			circle.to({ cx: 300, r: 80, fill: '#e13238' }),
			text.to({ opacity: 1 }, { duration: 2000 })
		)
	})
</script>
```

That's it! 😄

## Creating Stories With Sound

The last feature I want is to be able to play sounds alongside animations, to create engaging stories like [Vox](https://www.youtube.com/@Vox) does with their productions.

Inside `signal`, I'm going to create a `sfx` method that is also chainable.

```ts:+page.svelte {2-11,13} showLineNumbers
function signal(values, options) {
	function sfx(sound, { volume = 0.5 } = {}) {
		const audio = new Audio(sound)
		audio.volume = volume

		tasks.push(async () => {
			audio.play().catch(() => console.error('To play sounds interact with the page.'))
		})

		return this
	}

	return { subscribe, to, sfx, then }
}
```

## Tidying Things Up

I'm going to move the typed library code to `lib/motion.ts` and export the functions.

How beautiful is this? 😄

```ts:src/lib/motion.ts showLineNumbers
import { onMount } from 'svelte'
import { tweened, type TweenedOptions } from 'svelte/motion'
import { cubicInOut } from 'svelte/easing'
import { interpolate } from 'd3-interpolate'

type AnimationFn = () => Promise<void>
type Resolve = (value?: any) => Promise<void>

export function animate(fn: AnimationFn) {
	onMount(fn)
}

export function signal<TweenValues>(
	values: TweenValues,
	options: TweenedOptions<TweenValues> = {
		duration: 1000,
		easing: cubicInOut,
		interpolate,
	}
) {
	const { subscribe, update, set } = tweened<TweenValues>(values, options)

	let tasks: AnimationFn[] = []

	function to(
		this: any,
		values: Partial<TweenValues>,
		options: TweenedOptions<TweenValues> | undefined = undefined
	) {
		if (typeof values === 'object') {
			tasks.push(() => update((prev) => ({ ...prev, ...values }), options))
		} else {
			tasks.push(() => set(values, options))
		}
		return this
	}

	function sfx(this: any, sound: string, { volume = 0.5 } = {}) {
		const audio = new Audio(sound)
		audio.volume = volume

		tasks.push(async () => {
			audio.play().catch(() => console.error('To play sounds interact with the page first.'))
		})

		return this
	}

	async function then(resolve: Resolve) {
		for (const task of tasks) {
			await task()
		}
		resolve()
		tasks = []
	}

	return { subscribe, to, sfx, then }
}

export function all(...animations: AnimationFn[]) {
	return Promise.all(animations)
}
```

One last thing I changed is checking the type of `values` passed to the `to` method, in case you want to pass a single value, such as `signal(0)`, or `signal('#fff')`, instead of having to pass an object.

I hope you learned something, but more importantly feel inspired, and have fun coding.
