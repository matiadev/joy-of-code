---
title: Create Beautiful Presentations With Svelte
description: Learn how to create beautiful presentations with Svelte using the HTML presentation framework Reveal.js and Tailwind CSS.
slug: beautiful-presentations-with-svelte
published: '2023-06-09'
category: svelte
---

<script lang="ts">
	import Card from '#lib/components/card.svelte'
	import Embed from '#lib/components/embed.svelte'
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="67lqa5kTQkA" title="Create Beautiful Presentations With Svelte" />

## Table of Contents

## Most Presentations Are Boring

<Card type="warning">
	This post uses an older version of Svelte and hasn't been updated. If you're looking for a Svelte presentation library, I made <a href="https://animotion.pages.dev/">Animotion</a> for creating slides.
</Card>

No one likes boring presentations, but what if you could make them more engaging through rich visuals and animations using web technologies you're already familiar with?

<Embed src="https://stackblitz.com/github/joysofcode/svelte-deck?ctl=1&embed=1&file=src%2Froutes%2F%2Bpage.svelte&title=Svelte Deck" title="Svelte Deck" />

You might need to **enable cookies** for the example but the code is also available on [GitHub](https://github.com/joysofcode/svelte-deck).

You're going to learn how to make beautiful looking presentations in Svelte with minimal effort using the HTML presentation framework [Reveal.js](https://revealjs.com/) and [Tailwind CSS](https://tailwindcss.com/).

> If you ever used [Slides.com](https://slides.com/), it's made by the same creator behind the open source HTML presentation framework Reveal.js.

You might not like Tailwind, but in my opinion it's the best way to author slides. It's optional of course, in which case you can skip it.

## SvelteKit And Tailwind Setup

We're going to set up a SvelteKit project with TypeScript, including ESLint and Prettier for code formatting:

```shell:terminal
npm create svelte@latest
```

```shell:terminal
┌  Welcome to SvelteKit!
│
◇  Where should we create your project?
│    (hit Enter to use current directory)
│
◇  Which Svelte app template?
│  Skeleton project
│
◇  Add type checking with TypeScript?
│  Yes, using TypeScript syntax
│
◇  Select additional options (use arrow keys/space bar)
│  Add ESLint for code linting, Add Prettier for code formatting
│
└  Your project is ready!
```

Next install the dependencies:

```shell:terminal
npm i
```

Use the `svelte-add` package to add Tailwind CSS:

```shell:terminal
pnpx svelte-add tailwindcss
```

Install Reveal.js, types and fonts:

```shell:terminal
npm i reveal.js @types/reveal.js @fontsource/manrope @fontsource/jetbrains-mono
```

Start the development server:

```shell:terminal
npm run dev
```

## Creating The Slide Deck

Before I do anything, I'm going to disable server-side rendering in SvelteKit. It's going to cause problems, and we don't need it for a single page application:

```ts:src/routes/+page.ts
export const ssr = false
```

> You can use the Vite CLI to set up a regular Svelte project, but I prefer the SvelteKit CLI in case I change my mind and need more features.

Inside `+page.svelte` I'm going to import a `<Slides />` component and global styles:

```svelte:src/routes/+page.svelte
<script lang="ts">
	import Slides from '$lib/deck/slides.svelte'
	import '../app.postcss'
</script>

<svelte:head>
	<title>Presentation</title>
</svelte:head>

<Slides />
```

The styles include some [CSS variables for theming from Reveal.js](https://github.com/hakimel/reveal.js/blob/master/css/theme/template/exposer.scss) and styles to make the code blocks look nicer:

```css:src/app.postcss
/*
	CSS Variables For Theming
	https://github.com/hakimel/reveal.js/blob/master/css/theme/template/exposer.scss
*/

@import '@fontsource/manrope';
@import '@fontsource/jetbrains-mono';

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
	--r-main-font: 'Manrope';
	--r-heading-font: 'Manrope';
	--r-code-font: 'JetBrains Mono';
	--r-link-color: aqua;
	--r-link-color-hover: aqua;
}

.hljs {
	background: none;
}

.hljs-title,
.hljs-keyword {
	font-weight: normal;
}

.reveal pre,
.reveal code {
	overflow: hidden !important;
}

.reveal pre {
	box-shadow: none;
}
```

Inside the `<Slides />` component initialize Reveal.js:

```svelte:src/lib/decks/slides.svelte
<script lang="ts">
	import { onMount } from 'svelte'

	import Reveal from 'reveal.js'
	import Highlight from 'reveal.js/plugin/highlight/highlight'
	import Markdown from 'reveal.js/plugin/markdown/markdown'
	import Notes from 'reveal.js/plugin/notes/notes'

	import 'reveal.js/dist/reveal.css'
	import 'reveal.js/dist/theme/black.css'
	import 'reveal.js/plugin/highlight/monokai.css'

	import Presentation from './presentation.svelte'

	onMount(() => {
		const deck = new Reveal({
			plugins: [Markdown, Highlight, Notes],
			autoAnimateEasing: 'ease',
			autoAnimateDuration: 1,
			hash: true
		})

		deck.initialize()
	})
</script>

<div class="reveal">
	<div class="slides">
		<Presentation />
	</div>
</div>
```

I'm using the **highlight**, **markdown** and **speaker** notes plugin from Reveal.js but [you can find more plugins in their documentation](https://revealjs.com/plugins/).

You can use other [included Reveal.js themes](https://revealjs.com/themes/) and change the syntax highlighter theme. Reveal.js uses [highlight.js](https://highlightjs.org/) and there's a lot of [options to choose from for syntax highligting](https://highlightjs.org/static/demo/).

I encourage you to read the [Reveal.js docs](https://revealjs.com/) to know what you can customize, but here is a basic idea how you do slides:

```svelte:example.html
<div class="reveal">
  <div class="slides">
    <section>Slide 1</section>
    <section>Slide 2</section>
  </div>
</div>
```

One of the best features of Reveal.js is [auto-animate](https://revealjs.com/auto-animate/) for animating elements across slides using the [FLIP animation technique](https://aerotwist.com/blog/flip-your-animations/):

```svelte:example.html
<section data-auto-animate>
  <p>Auto-Animate</p>
</section>

<section data-auto-animate>
  <p class="text-teal-400">Auto-Animate</p>
</section>
```

You can learn more about how Reveal.js matches elements from reading the documentation, but the short version is that it looks for elements that are the same.

Because the contents of the `<p>` tag are the same, Reveal.js knows it should auto-animate it, but you can also specify a data attribute `data-id` id for elements that aren't the same, but should be animated:

```svelte:example.html
<section data-auto-animate>
  <div data-id="box" class="w-[200px] bg-teal-400"></div>
</section>

<section data-auto-animate>
  <div data-id="box" class="w-[400px] bg-red-400"></div>
</section>
```

I'm going to create reusable components which you can use to make a presentation inside the `<Presentation />` component:

```svelte:src/lib/deck/presentation.svelte
<script lang="ts">
	import Slide from './slide.svelte'
	import Code from './code.svelte'
	import Markdown from './markdown.svelte'
</script>

<!-- ... -->
```

## The Slide Component

Let's start with creating the `<Slide />` component:

```svelte:src/lib/deck/slide.svelte
<script lang="ts">
	export let id: string | null = null
	export let animate = false
	export let restart = false
</script>

<section
	data-auto-animate-id={id}
	data-auto-animate={animate || null}
	data-auto-animate-restart={restart || null}
>
	<slot />
</section>
```

- `data-auto-animate-id` attribute is useful when you want to break out of an animated slide into a new slide
- `data-auto-animate` attribute marks the slide to be animated
- `data-auto-animate-restart` option is useful if you want to break from the same group you're animating into a new slide

> Using `null` is important, otherwise the data attribute is always going to be present on the element.

You can already do a lot with a simple `<Slide />` component:

```svelte:src/lib/deck/presentation.svelte
<script lang="ts">
	import Slide from './slide.svelte'
</script>

<Slide>Horizontal Slide</Slide>

<Slide>
	<Slide>Vertical Slide 1</Slide>
	<Slide>Vertical Slide 2</Slide>
</Slide>

<Slide animate>
	<ul>
		<li>React</li>
		<li>Solid</li>
		<li>Svelte</li>
		<li>Vue</li>
	</ul>
</Slide>

<Slide animate>
	<ul>
		<li>Svelte ❤️</li>
		<li>React</li>
		<li>Solid</li>
		<li>Vue</li>
	</ul>
</Slide>
```

## The Code Component

The code component is straightforward:

```svelte:src/lib/deck/code.svelte
<script lang="ts">
	export let id: string | null = null
	export let lines: string | boolean | null = null
	export let noescape = false
</script>

<pre data-id={id || null}>
  <code
    data-trim
    data-line-numbers={lines || null}
    data-noescape={noescape || null}
  >
    <slot />
  </code>
</pre>
```

- `data-id` attribute is used again to mark the code that needs to be animated
- `data-trim` attribute removes whitespace around the code
- `data-line-numbers` toggles lines numbers and you can also pass a string to highlight the code
- `data-noescape` attribute is useful if you don't want to escape HTML characters (this might be redundant in Svelte's case)

Here is how you can use the `<Code />` component to animate a code block:

```svelte:src/lib/deck/presentation.svelte
<script lang="ts">
	import Code from './code.svelte'
</script>

<Slide animate>
	<Code id="code" lines>
		{`
			function love() {}
	 `}
	</Code>
</Slide>

<Slide animate>
	<Code id="code" lines="2|1-3">
		{`
			function love() {
				console.log('Svelte')
			}
	 `}
	</Code>
</Slide>
```

> The curly brackets are required to prevent Svelte from interpreting the code.

The first line of code is shown in the first slide, then in the second slide the code is updated. The `lines="2|1-3"` attribute is used to highlight the second line, followed by lines 1-3.

## The Markdown Component

You can author your slides with Markdown, and you can use HTML and Markdown in the slides, or write the entire presentation using an external Markdown file.

These should be separate components, but I've decided to be crafty and use an `external` prop to decide which component to render:

```svelte:src/lib/deck/markdown.svelte
<script lang="ts">
	export let name = 'example.md'
	export let external = false
</script>

{#if external}
	<section data-markdown={name} />
{:else}
	<section data-markdown>
		<div data-template>
			<slot />
		</div>
	</section>
{/if}
```

Here is how you can use the `<Markdown />` component:

```svelte:src/lib/deck/presentation.svelte
<script lang="ts">
	import Markdown from './markdown.svelte'
</script>

<Markdown>
	{`
		## Markdown ❤️
		You can use **HTML** or **Markdown** for slides.
	`}
</Markdown>

<Markdown name="example.md" external />
```

The `example.md` file is located in `static/example.md`:

````md:example.md
## Slide 1

You can write the entire presentation in Markdown using an external Markdown file.

---

## Slide 2

```js [2|1-3]
function love() {
	console.log('Svelte')
}
```
````

You can always find more information in the Reveal.js documentation. Just because I've done it this way, doesn't mean you have to.

## Speaker Notes Component

Speaker notes are useful if you want notes for a slide when presenting. They're only visible to you when doing a presentation:

```svelte:src/lib/deck/notes.svelte
<aside class="notes">
	<slot />
</aside>
```

You can include a node inside your slide:

```svelte:src/lib/deck/presentation.svelte
<script lang="ts">
	import Slide from './slide.svelte'
	import Code from './code.svelte'
	import Markdown from './markdown.svelte'
	import Notes from './notes.svelte'
</script>

<Slide>
	<!-- ... -->

	<Notes>
		<b>Avoid eye contact.</b>
	</Notes>
</Slide>
```

You can activate speaker notes by pressing the <kbd>S</kbd> key on your keyboard. Another useful shortcut is the <kbd>Escape</kbd> key that shows a bird's-eye view of your slides.

There's beauty in having the freedom to modify a tool to your needs and visualizing complex ideas with code.
