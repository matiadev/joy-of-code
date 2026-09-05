---
title: Entry And Exit Transitions With Modern CSS
description: Learn how to do enter and exit CSS transitions using @starting-style, animate discrete properties like display, and use the View Transition API for smooth layout animations.
slug: entry-and-exit-css-transitions
published: '2026-5-20'
category: css
---

<script lang="ts">
	import YouTube from '#lib/components/youtube.svelte'
	import Keyframes from './examples/Keyframes.svelte'
	import Transitions from './examples/Transitions.svelte'
	import KeyframeToggle from './examples/KeyframeToggle.svelte'
	import TransitionToggle from './examples/TransitionToggle.svelte'
	import Discrete from './examples/Discrete.svelte'
	import ViewTransition from './examples/ViewTransition.svelte'
	import Dialog from './examples/Dialog.svelte'
</script>

<YouTube id="7D9DSJp5rkY" title="Animate Entry And Exit Transitions With Modern CSS" />

## Table of Contents

## Enter Transitions Using @keyframes

Using keyframes for enter animations in CSS shouldn't be anything new. In this example, we have some boxes, and in the styles we define `fadeIn` keyframes with `from` and `to`:

<Keyframes />

For the `fadeIn` animation direction, we define `backwards` so we apply `from` styles instantly, otherwise it would use the default element styles. For the stagger effect, we use `sibling-index()` inside `animation-delay`:

```css:style.css
@keyframes fadeIn {
	from {
		opacity: 0;
		translate: 0 20px;
	}
	to {
		opacity: 1;
		translate: 0 0;
	}
}

.box {
	animation: fadeIn 0.8s backwards;
	animation-delay: calc(0.3s * sibling-index());
}
```

`sibling-index()` is a relatively new CSS function that returns an integer representing the position of the current element in the DOM tree.

## Enter Transitions Using @starting-style

Let's look at the same entry animation using CSS transitions. Instead of keyframes, we're going to use `@starting-style` at-rule to define the starting styles for an element:

<Transitions />

The `@starting-style` rule specifies how the initial style for the element should be `opacity: 0` and `translate: 0 20px`. Using CSS nesting, we don't have to repeat the box selector:

```css:style.css
.box {
	transition: opacity 0.8s, translate 0.8s;
	transition-delay: calc(0.3s * sibling-index());

	@starting-style {
		opacity: 0;
		translate: 0 20px;
	}
}
```

This way the starting styles values smoothly animate to their original values. The `opacity` goes from `0` to `1`, and `translate` goes from `20px` to `0` on the Y-axis.

## The Advantage of CSS Transitions

You might be asking yourself what's the point of using CSS transitions when keyframes can already do it. The advantage of using CSS transitions over keyframes is that CSS transitions can be **interrupted** which translates to a better user experience.

Try toggling and interrupting the animation by clicking it again quickly for the example using keyframes:

<KeyframeToggle />

As you can see, keyframe animations can't be interrupted mid-way. Now try toggling and interrupting the example using CSS transitions:

<TransitionToggle />

The elements in the CSS transition example smoothly reverse back to their starting position. That's because transitions are interruptible, the browser knows the current computed value and the target value, so it can animate between them in either direction.

This makes CSS transitions the better choice for interactive UI, where the user might change their mind, so the animation can gracefully be interrupted and avoid jank.

## Animating Discrete Properties Like display

You can combine `@starting-style` with the `allow-discrete` property for exit transitions. Without it, removing a box would be instant due to `display: none` so the animation never plays. In this example, the exit animation plays before the box is removed:

<Discrete />

First, we define the styles for the `hidden` attribute. If the element has the `hidden` attribute, we set it to `display: none`, `opacity: 0`, and `translate: 0 20px`. After that we set the `display` transition type with the `allow-discrete` keyword:

```css:style.css
.box {
	transition:
		opacity 0.5s,
		translate 0.5s,
		background 0.5s,
		display 0.5s allow-discrete;
	transition-delay: calc(0.1s * sibling-index());

	@starting-style {
		opacity: 0;
		translate: 0 20px;
	}

	&[hidden] {
		display: none;
		opacity: 0;
		translate: 0 20px;
	}
}
```

