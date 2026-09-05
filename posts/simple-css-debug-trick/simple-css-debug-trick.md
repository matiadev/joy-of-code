---
title: Simple Trick To Debug Your CSS
description: Learn how to debug CSS using this simple trick.
slug: simple-css-debug-trick
published: '2021-10-2'
category: css
---

<script lang="ts">
	import Image from '#lib/components/image.svelte'
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="5nrMpCWkncc" title="Debug Your CSS" />

## Table of Contents

## The Outline Trick

The fastest way to find misbehaving elements on the page is using the `outline` trick in CSS. This helps you find issues such as overflowing elements quickly, but more importantly it gives you a visual of the entire page.

<Image src="css-debug.webp" alt="Debugging CSS" />

You can use `outline` to set an outline on every element, which isn't going to affect the layout compared to using `border` — unless you specify `box-sizing: border-box`.

```css:css showLineNumbers
* {
  outline: 1px solid tomato;
}
```

You can also add a `background` property, or use different `outline` colors for nested elements, if you want to make things more readable:

```css:css showLineNumbers
* {
  outline: 1px solid tomato;
}

* * {
  outline: 1px solid black;
}

* * * {
  outline: 1px solid white;
}
```

## Creating A Bookmarklet

You can turn this helper into a JavaScript bookmarklet, and use it when you need it. The only thing you have to do is create a regular bookmark in your browser, and include this code.

<Image src="bookmarklet.webp" alt="Bookmarklet" />

```js:bookmarklet showLineNumbers
javascript: (function () {
  const headElement = document.head;
  const styleElement = document.createElement('style');
  styleElement.setAttribute('debug-css', '');
  styleElement.innerText = '* { outline: 1px solid tomato; }';

  const debugElement = headElement.querySelector('[debug-css]');
  if (debugElement) return debugElement.remove();

  headElement.append(styleElement);
})();
```

The code uses an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) to create a `<style>` tag, append it to the `<head>` element, and checks if the element exists to toggle it.

That's it! 😄
