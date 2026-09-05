---
title: Make A Svelte GUI Library To Generate The UI For You
description: Learn how to use Svelte to declaratively generate a GUI with controls based on the values you give it for instant feedback when changing the UI.
slug: svelte-gui
published: '2023-10-20'
category: svelte
---

<script lang="ts">
	import Embed from '#lib/components/embed.svelte'
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="LaQc5UWe0mE" title="Svelte GUI" />

## Table of Contents

## What Is A GUI Library?

You have probably seen [Tweakpane](https://cocopon.github.io/tweakpane/), or [dat.GUI](https://github.com/dataarts/dat.gui) on [CodePen](https://codepen.io/) as it's an awesome and quick way to create knobs to control the UI.

<Embed src="https://stackblitz.com/github/joysofcode/svelte-gui?ctl=1&embed=1&file=src%2Froutes%2F%2Bpage.svelte&title=Svelte GUI" title="Svelte GUI" />

The code is available on [GitHub](https://github.com/joysofcode/svelte-gui).

In Svelte we can use the `bind:` directive to bind a value of an input to a variable.

```svelte:example.svelte showLineNumbers
<script lang="ts">
  let cx = 200
  let cy = 200
  let r = 100
  let fill = '#00ffff'
</script>

<label>
  <span>X</span>
  <input bind:value={cx} min="0" max="100" step="0.1" type="range" />
</label>

<label>
  <span>Y</span>
  <input bind:value={cy} min="0" max="100" step="0.1" type="range" />
</label>

<svg width="800" height="800" viewBox="0 0 400 400">
  <circle {cx} {cy} {r} {fill} />
</svg>
```

Imagine having more controls besides the `x` and `y` coordinates, and having to create a binding and the corresponding markup for each one.

The largest insult to me is that we're writing disposable code that is only meant to try out things.

This is tedious! 😅

Instead of doing this nonsense yourself, I would prefer to describe the values and let our GUI library figure out the rest.

## Creating The GUI Store

I want Svelte GUI to be simple, and interpret the type of input based on the value.

```svelte:+page.svelte showLineNumbers
<script lang="ts">
  const gui = {
    x: 200,
    y: 200
  }
</script>
```

I'm going to use a `writable` Svelte store to make the values reactive. You can read, or watch the [Svelte stores guide](https://joyofcode.xyz/svelte-stores-guide) if you're not familiar with stores.

```svelte:+page.svelte showLineNumbers
<script lang="ts">
  import { writable } from 'svelte/store'

  const gui = writable({
    x: 200,
    y: 200
  })
</script>
```

The user shouldn't care about implementation details like stores, so I'm going to create a `store.ts` file and export a `guiControls` function.

```ts:src/lib/gui/store.ts showLineNumbers
import { writable } from 'svelte/store'

export function guiControls(values: any) {
	return writable(values)
}
```

I'm going to create a `gui.svelte` component, which takes a store prop named `controls`, and export everything from a `index.ts` file.

```svelte:src/lib/gui/gui.svelte showLineNumbers
<script lang="ts">
  export let controls
</script>
```

```ts:src/lib/gui/index.ts showLineNumbers
import GUI from './gui.svelte'
import { guiControls } from './store'

export { GUI, guiControls }
```

## Creating The GUI Inputs

I'm going to use `Object.entries($controls)`, which returns an array of `[key, value]` pairs from an object.

```svelte:src/lib/gui/gui.svelte {4} showLineNumbers
<script lang="ts">
  export let controls

  const entries: any = Object.entries($controls)
  const isNotEmpty = entries.length > 0
</script>
```

This is great because we can destructure `['x', 200]` as `[label, value]`, which you can name anything, but I'm going to use the object key as the label description.

```svelte:src/lib/gui/gui.svelte {5} showLineNumbers
<script lang="ts">
  export let controls

  const entries: any = Object.entries($controls)
  const isNotEmpty = entries.length > 0
</script>

{#if isNotEmpty}
  <div class="gui">
    {#each entries as [label, value]}
      <!-- ... -->
    {/each}
  </div>
{/if}
```

I'm going to create an `is` object, with methods to check what type of `value` has been passed since the value can be anything.

```svelte:src/lib/gui/gui.svelte showLineNumbers
<script lang="ts">
  <!-- ... -->
  const is = {
    number: (value: any) => typeof value === 'number',
    boolean: (value: any) => typeof value === 'boolean',
    text: (value: any) => typeof value === 'string' && !value.startsWith('#'),
    color: (value: any) => typeof value === 'string' && value.startsWith('#'),
    range: (value: any) => typeof value === 'object',
  }
</script>
```

Cool beans! 🫘

Let's add the inputs and event listeners. I want to listen for the `change` and `wheel` event on the input to use the mouse scroll wheel to update the values.

```svelte:src/lib/gui/gui.svelte showLineNumbers
<script lang="ts">
  <!-- ... -->
  function updateControls(e: Event) {
    // ...
  }
</script>

{#if isNotEmpty}
  <div class="gui">
    {#each entries as [label, value]}
      {#if is.number(value)}
        <label>
          {label}
          <input
            on:change={updateControls}
            on:wheel={updateControls}
            value={$controls[label]}
            data-key={label}
            type="number"
          />
        </label>
      {/if}

      {#if is.boolean(value)}
        <label>
          {label}
          <input
            on:change={updateControls}
            data-key={label}
            checked={$controls[label]}
            type="checkbox"
          />
        </label>
      {/if}

      {#if is.text(value)}
        <label>
          {label}
          <input
            on:input={updateControls}
            data-key={label}
            value={$controls[label]}
            type="text"
          />
        </label>
      {/if}

      {#if is.range(value)}
        <label>
          {label}
          <input
            on:input={updateControls}
            on:wheel={updateControls}
            data-key={label}
            value={$controls[label].value}
            min={$controls[label].min}
            max={$controls[label].max}
            step={$controls[label].step}
            type="range"
          />
        </label>
      {/if}

      {#if is.color(value)}
        <label>
          {label}
          <input
            on:input={updateControls}
            value={$controls[label]}
            data-key={label}
            type="color"
          />
        </label>
      {/if}
    {/each}
  </div>
{/if}
```

## Updating The GUI

The `updateControls` function is used to update the store.

```svelte:src/lib/gui/gui.svelte showLineNumbers
<script lang="ts">
  function updateControls(e: Event) {
    // slurp up the values
    let { value, type, dataset, checked, step, min, max } = e.target as HTMLInputElement
    // key used to access store value
    let key = dataset.key!

    switch (type) {
      case 'range':
        if (e.type === 'wheel') {
          // get mouse wheel scroll direction
          let direction = (e as WheelEvent).deltaY < 0 ? 'up' : 'down'

          if (direction === 'up') {
            // respect the `max` value
            $controls[key].value < max && ($controls[key].value += +step)
          } else {
            // respect the `min` value
            $controls[key].value > min && ($controls[key].value -= +step)
          }
        } else {
          // update `.value` on the object
          $controls[key].value = +value
        }
        break

      case 'checkbox':
        $controls[key] = checked
        break

      case 'number':
        $controls[key] = +value
        break

      default:
        $controls[key] = value
    }
  }
</script>
```

## Subscribing To Updates

You can `subscribe` to the store, or use a [reactive statement](https://learn.svelte.dev/tutorial/reactive-statements) inside Svelte components, if you want to do something when a value changes.

```svelte:+page.svelte showLineNumbers
<script lang="ts">
  import { GUI, guiControls } from '$lib/gui'

  const gui = guiControls({ x: 200, y: 200 })

  gui.subscribe(({ x, y }) => {
    // runs when store updates
    console.log({ x, y })
  })

  $: if($gui.x) {
    // runs when `x` updates
    console.log($gui.x)
  }

  $: {
    // runs when `x` updates
    console.log($gui.x)
  }
</script>
```

## Styling The GUI

You can expose [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) if you plan to release a library to let the user control the look and position of the element.

```svelte:src/lib/gui/gui.svelte showLineNumbers
<!-- ... -->
<style>
  .gui {
    position: absolute;
    top: var(--gui-position-top, 40px);
    right: var(--gui-position-right, 40px);
    bottom: var(--gui-position-bottom);
    left: var(--gui-position-left);
    display: grid;
    gap: 1.5rem;
    padding: 1rem;
    color: var(--gui-txt-clr, hsl(220 10% 80%));
    background-color: var(--gui-bg-clr, hsl(220 10% 14%));
    border: 1px solid hsl(220 10% 18%);
    border-radius: 8px;
    box-shadow: 1px 1px 10px hsl(0 0% 0% / 10%);

    & label {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
      align-items: center;
      justify-items: start;
      font-weight: 700;

      &:not(:last-child) {
        padding-block-end: 1.5rem;
        border-bottom: 1px solid hsl(220 10% 20%);
      }

      & input:not([type='checkbox']) {
        width: 80px;
        height: 40px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
</style>
```

## Svelte GUI Example

Here is how you can use Svelte GUI.

```svelte:+page.svelte showLineNumbers
<script lang="ts">
  import { GUI, guiControls } from '$lib/gui'

  const gui = guiControls({
    x: 200,
    y: 200,
    radius: 100,
    color: '#17191c',
    stroke: '#00ffcc',
    size: 4,
    dash: { value: 0, min: 0, max: 1.1, step: 0.01 },
    offset: { value: 0, min: 0, max: 1.1, step: 0.01 },
  })
</script>

<GUI controls={gui} />

<svg width="800" height="800" viewBox="0 0 400 400">
  <circle
    cx={$gui.x}
    cy={$gui.y}
    r={$gui.radius}
    fill={$gui.color}
    stroke={$gui.stroke}
    stroke-width={$gui.size}
    stroke-dasharray={$gui.dash.value}
    stroke-dashoffset={$gui.offset.value}
    pathLength="1"
  />
</svg>
```

That's it! 😄
