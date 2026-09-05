---
title: Using React Libraries In Svelte
description: Using React-only libraries like Excalidraw in Svelte.
slug: using-react-libraries-in-svelte
published: '2024-11-16'
category: svelte
---

<script lang="ts">
	import Embed from '#lib/components/embed.svelte'
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="SKUD-Aj1jKg" title="Using React Libraries Inside Svelte" />

## Table of Contents

## Using React Libraries In Svelte

I love using the virtual whiteboard app [Excalidraw](https://excalidraw.com/), so I was excited to learn it was also open source, but unfortunately it's only made for React which means you can't use it inside Svelte, or does it?

<Embed src="https://stackblitz.com/github/joysofcode/svelte-excalidraw?ctl=1&embed=1&file=src%2Froutes%2F%2Bpage.svelte&title=Excalidraw" title="Using React Libraries In Svelte" />

> You can find the code on [GitHub](https://github.com/joysofcode/svelte-excalidraw).

Every JavaScript framework is a single page application that lives in a random `<div>` somewhere on the page using [mount](https://svelte.dev/docs/svelte/imperative-component-api#mount) from Svelte or [createRoot](https://react.dev/reference/react-dom/client/createRoot) from React, so nothing stops you from using another framework elsewhere in your app:

```html:app.html
<div class="app"></div>
```

However, the problem is that some JavaScript frameworks require a compilation step before they can be used, but React is uniquely positioned so it doesn't.

## Understanding How React Works

The ironic part about React comes from the name because it's not reactive in a sense that only the value you updated is going to change, but instead React is lazy, and it's going to re-render the entire component:

```tsx:app.tsx
import React, { useState } from 'react'

function App() {
	const [count, setCount] = useState(0)

	// this logs each time you update count
	console.log(count)

	return (
		<button onClick={() => setCount(count + 1)}>
			You pressed me {count} times
		</button>
	)
}
```

What's more interesting is that React uses a XML-like syntax named [JSX](https://facebook.github.io/jsx/) for the template so everything gets turned into a function call:

```tsx:example.tsx
// JSX
let div = <div>JSX</div>

// output
let div = createElement('div', null, 'JSX')
```

Here is the signature of the [createElement](https://react.dev/reference/react/createElement) function:

```ts
createElement(type, props, ...children)
```

As you can see, "it's just JavaScript" so you don't need to even transpile the code to JavaScript and you can write it by hand:

```js:App.js
import React, { useState } from 'react'

function App() {
	const [count, setCount] = useState(0)

	return React.createElement(
		'button',
		{ onClick: setCount(count + 1) },
		'You pressed me ',
		count,
		' times'
	)
}
```

## Rendering React Components In Svelte

I'm using Excalidraw in this example, so I'm going to install the required dependencies inside a SvelteKit project:

```sh:terminal
npm i react react-dom @types/react @types/react-dom @excalidraw/excalidraw
```

If you're following along, you should also include this from the [Excalidraw docs](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/integration#preact) inside your Vite config:

```ts:vite.config.ts
export default defineConfig({
	// ...
	define: {
		'process.env.IS_PREACT': JSON.stringify('true'),
	}
})
```

I'm going to create a `Excalidraw.svelte` component inside `routes` and import it inside `+page.svelte`:

```svelte:src/routes/+page.svelte
<script lang="ts">
	import Excalidraw from './Excalidraw.svelte'
</script>

<Excalidraw />
```

Let's mount the React app inside the root element, and we have to use a dynamic import for Excalidraw because it would blow up during server-side rendering:

```svelte:src/routes/Excalidraw.svelte
<script lang="ts">
	import { createElement } from 'react'
	import { createRoot } from 'react-dom/client'
	import type { ExcalidrawProps } from '@excalidraw/excalidraw/types/types'

	let props: ExcalidrawProps = $props()
	let rootEl: HTMLElement

	$effect(() => {
		const root = createRoot(rootEl)

		import('@excalidraw/excalidraw').then(({ Excalidraw }) => {
			const excalidraw = createElement(Excalidraw, { ...props })
			root.render(excalidraw)
		})

		return () => root.unmount()
	})
</script>

<div bind:this={rootEl} class="root"></div>

<style>
	.root {
		height: 100svh;
	}
</style>
```

> ⚠️ The reason we don't use `await` inside `$effect` is because if you pass an async function to `$effect`, the cleanup is never going to be called.

## Nesting Elements In React

You can pass an array of children to a React element if you want to nest elements. Let's customize Excalidraw by including a welcome screen and changing the main menu:

```ts:src/routes/Excalidraw.svelte
$effect(() => {
	const root = createRoot(rootEl)

	import('@excalidraw/excalidraw').then(({ Excalidraw, WelcomeScreen, MainMenu }) => {
		const welcome = createElement(WelcomeScreen, { key: 'WelcomeScreen' })
		const menu = createElement(MainMenu, { key: 'MainMenu' }, [
			createElement(MainMenu.DefaultItems.LoadScene, { key: 'LoadScene' }),
			createElement(MainMenu.DefaultItems.SaveAsImage, { key: 'SaveAsImage' }),
			createElement(MainMenu.DefaultItems.Export, { key: 'Export' }),
			createElement(MainMenu.Separator, { key: 'Separator' }),
			createElement(MainMenu.DefaultItems.ChangeCanvasBackground, { key: 'ChangeCanvasBackground' }),
		])
		const excalidraw = createElement(Excalidraw, { ...props }, [welcome, menu])
		root.render(excalidraw)
	})

	return () => root.unmount()
})
```

## Reusing The Svelte Component

You now have a reusable Svelte component, and you could also export what you need from the component like the Excalidraw API:

```svelte:src/routes/+page.svelte
<script lang="ts">
	import Excalidraw from './Excalidraw.svelte'
	import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types'

	let excalidrawAPI: ExcalidrawImperativeAPI | undefined = $state()

  $effect(() => {
    excalidrawAPI?.onChange(console.log)
  })
</script>

<Excalidraw theme="dark" excalidrawAPI={api => excalidrawAPI = api} />
```

Keep in mind, using React is like bringing a sledgehammer to your project when there might be other alternatives, so use it only if you must.
