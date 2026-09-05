---
title: Favicon That Works for Light and Dark Mode
description: How to make a favicon that respects the user color scheme preference?
slug: dark-mode-favicon
published: '2021-8-29'
category: css
---

<script lang="ts">
	import Image from '#lib/components/image.svelte'
</script>

## Table of Contents

## Prefers Color Scheme

The majority of modern operating systems let the user choose between a **light** and **dark** mode preference (besides **Linux** as far as I know 😢).

<Image src="comparison.webp" alt="Comparison between light and dark favicon" />

We can take advantage of this by using the [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media query to change the favicon based on the user's preference.

```css:example.css showLineNumbers
@media (prefers-color-scheme: dark) {
  /* ... */
}
```

If we look at [caniuse](https://caniuse.com/), the `prefers-color-scheme` media query is [supported across 91% of browsers](https://caniuse.com/prefers-color-scheme).

<Image src="prefers-color-scheme.webp" alt="Prefers color scheme browser usage" />

## Using JavaScript

You can use **JavaScript** to change the favicon based on the user's preference using the [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) API that can **listen** for changes and return `true` or `false` if the media query **matches**.

```js:example.js showLineNumbers
// select the favicon 👉
const faviconEl = document.querySelector('link[rel="icon"]')

// watch for changes 🕵️
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
mediaQuery.addEventListener('change', themeChange)

// listener 👂
function themeChange(event) {
  if (event.matches) {
    faviconEl.setAttribute('href', 'favicon-dark.png')
  } else {
    faviconEl.setAttribute('href', 'favicon-light.png')
  }
}
```

## Using the Media Attribute

Inside the [external resource link element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) you can specify a `media` attribute that accepts a **media type** such as `print` and `screen`, or a **media query**.

```html:example.html showLineNumbers
<link
  href="favicon-light.png"
  rel="icon"
  media="(prefers-color-scheme: light)"
/>
<link
  href="favicon-dark.png"
  rel="icon"
  media="(prefers-color-scheme: dark)"
/>
```

The `media` attribute is [supported across 97% of browsers](https://caniuse.com/mdn-html_elements_link_media).

<Image src="link-media.webp" alt="Link media attribute browser usage" />

## Using a SVG Favicon

I prefer using a **SVG** favicon since it's easy to change and you don't have to think about the dimensions and size. Unfortunately, **SVG favicons** are only [supported across 74% of browsers](https://caniuse.com/link-icon-svg). We have to provide a **fallback** version for **Internet Explorer** and **Safari**.

<Image src="svg-favicons.webp" alt="SVG favicons browser usage" />

<Image src="safari.webp" alt="Person shouting at Safari to be normal" />

```html:example.html showLineNumbers
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="icon" href="favicon.png" type="image/png">
```

[Scalable Vector Graphics](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics) (SVG) are amazing because they're a self-contained [Document Object Model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) (DOM) that lets you do anything inside it such as using a `style` tag for **CSS** to take advantage of what we learned so far.

```html:favicon.svg showLineNumbers
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 134 134">
  <style>
    path {
      fill: black;
    }
    @media (prefers-color-scheme: dark) {
      path {
        fill: white;
      }
    }
  </style>
  <path
    d="M44.193 81.846c-10.615.683-20.248 4.726-25.714 19.13-.622 1.643-2.117 2.64-3.86 2.64-2.94 0-12.029-7.32-14.619-9.088.003 21.788 10.038 40.939 33.87 40.939 20.07 0 33.866-11.581 33.866-31.8 0-.823-.172-1.61-.257-2.416zM121.153 0c-4.011 0-7.771 1.775-10.64 4.352-54.083 48.313-59.71 49.448-59.71 63.67 0 3.625.86 7.08 2.31 10.24l16.885 14.07c1.908.476 3.874.801 5.924.801 16.433 0 25.958-12.03 55.87-67.855 1.952-3.796 3.677-7.898 3.677-12.168C135.47 5.461 128.59 0 121.153 0z"
  />
</svg>
```

If you want [Prettier](https://prettier.io/) to format your SVG nicely, temporarily rename it to use the **\*.html** extension or tell your editor to treat it as a **HTML** file. You can also use [SVGOMG](https://jakearchibald.github.io/svgomg/), which reduces the amount of markup created inside SVGs when you export them, to optimize your SVG beforehand.

## Conclusion

The only downside to this method is the browser theme set by the user, since they could be using light mode with a dark theme.

Thanks for reading! 🏄‍♀️
