---
title: Svelte Actions Make Svelte The Best JavaScript Framework
description: Svelte actions are the most underrated and powerful feature of Svelte which sets it apart from other JavaScript frameworks.
slug: svelte-actions-guide
published: '2023-10-06'
category: svelte
---

<script lang="ts">
	import Embed from '#lib/components/embed.svelte'
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="LGOqg0Y7sAc" title="Svelte Actions" />

## Table of Contents

## Svelte Actions

> ⚠️ Svelte actions are now replaced by [attachments](https://joyofcode.xyz/svelte-attachments-explained). You can still use actions, but they are not recommended anymore and might be deprecated in the future.

[Svelte actions](https://svelte.dev/docs/svelte-action) are just regular JavaScript functions that are called when an element is created, and give you a reference to the element itself, so you can attach any behavior to that element using regular JavaScript.

<Embed src="https://stackblitz.com/github/joysofcode/svelte-actions?ctl=1&embed=1&file=src%2Froutes%2F%2Bpage.svelte&title=Svelte Actions Guide" title="Svelte Actions Guide" />

You can find the repo with the examples on [GitHub](https://github.com/joysofcode/svelte-actions).

```svelte:example.svelte showLineNumbers
<script lang="ts">
	function greet(element: HTMLElement) {
		// logs when element is created
		console.log('hi')

    // do whatever you want
    element.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 300,
      fill: 'forwards',
    })

		return {
			destroy() {
				// logs when element is removed
				console.log('bye')
			}
		}
	}

	let show = false
</script>

<input bind:checked={show} type="checkbox" />

{#if show}
	<div use:greet>
		Action
	</div>
{/if}
```

You can optionally return a `destroy` method after the element is removed for cleanup, and an `update` method for updating the parameters.

```svelte:example.svelte showLineNumbers
<script lang="ts">
	function greet(element: HTMLElement, content: string) {
    // ...
		return {
			update(content: string) {
				// the value of content has changed
				console.log({ content })
			},
		}
	}

	let content = ''
	let show = false
</script>

<!-- bind input value to `content` -->
<input bind:checked={show} type="checkbox" />

<!-- run `update` when `content` updates  -->
<div use:greet={content}>
	Action
</div>
```

You can also dispatch [custom events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) using Svelte actions.

```svelte:.example.svelte showLineNumbers
<script lang="ts">
	function greet(element: HTMLElement) {
		const greetEvent = new CustomEvent('greet', { detail: 'hi' })
		element.dispatchEvent(greetEvent)
	}

	function handleGreet(event) {
		console.log(event.detail) // "hi"
	}
</script>

<div
  on:greet={handleGreet}
  use:greet
>
	Action
</div>
```

> 🐿️ The order is important if you want to dispatch the event when the element is created. You have to add the `on:greet` event listener first, and then use the `use:greet` action.

You can use Svelte actions for anything from [using JavaScript libraries in Svelte](https://joyofcode.xyz/using-javascript-libraries-in-svelte) to [Sveltifying existing JavaScript libraries](https://joyofcode.xyz/sveltify-any-javascript-library).

Svelte actions only work with JavaScript enabled, and **don't** run on the server.

Let's go over some examples first, and then I'm also going to show you how to type your actions if you're using TypeScript.

## Tooltip Action

The next example uses [Tippy.js](https://atomiks.github.io/tippyjs/) to make a reusable tooltip with Svelte actions.

```svelte:src/routes/tooltip/+page.svelte showLineNumbers
<script lang="ts">
  import tippy, { type Props } from 'tippy.js'
  import 'tippy.js/dist/tippy.css'

  type Options = Partial<Props>

  let content = 'Tooltip'

  function tooltip(element: HTMLElement, options: Options) {
    // create tooltip
    const tooltip = tippy(element, options)

    return {
      update(options: Options) {
        // update options
        tooltip.setProps(options)
      },
      destroy() {
        // cleanup
        tooltip.destroy()
      },
    }
  }
</script>

<input bind:value={content} />

<button use:tooltip={{ content }}>Hover</button>
```

There is nothing wrong with using a `<Tooltip />` component if you want but in this case a Svelte action makes more sense because it gives you a direct reference to the element and avoids the `onMount` and `bind` directive boilerplate.

## Click Outside Action

Most of the time you're going to need a simple action where you need a bit of JavaScript to do something like knowing when a user clicks outside of an element.

```svelte:src/routes/modal/+page.svelte showLineNumbers
<script lang="ts">
  import { scale } from 'svelte/transition'
  import type { Action } from 'svelte/action'

  type Attributes = {
    'on:outside'?: (event: CustomEvent) => void
  }
  type clickOutsideAction = Action<HTMLElement, any, Attributes>

  let open = false

  function openModal() {
    open = true
  }

  function closeModal() {
    open = false
  }

  const clickOutside: clickOutsideAction = (element) => {
    function handleClick(event: MouseEvent) {
      const targetEl = event.target as HTMLElement

      if (element && !element.contains(targetEl)) {
        const clickOutsideEvent = new CustomEvent('outside')
        element.dispatchEvent(clickOutsideEvent)
      }
    }

    document.addEventListener('click', handleClick, true)

    return {
      destroy() {
        document.removeEventListener('click', handleClick, true)
      },
    }
  }
</script>

{#if open}
  <div class="background">
    <div
      class="modal"
      on:outside={closeModal}
      use:clickOutside
      transition:scale
    >
      <h2>Modal</h2>
      <p>What's up?</p>
    </div>
  </div>
{/if}

<button on:click={openModal}>
  Open
</button>

<style>
  .background {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;

    & .modal {
      width: 400px;
      min-height: 300px;
      padding: 2rem;
      background-color: hsl(200 10% 10% / 80%);
      backdrop-filter: blur(20px);
      border: 1px solid hsl(200 10% 12%);
      border-radius: 8px;
      box-shadow: 1px 1px 10px hsl(0 0% 0% / 20%);

      & p {
        margin-top: 1rem;
      }
    }
  }
</style>
```

> 🐿️ If you're making a modal you should use the [dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) element instead.

You can close the modal ny dispatching and listening for a custom `on:outside` event on the modal, and the logic isn't tied to that specific modal, so we can reuse the `use:clickOutside` action on any element.

Knowing how to make a quick Svelte action like this is always useful, regardless if you need to know if a user clicked outside of an element, or if you need to [know if an element is sticky](https://twitter.com/branmcconnell/status/1709670088344060303).

## Text Animation Action

The next example uses the JavaScript animation library [Motion One](https://motion.dev/) to create a reusable `use:text` Svelte action to create elements as letters from any text, and animate it on the screen.

```svelte:src/routes/motion/+page.svelte showLineNumbers
<script lang="ts">
  import { animate, stagger, type AnimationOptions, type AnimationControls } from 'motion'
  import type { Action } from 'svelte/action'

  type Options = {
    options?: AnimationOptions
    action?: ({ animation }: { animation: AnimationControls }) => void
  }
  type Attributes = {
    'on:finished'?: (event: CustomEvent) => void
  }
  type TextAction = Action<HTMLElement, Options, Attributes>

  const text: TextAction = (element, { options, action }) => {
    // remove whitespace and split letters
    const letters = element.innerText.trim().split('')

    // remove any text
    element.innerHTML = ''

    // create an element for every letter
    letters.forEach((letter) => {
      element.innerHTML += `
        <span class="letter">
          ${letter}
        </span>
      `
    })

    // animate the letters
    const animation = animate(
      [...element.children],
      {
        color: 'orangered',
        y: [0, 30, -60, 0],
        rotate: 360,
      },
      { duration: 1, delay: stagger(0.1), ...options }
    )

    // invoke callback
    if (action) {
      action({ animation })
    }

    // dispatch event when animation is finished
    animation.finished.then(() => {
      element.dispatchEvent(new CustomEvent('finished'))
    })
  }

  let controls: AnimationControls
  let time = 0

  $: if (controls) {
    controls.currentTime = time
  }
</script>

<h1
  on:finished={() => console.log('finished')}
  use:text={{
    options: { duration: 2 },
    action({ animation }) {
      animation.stop()
      controls = animation
    },
  }}
>
  Svelte
</h1>

{#if controls}
  <input
    bind:value={time}
    type="range"
    min={0}
    max={controls.duration + 0.6}
    step={0.01}
  />
{/if}
```

Here we use a `action` callback to get a reference to `animation` which we use to scrub through the animation.

## Progressive Form Enhancement Action

Svelte actions are great for progressive enhancement.

SvelteKit already has an [action for progressive form enhancement](https://kit.svelte.dev/docs/form-actions#progressive-enhancement-use-enhance) but here is how it works.

```svelte:src/routes/forms/+page.svelte showLineNumbers
<script lang="ts">
  // please use this instead
  // import { enhance } from '$app/forms'

  type Submit = (params: SubmitParams) => void
  type SubmitParams = {
    formElement: HTMLFormElement
    formData: FormData
  }

  function enhance(formEl: HTMLFormElement, submit: Submit) {
    async function handleSubmit(e: SubmitEvent) {
      // prevent default form submit
      e.preventDefault()

      // get the submitted form data
      const data = new FormData(formEl)

      // hit the endpoint at forms/+page.server.ts
      const response = await fetch(formEl.action, {
        method: formEl.method,
        body: data,
      })

      // get the response as JSON
      console.log(await response.json())

      // invoke callback
      submit({ formElement: formEl, formData: data })
    }

    // add event listener
    formEl.addEventListener('submit', handleSubmit)

    return {
      destroy() {
        // cleanup
        formEl.removeEventListener('submit', handleSubmit)
      },
    }
  }
</script>

<form
  method="POST"
  use:enhance={({ formElement, formData }) => {
    console.log(formElement, formData)
  }}
>
  <input name="value" type="text" />
  <button>Submit</button>
</form>

<style>
  form {
    display: grid;
    gap: 1rem;
  }
</style>
```

Thanks to passing the `submit` callback to the Svelte action, we can get the current `<form>` element and form data, or whatever else you want.

## Svelte Actions Examples

Here is a list of some great libraries and set of utilities that use Svelte actions you can use and learn from.

Libraries:

- [Neocodemirror](https://github.com/PuruVJ/neocodemirror)
- [Neodrag](https://github.com/puruvj/neodrag)
- [Neoconfetti](https://github.com/PuruVJ/neoconfetti)
- [Flatpickr](https://github.com/kodaicoder/svelte-flatpickr-plus)
- [Maskify](https://github.com/Hugos68/svelte-maskify)

Utils:

- [Svelte actions](https://github.com/swyxio/svelte-actions)
- [Svelte UX](https://github.com/techniq/svelte-ux)
