---
title: Build a SvelteKit Markdown Blog
description: Learn how to build a blazingly fast and extendable SvelteKit Markdown blog for poets.
slug: sveltekit-markdown-blog
published: '2023-04-28'
category: sveltekit
---

<script lang="ts">
	import Embed from '#lib/components/embed.svelte'
	import Image from '#lib/components/image.svelte'
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="RhScu3uqGd0" title="SvelteKit Markdown blog" />

## Table of Contents

## Project Setup

> 🔥 The post has been updated for Svelte 5.

You're going to make a blazingly fast and extendable SvelteKit Markdown blog you can be proud of and deploy it to Vercel at no cost.

<Embed src="https://stackblitz.com/github/joysofcode/sveltekit-markdown-blog?ctl=1&embed=1&file=src%2Froutes%2F%2Bpage.svelte&title=SvelteKit Markdown Blog" title="SvelteKit Markdown Blog" />

You can find the finished project on [GitHub](https://github.com/joysofcode/sveltekit-markdown-blog).

> 🔥 If you want to learn SvelteKit you can watch [The Complete SvelteKit Course For Building Modern Web Apps](https://www.youtube.com/watch?v=MoGkX4RvZ38) on YouTube.

Start by creating a new SvelteKit project:

```sh:terminal
npx sv create
```

Use the <kbd>Enter</kbd> key to select the **SvelteKit minimal** template and **TypeScript**. You can use the <kbd>Space</kbd> key to select **ESLint** to lint your code for errors and **Prettier** to format the code:

```sh:terminal
┌  Welcome to the Svelte CLI!
│
◇  Where would you like your project to be created?
│  sveltekit-blog
│
◇  Which template would you like?
│  SvelteKit minimal
│
◇  Add type checking with Typescript?
│  Yes, using Typescript syntax
│
◆  Project created
│
◇  What would you like to add to your project? (use arrow keys / space bar)
│  prettier, eslint
│
◇  Which package manager do you want to install dependencies with?
│  npm
```

Open the development server at [http://localhost:5173/](http://localhost:5173/):

```sh:terminal
npm run dev
```

## Layout And Styles

Here's what I'm going to use:

- [Open Props](https://open-props.style/) for styling using CSS variables instead of utility classes like Tailwind
- [Lucide](https://lucide.dev/) for icons
- **Atkinson Hyperlegible** for text and **JetBrains Mono** for the code

```sh:terminal
npm i open-props lucide-svelte @fontsource/atkinson-hyperlegible @fontsource/jetbrains-mono
```

Let's update the favicon inside `app.html`:

```svelte:src/app.html {6} showLineNumbers
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width" />
		<link rel="icon" href="https://fav.farm/🔥" />
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

Let's also add a **config** file for the blog:

```ts:src/lib/config.ts showLineNumbers
import { dev } from '$app/environment'

export const title = 'Shakespeare'
export const description = 'SvelteKit blog for poets'
export const url = dev ? 'http://localhost:5173/' : 'https://joyofcode.xyz/'
```

Add a root layout inside `src/routes/+layout.svelte` that includes the **header**, **footer** and **styles** for the blog:

```svelte:src/routes/+layout.svelte showLineNumbers
<script lang="ts">
	import Footer from './footer.svelte'
	import Header from './header.svelte'

	import 'open-props/style'
	import 'open-props/normalize'
	import 'open-props/buttons'
	import '../app.css'

	let { children, data } = $props()
</script>

<div class="layout">
	<Header />

	<main>
		{@render children?.()}
	</main>

	<Footer />
</div>

<style>
	.layout {
		height: 100%;
		max-inline-size: 1440px;
		display: grid;
		grid-template-rows: auto 1fr auto;
		margin-inline: auto;
		padding-inline: var(--size-7);

		@media (min-width: 1440px) {
			padding-inline: 0;
		}

		main {
			padding-block: var(--size-9);
		}
	}
</style>
```

```svelte:src/routes/header.svelte showLineNumbers
<script lang="ts">
	import * as config from '$lib/config'
</script>

<nav>
	<a href="/" class="title">
		<b>{config.title}</b>
	</a>

	<ul class="links">
		<li>
			<a href="/about">About</a>
		</li>
		<li>
			<a href="/contact">Contact</a>
		</li>
		<li>
			<a href="/rss.xml" target="_blank">RSS</a>
		</li>
	</ul>

	<button>Toggle</button>
</nav>

<style>
	nav {
		padding-block: var(--size-7);

		@media (min-width: 768px) {
			display: flex;
			justify-content: space-between;
		}

		.links {
			margin-block: var(--size-7);

			@media (min-width: 768px) {
				display: flex;
				gap: var(--size-7);
				margin-block: 0;
			}
		}

		a {
			color: inherit;
			text-decoration: none;
		}
	}
</style>
```

```svelte:src/routes/footer.svelte showLineNumbers
<script lang="ts">
	import * as config from '$lib/config'
</script>

<footer>
	<p>{config.title} &copy {new Date().getFullYear()}</p>
</footer>

<style>
	footer {
		padding-block: var(--size-7);
		border-top: 1px solid var(--border);

		p {
			color: var(--text-2);
		}
	}
</style>
```

```css:src/app.css showLineNumbers
@import '@fontsource/atkinson-hyperlegible';
@import '@fontsource/jetbrains-mono';

html {
	/* font */
	--font-system-ui: 'Atkinson Hyperlegible', sans-serif;
	--font-monospace-code: 'JetBrains Mono', monospace;

	/* dark */
	--brand-dark: var(--orange-3);
	--text-1-dark: var(--gray-3);
	--text-2-dark: var(--gray-5);
	--surface-1-dark: var(--gray-12);
	--surface-2-dark: var(--gray-11);
	--surface-3-dark: var(--gray-10);
	--surface-4-dark: var(--gray-9);
	--background-dark: var(--gradient-8);
	--border-dark: var(--gray-9);

	/* light */
	--brand-light: var(--orange-10);
	--text-1-light: var(--gray-8);
	--text-2-light: var(--gray-7);
	--surface-1-light: var(--gray-0);
	--surface-2-light: var(--gray-1);
	--surface-3-light: var(--gray-2);
	--surface-4-light: var(--gray-3);
	--background-light: none;
	--border-light: var(--gray-4);
}

:root {
	color-scheme: dark;

	--brand: var(--brand-dark);
	--text-1: var(--text-1-dark);
	--text-2: var(--text-2-dark);
	--surface-1: var(--surface-1-dark);
	--surface-2: var(--surface-2-dark);
	--surface-3: var(--surface-3-dark);
	--surface-4: var(--surface-4-dark);
	--background: var(--background-dark);
	--border: var(--border-dark);
}

@media (prefers-color-scheme: light) {
	:root {
		color-scheme: light;

		--brand: var(--brand-light);
		--text-1: var(--text-1-light);
		--text-2: var(--text-2-light);
		--surface-1: var(--surface-1-light);
		--surface-2: var(--surface-2-light);
		--surface-3: var(--surface-3-light);
		--surface-4: var(--surface-4-light);
		--background: var(--background-light);
		--border: var(--border-light);
	}
}

[color-scheme='dark'] {
	color-scheme: dark;

	--brand: var(--brand-dark);
	--text-1: var(--text-1-dark);
	--text-2: var(--text-2-dark);
	--surface-1: var(--surface-1-dark);
	--surface-2: var(--surface-2-dark);
	--surface-3: var(--surface-3-dark);
	--surface-4: var(--surface-4-dark);
	--background: var(--background-dark);
	--border: var(--border-dark);
}

[color-scheme='light'] {
	color-scheme: light;

	--brand: var(--brand-light);
	--text-1: var(--text-1-light);
	--text-2: var(--text-2-light);
	--surface-1: var(--surface-1-light);
	--surface-2: var(--surface-2-light);
	--surface-3: var(--surface-3-light);
	--surface-4: var(--surface-4-light);
	--background: var(--background-light);
	--border: var(--border-light);
}

html,
body {
	height: 100%;
}

html {
	color: var(--text-1);
	accent-color: var(--link);
	background-image: var(--background);
	background-attachment: fixed;
}

img {
	border-radius: var(--radius-3);
}

ul,
ol {
	list-style: none;
	padding: 0;
}

li {
	padding-inline-start: 0;
}

.surface-1 {
	background-color: var(--surface-1);
	color: var(--text-2);
}

.surface-2 {
	background-color: var(--surface-2);
	color: var(--text-2);
}

.surface-3 {
	background-color: var(--surface-3);
	color: var(--text-1);
}

.surface-4 {
	background-color: var(--surface-4);
	color: var(--text-1);
}
```

Here's the result:

<Image src="setup.webp" alt="Start of the SvelteKit blog" />

> 💪 As an exercise try adding the `/about` and `/contact` routes yourself since they're mostly used as placeholders.

This sets us up nicely for implementing a theme switcher later. Even without a theme toggle it should respect the user preference thanks to the `prefers-color-scheme` media query.

## Setting Up Mdsvex

[mdsvex](https://mdsvex.pngwn.io/) is a Markdown preprocessor for Svelte that also lets you have interactive Svelte components inside Markdown like [MDX](https://mdxjs.com/) for React.

To get started install mdsvex:

```sh:terminal
npm i -D mdsvex
```

Add mdsvex as a preprocessor inside `svelte.config.js`:

```js:svelte.config.js {4, 6-9, 13-14} showLineNumbers
import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

import { mdsvex } from 'mdsvex'

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
	kit: {
		adapter: adapter()
	}
}

export default config
```

Svelte by default processes `.svelte` files, but adding `.md` to `extensions` inside `config` lets you treat `+page.md` as Svelte components.

Let's add some posts in `/src/posts`:

````md:src/posts/first-post.md
---
title: First post
description: First post.
date: '2023-4-14'
categories:
  - sveltekit
  - svelte
published: true
---

## Markdown

Hey friends! 👋

```ts
function greet(name: string) {
	console.log(`Hey ${name}! 👋`)
}
```
````

```md:src/posts/second-post.md
---
title: Second
description: Second post.
date: '2023-4-16'
categories:
  - sveltekit
  - svelte
published: true
---

## Svelte

Media inside the **static** folder is served from `/`.

![Svelte](favicon.png)
```

## Posts API Endpoint

Let's create an endpoint for the posts in `routes/api/posts/+server.ts` so it can be used anywhere in the app:

```ts:src/routes/api/posts/+server.ts showLineNumbers
import { json } from '@sveltejs/kit'
import type { Post } from '$lib/types'

async function getPosts() {
	let posts: Post[] = []

	const paths = import.meta.glob('/src/posts/*.md', { eager: true })

	for (const path in paths) {
		const file = paths[path]
		const slug = path.split('/').at(-1)?.replace('.md', '')

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Post, 'slug'>
			const post = { ...metadata, slug } satisfies Post
			post.published && posts.push(post)
		}
	}

	posts = posts.sort((first, second) =>
    new Date(second.date).getTime() - new Date(first.date).getTime()
	)

	return posts
}

export async function GET() {
	const posts = await getPosts()
	return json(posts)
}
```

Here's the breakdown:

- `import.meta.glob` is a useful Vite feature to get all the posts using a glob (`eager` reads the contents of the file avoiding `await paths[path]()`)
- Loop over the `paths` and get the slug `post.md` but replace `.md` since we only want the slug
- Check if `file` has a `metadata` property inside of it and if the `slug` exists to be safe and then I'm going to get the `metadata` or **frontmatter** from the post
- Create a `post` that includes `metadata` and the `slug`
- Only add the post if `published` is set to `true`
- Sort `posts` by date and return them

If you're using TypeScript, here are the types:

```ts:src/lib/types.ts showLineNumbers
export type Categories = 'sveltekit' | 'svelte'

export type Post = {
	title: string
	slug: string
	description: string
	date: string
	categories: Categories[]
	published: boolean
}
```

You can navigate to [http://localhost:5173/api/posts](http://localhost:5173/api/posts) to see the JSON response:

<Image src="endpoint.webp" alt="API endpoint for posts" />

> 🐿️ You can use the [JSON Viewer](https://chrome.google.com/webstore/detail/json-viewer/gbmdgpbipfallnflgajpaliibnhdgobh?hl=en-US) Chrome extension for the highlighting.

Awesome! 🥳

You created an API for posts you can reuse across your app or make it public for others to consume.

## Rendering The Posts

Time to use the posts API you just created to fetch and server-side render the posts for the page:

```ts:src/routes/+page.server.ts showLineNumbers
import type { Post } from '$lib/types'

export async function load({ fetch }) {
	const response = await fetch('/api/posts')
	const posts: Post[] = await response.json()
	return { posts }
}
```

> 🐿️ The `fetch` function from `load` has superpowers like being able to resolve the relative URL `/api/posts` which would not work using regular `fetch`.

You can now get the data and render the posts:

```svelte:src/routes/+page.svelte showLineNumbers
<script lang="ts">
	import { formatDate } from '$lib/utils'
	import * as config from '$lib/config'

	let { data } = $props()
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<section>
	<ul class="posts">
		{#each data.posts as post}
			<li class="post">
				<a href={post.slug} class="title">{post.title}</a>
				<p class="date">{formatDate(post.date)}</p>
				<p class="description">{post.description}</p>
			</li>
		{/each}
	</ul>
</section>

<style>
	.posts {
		display: grid;
		gap: var(--size-7);

		.post {
			max-inline-size: var(--size-content-3);

			&:not(:last-child) {
				border-bottom: 1px solid var(--border);
				padding-bottom: var(--size-7);
			}

			.title {
				font-size: var(--font-size-fluid-3);
				text-transform: capitalize;
			}

			.date {
				color: var(--text-2);
			}

			.description {
				margin-top: var(--size-3);
			}
		}
	}
</style>
```

Here's the function used to format the date:

```ts:src/lib/utils.ts showLineNumbers
type DateStyle = Intl.DateTimeFormatOptions['dateStyle']

export function formatDate(date: string, dateStyle: DateStyle = 'medium', locales = 'en') {
	// Safari is mad about dashes in the date
	const dateToFormat = new Date(date.replaceAll('-', '/'))
	const dateFormatter = new Intl.DateTimeFormat(locales, { dateStyle })
	return dateFormatter.format(dateToFormat)
}
```

Let's take a look at the result:

<Image src="posts.webp" alt="Posts" />

Things are coming together. 💪

## Rendering A Single Post

Creating a route for every post would be annoying, so I'm going to use a dynamic route like `routes/[slug]/+page.svelte` that's going to slurp up the post based on the `[slug]` in the URL.

Let's use a dynamic import for the post and get the **content** and **metadata** data for the component:

```ts:src/routes/[slug]/+page.ts showLineNumbers
import { error } from '@sveltejs/kit'

export async function load({ params }) {
	try {
		const post = await import(`../../posts/${params.slug}.md`)

		return {
			content: post.default,
			meta: post.metadata
		}
	} catch (e) {
		error(404, `Could not find ${params.slug}`)
	}
}
```

This lets us render `data.content` as a Svelte component:

```svelte:src/routes/[slug]/+page.svelte showLineNumbers
<script lang="ts">
	import { formatDate } from '$lib/utils'

	let { data } = $props()
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
</svelte:head>

<article>
	<hgroup>
		<h1>{data.meta.title}</h1>
		<p>Published at {formatDate(data.meta.date)}</p>
	</hgroup>

	<div class="tags">
		{#each data.meta.categories as category}
			<span class="surface-4">&num;{category}</span>
		{/each}
	</div>

	<div class="prose">
		<data.content />
	</div>
</article>

<style>
	article {
		max-inline-size: var(--size-content-3);
		margin-inline: auto;

		h1 {
			text-transform: capitalize;
		}

		h1 + p {
			margin-top: var(--size-2);
			color: var(--text-2);
		}

		.tags {
			display: flex;
			gap: var(--size-3);
			margin-top: var(--size-7);

			> * {
				padding: var(--size-2) var(--size-3);
				border-radius: var(--radius-round);
			}
		}
	}
</style>
```

Let's add some global styles for the post inside `app.css` since we don't have control over the markup:

```css:src/app.css showLineNumbers
/* ... */

.prose {
	p {
		:not(:is(h2, h3, h4, h5, h6) + p) {
			margin-top: var(--size-7);
		}

		/* ignore paragraph tag around images */
		&:has(img) {
			display: contents;
		}
	}

	:is(h2, h3, h4, h5, h6) {
		margin-top: var(--size-8);
		margin-bottom: var(--size-3);
	}

	:is(ul, ol) {
		list-style-type: '🔥';
		padding-left: var(--size-5);
	}

	:is(ul, ol) li {
		margin-block: var(--size-2);
		padding-inline-start: var(--size-2);
	}

	pre {
		max-inline-size: 100%;
		padding: var(--size-3);
		border-radius: 8px;
		tab-size: 2;
	}
}
```

Everything looks great:

<Image src="post.webp" alt="Post" />

> 💪 Turn the tags into links that point to a `/category/[category]` page that shows the posts based on the name of the category.

## Syntax Highlighting

You can use a [Prism](https://prismjs.com/) theme, but I want to use a modern syntax highlighter like [Shiki](https://github.com/shikijs/shiki) that uses the same highlighter as VS Code.

Let's install Shiki:

```sh:terminal
npm i shiki
```

Create a custom Shiki highlighter:

```js:svelte.config.js {2-3, 8-18} showLineNumbers
// ...
import { mdsvex, escapeSvelte } from 'mdsvex'
import { createHighlighter } from 'shiki'

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
	highlight: {
		highlighter: async (code, lang = 'text') => {
			const highlighter = await createHighlighter({
				themes: ['poimandres'],
				langs: ['javascript', 'typescript']
			})
			await highlighter.loadLanguage('javascript', 'typescript')
			const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme: 'poimandres' }))
			return `{@html \`${html}\` }`
		}
	},
}

// ...
```

Here's the breakdown:

- Create the highlighter using `createHighlighter` and pass one of the [VS Code themes](https://github.com/shikijs/shiki/blob/main/docs/themes.md) you want (you can also give it a path to your theme)
- Use `escapeSvelte` to escape characters like `{` that are going to cause a problem in Svelte
- Shiki is going to generate HTML that looks like your code in VS Code using the `code` and `lang` you passed
- Insert `{@html html}` in the Svelte component to output the code block, but we need to escape the backticks with `\`

I found this solution from a [GitHub issue](https://github.com/pngwn/MDsveX/issues/212#issuecomment-937548885) in the mdsvex repo.

## Using Components Inside Markdown

You can use Svelte components inside Markdown from interactive data visualizations to working code examples:

```svelte:src/posts/counter.svelte showLineNumbers
<script lang="ts">
	let count = $state(0)

	const increment = () => count++
</script>

<button onclick={increment}>
	{count}
</button>
```

```md:src/posts/example.md showLineNumbers
<!-- ... -->
<script>
  import Counter from './counter.svelte'
</script>

## Counter

The counter is rendered inside Markdown.

<Counter />
```

You can also replace HTML elements with [custom components](https://mdsvex.pngwn.io/docs#custom-components) in mdsvex. For example you might want to lazy load images using `loading="lazy"` since you can't set attributes on images inside Markdown.

Let's create a default [mdsvex layout](https://mdsvex.pngwn.io/docs#layout) that's going to wrap everything and name it `mdsvex.svelte` to avoid confusion with `+layout.svelte`:

```js:svelte.config.js {4-6} showLineNumbers
/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
	layout: {
		_: './src/mdsvex.svelte'
	},
	// ...
}
```

The custom component receives the attributes of the element you want to replace like `src` and `alt` as props:

```svelte:src/lib/components/custom/img.svelte showLineNumbers
<script lang="ts">
	type Props = {
		src: string
		alt: string
	}

	let { src, alt }: Props = $props()
</script>

<img {src} {alt} loading="lazy" />
```

Let's export everything from `index.ts`:

```ts:src/lib/components/custom/index.ts showLineNumbers
import img from './img.svelte'

export { img }
```

Inside the layout you have to import and export the custom component with the same name as the element you want to replace:

```svelte:src/mdsvex.svelte showLineNumbers
<script lang="ts" module>
	import { img } from '$lib/components/custom'
	export { img }
</script>

<script lang="ts">
	let props = $props()
</script>

{@render props.children?.()}
```

Images and other media should be placed inside the `static` folder at the root of your project.

## Using Markdown Plugins

mdsvex first parses the Markdown into a Markdown tree (MDAST) where **remark** plugins run and then it converts it into a HTML tree (HAST) where **rehype** plugins run.

You don't have to understand ASTs but I recommend reading [How to Modify Nodes in an Abstract Syntax Tree](https://css-tricks.com/how-to-modify-nodes-in-an-abstract-syntax-tree/) if you want to learn the fundamentals and write your own plugin which is just a JavaScript function.

You can use [rehype](https://github.com/rehypejs/rehype) plugins to transform HTML and [remark](https://github.com/remarkjs/remark) plugins for transforming Markdown — I'm going to refer to them as **Markdown plugins** even if they're general plugins for transforming HTML and Markdown.

Using these plugins it's very simple to extend the functionality of your Markdown blog:

- `rehype-slug` is used to add slugs to headings like `<h2 id="section">` and link to a section of your post like `example.com/post#section`
- `remark-toc` is used to generate a table of contents based on the headings

Install the Markdown plugins:

```sh:terminal
npm i remark-toc rehype-slug
```

Add the plugins to the config:

```js:svelte.config.js {2,3,8,9} showLineNumbers
// ...
import remarkToc from 'remark-toc'
import rehypeSlug from 'rehype-slug'

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	// ...
	remarkPlugins: [[remarkToc, { tight: true }]],
	rehypePlugins: [rehypeSlug]
}
```

> 🐿️ You can pass options for the plugin like `[plugin, { options }]` which you can find in their docs.

That's how you stay plugged in. 🔌

## Light And Dark Mode Toggle

I want to check if the user has set a theme in [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) before the page loads to prevent flashing and set the attribute on `<html>` based on their preference otherwise default to using a dark theme.

A good place to start is inside `app.html` since it loads first:

```svelte:src/app.html {5-11} showLineNumbers
<!doctype html>
<html lang="en">
	<head>
		<!-- ... -->
		<script type="module">
			const theme = localStorage.getItem('color-scheme')

			theme
				? document.documentElement.setAttribute('color-scheme', theme)
				: localStorage.setItem('color-scheme', 'dark')
		</script>
	</head>
	<!-- ... -->
</html>
```

Let's create a simple theme toggle:

```ts:src/lib/theme.svelte.ts showLineNumbers
import { browser } from '$app/environment'

class Theme {
	current = $state(browser && localStorage.getItem('color-scheme'))

	toggle = () => {
		const theme = this.current === 'dark' ? 'light' : 'dark'
		document.documentElement.setAttribute('color-scheme', theme)
		localStorage.setItem('color-scheme', theme)
		this.current = theme
	}
}

export const theme = new Theme()
```

> 💪 Use JavaScript to check the user preference with `const preference = window.matchMedia('(prefers-color-scheme: dark)').matches` and then use an event listener `preference.addEventListener('change', (mediaQuery) => ...)` to update the theme.

Let's create a `<Toggle>` component:

```svelte:src/routes/toggle.svelte showLineNumbers
<script lang="ts">
	import { fly } from 'svelte/transition'
	import { Moon, Sun } from 'lucide-svelte'
	import { theme } from '$lib/theme.svelte'
</script>

<button on:click={theme.toggle} aria-label="Toggle theme">
	{#if theme.current === 'dark'}
		<div in:fly={{ y: 10 }}>
			<Sun />
			<span>Light</span>
		</div>
	{:else}
		<div in:fly={{ y: -10 }}>
			<Moon />
			<span>Dark</span>
		</div>
	{/if}
</button>

<style>
	button {
		padding: 0;
		font-weight: inherit;
		background: none;
		border: none;
		box-shadow: none;
		overflow: hidden;

		> * {
			display: flex;
			gap: var(--size-2);
		}
	}
</style>
```

Import the `<Toggle>` component inside the `<Header>` component:

```svelte:header.svelte {2, 8} showLineNumbers
<script lang="ts">
	import Toggle from './toggle.svelte'
	// ...
</script>

<nav>
	<!-- ... -->
	<Toggle />
</nav>
```

I wear my sunglasses at night. 😎

## Page Transitions

To transition a page we need to know when the URL changed to destroy and recreate the page which is going to play the transition:

```ts:src/routes/+layout.ts. showLineNumbers
export async function load({ url }) {
	return {
		url: url.pathname
	}
}
```

```svelte:src/routes/transition.svelte showLineNumbers
<script lang="ts">
	import type { Snippet } from 'svelte'
	import { fade } from 'svelte/transition'

	type Props = {
		children: Snippet
		url: string
	}

	let { children, url }: Props = $props()
</script>

{#key url}
	<div class="transition" in:fade>
		{@render children?.()}
	</div>
{/key}

<style>
	.transition {
		height: 100%;
	}
</style>
```

```svelte:src/routes/+layout.svelte {4, 6, 13-15} showLineNumbers
<script lang="ts">
	import Footer from './footer.svelte'
	import Header from './header.svelte'
	import PageTransition from './transition.svelte'
	// ...
	let { children, data } = $props()
</script>

<div class="layout">
	<Header />

	<main>
		<PageTransition url={data.url}>
			{@render children?.()}
		</PageTransition>
	</main>

	<Footer />
</div>
```

He's a smooth operator. 🎷

## RSS Feed

Creating an RSS feed in SvelteKit is simple as creating an API endpoint that returns XML:

```ts:src/routes/rss.xml/+server.ts showLineNumbers
import * as config from '$lib/config'
import type { Post } from '$lib/types'

export async function GET({ fetch }) {
	const response = await fetch('/api/posts')
	const posts: Post[] = await response.json()

	const headers = { 'Content-Type': 'application/xml' }

	const xml = `
		<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
			<channel>
				<title>${config.title}</title>
				<description>${config.description}</description>
				<link>${config.url}</link>
				<atom:link href="${config.url}/rss.xml" rel="self" type="application/rss+xml"/>
				${posts
					.map(
						(post) => `
						<item>
							<title>${post.title}</title>
							<description>${post.description}</description>
							<link>${config.url}/${post.slug}</link>
							<guid isPermaLink="true">${config.url}/${post.slug}</guid>
							<pubDate>${new Date(post.date).toUTCString()}</pubDate>
						</item>
					`
					)
					.join('')}
			</channel>
		</rss>
	`.trim()

	return new Response(xml, { headers })
}
```

> 🐿️ The endpoint extensions like `.xml` and `.json` are optional unless you use prerendering and have clashing route names.

This is the least XML required for an RSS feed which you can validate with [W3C Feed Validation Service](https://validator.w3.org/feed/) when you deploy the site.

You can include this markup in `app.html` so when people input your website URL in their RSS reader it's going to pick it up:

```svelte:src/app.html {4} showLineNumbers
<!DOCTYPE html>
<html lang="en">
	<head>
		<link rel="alternate" type="application/atom+xml" href="/rss.xml" />
		<!-- ... -->
	</head>
	<!-- ... -->
</html>
```

## Custom Error Page

Let's customize the default error page by creating `+error.svelte` in `routes`:

```svelte:src/routes/+error.svelte showLineNumbers
<script>
	import { page } from '$app/stores'
</script>

<div class="error">
	<h1>{$page.status}: {$page.error?.message}</h1>
</div>

<style>
	.error {
		height: 100%;
		display: grid;
		place-content: center;
	}
</style>
```

## Deployment

I'm going to prerender everything so it's blazingly fast and deploy the blog to [Vercel](https://vercel.com/) since they have a generous free tier. 🔥

[Prerendering](https://kit.svelte.dev/docs/page-options#prerender) means creating the HTML files at build time (when you run `npm run build` or `vite build`).

This is one line of code:

```ts:src/routes/+layout.ts showLineNumbers
export const prerender = true
// ...
```

Let's also prerender the RSS feed:

```ts:src/routes/rss.xml/+server.ts showLineNumbers
export const prerender = true
// ...
```

SvelteKit is going to crawl the links in your site and prerender the pages (`+page.svelte`) and server routes (`+server.ts`) when you use the `prerender` page option in the root layout.

> ⚠️ If you have pages with [form actions](https://kit.svelte.dev/docs/form-actions) they can't be prerendered because you need a server but SvelteKit is flexible and you can disable prerendering for that page.

I'm going to use the [Vercel adapter](https://kit.svelte.dev/docs/adapter-vercel) for deployment:

```sh:terminal
# remove the default adapter
npm remove @sveltejs/adapter-auto

# add Vercel adapter
npm i -D @sveltejs/adapter-vercel
```

```js:svelte.config.js showLineNumbers
import adapter from '@sveltejs/adapter-vercel'
// ...
```

> 🐿️ You can run `npm run build` and `npm run preview` to check for any obvious errors instead of finding out about it during deployment. The build command is going to create a `.vercel` folder which should be added to your `.gitignore` file.

Create a new project on GitHub and push the code:

```sh:terminal
# initialize Git repository
git init

# stage changes for every file
git add .

# add commit
git commit -m "Add project"

# add remote repository
git remote add origin https://github.com/you/sveltekit-blog.git

# rename current branch to main
git branch -M main

# push the main branch to origin
git push -u origin main
```

[Add a new project on Vercel](https://vercel.com/new) and **import** your repository. You can leave the default options and press **deploy** which should take a minute.

> 🐿️ You can change the name of the URL Vercel assigned to your project if you go to **Settings** > **Domains**.

Each time you push to the GitHub repository, Vercel is going to redeploy and run the build since it's integrated with GitHub.

Congrats! 🎉
