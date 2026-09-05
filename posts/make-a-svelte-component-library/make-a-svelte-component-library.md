---
title: How To Make a Svelte Component Library
description: Learn how to make reusable UI components in Svelte by making an accordion.
slug: make-a-svelte-component-library
published: '2023-05-26'
category: svelte
---

<script lang="ts">
	import Embed from '#lib/components/embed.svelte'
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="teXFHcugXaI" title="Make Your Own Svelte Component Library" />

## Table of Contents

## Making Reusable Svelte Components

Svelte sparks joy because it has everything you want for creating reusable components with ease from state management to bringing your components to life with animations.

You're going to learn how to build and compose reusable Svelte components which you can use to make your own component library by making an accessible Svelte accordion.

<Embed src="https://stackblitz.com/github/joysofcode/svelte-accordion?ctl=1&embed=1&file=src%2Froutes%2F%2Bpage.svelte&title=Svelte Accordion" title="Svelte Accordion" />

## Building Accessible Components

There's not a lot of great native components you can use either due to lack of functionality or customization in which case you reach out to a third party UI component library.

The downside of most UI component libraries is they make it hard to customize things how you want, or make it difficult and the closest you can get is using an unstyled headless UI library.

That being said making your own reusable UI components is not intimidating and hard as it might sound.

The [ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/) has all the patterns for the most popular components you might want and has rules on what you should include to make a component accessible including the HTML, CSS and JavaScript.

To be honest this is boring unless you're into A11Y but important if you want your components to be consumed by other humans.

I'm more excited about building things and coming up with ideas for how I would want to use something making the editor your canvas.

## Coming Up With The API

Before I write any code I love to think about how I would want to use the component.

```svelte:example.svelte showLineNumbers
<Accordion {items} />
```

You could make an `<Accordion />` component and pass it `items` as prop which you could loop over and do your thing.

```svelte:example.svelte showLineNumbers
<Accordion {title} {content} />
```

How about a single `<Accordion />` component?

The exploration and thinking about how to solve a problem like this is heaps of fun.

That being said I would love to be in charge of the rendering and use a `<slot />` to pass whatever I want to the accordion.

```svelte:example.svelte showLineNumbers
<Accordion>
  <slot />
</Accordion>
```

Instead of passing whatever we can compose Svelte components with ease.

```svelte:example.svelte showLineNumbers
<Accordion>
  <AccordionItem>
    <h3>Item 1<h3>
    <marquee>Content 1</marquee>
  </AccordionItem>
</Accordion>
```

In this case I prefer this approach because you're in control of rendering whatever you want, including a `<marquee>` element.

If you're just learning Svelte you're not going to know what you don't know but the more you learn, or if you have any experience with other JavaScript frameworks you're going to develop an intuition for what you can do over time.

Another feature I want is to be able to pass a `collapse` prop to the `<Accordion />` component if I want one `<AccordionItem />` open at a time, and I want to be able to pass an `open` prop to the `<AccordionItem />` item I want to be open by default.

```svelte:example.svelte showLineNumbers
<Accordion collapse>
  <AccordionItem open>
    <!-- ... -->
  </AccordionItem>

  <AccordionItem>
    <!-- ... -->
  </AccordionItem>
</Accordion>
```

## Making The Accordion

Here are the files I'm going to create.

```shell:accordion
src
└── lib
    └── components
        └── accordion
            ├── accordion-item.svelte
            ├── accordion.svelte
            ├── context.ts
            ├── index.ts
            └── types.ts
```

I created a `index.ts` file to export the accordion parts, so you're able to import the accordion parts using a single import.

```ts:src/lib/components/accordion/index.ts showLineNumbers
export { default as Accordion } from './accordion.svelte'
export { default as AccordionItem } from './accordion-item.svelte'
```

```svelte:src/routes/+page.svelte showLineNumbers
<script lang="ts">
	import { Accordion, AccordionItem } from '$lib/components/accordion'

	const items = [
		{ title: 'Item 1', content: 'Content 1' },
		{ title: 'Item 2', content: 'Content 2' },
		{ title: 'Item 3', content: 'Content 3' },
		{ title: 'Item 4', content: 'Content 4' }
	]
</script>

<Accordion collapse --accordion-width="60ch">
  {#each items as item, i}
    <AccordionItem open={i === 0}>
      <svelte:fragment slot="title">{item.title}</svelte:fragment>
      <svelte:fragment slot="content">{item.content}</svelte:fragment>
    </AccordionItem>
  {/each}
</Accordion>
```

I'm using **named slots** to let Svelte know where to place the items inside the `<AccordionItem />` component.

The special Svelte element `<svelte:fragment>` looks spooky but it just allows you to pass content to a slot without an extra `<div>` wrapper.

