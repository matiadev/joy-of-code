---
title: How to Style CSS Focus Outline
description: Learn the importance of CSS focus outline for accessibility and how to style it.
slug: css-focus-outline
published: '2021-3-28'
category: css
---

<script lang="ts">
	import Embed from '#lib/components/embed.svelte'
	import Image from '#lib/components/image.svelte'
</script>

## Table of Contents

## Default Styles Don't Spark Joy

Do you ignore focus styles because they're ugly? I'm going to explain why you shouldn't remove them, and show you how to style them to match your UI (user interface) instead.

<Embed src="https://codepen.io/mattcroat/embed/oNBxKvb?height=600&theme-id=dark&default-tab=result" title="Simple Product Card" />

Let's say you're presented with the design above. If you were to just <kbd>Tab</kbd> through, it's functional — but we can agree it's not something to behold.

<Image src="default.gif" alt="Default styles" />

## Removing Focus Outline Is Bad For Accessibility

You might be tempted to remove focus styles. There's only one problem. **It's terrible for accessibility**. [Focus outline](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus) provides visual feedback for users who can't use a mouse, or have visual impairment, when using <kbd>Tab</kbd> on their keyboard for navigation.

```css:example.css showLineNumbers
/* 🚫 don't do this */
:focus {
  outline: none;
}
```

<Image src="no-outline.gif" alt="Outline set to none" />

Be mindful that impairment doesn't only refer to people with permanent disabilities. You can have temporary impairment due to injury, so the number of people with impairments is higher than you might think.

**It's our responsibility to make the web accessible for everyone**.

## Outline Doesn't Work for Rounded Corners

```css:example.css showLineNumbers
/* ⚠️ doesn't work for rounded corners */
:focus {
  outline: 3px solid hsla(220, 100%, 50%, 80%);
}
```

<Image src="outline.gif" alt="Using outline styles" />

There is no way of specifying a border radius for outline at the moment, other than some browser specific experimental features.

## Using Border Causes Layout Shifts

```css:example.css showLineNumbers
/* 🚫 don't do this */
:focus {
  outline: none;
  border: 3px solid hsla(220, 100%, 50%, 80%);
}
```

<Image src="border.gif" alt="Using border styles" />

The layout shifts from the border cause our elements to jump around. It can probably be solved by setting a border on each element with no opacity, and then bring the opacity back on focus. I don't hate this idea, but it's not great.

## Use Box Shadow

```css:example.css showLineNumbers
/* ✅ do this */
:focus {
  outline: none;
  box-shadow: 0 0 0 3px hsla(220, 100%, 50%, 80%);
}
```

<Image src="box-shadow.gif" alt="Using box-shadow" />

This works for any focusable element. Not only does it take on the same rounded corners, but you can control other properties such as color, opacity, offset, and blur. You can [read more about box-shadow here](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow).

Notice we're also able to animate the transition.

```css:example.css showLineNumbers
.element {
  transition: box-shadow 0.3s ease;
}
```

## Conclusion

Accessibility is important. It's an important subject worth understanding. No one goes out of their way to create a bad user experience on purpose. If you're aware, and strive to make the web a better place — that's what counts.