The `allow-discrete` keyword waits for the transition to finish before it applies the `display` type. Without it, the `display` property applies immediately and the box disappears.

You can clean up the node after the transition ends using JavaScript. The simplest approach is to use `ontransitionend`:

```js:script.js
function remove(node) {
	node.hidden = true;
	node.ontransitionend = () => node.remove();
}
```

A more robust approach waits for all animations to finish:

```js:script.js
function onTransitionEnd(node) {
	return Promise.allSettled(
		node.getAnimations().map(a => a.finished)
	);
}

async function remove(node) {
	node.hidden = true;
	await onTransitionEnd(node);
	node.remove();
}
```

## View Transitions for Layout Animations

In the previous example, you might have noticed the jank when you remove a box and the surrounding boxes just snap into place.

If you want to animate layout transitions, you can use the [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) to animate any before and after state in the DOM:

<ViewTransition />

The way the View Transition API works is that the browser takes a literal image of the before and after DOM and gives you control how to animate between those states.

First, we define a few view transition styles. The `::view-transition-group` pseudo-element targets all of the box elements for easier styling. The `::view-transition-new` and `::view-transition-old` pseudo-elements let us specify enter and leave animations for the box:

```css:style.css
::view-transition-group(.box) {
	animation-delay: 0.3s;
}

::view-transition-new(enter) {
	animation: enter 0.5s;
}

::view-transition-old(leave) {
	animation: leave 0.5s forwards;
}

@keyframes enter {
	from { opacity: 0; translate: 0 20px; }
	to { opacity: 1; translate: 0 0; }
}

@keyframes leave {
	to { opacity: 0; translate: 0 20px; }
}
```

To start a view transition, we have to invoke the `startViewTransition` method on the `document` with a callback that changes the DOM in some way:

```js:script.js
document.querySelector('.boxes').addEventListener('click', (e) => {
	const box = e.target.closest('.box');
	if (!box) return;

	document.querySelectorAll('.box').forEach((b, i) => {
		const name = b === box ? 'leave' : `box-${i}`;
		b.style.viewTransitionName = name;
		b.style.viewTransitionClass = 'box';
	});

	document.startViewTransition(() => box.remove());
});
```

In the code we assign a unique `viewTransitionName` to a box if it's leaving or just existing in the layout change. The `viewTransitionClass` lets us target every box to apply a delay without having to target `box-1`, `box-2`, etc...

Now if you remove a box, the surrounding boxes smoothly animate into place. No more jank where elements just snap into position.

## Better Use Case For Entry And Exit Transitions

A better use case for entry and exit transitions using `@starting-style` is for elements that won't shift the layout, like the `<dialog>` element or the [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API):

<Dialog />

Here, we have a simple modal. It might sound weird at first, but the exit state is the initial `dialog` state which has a translate of `100svh` on the Y-axis:

```css:style.css
/* exit state */
dialog {
	translate: 0 100svh;
	transition:
		translate 1s,
		display 1s allow-discrete,
		overlay 1s allow-discrete;
}

/* enter state */
dialog:open {
	translate: 0 0;

	@starting-style {
		translate: 0 -100svh;
	}
}
```

The `overlay` property is a special property for dialogs, which avoids any problems with the `z-index` for the overlay. Using `display` with `allow-discrete` ensures the `overlay` and `display` styles don't toggle immediately.

Here we also style the dialog `::backdrop` pseudo-element. Unfortunately, you can't use nesting inside pseudo-elements, so `@starting-style` has to wrap the selector explicitly:

```css:style.css
dialog::backdrop {
	background-color: transparent;
	transition:
		display 1s allow-discrete,
		overlay 1s allow-discrete,
		background-color 1s;
}

dialog:open::backdrop {
	background-color: oklch(0% 0 0 / 50%);
}

@starting-style {
	dialog:open::backdrop {
		background-color: transparent;
	}
}
```

When you close the modal, it does the exit transition. Because we're using CSS transitions instead of keyframes, we can interrupt the dialog transition, which wouldn't be possible using keyframes.

That's it! 😄 Now you can create smooth enter and exit transitions using modern CSS features like `@starting-style`, `allow-discrete`, and the View Transition API.
