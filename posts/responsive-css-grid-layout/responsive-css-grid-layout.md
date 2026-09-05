---
title: Use This Simple Line Of CSS Grid To Make Your Layout Responsive
description: Avoid writing a bunch of media queries using a single line of CSS Grid.
slug: responsive-css-grid-layout
published: '2024-03-28'
category: css
---

<script lang="ts">
	import Embed from '#lib/components/embed.svelte'
</script>

<Embed src="https://svelte.dev/repl/2a2644dd768c43f6a5e16ef94fd145ca?version=4.2.12" title="Responsive CSS Grid Layout" />

If you're using [CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout) for your layout, you can avoid writing a bunch of media queries with this simple line of CSS.

```css:css {3} showLineNumbers
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
```

Let's break it down:

- `repeat` uses `auto-fill` as the repeat count to repeat the grid item as many times as needed
- `minmax` specifies a minimum size of `200px`, and maximum size of `1fr` for the grid item

You could also use `auto-fit` instead of `auto-fill`, but what is the difference?

<Embed src="https://svelte.dev/repl/6b20131ea56a480b83af648d461bc1b4?version=4.2.12" title="CSS Grid Auto-Fill Versus Auto-Fit" />

If you want to stretch the grid items to take the entire available space use `auto-fit`, otherwise use `auto-fill`.
