---
title: Sveltify Any JavaScript Library
description: Learn how to Sveltify any JavaScript library using Svelte actions and component composition.
slug: sveltify-any-javascript-library
published: '2023-09-29'
category: svelte
---

<script lang="ts">
	import Embed from '#lib/components/embed.svelte'
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="RuM4KHTZqD4" title="Sveltify Any JavaScript Library" />

## Table of Contents

## Sveltify Any JavaScript Library

[Svelte makes it easy to work with any existing JavaScript library](https://joyofcode.xyz/using-javascript-libraries-in-svelte) since it gives you control over the DOM and doesn't require mental gymnastics.

Instead of using regular JavaScript you can take advantage of the declarative nature of Svelte and **Sveltify** any JavaScript library for a nicer developer experience — which you can also publish on [npm](https://www.npmjs.com/) if you want.

<Embed src="https://stackblitz.com/github/joysofcode/sveltify?ctl=1&embed=1&file=src%2Froutes%2F%2Bpage.svelte&title=Sveltify Any JavaScript Library" title="Sveltify Any JavaScript Library" />

You can find the source code on [GitHub](https://github.com/joysofcode/sveltify).

First we're going to use [Svelte actions](https://learn.svelte.dev/tutorial/actions) to create a reusable tooltip from [Floating UI](https://floating-ui.com/), and then use component composition to turn a [Leaflet](https://leafletjs.com/) map into a simple library we can use.

You don't need special Svelte version of a library to use it, but it can teach you a lot about how JavaScript frameworks work in general and it's fun.

## Using Svelte Actions

[Floating UI](https://floating-ui.com/) is used to create tooltips, popovers, dropdown and more but for our use case I'm only interested in using it for tooltips.

You might look at the code of some **sveltified** libraries and think it looks complicated, but that's only because they're trying to make a general abstraction for everyone to use — you don't have to, so only Sveltify the parts you need.

Here is the regular code required for creating a Floating UI tooltip using the `bind` directive to get a reference to the element.

```svelte:src/routes/tooltip/tooltip.svelte showLineNumbers
<script lang="ts">
  import { computePosition, offset, type ComputePositionConfig } from '@floating-ui/dom'

  // get reference to dom elements
  let buttonEl: HTMLButtonElement
  let tooltipEl: HTMLDivElement

  // state
  let showTooltip = false

  async function updateTooltipPosition() {
    // use the Floating UI API
    const { x, y } = await computePosition(buttonEl, tooltipEl, {
      placement: 'bottom',
      middleware: [offset(8)],
    })

    Object.assign(tooltipEl.style, {
      left: `${x}px`,
      top: `${y}px`,
    })
  }

  // run when `showTooltip` changes
  $: if (showTooltip) {
    updateTooltipPosition()
  }
</script>

<button
  bind:this={buttonEl}
  on:mouseenter={() => showTooltip = true}
  on:mouseleave={() => showTooltip = false}
  aria-describedby="tooltip"
>
  Hover
</button>

<div bind:this={tooltipEl} class:show={showTooltip} class="tooltip" role="tooltip">
  Component
</div>

<style>
  .tooltip {
    display: none;
    width: max-content;
    position: absolute;
    top: 0;
    left: 0;
    font-weight: 600;
    background: var(--tooltip-bg);
    color: var(--tooltip-clr);
    padding: var(--tooltip-padding);
    border-radius: var(--tooltip-rounded);

    &.show {
      display: block;
    }
  }
</style>
```

You can import is any other component, and perhaps even pass arguments to change the values to make it more flexible.

```svelte:src/routes/tooltip/+page.svelte showLineNumbers
<script lang="ts">
  import Tooltip from './tooltip.svelte'
</script>

<!-- Floating UI  -->
<Tooltip />
```

Instead of creating a `<Tooltip />` component, it's easier to create a Svelte action you can simply use on any element.

Using a Svelte action is a simple way to get a reference to any element. You can attach behavior to any element using regular JavaScript, and run code when the element is created or removed.

```ts:src/lib/tooltip.ts showLineNumbers
import { computePosition, offset, type Placement } from '@floating-ui/dom'

type TooltipOptions = {
  text?: string
  placement?: Placement
}

export function tooltip(targetEl: HTMLElement, options?: TooltipOptions) {
  const tooltipEl = createTooltip(targetEl)

  function createTooltip(targetEl: HTMLElement) {
    const tooltipEl = Object.assign(document.createElement('div'), {
      role: 'tooltip',
      innerHTML: options?.text ?? 'Tooltip',
      style: `
        display: none;
        width: max-content;
        position: absolute;
        top: 0;
        left: 0;
        font-weight: 600;
        background: var(--tooltip-bg);
        color: var(--tooltip-clr);
        padding: var(--tooltip-padding);
        border-radius: var(--tooltip-rounded);
      `,
    })

    targetEl.after(tooltipEl)

    return tooltipEl
  }

  async function updateTooltipPosition(targetEl: HTMLElement, tooltipEl: HTMLElement) {
    const { x, y } = await computePosition(targetEl, tooltipEl, {
      placement: options?.placement,
      middleware: [offset(8)],
    })

    Object.assign(tooltipEl.style, {
      left: `${x}px`,
      top: `${y}px`,
    })
  }

  function showTooltip() {
    tooltipEl.style.display = 'block'
    updateTooltipPosition(targetEl, tooltipEl)
  }

  function hideTooltip() {
    tooltipEl.style.display = 'none'
  }

  // add event listeners
  targetEl.addEventListener('mouseenter', showTooltip)
  targetEl.addEventListener('mouseleave', hideTooltip)

  return {
    destroy() {
      // remove event listeners when element is removed
      targetEl.removeEventListener('mouseenter', showTooltip)
      targetEl.removeEventListener('mouseLeave', hideTooltip)
    },
  }
}
```

Looking at the example you can see we're using regular JavaScript which is incredibly powerful.

```svelte:src/routes/tooltip/+page.svelte showLineNumbers
<script lang="ts">
  import { tooltip } from '$lib/tooltip'
</script>

<!-- Action -->
<button use:tooltip={{ text: 'Bottom' }}>Hover</button>
<button use:tooltip={{ text: 'Right', placement: 'right' }}>Hover</button>
```

Using a Svelte action we abstracted the tooltip logic into a `tooltip` action which is just a regular JavaScript function with a reference to the element — you can import the action from anywhere, and use it with the [use:action directive](https://svelte.dev/docs/element-directives#use-action).

## Using Component Composition

[Leaflet](https://leafletjs.com/) is a great JavaScript library for interactive maps, and has some of the most common problems you're going to run into when using a JavaScript library with SvelteKit.

For some reason Leaflet doesn't include installation instructions for npm, but doing a quick search on npm you can find [Leaflet](https://www.npmjs.com/package/leaflet), and use `npm i leaflet` to install the package.

If you use TypeScript, besides the name of the package you can see Leaflet has type definitions available from `npm i @types/leaflet` since it's not written in TypeScript.

Here is how you use Leaflet in Svelte.

```svelte:src/routes/map/map.svelte showLineNumbers
<script lang="ts">
  import { onMount } from 'svelte'
  import 'leaflet/dist/leaflet.css'

  let mapEl: HTMLDivElement

  onMount(async () => {
    // using dynamic import because leaflet runs
    // code on the `window` object during init
    const leaflet = await import('leaflet')

    // create map of Croatia
    const map = leaflet.map(mapEl).setView([45.815399, 15.966568], 6)

    // add map tile
    leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

    // create Zagreb marker
    const markerZagreb = leaflet.marker([45.815399, 15.966568]).addTo(map)
    markerZagreb.bindPopup('Zagreb')

    // create Zadar marker
    const markerZadar = leaflet.marker([44.119371, 15.231365]).addTo(map)
    markerZadar.bindPopup('Zadar')
  })
</script>

<div bind:this={mapEl} class="map" />

<style>
  .map {
    position: absolute;
    inset: 0;
    z-index: 10;
  }
</style>
```

This gives us a nice map.

```svelte:src/routes/map/+page.svelte showLineNumbers
<script lang="ts">
  import LeafletMap from './map.svelte'
</script>

<!-- Leaflet -->
<LeafletMap />
```

This is great but what if we wanted to create a map in a more declarative way?

```svelte:src/routes/map/+page.svelte showLineNumbers
<script lang="ts">
  import { Map, Marker } from '$lib/map'
</script>

<!-- Composition -->
<Map lat={45.815399} lon={15.966568} zoom={6}>
  <Marker lat={45.815399} lon={15.966568} label="Zagreb" />
  <Marker lat={44.119371} lon={15.231365} label="Zadar" />
</Map>
```

This already looks a lot nicer! To achieve this we can use component composition with [Svelte's Context API](https://learn.svelte.dev/tutorial/context-api).

Inside `lib` I'm going to create a `map` folder with a `<Map />` and `<Marker />` component.

```svelte:src/lib/map/map.svelte showLineNumbers
<script lang="ts">
  import { onMount, setContext } from 'svelte'
  import type L from 'leaflet'
  import { key } from '$lib/map'
  import 'leaflet/dist/leaflet.css'

  export let lat: number
  export let lon: number
  export let zoom: number

  let leaflet: typeof L
  let leafletMap: L.Map
  let mapEl: HTMLDivElement

  setContext(key, {
    getLeaflet: () => leaflet,
    getMap: () => leafletMap,
  })

  onMount(async () => {
    leaflet = await import('leaflet')
    leafletMap = leaflet.map(mapEl).setView([lat, lon], zoom)
    leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(leafletMap)
  })
</script>

<div bind:this={mapEl} class="map" />

{#if leaflet && leafletMap}
  <slot />
{/if}

<style>
  .map {
    position: absolute;
    inset: 0;
    z-index: 10;
  }
</style>
```

The reason we use the Context API is because we need to pass the `leaflet` and `map` instance to the child `<Marker />` component.

The reason we use a `getLeaflet()` and `getMap()` function is because we always want the latest `leaflet` and `map` value, otherwise it would be `undefined` because that's the initial value.

```svelte:src/lib/map/marker.svelte showLineNumbers
<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte'
  import { key, type MapContext } from '$lib/map'

  export let lat: number
  export let lon: number
  export let label: string

  // get methods from context
  const { getLeaflet, getMap } = getContext<MapContext>(key)

  // get Leaflet instance and map from context
  const leaflet = getLeaflet()
  const map = getMap()

  // add marker
  const marker = leaflet.marker([lat, lon]).addTo(map)
  marker.bindPopup(label)
</script>
```

I'm going to create a `index.ts` file to export everything. This is going to let us import anything from the library using a single import.

```ts:src/lib/map/index.ts showLineNumbers
import type L from 'leaflet'
import Map from './map.svelte'
import Marker from './marker.svelte'
import { key } from './key'

export type MapContext = {
  getLeaflet: () => typeof L
  getMap: () => L.Map
}

export { Map, Marker, key }
```

The key in `setContext()` can be anything like the string `map`, but to ensure the context is unique for every instance of `<Map />` you want to use something unique like an object `{}` or `Symbol`.

```ts:src/lib/map/key.ts showLineNumbers
export const key = Symbol()
```

## Dispatching Custom Events

You can dispatch custom events by using the [createEventDispatcher](https://svelte.dev/docs/svelte#createeventdispatcher) from Svelte.

```svelte:src/lib/map/marker.svelte showLineNumbers
<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  // dispatch custom events
  const dispatch = createEventDispatcher()
  marker.on('popupopen', () => dispatch('open'))
  marker.on('popupclose', () => dispatch('close'))
</script>
```

You can listen for the custom event using the [on:eventname](https://svelte.dev/docs/element-directives#on-eventname) directive.

```svelte:src/routes/map/+page.svelte {7-8} showLineNumbers
<script lang="ts">
  import { Map, Marker } from '$lib/map'
</script>

<Map lat={45.815399} lon={15.966568} zoom={6}>
  <Marker
    on:open={() => console.log('open')}
    on:close={() => console.log('close')}
    lat={45.815399}
    lon={15.966568}
    label="Zagreb"
  />
  <Marker lat={44.119371} lon={15.231365} label="Zadar" />
</Map>
```

You can also dispatch [custom events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) from Svelte actions using regular JavaScript, and pass any data alongside the event.

```svelte:example.svelte showLineNumbers
<script lang="ts">
  function action(element: HTMLElement) {
    element.addEventListener('click', () => {
      element.dispatchEvent(new CustomEvent('banana'))
    })
  }
</script>

<button use:action on:banana={() => console.log('🍌')}>
  Click
</button>
```

That's it! 😄
