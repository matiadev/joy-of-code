---
title: Animated Code Blocks Using Shiki Magic Move
description: Using the framework agnostic Shiki Magic Move library in Svelte for smoothly animated code blocks.
slug: animated-code-blocks-using-shiki
published: '2024-04-14'
category: svelte
---

<script lang="ts">
	import Embed from '#lib/components/embed.svelte'
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="RbfIcFZsISg" title="Animated Code Blocks Using Shiki Magic Move" />

## Table of Contents

## What Is Shiki Magic Move?

<Embed src="https://stackblitz.com/github/joysofcode/shiki-magic-move?ctl=1&embed=1&file=src%2Froutes%2F%2Bpage.svelte&view=preview&title=Shiki Magic Move" title="Shiki Magic Move" />

You can click on the example on the page to activate the code block animation. You can find the [source code](https://github.com/joysofcode/shiki-magic-move) on GitHub.

[Shiki](https://shiki.style/) is a powerful, modern JavaScript syntax highlighter. [Shiki Magic Move](https://shiki-magic-move.netlify.app/) is a low-level framework agnostic library for animating code blocks which uses Shiki for syntax highlighting — it has framework wrappers for Vue and React, but in this post I'm going to show you how to make a Svelte renderer.

You can read [The Magic In Shiki Magic Move](https://antfu.me/posts/shiki-magic-move) if you want to understand how Shiki Magic Move works, but the gist is that it uses text diffing, and the [FLIP animation technique](https://www.youtube.com/watch?v=idD9DA9eR_A) to animate the changes.

Huge thanks to [@antfu](https://twitter.com/antfu7) for not only creating Shiki Magic Move, but also completely rewriting Shiki for the modern JavaScript age to use ESM, and run anywhere where JavaScript runs.

## Project Setup

Install the `shiki` and `shiki-magic-move` dependencies:

```shell:terminal
npm i shiki shiki-magic-move
```

Inside a SvelteKit project create these files:

```shell:files
src/
├── lib/
│   ├── index.ts
│   ├── ShikiMagicMove.svelte
│   └── ShikiMagicMoveRenderer.svelte
└── routes/
    ├── +layout.svelte
    └── app.css
```

You can find the [types](https://github.com/joysofcode/shiki-magic-move/blob/main/src/lib/types.ts) I use throughout the examples on GitHub.

You could put everything inside a single file, but I'm going to mirror the setup for other [framework renderers](https://github.com/shikijs/shiki-magic-move/tree/main/src/vue).

```ts:src/lib/index.ts showLineNumbers
import ShikiMagicMove from './ShikiMagicMove.svelte'
import ShikiMagicMoveRenderer from './ShikiMagicMoveRenderer.svelte'

export { ShikiMagicMove, ShikiMagicMoveRenderer }
```

You should copy over these [Shiki Magic Move styles](https://github.com/joysofcode/shiki-magic-move/blob/main/src/routes/app.css) inside `app.css`, and include it inside your root layout.

```svelte:src/routes/+layout.svelte showLineNumbers
<script lang="ts">
	import './app.css'

  let { children } = $props()
</script>

<svelte:head>
  <title>Shiki</title>
</svelte:head>

{@render children()}
```

## Creating The Shiki Highlighter

Inside `+page.svelte` create the Shiki highlighter and pass it to the `<ShikiMagicMove>` component.

```svelte:src/routes/+pages.svelte {2,8-11,21-32} showLineNumbers
<script lang="ts">
	import { getHighlighter } from 'shiki'
	import ShikiMagicMove from '$lib/ShikiMagicMove.svelte'

	let code = $state('let bool;')
	let toggle = $state(false)

	const highlighter = getHighlighter({
		themes: ['poimandres'],
		langs: ['javascript', 'typescript', 'svelte'],
	})

	function toggleAnimation() {
		toggle = !toggle
		toggle ? (code = 'let bool = true;') : (code = 'let bool;')
	}
</script>

<svelte:window on:click={toggleAnimation} />

{#await highlighter then highlighter}
	<ShikiMagicMove
		lang="ts"
		theme="poimandres"
		options={{ duration: 600, stagger: 3 }}
		onStart={() => console.log('start')}
		onEnd={() => console.log('end')}
		{highlighter}
		{code}
	/>
{/await}
```

## Shiki Magic Move Component

Inside the `<ShikiMagicMove>` component we have to create the `machine` to tokenize the code, derive the result each time the reactive `code` value updates using Svelte's `$derived` rune, and pass the props to the `<ShikiMagicMoveRenderer>` component.

```svelte:src/lib/ShikiMagicMove.svelte {2,8-16,21,22} showLineNumbers
<script lang="ts">
	import { codeToKeyedTokens, createMagicMoveMachine } from 'shiki-magic-move/core'
	import ShikiMagicMoveRenderer from './ShikiMagicMoveRenderer.svelte'
	import type { ShikiMagicMoveProps } from './types'

	const { ...props }: ShikiMagicMoveProps = $props()

	const machine = createMagicMoveMachine(
		(code) =>
			codeToKeyedTokens(props.highlighter, code, {
				lang: props.lang,
				theme: props.theme,
			}),
		props.options
	)
	const result = $derived(machine.commit(props.code))
</script>

<ShikiMagicMoveRenderer
	animate={true}
	tokens={result.current}
	previous={result.previous}
	options={props.options}
	onStart={props.onStart}
	onEnd={props.onEnd}
/>
```

## Shiki Magic Move Renderer Component

Inside the `<ShikiMagicMoveRenderer>` component we have to render the `<pre>` tag, create the `MagicMoveRenderer`, and invoke the `render()` method using the tokens to start the animation, which is going to rerun the `$effect` each time `tokens` update.

```svelte:src/lib/ShikiMagicMoveRenderer.svelte {2,7-8,16,42,54} showLineNumbers
<script lang="ts">
	import { MagicMoveRenderer } from 'shiki-magic-move/renderer'
	import type { ShikiMagicMoveRendererProps } from './types'

	const { ...props }: ShikiMagicMoveRendererProps = $props()

	let container: HTMLPreElement
	let renderer: MagicMoveRenderer
	let isMounted = $state(false)

	$effect(() => {
		if (!container) return
		container.innerHTML = ''
		isMounted = true
    // create the magic move renderer
		renderer = new MagicMoveRenderer(container)
	})

	$effect(() => {
		async function render() {
			if (!renderer) return
      // merge renderer options with our options
			Object.assign(renderer.options, props.options)
			if (props.animate) {
        // replace previous animation
				if (props.previous) renderer.replace(props.previous)
        // optional start callback
				props.onStart?.()
        // run the animation and return a promise
				await renderer.render(props.tokens)
        // optional end callback
				props.onEnd?.()
			} else {
        // update code without animation
				renderer.replace(props.tokens)
			}
		}
		render()
	})
</script>

<pre bind:this={container} class="shiki-magic-move-container">
  <!-- render initial tokens for SSR -->
  {#if !isMounted}
		{#each props.tokens.tokens as token}
			{#if token.content === '\n'}
				<br />
			{/if}
      <span class="shiki-magic-move-item">
        {token.content}
      </span>
		{/each}
	{/if}
</pre>
```

The server-side rendering code is unimportant because it only serves as a placeholder until the component is ready, and I only included it for posterity.

You can watch the video on YouTube where I do everything from scratch, and spend more time explaining things.

That's it! 😄