> 🐿️ As an exercise you could hide the `<svelte:fragment>` implementation inside a `<AccordionTitle>` and `<AccordionContent>` component, so the consumer of your component doesn't have to think about the meaning of it.

First edit the `<Accordion />` component.

```svelte:src/lib/components/accordion/accordion.svelte showLineNumbers
<script lang="ts">
	// by default more than one accordion can be open
	export let collapse = false
</script>

<div class="accordion">
	<slot />
</div>

<style>
	.accordion {
		width: var(--accordion-width, 100%);
		padding: var(--accordion-padding, 1rem);
		color: var(--accordion-color, hsl(220 10% 98%));
		background-color: var(--accordion-background, hsl(220 10% 16%));
		border-radius: var(--accordion-radius, 4px);
		box-shadow: var(--accordion-shadow, 0px 1px 20px hsl(220 10% 8%));
	}
</style>
```

I use CSS variables with a hardcoded fallback value but I would prefer to use another CSS variable from my design system. This is a great way to customize your component directly besides specifying the values for the CSS variables in your global styles.

Edit the `<AccordionItem />` component.

```svelte:src/lib/components/accordion/accordion-item.svelte showLineNumbers
<script lang="ts">
	// by default the accordion item is closed
  export let open

	function toggleOpen() {
		open = !open
	}
</script>

<div class="accordion-item">
	<button on:click={toggleOpen} class="accordion-toggle">
		<div class="accordion-title">
			<slot name="title" />
		</div>

		<div class="accordion-caret">👉️</div>
	</button>

	{#if open}
		<div class="accordion-content">
			<slot name="content" />
		</div>
	{/if}
</div>

<style>
	.accordion-toggle {
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding: var(--accordion-padding, 1rem);
		color: var(--accordion-color, inherit);
		font: inherit;
		font-weight: 600;
		border: none;
		background: none;
		cursor: pointer;
		border-radius: var(--accordion-radius, 4px);
		transition: background-color 0.1s ease;
	}

	.accordion-toggle:hover {
		background-color: var(--accordion-hover, hsl(220 20% 20%));
	}

	.accordion-content {
		padding: var(--accordion-content-padding, 1rem);
	}
</style>
```

That's not so bad, right? 😄

## Using The Context API

If you want one accordion item open at a time you have to pass `collapse` to every `<AccordionItem />` component. 😅

```svelte:example.svelte showLineNumbers
<Accordion>
  <AccordionItem collapse />
  <AccordionItem collapse />
  <AccordionItem collapse />
  <AccordionItem collapse />
</Accordion>
```

