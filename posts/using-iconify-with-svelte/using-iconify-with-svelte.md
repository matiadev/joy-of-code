---
title: The Best Icon Library For Svelte
description: Iconify is a framework agnostic icon library that includes every popular icon set.
slug: using-iconify-with-svelte
published: '2022-12-11'
category: category
---

{% youtube id="iGVhzsTZSa8" title="The Best Icon Library For Svelte" %}

## Table of Contents

## Iconify

[Iconify](https://iconify.design/) is a framework agnostic icon library that includes every popular icon set — you can use [Icônes](https://icones.js.org/) to explore icons and copy them directly as SVG if you want.

To use the icons you can use the component wrapper for your framework but the recommended way is to use the web component version.

```shell:terminal
npm i iconify-icon
```

```svelte:+layout.svelte showLineNumbers
<script lang="ts">
  import 'iconify-icon'
</script>
```

After you find the icon copy the generated code.

```svelte:+page.svelte showLineNumbers
<iconify-icon icon="mdi:home"></iconify-icon>
```

That's it.
