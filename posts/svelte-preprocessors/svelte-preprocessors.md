---
title: How To Make A Svelte Markdown Preprocessor
description: Introduction to Svelte preprocessors and how to make your own Markdown preprocessor.
slug: svelte-preprocessors
published: '2024-04-05'
category: svelte
---

<script lang="ts">
	import Embed from '#lib/components/embed.svelte'
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="FNIwqQx7mOo" title="Svelte Preprocessors" />

## Table of Contents

## What's A Preprocessor?

<Embed src="https://stackblitz.com/github/joysofcode/svelte-markdown-preprocessor?ctl=1&embed=1&file=src%2Froutes%2F%2Bpage.svelte&view=preview&title=Svelte Preprocessors" title="Svelte Preprocessors" />

The Svelte documentation describes [preprocessors](https://kit.svelte.dev/docs/integrations#preprocessors) as following:

> Preprocessors transform your `.svelte` files before passing them to the compiler.

To understand what this means, we first have to understand the three parts that make a Svelte component which are:

- markup
- `<script>`
- `<style>`

If your component uses TypeScript for example, it has to be transformed to JavaScript first, before it goes through the Svelte compiler — you're already using [vitePreprocess](https://kit.svelte.dev/docs/integrations#preprocessors-vitepreprocess) in your Svelte project for handling everything from TypeScript, to PostCSS through Vite.

Another great example is [Melt UI](https://melt-ui.com/) which provides a custom [preprocessor](https://melt-ui.com/docs/preprocessor) to enhance the developer experience by reducing boilerplate.

It takes the following code:

```svelte:example showLineNumbers
<div use:melt={$root}>
  <button use:melt={$trigger}>...</button>
  <div use:melt={$content}>...</div>
</div>
```

...and transforms it to this:

```svelte:example showLineNumbers
<div {...$root} use:$root.action>
  <button {...$trigger} use:$trigger.action>...</button>
  <div {...$content} use:$content.action>...</div>
</div>
```

[mdsvex](https://mdsvex.pngwn.io/) is a popular Markdown preprocessor for Svelte which transforms Markdown in your Svelte components to HTML — similar to [MDX](https://mdxjs.com/) for React.

In the next part we're going to make a simple Markdown preprocessor for learning purposes.

## Creating A Preproccesor

A preprocessor is a regular JavaScript function which can be passed alongside other preprocessors inside the Svelte config.

The preprocessor includes `markup`, `script`, and `style` methods where the order is **important** — you can use these methods to change parts of the Svelte component you're interested in.

```js:svelte.config.js {3-10,14} showLineNumbers
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

function banana() {
  return {
    name: 'banana',
    markup({ content, filename }) {},
    script({ content, filename }) {},
    style({ content, filename }) {},
  }
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), banana()],
  // ...
}

export default config
```

You can name your preprocessor however you want, but keep in mind when you make changes to restart the Vite development server to see updates.

## Emoji Preprocessor

Ever dreamed about using emojis to name your variables in Svelte, but are held back by outdated societal norms and limitations of JavaScript? 😔

```svelte:example showLineNumbers
<script>
	let 🔥 = 'fire'
</script>

{🔥}
```

You can stop dreaming, and make a preprocessor to improve the developer experience because a picture is worth a thousand words.

```js:svelte.config.js {3-9,13} showLineNumbers
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

function emoji() {
	return {
		name: 'emoji',
		markup: ({ content }) => ({ code: content.replaceAll('🔥', 'fire') }),
		script: ({ content }) => ({ code: content.replaceAll('🔥', 'fire') }),
	}
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), emoji()],
  // ...
}

export default config
```

Congrats on writing your first preprocessor! 🥳

## The Markdown Preprocessor

For the Markdown preprocessor the only part we're interested in is the `markup` method to transform Markdown to HTML in the Svelte component.

You can also specify a list of file extensions that should be treated as Svelte files — you can use any extension like `.banana` if you want but I'm going to use `.md` for Markdown.

```js:svelte.config.js {3} showLineNumbers
/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md']
  // ...
}

export default config
```

Rename `+page.svelte` to `+page.md` in your route because we're going to look for the `.md` extension to change the content.

The idea behind the Markdown preprocessor is to take a Svelte component with a mix of HTML and Markdown:

```svelte:+page.md showLineNumbers
<script>
  import Counter from './counter.svelte'
</script>

# Counter

<Counter />
```

...and convert it to HTML:

```svelte:+page.md showLineNumbers
<script>
  import Counter from './counter.svelte'
</script>

<h1>Counter</h1>

<Counter />
```

The only part left to do is convert Markdown to HTML and replace the content.

## Transforming Markdown To HTML

I'm going to use [unified](https://github.com/unifiedjs/unified) which is an ecosystem of plugins that helps you inspect and transform content with plugins:

- [remark](https://github.com/remarkjs/remark) (Markdown processor)
- [rehype](https://github.com/rehypejs/rehype) (HTML processor)

It's helpful but you don't have to understand how abstract syntax trees work — they're just a data structure that uses nodes to represent code.

Create the `markdown` preprocessor inside `src/lib/markdown.js` to keep things organized.

```js:src/lib/markdown.js showLineNumbers
import { parse } from 'svelte/compiler'
import { unified } from 'unified'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'

async function markdownToHtml(string) {
	return (
		unified()
			// turn Markdown into mdast
			.use(remarkParse)
			// turn Markdown (mdast) into HTML (hast)
			.use(remarkRehype, { allowDangerousHtml: true })
			// turn HTML (hast) into HTML string
			.use(rehypeStringify, { allowDangerousHtml: true })
			// process the string
			.process(string)
	)
}

async function html(content) {
	const svast = parse(content)
	const { start, end } = svast.html
	const string = content.slice(start, end)
	const html = await markdownToHtml(string)

	return {
		code: content.replace(string, html),
	}
}

function markdown() {
	return {
		name: 'markdown',
		markup({ content, filename }) {
			if (filename.endsWith('.md')) {
				return html(content)
			}
		},
	}
}

export default markdown
```

Here's how it works:

- `markdown` only transforms `.md` files
- `html` turns the Svelte component into an abstract syntax tree, so we get the `start`, and `end` point of the markup to `slice`
- `markdownToHtml` transforms the Markdown:
  - Markdown > mdast (Markdown AST) > hast (HTML AST) > HTML string
- replace the Markdown `string` with the transformed `html`

The reason for using `allowDangerousHtml` is because otherwise it would strip out things like the `<script>` tag.

Not only can we combine preprocessors, but you can also pass options to them if you want.

```js:svelte.config.js {3-4,9} showLineNumbers
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

import emoji from './src/lib/emoji.js'
import markdown from './src/lib/markdown.js'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [vitePreprocess(), emoji(), markdown()],
	kit: {
		adapter: adapter(),
	},
}

export default config
```

The Markdown preprocessor should transform Markdown in your Svelte components to regular HTML.

```svelte:+page.md showLineNumbers
<script>
	import Counter from './counter.svelte'
	let 🔥 = 'Counter'
</script>

# {🔥}

<Counter />
```

That's it! 😄
