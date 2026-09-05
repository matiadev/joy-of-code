---
title: Progressive Form Enhancement With SvelteKit
description: Progressively enhance your forms in SvelteKit for a better user experience.
slug: sveltekit-progressive-enhancement
published: '2022-11-28'
category: sveltekit
---

<script lang="ts">
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="6pv70d7i-3Q" title="Progressive Form Enhancement With SvelteKit" />

## Table of Contents

## How Do Forms Work?

By the end of this post you're going to learn how to use progressive enhancement in SvelteKit and understand the history that led us here.

> 🧪 You can find the code on [GitHub](https://github.com/joysofcode/sveltekit-progressive-enhancement) or try it on [StackBlitz](https://stackblitz.com/github/joysofcode/sveltekit-progressive-enhancement).

Do you know the default behavior of a form?

I encourage you to try it out yourself inside a SvelteKit project and see what happens.

```svelte:+page.svelte showLineNumbers
<form>
  <input type="email" name="email" />
  <input type="password" name="password" />
  <button type="submit">Login</button>
</form>
```

You might be surprised to learn the browser already knows how to send and process the form data.

If you used any modern frontend JavaScript framework in the last couple of years you probably forgot how forms work.

JavaScript was meant to enhance the user experience but instead it became mandatory using [`event.preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) that prevents the default form behavior and puts reimplementing the browser behavior on you.

```svelte:routes/+page.svelte showLineNumbers
<script lang="ts">
  async function handleSubmit(event: SubmitEvent) {
    const form = event.target as HTMLFormElement
    const data = new FormData(form)

    await fetch(form.action, {
      method: form.method,
      body: data,
      // optional, the browser can handle this 😎
      // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#body
      // headers: { 'Content-Type': 'form-data' },
    })
  }
</script>

<form
  method="POST"
  action="/api/login"
  on:submit|preventDefault={handleSubmit}
>
  <label>
    <span>Email</span>
    <input type="email" name="email" />
  </label>

  <label>
    <span>Password</span>
    <input type="password" name="password" />
  </label>

  <button type="submit">Login</button>
</form>
```

```ts:routes/api/login/+server.ts showLineNumbers
import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

// https://kit.svelte.dev/docs/routing#server
export const POST: RequestHandler = async ({ request }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  // do whatever you want
  console.log(data)

  redirect(303, '/')
}
```

Progressive enhancement is popularized and championed by web frameworks like [Remix](https://remix.run/) and [SvelteKit](https://kit.svelte.dev/) where they give you the best of both worlds by having a form work without JavaScript and then if JavaScript is available on the page they use client-side rendering.

This is possible because these frameworks combine the frontend and backend and give you control over both where you can have an endpoint for a form.

## Svelte Actions To The Rescue

The previous code is a bit tedious to write for every form, so you can use [Svelte actions](https://learn.svelte.dev/tutorial/actions) to make it more reusable.

```ts:src/lib/form.ts showLineNumbers
export function enhance(form: HTMLFormElement) {
  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault()

    const data = new FormData(form)

    await fetch(form.action, {
      method: form.method,
      body: data,
    })
  }

  form.addEventListener('submit', handleSubmit)

  return {
    destroy: () => {
      form.removeEventListener('submit', handleSubmit)
    },
  }
}
```

```svelte:+page.svelte {2, 8} showLineNumbers
<script lang="ts">
  import { enhance } from '$lib/form'
</script>

<form
  method="POST"
  action="/api/login"
  use:enhance
  >
  <label>
    <span>Email</span>
    <input type="email" name="email" />
  </label>

  <label>
    <span>Password</span>
    <input type="password" name="password" />
  </label>

  <button type="submit">Login</button>
</form>
```

This is a slight improvement but you also have to invalidate the page data and handle errors but thanks to SvelteKit you don't have to do this work.

## Use The Web Platform

SvelteKit makes working with forms easy with [form actions](https://kit.svelte.dev/docs/form-actions).

Instead of using a standalone endpoint use a page endpoint `+page.server.ts` file alongside `+page.svelte`.

```ts:+page.server.ts {12-22} showLineNumbers
import { redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

let count = 0

// SvelteKit is going to rerun the `load` function and invalidate the data
export const load: PageServerLoad = () => {
  console.log('+page.svelte load function')
  return { count: count += 1 }
}

export const actions: Actions = {
  login: async ({ request }) => {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)

    // do whatever you want
    console.log(data)

    redirect(303, '/')
  },
}
```

Try using the form without JavaScript! After you're done add progressive enhancement from SvelteKit.

```svelte:+page.svelte {2, 9-13} showLineNumbers
<script lang="ts">
  import { enhance } from '$app/forms'
  import type { PageServerData } from './$types'

  export let data: PageServerData
  $: console.log(data.count)
</script>

<form
  method="POST"
  action="?/login"
  use:enhance
>
  <label>
    <span>Email</span>
    <input type="email" name="email" />
  </label>

  <label>
    <span>Password</span>
    <input type="password" name="password" />
  </label>

  <button type="submit">Login</button>
</form>
```

That's it! 🔥

SvelteKit also makes [validating form errors](https://kit.svelte.dev/docs/form-actions#anatomy-of-an-action-validation-errors) and redirecting simple which I'm going to cover in a future post.

You can also learn how to customize this behavior and manage pending UI state in the [SvelteKit docs](https://kit.svelte.dev/docs/form-actions#progressive-enhancement).

```svelte:+page.svelte showLineNumbers
<form
  method="POST"
  use:enhance={({ form, data, action, cancel }) => {
    // `form` is the `<form>` element
    // `data` is its `FormData` object
    // `action` is the URL to which the form is posted
    // `cancel()` will prevent the submission

    return async ({ result, update }) => {
      // `result` is an `ActionResult` object
      // `update` is a function which triggers the logic that would be triggered if this callback wasn't set
    }
  }}
>
```

The action provided by SvelteKit looks a lot like the Svelte action from before doesn't it? 😉
