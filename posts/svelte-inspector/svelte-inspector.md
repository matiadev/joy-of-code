---
title: Never Search For Svelte Components Again
description: Find elements on the page in your code editor with ease using the Svelte inspector.
slug: svelte-inspector
published: '2022-9-9'
category: svelte
---

<script lang="ts">
	import Card from '#lib/components/card.svelte'
	import Video from '#lib/components/video.svelte'
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="Qglbt8M8H_w" title="Svelte Inspector" />

## Table of Contents

## The Svelte Inspector

The [Svelte Inspector](https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/inspector.md) is part of the `@sveltejs/vite-plugin-svelte` package found in most Svelte and SvelteKit projects which helps you find any element on the page in your code editor:

<Card type="info">This post has been updated for Svelte 5 and the same instructions should work for any Vite based Svelte and SvelteKit project.</Card>

<Video src="inspector.mp4" />

## Enabling The Svelte Inspector

To enable the Svelte Inspector inside your project, open the Svelte config:

```js:svelte.config.js {2-4}
export default {
	vitePlugin: {
		inspector: true
	}
}
```

## Configuration

You can start using the Svelte Inspector by pressing the <kbd>Alt</kbd> + <kbd>X</kbd> shortcut by default and configure the [plugin options](https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/inspector.md#plugin-options) if you want:

```js:svelte.config.js {4-6}
export default {
  vitePlugin: {
    inspector: {
      toggleKeyCombo: 'alt-x',
      showToggleButton: 'always',
      toggleButtonPos: 'bottom-right'
    }
  }
}
```
