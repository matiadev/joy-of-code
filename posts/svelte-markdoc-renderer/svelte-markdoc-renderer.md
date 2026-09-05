---
title: Custom Svelte Markdoc Renderer
description: Learn how to make a custom Markdoc renderer for Svelte.
slug: svelte-markdoc-renderer
published: '2024-04-20'
category: svelte
---

<script lang="ts">
	import Embed from '#lib/components/embed.svelte'
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="mWt7jsgZIWw" title="Svelte Markdoc Renderer" />

## Table of Contents

## What Is Markdoc?

<Embed src="https://stackblitz.com/github/joysofcode/svelte-markdoc-renderer?ctl=1&embed=1&file=src%2Froutes%2F%5Bslug%5D%2F%2Bpage.svelte&view=preview&title=Svelte Markdoc Renderer" title="Svelte Markdoc Renderer" />

You can find the [source code on GitHub](https://github.com/joysofcode/svelte-markdoc-renderer).

[Markdoc](https://markdoc.dev/) is an extension of Markdown which enhances Markdown with custom nodes, tags, attributes, variables, and interactive elements using the framework of your choice.

Here's a simple example that uses a `title` variable, and a custom `<Callout>` component:

```md:posts/markdoc.md showLineNumbers
---
title: What is Markdoc?
---

# {% $frontmatter.title %}

Markdoc is a Markdown-based syntax and toolchain for creating custom documentation sites. Stripe created Markdoc to power [our public docs](http://stripe.com/docs).

{% callout type="check" %}
Markdoc is open-source—check out its [source](http://github.com/markdoc/markdoc) to see how it works.
{% /callout %}
```

Here is how you process Markdown using Markdoc:

```ts:routes/[slug]/+page.server.ts showLineNumbers
async function html(slug: string) {
	// ...
	const ast = Markdoc.parse(post)
	const content = Markdoc.transform(ast, {
    // components
		tags: {
			callout: {
				render: 'Callout',
				attributes: {
					type: {
						type: String,
						default: 'note',
					},
				},
			},
		},
    // variables
		variables: {
			frontmatter: getFrontmatter(ast.attributes.frontmatter),
		},
	})
  // using the HTML renderer
	return Markdoc.renderers.html(content)
}

export async function load({ params }) {
	return { content: await html(params.slug) }
}
```

Render the HTML on the page:

```svelte:routes/[slug]/+page.svelte showLineNumbers
<script lang="ts">
	let { data } = $props()
</script>

{@html data.content}
```

Markdoc doesn't know how to render the custom `<Callout>` component yet, which is where a custom renderer comes in. Markdoc has a HTML, and React [renderer](https://markdoc.dev/docs/render#render), but it's relatively simple to make your own renderer.

## Creating The Markdoc Renderer

Instead of returning HTML, we can return a tree of renderable elements, and create a custom renderer using special Svelte elements.

```ts:routes/[slug]/+page.server.ts {4,8} showLineNumbers
async function markdoc(slug: string) {
  // ...
  const content = Markdoc.transform(ast, config)
  return JSON.stringify(content.children)
}

export async function load({ params }) {
	return { children: await markdoc(params.slug) }
}
```

If you log `content.children` you get a renderable tree:

```txt:terminal
{
  "$$mdtype": "Tag",
  "name": "Document",
  "attributes": {},
  "children": [
    "0": {
      "$$mdtype": "Tag",
      "name": "Heading",
      "attributes": { ... 2 items },
      "children": [ ... 2 items ],
    },
		// ...
  ],
}
```

To create a custom renderer we just need to loop over the renderable tree, and render elements based on the name of the child node.

```svelte:routes/[slug]/+page.svelte {2,7} showLineNumbers
<script lang="ts">
	import MarkdocRenderer from '$lib/markdoc/renderer.svelte'

	let { data } = $props()
</script>

<MarkdocRenderer children={JSON.parse(data.children)} />
```

For this we can use special Svelte elements:

- `<svelte:component` to render custom Svelte components
- `<svelte:element>` to render regular HTML elements
- `<svelte:self>` to recursively use the `renderer.svelte` component, and pass the `children` prop until there are no more children

```svelte:$lib/markdoc/renderer.svelte showLineNumbers
<script lang="ts">
	import Callout from './components/callout.svelte'
	import Counter from './components/counter.svelte'

	let { children }: any = $props()

	const components = { Callout, Counter }
</script>

{#each children as child}
  <!-- this is a custom element -->
	{#if components[child.name]}
    <!-- render it -->
		<svelte:component this={components[child.name]} {...child.attributes}>
      <!-- recurse over children -->
			<svelte:self children={child.children} />
		</svelte:component>
	{:else}
    <!-- this is a regular HTML element -->
		<svelte:element this={child.name} {...child.attributes}>
      <!-- recurse over children -->
			<svelte:self children={child.children} />
		</svelte:element>
	{/if}

  <!-- this is a plain text node -->
	{#if typeof child === 'string'}
		{child}
	{/if}
{/each}
```

Creating a custom renderer might sound complicated, but you're just taking a representation, or a tree of renderable nodes, and looping over the nodes to render elements on the page which could be anything from custom Svelte components, to regular HTML elements, and text nodes.

That's it! 😄
