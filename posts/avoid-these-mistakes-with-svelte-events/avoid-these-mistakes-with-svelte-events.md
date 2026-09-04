---
title: Avoid These Mistakes With Svelte Events
description: Learn how Svelte handles events using event delegation and how to avoid mistakes when creating events.
slug: avoid-these-mistakes-with-svelte-events
published: '2026-3-14'
category: svelte
---

<script lang="ts">
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="7mQCRxdIPJg" title="Avoid These Mistakes With Svelte Events" />

## Table of Contents

## Event Delegation

Most JavaScript frameworks don't attach event listeners directly on elements. Instead they use a technique called [event delegation](https://javascript.info/event-delegation).

```svelte:+page.svelte
<button onclick={() => console.log('click')}>
  Click
</button>
```

If you inspect a button with a click handler in Svelte and look at the event listeners, you'll notice the button itself has no event listeners — the event listener is actually on the root element.

This works thanks to [event bubbling](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling). When you click a button, the event bubbles up through all of its ancestors. So instead of attaching a separate listener to every button (which would be memory inefficient and require manual cleanup), Svelte attaches a single event listener higher up the tree and figures out which element was clicked.

You can check the [Svelte docs](https://svelte.dev/docs/svelte/svelte-events) to see which event types get delegated.

Svelte handles declarative events in the template for you, but you can run into problems when using **custom events** or **manual event listeners** because of how event delegation works.

## Custom Events Don't Bubble

Consider an [attachment](https://joyofcode.xyz/svelte-attachments-explained) called `clickedoutside` that fires a custom event when you click outside a node:

```svelte:+page.svelte
<script lang="ts">
  function clickedoutside(node: HTMLElement) {
    function handler(event: MouseEvent) {
      if (!node.contains(event.target as Node)) {
        node.dispatchEvent(new CustomEvent('clickedoutside'))
      }
    }
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }
</script>

<button
	{@attach clickedoutside}
	onclickedoutside={() => console.log('clicked outside')}
>
	Click
</button>
```

This works fine when you listen for the event on the element itself. But what if you want to listen on a **parent element**?

```svelte:+page.svelte
<!-- ❌ this won't work -->
<section onclickedoutside={() => console.log('clicked outside')}>
  <button {@attach clickedoutside}>Click</button>
</section>
```

Nothing happens, because **custom events don't bubble by default**.

The fix is simple — pass `{ bubbles: true }` to your `CustomEvent`:

```ts:+page.svelte
new CustomEvent('clickedoutside', { bubbles: true })
```

Now the event bubbles up the DOM tree and the parent listener catches it correctly.

## Simplifying Event Listeners With On

The `on` function from `svelte/events` makes it easier to add and clean up event listeners. Instead of manually calling `addEventListener` and `removeEventListener`, you can do this:

```svelte:+page.svelte
<script lang="ts">
  import { on } from 'svelte/events'

  function clickedoutside(node: HTMLElement) {
    // `on` returns a cleanup function automatically
    return on(window, 'click', (event) => {
			if (!node.contains(event.target as Node)) {
			  node.dispatchEvent(new CustomEvent('clickedoutside', { bubbles: true }))
			}
    })
  }
</script>
```

This also works great inside `$effect`:

```svelte:+page.svelte
<script lang="ts">
  import { on } from 'svelte/events'

  $effect(() => {
    return on(window, 'click', handler)
  })
</script>
```

## Manual Event Listeners Fire In The Wrong Order

Consider an attachment that adds a manual `click` event listener directly to a node:

```svelte:+page.svelte
<script lang="ts">
  function event(node: HTMLElement) {
    function handler() {
      console.log('manual click')
    }
    node.addEventListener('click', handler)
    return () => node.removeEventListener('click', handler)
  }
</script>

<section {@attach event}>
	<button onclick={() => console.log('click')}>
	  Click
	</button>
</section>
```

When you click the button, you might expect `click` to log first and `manual click` second — but the **opposite** happens. The manual event listener fires first, before the declarative one.

This also breaks `stopPropagation`.

Even if you add `event.stopPropagation()` to the declarative handler, the manual listener will still fire:

```svelte:+page.svelte
<!-- ❌ stopPropagation won't prevent the manual listener from firing -->
<section {@attach event}>
	<button onclick={(event) => {
		event.stopPropagation()
		console.log('click')
	}}>
	  Click
	</button>
</section>
```

The fix is to use `on` from `svelte/events` instead of calling `addEventListener` directly:

```svelte:+page.svelte
<script lang="ts">
  import { on } from 'svelte/events'

  function event(node: HTMLElement) {
    return on(node, 'click', () => console.log('manual click'))
  }
</script>

<section {@attach event}>
	<button onclick={(event) => {
		event.stopPropagation()
		console.log('click')
	}}>
	  Click
	</button>
</section>
```

Now events fire in the correct order (`click` first, `manual click` second), and `stopPropagation` works as expected — when propagation is stopped, the manual listener won't fire at all.

## How Event Delegation Works Under The Hood

When Svelte compiles a component, it doesn't wire up `addEventListener` on each element. Instead, it stores the event handlers as a property on the element (something like `element['events'] = { onclick: ... }`), then adds a **single listener** to both the container and the document:

> "The container listener ensures we catch events from within in case the outer content stops propagation of the event."

When you click a button, that single listener fires a function called `handle_event_propagation`. It:

1. Receives the event and proxies `currentTarget` to point to the correct element
2. Walks up the DOM tree through each parent element
3. Looks up the delegated event handlers stored on each element
4. Calls them using `.call(element, event)` to ensure the correct `this` context

```js:events.js
var delegated = current_target[event.symbol]?.[event.name]
delegated.call(current_target, event)
```

This is why declarative Svelte events "just work" — the ordering and cleanup are all managed for you.

## How On Is Implemented

The `on` function from `svelte/events` wraps your handler inside a `target_handler` which calls `handle_event_propagation` (the same internal function Svelte uses for delegated events) with the element as `this`.

This is exactly how Svelte ensures manually added listeners fire in the correct order relative to declarative ones:

```js:events.js
function on(element, type, handler, options = {}) {
  var target_handler = create_event(type, element, handler, options)
  return () => element.removeEventListener(type, target_handler, options)
}

function create_event(event_name, dom, handler, options = {}) {
	function target_handler(event) {
		handle_event_propagation.call(dom, event)
	}
	dom.addEventListener(event_name, target_handler, options)
	return target_handler
}
```

Using the same propagation mechanism, `on` guarantees that event ordering and `stopPropagation` behave exactly as you'd expect.
