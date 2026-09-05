---
title: Understand How Data Flows In SvelteKit
description: Learn how data flows in your SvelteKit app.
slug: sveltekit-data-flow
published: '2023-05-12'
category: sveltekit
---

<script lang="ts">
	import Embed from '#lib/components/embed.svelte'
	import Image from '#lib/components/image.svelte'
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="ampDDmT3TU0" title="SvelteKit Data Flow" />

## Table of Contents

## Introduction

Understanding how data flows through your app in SvelteKit can be confusing because SvelteKit blurs the line between your backend and frontend.

> 🔥 If you want to learn SvelteKit you can watch the [Complete SvelteKit Course For Building Modern Web Apps](https://www.youtube.com/watch?v=MoGkX4RvZ38) on YouTube and [support my work by becoming a patron](https://www.patreon.com/joyofcode).

In another post I wrote about [page versus standalone endpoints in SvelteKit](https://joyofcode.xyz/using-sveltekit-endpoints) if you need a better understanding through examples when to use each.

By the end you should have a clear understanding how data flows through your routes but also how you can pass data around in SvelteKit.

## What Each File Related To Routing Does

Before I start talking about data flow it's important you understand what each file related to routing in SvelteKit does.

SvelteKit uses file-based routing and splits routes in directories where `src/routes/posts/+page.svelte` creates a new `/posts` route.

| File     | Responsibility                          |
| -------- | --------------------------------------- |
| app.html | HTML template SvelteKit uses for routes |

> 🐿️ `app.html` is useful if you need to run some code before the page component mounts, like checking the user's theme from [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) to set a theme.

A page is just a Svelte component. The `load` function inside `+page.ts` runs on the server and client but if you need to use a secret, talk to a database, or write to a file add `.server`, so the `load` function only runs on the server.

> 🐿️ The `+page|layout.svelte` file always has a sibling `+page|layout.ts`, or `+page|layout.server.ts` which does **nothing** on its own because it only provides data for the page through `data`.

| File            | Responsibility                               |
| --------------- | -------------------------------------------- |
| +page.server.ts | Data for `+page.svelte` and form actions     |
| +page.ts        | Data for `+page.svelte`                      |
| +page.svelte    | Page with `export let data` prop from `load` |

Layout wraps around your page using `<slot />` and you can have nested layouts.

Layouts also pass the data to child routes through `export let data`.

Use `+layout.ts` to get the data for the page but if you need to use a secret, talk to a database, or write to a file append `.server` to the file.

| File              | Responsibility                                 |
| ----------------- | ---------------------------------------------- |
| +layout.server.ts | Data for `+layout.svelte` and child routes     |
| +layout.ts        | Data for `+layout.svelte` and child routes     |
| +layout.svelte    | Layout with `export let data` prop from `load` |

A standalone API endpoint named `+server.ts` can return **anything** and can be used by multiple routes. You can export `GET`, `POST`, `PUT`, `PATCH`, `DELETE` functions that map to the same [HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods).

> 🐿️ If you need to send data from the browser to the server it's easier to use [SvelteKit form actions](https://learn.svelte.dev/tutorial/the-form-element).

| File       | Responsibility          |
| ---------- | ----------------------- |
| +server.ts | Standalone API endpoint |

[SvelteKit hooks](https://learn.svelte.dev/tutorial/handle) are functions used to intercept and override the framework's default behavior.

| File            | Responsibility                                                                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| hooks.server.ts | Runs on every **request** and returns **response** but is optional unless you want to modify that **request** and **response** using the `handle` hook |
| hooks.client.ts | Not as useful as **hook.server.ts** but you can use it to catch **unexpected errors** on the frontend with the `handleError` hook                      |

Honorable mention for customizing error pages.

| File          | Responsibility    |
| ------------- | ----------------- |
| +error.svelte | Custom error page |

You can see there's actually not a lot of files in SvelteKit you have to know about.

The `+page|layout.svelte` files paired with `+page|layout.ts` or `+page|layout.server.ts` use `load` functions to get the data for the page with the expection of `+page.server.ts` which can also export form actions.

Files that include `load` functions can also export [page options](https://learn.svelte.dev/tutorial/page-options) to change the rendering method for individual, or multiple routes.

## Understanding The Order In Which Things Run

To understand the order in which things run I've created an example with every file related to SvelteKit routing.

<Embed src="https://stackblitz.com/github/joysofcode/sveltekit-data-flow?ctl=1&embed=1&file=src%2Froutes%2F%2Bpage.svelte&title=SvelteKit Data Flow" title="SvelteKit Data Flow" />

I've included a working example (you have to enable cookies) you can play around with. You can [find the project files on GitHub](https://github.com/joysofcode/sveltekit-data-flow).

I'm using the package `chalk` to style the output in the terminal and browser console with some helper functions I wrote inside `lib/utils/log.ts` but you can use a regular `console.log()` method.

Here is the SvelteKit project structure.

```shell:project structure
src/
src/
├── routes/
│   ├── actions
│   ├── api/secret
│   ├── error
│   ├── locals
│   ├── nested/route
│   ├── redirect
│   ├── stores
│   ├── +error.svelte
│   ├── +layout.server.ts
│   ├── +layout.svelte
│   ├── +layout.ts
│   ├── +page.server.ts
│   ├── +page.svelte
│   └── +page.ts
├── app.html
├── hooks.client.ts
└── hooks.server.ts
```

There's a lot of files, so I'm only going to reference the relevant code here but you can open the example, or look at the project repository.

When you enter a URL in the browser like [https://joyofcode.xyz/](https://joyofcode.xyz/) you're making a `GET` request to the server (SvelteKit).

You can listen to every **request** using the optional `hooks.server.ts` file inside the `handle` function which listens to **requests** and sends a **response** based on the request.

The default behavior is to resolve the request.

```ts:src/hooks.server.ts showLineNumbers
export async function handle({ event, resolve }) {
  return resolve(event)
}
```

> 🐿️ The `event` object is the default argument for `load` functions and functions inside `+server.ts` files. You can send extra data to routes through `event.locals`.

Everything in a SvelteKit app is going to happen in-between the **request** and **response** until the page or resource is ready.

> 🐿️ You can learn more about [SvelteKit hooks through example](https://joyofcode.xyz/sveltekit-hooks).

```ts:src/hooks.server.ts showLineNumbers
import log from '$lib/utils/log'

export async function handle({ event, resolve }) {
	log.bold(`📣 NEW REQUEST IS BEING MADE FROM ${event.url.pathname}`)
	log.hooks('hooks.server.ts')

	const response = await resolve(event)

  log.bold(`🔥 THE PAGE IS READY, I'M SENDING THE RESPONSE`)
  return response
}
```

Start the development server with `npm run dev` and open `http://localhost:5173/`.

First the **server-only** code runs which you can observe in the terminal.

```shell:terminal
📣 NEW REQUEST IS BEING MADE FROM /
hooks.server.ts
+layout.server.ts (load)
+page.server.ts (load)
+layout.ts (load)
+page.ts (load)
+layout.svelte
+page.svelte
🔥 THE PAGE IS READY, I'M SENDING THE RESPONSE
```

As expected the order is:

- `hooks.server.ts`
- `+layout.server.ts`'s `load` function
- `+page.server.ts`'s `load` function
- `+layout.ts`'s `load` function
- `+page.ts`'s `load` function

The server-only files run first, after that other `load` functions, then the layout and pages. This is because pages are rendered twice, once on the server (SSR) and the second time on the client (hydration).

Time to start work in the browser where you can see the order if you look at the browser console inside your developer tools which you can open with <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd>.

```shell:console showLineNumbers
app.html
+layout.ts (load)
+page.ts (load)
+layout.svelte
+page.svelte
```

- `app.html` script runs first
- `+layout.ts`'s `load` function runs
- `+page.ts`'s `load` function runs
- `+layout.svelte` is mounted
- `+page.svelte` is mounted

As you might expect `+layout.ts` should run before `+page.ts` and `+layout.svelte` should be mounted before `+page.svelte`.

If you're curious this is an approximation of how a layout and components work in SvelteKit.

```svelte:example.html showLineNumbers
<Layout {data}>
  <!-- 🔥 if no error render child route -->
  <Page {data} />

  <!-- 💩 if error render nearest `+error.svelte` component -->
  <Error>

  <!-- 🪆 nested layouts -->
  <NestedLayout>
    <!-- ... -->
  <NestedLayout />
</Layout>
```

## SvelteKit Does Server-Side Rendering (SSR) And Client-Side Rendering (CSR)

By default when you open a page for the first time meaning you enter it in the URL and press enter (or refresh a page) SvelteKit is going to server-side render your page meaning it has everything it needs to return the HTML.

This is awesome but if you navigate to another page it would cause a refresh using SSR if you're not using JavaScript for client-side navigation (this is how a multi-page app or MPA like PHP behaves).

To demonstrate this I'm going to type `http://localhost:5173/` in the browser and press enter which should give us what we've seen before.

```shell:terminal
📣 NEW REQUEST IS BEING MADE FROM /
hooks.server.ts
+layout.server.ts (load)
+page.server.ts (load)
+layout.ts (load)
+page.ts (load)
+layout.svelte
+page.svelte
🔥 THE PAGE IS READY, I'M SENDING THE RESPONSE
```

```shell:console showLineNumbers
app.html
+layout.ts (load)
+page.ts (load)
+layout.svelte
+page.svelte
```

When the SvelteKit app loads it's going to initialize a client-side router that uses JavaScript and client-side rendering (CSR) but only does server-side rendering (SSR) when you visit the page for the first time or refresh it.

To demonstrate this I'm going to go to any other route and from there I'm going to navigate to **home** inside the browser which is going to use client-side navigation.

```shell:terminal showLineNumbers
📣 NEW REQUEST IS BEING MADE FROM /
hooks.server.ts
+page.server.ts
🔥 THE PAGE IS READY, I'M SENDING THE RESPONSE
```

```shell:console showLineNumbers
+page.ts
+page.svelte
```

SvelteKit is smart enough to only run the `load` functions it has to and `+layout.svelte` is already mounted, so on navigation the only thing that gets destroyed (unmounted) and created (mounted) is the `+page.svelte` component.

> 🐿️ SvelteKit tucks the data in the HTML page for reuse inside a `<script>` tag. If you look at the page source you can find the JSON for the page data inside `data`. This is your page endpoint that starts with `__data.json` in the network tab and you open it by going to `http://localhost:5173/__data.json`.

You get great SEO because crawlers are going to get SSR'd pages and you can progressiely enhance the user experience with JavaScript but it's not like a pure SPA where your site doesn't work without JavaScript (try opening [Twitter](https://twitter.com/) with JavaScript disabled).

I want to emphasize how the point is not that your site should work **without JavaScript** but **before JavaScript** to be more resilient and use JavaScript to enhance the user experience.

## How Data Is Passed Through Routes

Most of the time you're going to have a `+page|layout.svelte` file and a `+page|layout.ts`, or `+page|layout.server.ts` file for a given route (using one `load` function).

That being said you could have multiple `load` functions if you have `+page|layout.svelte`, `+page|layout.server.ts` and `+page|layout.ts` in which case the **last `load` function always wins**.

The data flows top to bottom:

- `+layout.server.ts`
- `+layout.ts`
- `+layout.svelte`
- `+page.svelte`

This leaves a lot of questions open I want to explore such as "can you pass props down?" and if you can "what happens if you pass a prop with the same name?".

If you open `+page.svelte` at the root I'm showing the value of `export let data` alongside the `$page.data` store on the page, so you can see any changes easily instead of _squinting_ at the console.

> 🐿️ When you navigate to a page that returns data from a `load` function the `$page.data` store is going to be updated, so a parent can access data from a child route.

Let's start with `+layout.server.ts`.

```ts:src/routes/+layout.server.ts showLineNumbers
export async function load() {
	return {
		a: 1,
	}
}
```

This data is now available to `+layout.svelte` and child routes through `export let data`.

If you return the key with the same name from `+layout.ts` since it's the last `load` function that runs it wins and overrides the value.

```ts:src/routes/+layout.ts showLineNumbers
export async function load() {
  return {
    a: 2
  }
}
```

[The SvelteKit docs](https://kit.svelte.dev/docs/load#universal-vs-server) refer to `load` functions that run on the server and browser as **universal** (`+page|layout.ts`) and **server** (`+page|layout.server.ts`) for ones that always run on the server.

This is important because **server `load` functions** return the value which you can get through the `data` argument from **universal `load` functions**.

```ts:src/routes/+layout.ts showLineNumbers
export async function load({ data }) {
  // `data` is the return value of `+layout.server.ts`
  console.log(data) // { a: 1 }
  // return new data
  return {
    ...data,
    b: 2
  }
}
```

On the other hand **server `load`** functions don't have a `data` prop but receive the data from the layout.

```ts:src/routes/+page.server.ts showLineNumbers
export async function load() {
  return {
    c: 3
  }
}
```

The return from the `load` function is going to have the data from the layout and the new prop `{ a: 1, b: 2, c: 3 }`.

You could change everything you received so far, or combine the received data with new data.

```ts:src/routes/+page.ts showLineNumbers
export async function load({ data }) {
  // a) change the props
  return {
    a: 10,
    b: 20,
    c: 30,
  }

  // b) return new data
  return {
    ...data,
    d: 4
  }
}
```

The last `load` function that runs **wins**.

The page output should be the same for `+page.server` data and the `$page.data` store.

```json:data showLineNumbers
{
  "a": 1,
  "b": 2,
  "c": 3,
  "d": 4
}
```

## Accessing Parent Layout Data

You're already familiar how `+page.svelte` and `+layout.svelte` have access to all the data from parent `load` functions but you might want to get data inside a `load` function from a parent **layout** `load` function.

To get the data from a parent layout `load` function you can use `await parent()` inside `load` functions.

If you use `await parent()` in `load` functions for `+page|layout.server.ts` you're going to get the data from a parent `+page|layout.server.ts` `load` function.

```ts:src/routes/nested/route/+page.server.ts showLineNumbers
export async function load({ parent }) {
	// parent `+layout.server.ts` data
	const data = await parent()
	console.log(data) // { a: 1 }
}
```

If you use `await parent()` inside `load` functions for `+page|layout.ts` you're going to get the data from a parent `+page|layout.server.ts` file.

```ts:src/routes/nested/route/+page.ts showLineNumbers
export async function load({ parent }) {
	// parent `+layout.ts` data
	const data = await parent()
	console.log(data) // { a: 1, b: 2 }
}
```

## $app/stores

SvelteKit has some [useful modules](https://kit.svelte.dev/docs/modules) which are just [Svelte stores](https://learn.svelte.dev/tutorial/writable-stores) you can subscribe to and be notified when someting changes.

One of those modules is `$app/stores` which has a `getStores`, `navigating`, `page`, and `updates` exports.

If you navigate to `/error` you can see the entire output for `$page`.

```json:$page showLineNumbers
{
  "params": {},
  "route": {
    "id": "/error"
  },
  "status": 500,
  "url": "http://localhost:5173/error",
  "form": null,
  "data": {
    "a": 1,
    "b": 2
  }
}
```

We can use this to customize the error page.

```svelte:src/routes/+error.svelte. showLineNumbers
<script lang="ts">
	import { page } from '$app/stores'
</script>

<h1>Error</h1>

<p>
	Even though you're on the <b>{$page.url.pathname}</b> route this is not the
	<code>+page.svelte</code> component but the <code>+error.svelte</code> component.
</p>
```

App stores use [Svelte's context API](https://learn.svelte.dev/tutorial/context-api) on the server, so the page you visit is unique to that request to prevent shared state on the server because a server is a long running process which isn't a problem in the browser because you're not sharing state with anyone else.

## Adding Custom Data To A Request

Adding custom data to a request is super useful because you can use `hooks.server.ts` on each request to make sure the user is authenticated and pass the user data to handlers in `+server.ts` and server `load` functions by using the `event.locals` object.

Here is how [Lucia](https://lucia-auth.com/), an authenticaion library for SvelteKit uses it.

```ts:src/hooks.ts showLineNumbers
import { auth } from '$lib/server/lucia'

export async function handle({ event, resolve }) {
	event.locals.auth = auth.handleRequest(event)
	return await resolve(event)
}
```

Now you can use validation methods from `auth` inside `load` functions and `+server.ts` handlers through `locals.auth`.

> 🚨 Careful that you **never** send sensitive information using `event.locals` and only send the information for the user.

Let's say I have a secret route and I only want to show it to the user if the secret is banana, otherwise I'm going to redirect them.

```ts:src/hooks.ts showLineNumbers
export async function handle({ event, resolve }) {
	event.locals.secret = '🍌'
	return await resolve(event)
}
```

If you're using TypeScript update the types in `app.d.ts`.

```ts:src/app.d.ts showLineNumbers
declare global {
	namespace App {
		interface Locals {
      secret: string
    }
	}
}
```

Inside `+page.server.ts` we can check `locals` and show data on the page or redirect the user.

```ts:src/routes/locals/+page.server.ts showLineNumbers
import { redirect } from '@sveltejs/kit'

export async function load({ locals }) {
	if (locals.secret !== '🍌') {
		redirect(307, '/')
	}

	return {
		secret: locals.secret,
	}
}
```

If you navigate to `/locals` you should see the output on the page.

## Standalone Endpoints

So far we didn't talk about standalone endpoints but for a good reason because there's nothing special about them and you can use them if you need the same data in multiple routes, or you're making a REST API you can use inside, or outside your app.

I made a `api/secret/+server.ts` endpoint and I'm curious in what order things run if I navigate to it

```shell:termina showLineNumbers
📣 NEW REQUEST IS BEING MADE FROM /api/secret
hooks.server.ts
+server.ts (GET)
🔥 THE PAGE IS READY, I'M SENDING THE RESPONSE
```

As you can see a standalone API endpoint always runs on the server because you need a server to make a HTTP request. If you look at the network tab it returns a text document but you can return anything you want.

If you want to learn more I wrote about [page versus standalone endpoints in SvelteKit](https://joyofcode.xyz/using-sveltekit-endpoints).

## Form Actions

[SvelteKit form actions](https://learn.svelte.dev/tutorial/the-form-element) are the easiest way to send data from the browser to the server compared to using standalone endpoints because SvelteKit handles everything for you.

By default forms work without JavaScript but you can use the `enhance` [Svelte form action](https://learn.svelte.dev/tutorial/actions) to progressively enhance them.

To use form actions you export an `actions` object from `+page.server.ts`.

```ts:src/routes/actions/+page.server.svelte showLineNumbers
export const actions = {
	async login() {
    // ...
	},
	async register() {
    // ...
	},
}
```

You can use a `form` prop to handle errors but I'm going to keep it simple.

```svelte:src/routes/actions/+page.svelte showLineNumbers
<script lang="ts">
	import { enhance } from '$app/forms'

	export let data
</script>

<h1>Form Actions</h1>

<form method="POST" action="?/login" use:enhance>
	<label for="username">
		<p>Username</p>
		<input type="text" name="username" id="username" />
	</label>

	<label for="password">
		<p>Password</p>
		<input type="password" name="password" id="password" />
	</label>

	<div class="actions">
		<button type="submit">Log In</button>
		<button type="submit" formaction="?/register">Register</button>
	</div>
</form>
```

First we navigate to the `/actions` page where you can see the usual suspects.

```shell:terminal showLineNumbers
📣 NEW REQUEST IS BEING MADE FROM /actions
hooks.server.ts
/forms/+page.server.ts (load)
🔥 THE PAGE IS READY, I'M SENDING THE RESPONSE
```

```shell:console showLineNumbers
/forms/+page.svelte
```

Let's see what happens when you submit the form.

```shell:terminal showLineNumbers
📣 NEW REQUEST IS BEING MADE FROM /actions
hooks.server.ts
LOGIN ACTION: http://localhost:5173/actions?/login
🔥 THE PAGE IS READY, I'M SENDING THE RESPONSE
📣 NEW REQUEST IS BEING MADE FROM /actions
hooks.server.ts
/forms/+page.server.ts (load)
+layout.server.ts (load)
🔥 THE PAGE IS READY, I'M SENDING THE RESPONSE
```

```shell:console showLineNumbers
+layout.ts (load)
```

- a new request is made to `/actions` (you could log the type of request but you can only use a `POST` request when using form actions)
- as you can see a form action is just a URL that invokes an action
- you can replace "PAGE" with "RESOURCE" in this case
- SvelteKit is going to invalidate the data which fires another request
- the `load` functions for `/forms/+page.server.ts` and `src/routes/+layout.server.ts` are going to rerun to update the data
- you don't see `+page.svelte` because it's already mounted

That's it! 😄

By the way don't sweat the details because this is a lot to take in at once. The important thing to take away from this is that you have a general idea how data flows in SvelteKit to help you build your next idea.

## SvelteKit Data Flow Cheat Sheet

I made an awesome SvelteKit data flow cheat sheet to go over what we learned which should be helpful.

<Image src="sveltekit-data-flow.png" alt="Sveltekit data flow" />

You can get the SVG version of the SvelteKit data flow cheat sheet as a light or dark version:

- [SvelteKit Data Flow (Light)](https://raw.githubusercontent.com/mattcroat/joy-of-code/main/posts/sveltekit-data-flow/cheatsheet/sveltekit-data-flow-light.svg)
- [SvelteKit Data Flow (Dark)](https://raw.githubusercontent.com/mattcroat/joy-of-code/main/posts/sveltekit-data-flow/cheatsheet/sveltekit-data-flow-dark.svg)

I hope this helped you understand how data flows in SvelteKit and answered any questions you might have.

There's always more than one way of doing things, so don't concern yourself with the "right way" of doing things and go make some happy accidents.
