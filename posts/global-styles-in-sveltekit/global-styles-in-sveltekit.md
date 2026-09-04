---
title: How To Use Global Styles In SvelteKit
description: How to use global styles in SvelteKit.
slug: global-styles-in-sveltekit
published: '2022-11-24'
category: sveltekit
---

{% youtube id="jHSwChkx3TQ" title="Global Styles In SvelteKit" %}

## Table of Contents

## app.html

You can include your global styles inside `app.html` in SvelteKit but then you can't take advantage of [HMR (hot module replacement)](https://vitejs.dev/guide/features.html#hot-module-replacement) since SvelteKit has no idea the file got updated.

```svelte:src/app.html showLineNumbers
<!-- ... -->
  <head>
    <style>
      h1 {
        color: aqua;
      }
    </style>
  </head>
<!-- ... -->
```

## +layout.svelte

Instead use a `+layout.svelte` file and import your styles.

```css:src/app.css showLineNumbers
h1 {
  color: aqua;
}
```

```svelte:routes/+layout.svelte showLineNumbers
<script>
  import '../app.css'
</script>

<slot />
```

The base layout wraps the entire SvelteKit app.

## :global

Svelte ignores styles that aren't part of your template which sucks when you don't have control over the markup from a CMS (content management system), or the markup is inside another component.

In that case you can use `:global`.

```svelte:+page.svelte showLineNumbers
<script>
  export let data
</script>

<div class="prose">
  {@html data.content}
</div>

<style>
  :global(.prose h1) {
    color: aqua;
  }
</style>
```

You can scope `.prose` to the component if you want.

```svelte:+page.svelte showLineNumbers
<!-- ... -->

<style>
  .prose :global(h1) {
    color: aqua;
  }
</style>
```

SvelteKit by default comes with the [svelte-preprocess](https://github.com/sveltejs/svelte-preprocess) preprocessor where you can use the `global` attribute on the `<style>` tag to avoid typing `:global` everywhere if you're not using SASS.

```svelte:+page.svelte showLineNumbers
<!-- ... -->

<style global>
  .prose h1 {
    color: aqua;
  }
</style>
```
