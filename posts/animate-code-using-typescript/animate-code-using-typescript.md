---
title: Animate Code Using TypeScript
description: Learn how to animate code using TypeScript and the Shiki Magic Move library.
slug: animate-code-using-typescript
published: '2026-03-21'
category: typescript
---

<script lang="ts">
	import YouTube from '$lib/components/youtube.svelte'
</script>

<YouTube id="wGf0PUlOQoA" title="Animate Code Using TypeScript" />

## Table of Contents

## Shiki Magic Move

In another post I wrote about [how to create animated code blocks using Shiki Magic Move in Svelte](https://joyofcode.xyz/animated-code-blocks-using-shiki) by creating a custom Svelte renderer.

[Shiki Magic Move](https://shiki-magic-move.netlify.app/) is a low-level library for animating code blocks using [Shiki](https://shiki.style/) for syntax highlighting, so it only provides framework wrappers and doesn't have instructions on how to create a TypeScript renderer.

In this post I'm going to show you how to create a TypeScript renderer using Shiki Magic Move for smoothly animated code blocks.

## Animating Code Blocks Using TypeScript

If you want to follow along create a vanilla TypeScript project using Vite:

```sh:terminal
npm create vite@latest magic-move -- --template vanilla-ts
```

We need to install the `shiki-magic-move` and `shiki` package:

```sh:terminal
npm i shiki-magic-move shiki
```

At the heart of Shiki Magic Move is a framework agnostic **core**, and **renderer**:

```ts:magic-move.ts
import { codeToKeyedTokens, createMagicMoveMachine } from 'shiki-magic-move/core'
import { MagicMoveRenderer } from 'shiki-magic-move/renderer'
```

We also need to import the CSS styles for the animations from `shiki-magic-move`:

```ts:magic-move.ts
import 'shiki-magic-move/dist/style.css'
```

Next let's create the Shiki highlighter:

```ts:magic-move.ts
import { createHighlighter } from 'shiki'

// create the Shiki highlighter
const highlighter = await createHighlighter({
	langs: ['typescript'],
	themes: ['poimandres'],
});
```

Keep in mind how Shiki can be resource intensive. If you're going to create multiple highlighters you want to cache them using the [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) object. You can also create lighter bundles by reading the [Shiki docs](https://shiki.style/guide/bundles).

Now it's time to create a `MagicMove` class that creates the `machine` and `renderer` with an `update` method:

```ts:magic-move.ts
import { createHighlighter, type HighlighterCore, type BundledLanguage, type BundledTheme } from 'shiki'
import { codeToKeyedTokens, createMagicMoveMachine, type MagicMoveDifferOptions, type MagicMoveRenderOptions } from 'shiki-magic-move/core'
import { MagicMoveRenderer } from 'shiki-magic-move/renderer'
import 'shiki-magic-move/dist/style.css'

interface MagicMoveOptions extends MagicMoveRenderOptions, MagicMoveDifferOptions {
	lang: BundledLanguage
	theme: BundledTheme
}

class MagicMove {
	// the machine diffs the code
	private machine: ReturnType<typeof createMagicMoveMachine>
	// the renderer creates DOM elements and transitions
	private renderer: MagicMoveRenderer

	constructor(target: Element, highlighter: HighlighterCore, code: string, options: MagicMoveOptions) {
		const { lang, theme, lineNumbers = false } = options

		// add `<pre>` element to target
		const pre = document.crateElement('pre')
		pre.className = 'shiki-magic-move-container'
		target.appendChild(pre)

		// create the Shiki Magic Move machine
		this.machine = createMagicMoveMachine(
			(code) => codeToKeyedTokens(highlighter, code, { lang, theme }, lineNumbers),
			options,
		);

		// create the Shiki Magic Move renderer
		this.renderer = new MagicMoveRenderer(pre, options)

		// initial render
		this.machine.commit(code)
		this.renderer.render(this.machine.current)
	}

	// update the DOM and perform the transitions
	update(code: string) {
		this.machine.commit(code)
		this.renderer.render(this.machine.current)
	}
}

// get the target element
const target = document.querySelector<HTMLDivElement>('#app')!

// the formatting is important because of `<pre>`
const steps = {
	before: `
function lerp(a, b, t) {
  return a + (b - a) * t
}`.trim(),
	after: `
function lerp(a, b, t) {
  const delta = (b - a) * t
  return a + delta
}`.trim(),
};

// create the `MagicMove` instance
const code = new MagicMove(target, highlighter, steps.before, {
	lang: 'typescript',
	theme: 'poimandres',
})

let toggle = false

document.addEventListener('click', () => {
	// update the code
	code.update(toggle ? steps.before : steps.after)
	toggle = !toggle
})
```

You can pass more options like `lineNumbers`, `duration`, `stagger`, `containerStyle` to remove the code background, and `easing` to add more character to the animation among other options:

```ts:shiki-magic-move.ts
const code = new MagicMove(target, highlighter, steps.before, {
	lang: 'typescript',
	theme: 'poimandres',
	lineNumbers: true,
	duration: 1_000,
	stagger: 0.3,
	containerStyle: false,
	easing: `linear(
	   0, 0.009, 0.035 2.1%, 0.141, 0.281 6.7%, 0.723 12.9%, 0.938 16.7%, 1.017,
	   1.077, 1.121, 1.149 24.3%, 1.159, 1.163, 1.161, 1.154 29.9%, 1.129 32.8%,
	   1.051 39.6%, 1.017 43.1%, 0.991, 0.977 51%, 0.974 53.8%, 0.975 57.1%,
	   0.997 69.8%, 1.003 76.9%, 1.004 83.8%, 1
	 )`,
});
```

I got the easing from the [linear easing generator](https://linear-easing-generator.netlify.app/) which can create [linear()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/easing-function/linear) easings from JavaScript and SVGs.

That's it! Now you have a framework agnostic Shiki Magic Move instance that you can use anywhere your heart desires.