To avoid passing data as props to every child component you can use the [context API](https://learn.svelte.dev/tutorial/context-api) from Svelte.

The way how the context API works is instead of passing props, you set the context inside a parent component which only the child components can access.

```svelte:example.svelte showLineNumbers
<Accordion collapse>
  <AccordionItem />
  <AccordionItem />
  <AccordionItem />
  <AccordionItem />
</Accordion>
```

> 🐿️ If you want to learn how to manage state in Svelte you can read the [Svelte state management guide](https://joyofcode.xyz/svelte-state-management).

Instead of using the context API directly inside the components I'm going to do it inside `context.ts`, so everything is in one place which also makes it easier to type.

I get it if you're not into TypeScript, so here's the version without types first.

```ts:src/lib/components/accordion/context.ts showLineNumbers
import { writable } from 'svelte/store'
import { setContext, getContext } from 'svelte'

export function setAccordionOptions({ collapse }) {
	const activeComponentId = writable(null)
	setContext('collapse', collapse)
	setContext('active', activeComponentId)
}

export function getAccordionOptions() {
	const collapse = getContext('collapse')
	const activeComponentId = getContext('active')
	return { collapse, activeComponentId }
}
```

You could have the options inside an object like `setContext('options', { ... })` but avoid unnecesary work for Svelte and only update what needs to be updated.

**Context is not reactive** but you can use a Svelte store for the `activeComponentId` value. This way you don't have a global store but one that's tied to the accordion.

> 🐿️ You could use a Svelte store to do the same thing but Svelte stores are available to any part of your app but a context is only available to that component and it's descendants.

Here's the typed version for the TypeScript nerds.

```ts:src/lib/components/accordion/types.ts showLineNumbers
import type { Writable } from 'svelte/store'

export type AccordionOptions = { collapse: boolean }
export type ActiveId = string | null
export type CollapseContext = boolean
export type ActiveIdContext = Writable<ActiveId>
```

```ts:src/lib/components/accordion/context.ts showLineNumbers
import { writable } from 'svelte/store'
import { setContext, getContext } from 'svelte'
import type {
	AccordionOptions,
	ActiveId,
	ActiveIdContext,
	CollapseContext
} from './types'


export function setAccordionOptions({ collapse }: AccordionOptions) {
	const activeComponentId = writable<ActiveId>(null)
	setContext<CollapseContext>('collapse', collapse)
	setContext<ActiveIdContext>('active', activeComponentId)
}

export function getAccordionOptions() {
	const collapse = getContext<CollapseContext>('collapse')
	const activeComponentId = getContext<ActiveIdContext>('active')
	return { collapse, activeComponentId }
}
```

This is why using the context API directly in the components would be annoying because you would have to import the types everywhere.

Set the context inside the `<Accordion />` component.

```svelte:src/lib/components/accordion/accordion.svelte {2,7} showLineNumbers
<script lang="ts">
	import { setAccordionOptions } from './context'

	export let collapse = false

	// the context API avoids passing data through components as props
	setAccordionOptions({ collapse })
</script>
```

Get the context values inside `<AccordionItem />` but we also need to give the component a unique id.

```svelte:src/lib/components/accordion/accordion-item.svelte showLineNumbers
<script lang="ts">
	import { getAccordionOptions } from './context'

	export let open = false

	// assign a unique identifier for the component
	const componentId = crypto.randomUUID()

	// get the accordion options using the context api
	const { collapse, activeComponentId } = getAccordionOptions()
</script>
```

> 🐿️ You could use anything to create the random id like `Math.random()` but the `crypto.randomUUID()` module is available on the server and browser.

I'm going to update the logic inside the `<AccordionItem />` component.

```svelte:src/lib/components/accordion/accordion-item.svelte {26,32} showLineNumbers
<script lang="ts">
	function setActive() {
		// update the store value in the context
		$activeComponentId = componentId
	}

	function toggleOpen() {
		open = !open
	}

	function handleClick() {
		// if `collapse` is passed only one item can be active
		collapse ? setActive() : toggleOpen()
	}

	// the accordion item to be open by default
	$: open && collapse && setActive()
	// compare if the active id matches the component id
	$: isActive = $activeComponentId === componentId
	// if `collapse`, set one item as active, otherwise use `open`
	$: isOpen = collapse ? isActive : open
</script>

<div class="accordion-item">
	<button
    on:click={handleClick}
    class="accordion-toggle"
	>
    <!-- ... -->
	</button>

  {#if isOpen}
    <!-- ... -->
  {/if}
</div>
```

That's it! 🎉

## Animating The Accordion

The Svelte `class:name` directive is an easy way to add, or remove a class for animation.

```svelte:src/lib/components/accordion/accordion-item.svelte showLineNumbers
<div
  class="accordion-caret"
  class:open={isOpen}
>
  👉️
</div>

<style>
	.accordion-caret {
		transition: rotate 0.3s ease;
	}

	.open {
		rotate: 90deg;
	}
</style>
```

To animate the height of the accordion item I'm going to use the `slide` transition from Svelte.

```svelte:src/lib/components/accordion/accordion-item.svelte showLineNumbers
<script lang="ts">
	import { slide } from 'svelte/transition'
  // ...
</script>

{#if isOpen}
  <div
    transition:slide|local
    class="accordion-content"
  >
    <slot name="content" />
  </div>
{/if}
```

> 🐿️ Local transitions only play when the block they belong to is created or destroyed.

Adding a touch of wimsy goes a long way. 🪄

<YouTube id="B_n4YONte5A" title="The simple trick to transition from height 0 to auto with CSS" />

You can easily animate the height of an item using CSS Grid if you have to and [@kevinpowell](https://twitter.com/KevinJPowell) has a great video on how to do that.

## Accessibility

If you remember, the [ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/) from the start has guidelines on what you need to include to make an accordion accessible.

Accessibility is a large subject and I'm the first to admit I don't know much about it but it's a great start and **having some accessibility is better than having none**.

That being said it's only a couple of lines of code if you look at the guidelines.

```svelte:src/lib/components/accordion/accordion-item.svelte {5-6, 16-17} showLineNumbers
<div class="accordion-item">
	<button
		on:click={handleClick}
		class="accordion-toggle"
    aria-expanded={isOpen}
    aria-controls="accordion-{componentId}"
	>
		<!-- ... -->
	</button>

	{#if isOpen}
		<div
			transition:slide|local
			class="accordion-content"
			role="region"
      aria-hidden={!isOpen}
      aria-labelledby="accordion-{componentId}"
		>
			<slot name="content" />
		</div>
	{/if}
</div>
```

Congrats! 🥳

I hope you learned a lot and even if you're not making a UI component library now you understand how powerful Svelte composition is and you can use it to make any kind of reusable component.
