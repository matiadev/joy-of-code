---
title: The Best CSS Framework For Svelte
description: How to set up and customize Pico.css with Svelte.
slug: using-pico-css-with-svelte
published: '2022-12-11'
category: svelte
---

<script lang="ts">
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="-n84EMKIXQM" title="The Best CSS Framework For Svelte" />

## Table of Contents

## Setup

Pico.css is one of my favorite CSS frameworks to use with Svelte and here's how to set it up and customize it.

Install Pico.css.

```shell:terminal
npm i @picocss/pico
```

Import it inside your layout.

```svelte:+layout.svelte showLineNumbers
<script lang="ts">
  import '@picocss/pico'
  import '../app.css'
</script>

<slot />
```

This is how simple it to turn a checkbox into a switch.

```svelte:+page.svelte showLineNumbers
<input type="checkbox" role="switch" />
```

## Customization

You can use CSS variables to customize Pico.

```css:app.css showLineNumbers
:root {
  --primary: aqua;
}
```

Here are the [values you can customize](https://github.com/picocss/pico/blob/master/css/themes/default.css) and you can learn more from the [Pico docs](https://picocss.com/docs/customization.html).

If you're using Sass you can import the components you need from Pico including a custom theme and keep it up to date.

```scss:app.scss showLineNumbers
/* custom version */

// theme
@import "@picocss/pico/scss/themes/default";

// import components you need
@import "@picocss/pico/scss/content/button";
@import "@picocss/pico/scss/content/form";
```

You can look at the [`pico.scss`](https://github.com/picocss/pico/blob/master/scss/pico.scss) example to see every component.
