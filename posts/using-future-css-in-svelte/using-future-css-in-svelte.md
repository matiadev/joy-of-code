---
title: Use Future CSS In Svelte Today
description: Learn how to use future CSS in Svelte today with PostCSS.
slug: using-future-css-in-svelte
published: '2022-9-2'
category: svelte
---

{% youtube id="eqwtoaP-0pk" title="Use Future CSS in Svelte" %}

## Table of Contents

## Use Future CSS Today

With so many great CSS features like [container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries) coming to browsers the excitement around CSS has never been greater.

Here are some of the CSS features I'm excited about:

- [Nesting rules](https://preset-env.cssdb.org/features/#nesting-rules)
- [Cascade layers](https://preset-env.cssdb.org/features/#cascade-layers)
- [Custom media queries](https://preset-env.cssdb.org/features/#custom-media-queries)
- [Media query ranges](https://preset-env.cssdb.org/features/#media-query-ranges)
- [`:has()` and `:is()` pseudo class](https://preset-env.cssdb.org/features/#has-pseudo-class)
- [Trigonometric functions](https://preset-env.cssdb.org/features/#trigonometric-functions)

Some of these features might be already supported by some browsers but what if you wanted to use those features today?

In that case you can use PostCSS that describes itself as “A tool for transforming CSS with JavaScript”.

## Set Up PostCSS

[PostCSS](https://postcss.org/) is to CSS what [Babel](https://babeljs.io/) is to JavaScript and it lets you use future CSS today by converting modern CSS to something most browsers can understand using polyfills.

> 🐿️ A [polyfill](https://developer.mozilla.org/en-US/docs/Glossary/Polyfill) is a piece of code used to provide functionality on older browsers that don't natively support it.

To start using modern CSS today it's simple as adding the [postcss-preset-env](https://preset-env.cssdb.org/) plugin for PostCSS in your Svelte project and enabling the options you want.

To get started install the `postcss-preset-env` plugin.

```shell:terminal
npm i -D postcss-preset-env
```

Create a `postcss.config.js` file at the root of your project.

```js:postcss.config.js showLineNumbers
import postcssPresetEnv from 'postcss-preset-env'

/** @type {import('postcss-preset-env').Config} */
const config = {
	plugins: [
		postcssPresetEnv({
			features: { 'nested-rules': true },
		}),
	],
}

export default config
```

[Stage 2 features](https://preset-env.cssdb.org/features/#stage-2) are enabled by default but you can enable other features and look at more options from [postcss-preset-env](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env).

Don't forget to include the `lang="postcss"` attribute inside the `<style>` tag.

```svelte:+page.svelte
<style lang="postcss">
  @custom-media --md (min-width: 768px);

  .grid {
    display: grid;
    grid-template-columns: 1fr;

    @media (--md) {
      grid-template-columns: repeat(4, 1fr);
    }
  }
</style>
```

That's it! 🎉
