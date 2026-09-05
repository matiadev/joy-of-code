---
title: Avoid Sharing Server And Client State In SvelteKit
description: Learn how to avoid leaking user data and safely share state from the server between components in SvelteKit.
slug: avoid-sharing-server-and-client-state-in-sveltekit
published: '2024-11-30'
category: sveltekit
---

<script lang="ts">
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="0Sf1Q0eSJnw" title="Avoid Leaking User Data In Your SvelteKit App" />

## Table of Contents

## Sharing Server And Client State In SvelteKit

Frontend developers aren't used to working with a server, which makes it more confusing when they start using a meta-framework like SvelteKit that blurs the line between the server and client.

One thing I often see people ask is if you can share the page data returned from a `load` function between unrelated components in SvelteKit:

```ts:routes/user/+page.ts
export async function load() {
  // this data can be from anywhere
  return { user }
}
```

For example, you might have some deeply nested components in the same route where you don't want to manually pass the props:

```svelte:routes/user/+page.svelte
<script lang="ts">
  let { data } = $props()
</script>

<!-- nested components -->
<A user={data.user} >
  <B {user}>
    <C {user}>
      <D {user} />
    </C>
  </B>
</A>
```

Another example might be that you want to access the data in some unrelated component like `<Avatar>` inside the header:

```svelte:routes/+layout.svelte
<script lang="ts">
  // ...how can we get the user data?
</script>

<header>
  <Avatar user={data.user} />
</header>
```

You might get the idea to use reactive state to solve the problem by updating the value on the server and accessing it in your components:

```ts:routes/user/+page.ts
// using runes for reactivity
import { user } from '$lib/user.svelte'

export async function load() {
  // ⛔️ don't do this
  user.set(user)
}
```

In this post, I'm going to explain why sharing state between the server and client is unsafe and show you how to safely do it.

## The Difference Between Server And Client State

First we need to understand the difference between server and client state, so let's return some data from a `load` function in `+page.ts`:

```ts:routes/user/+page.ts
let id = 0

// outputs 'hi' on the server and client
console.log('hi')

export async function load() {
  id++
  const user = { id, name: `user-${id}` }
  return { user }
}
```

If you refresh the page in the browser, you're going to see a flash of the `user` value from the server, before it's updated to the initial value on the client during hydration.

Unlike `+page.server.ts`, the `load` function inside `+page.ts` runs both on the server and client so, the state is unique between them.

> 🐿️ `+page.ts` gives you access to URL state among other things and can be used for a SPA if you're not using SSR — you can even pass data from `+page.server.ts` to `+page.ts` using `event.data` to do something before you navigate to the page, like loading an image.

Servers are stateless, kind of since there are cookies, but they're just a long-running process, so if we update `id` it's going to persist in memory until we restart the server — on the client side the `id` is always `1` after `id++` if you refresh the page because the state doesn't persist between page reloads.

## Avoid Shared State On The Server

The reason why having state at the top of the module is unsafe is because anyone can read or change the data from another user.

I'm going to get the user data from the URL at [http://localhost:5173/example?id=1&name=jojo](http://localhost:5173/example?id=1&name=jojo) to make it simple, but usually this would come from a database or an API:

```ts:routes/user/+page.ts
let user = {}

export async function load({ url }) {
	user = {
		id: url.searchParams.get('id'),
		name: url.searchParams.get('name'),
	}

  // this gives us enough time to see the problem
	await new Promise((resolve) => setTimeout(resolve, 4000))

  return { user }
}
```

If you open [http://localhost:5173/example?id=1&name=jojo](http://localhost:5173/example?id=1&name=jojo) in a regular tab and [http://localhost:5173/example?id=2&name=dio](http://localhost:5173/example?id=2&name=dio) inside an incognito tab, you'll see that **if you reload the regular tab, and incognito tab after, the regular tab is going to show the data from the incognito tab for a moment** before the client state is updated.

**This gets even worse if you disable JavaScript** in the regular tab because the `load` function won't run on the client and update the user, which can happen due to a bad network connection or a slow response from the server.

In general, you should avoid using shared state on the server because it's
shared by everyone accessing the page.

## Avoid Side Effects In Load Functions

Naturally, you might try using reactive state as a potential solution to the problem:

```ts:lib/user.svelte.ts
type User = { id: number | null; username: string | null }

// using a reactive Proxy
export const user = $state<User>({ id: null, username: null })
```

In theory, instead of returning `user` you only have to update the state and now you can access it in your component:

```ts:routes/user/+page.ts
import { user } from '$lib/user.svelte'

export async function load({ url }) {
  // ⛔️ don't do this
	user.id = url.searchParams.get('id')
	user.name = url.searchParams.get('name')

  // this gives us enough time to see the problem
  await new Promise((resolve) => setTimeout(resolve, 4000))
}
```

You can access the `user` data in an unrelated `<Avatar>` component, for example:

```svelte:lib/Avatar.svelte
<script lang="ts">
	import { user } from '$lib/user.svelte'
</script>

<div class="avatar">
  <div class="id">{user.id}</div>
  <div class="name">{user.name}</div>
</div>
```

It works, but it's only abusing the fact the `load` function runs on the server and client to sync the state between them, which is unsafe like the previous example.

## Always Return The Data From Load Functions

**You should always return the data from a `load` function** and pass it to components that need it:

```ts:routes/user/+page.ts
export async function load({ url }) {
  const user = {
    id: url.searchParams.get('id'),
    name: url.searchParams.get('name'),
  }
  return { user }
}
```

```svelte:routes/user/+page.svelte
<script lang="ts">
  import Avatar from '$lib/Avatar.svelte'

	let { data } = $props()
</script>

<Avatar user={data.user} />
```

There are other methods you can use to pass the data returned from `load` functions around components we're going to explore next.

## Using The Page Store To Access Data From Load Functions

You can use the `page` store from SvelteKit to access the page data returned from `load` functions in the current route and the parent layout.

Data returned from the `load` function becomes available in the `data` property of the page store:

```ts:routes/user/+page.ts
export async function load({ url }) {
  const user = {
    id: url.searchParams.get('id'),
    name: url.searchParams.get('name'),
  }
  return { user }
}
```

You can easily access the page data in a nested component:

```svelte:lib/Avatar.svelte
<script lang="ts">
  import { page } from '$app/stores'
</script>

<div class="avatar">
  <div class="id">{$page.data.user.id}</div>
  <div class="name">{$page.data.user.name}</div>
</div>
```

You can also access the page data from a parent layout:

```svelte:routes/+layout.svelte
<script lang="ts">
  import Avatar from '$lib/Avatar.svelte'
  import { page } from '$app/stores'
</script>

<header>
  <Avatar user={$page.data.user} />
<header>
```

## Using The Context API To Safely Pass Page Data

SvelteKit uses the Context API on the server to safely scope state to the component tree. You can create your own `page` store like SvelteKit by using the Context API to safely pass data to child components.

> 🐿️ SvelteKit uses stores, which is an older system of reactivity until they update it, but we're using [Svelte 5 runes](https://svelte.dev/docs/svelte/what-are-runes) for reactivity.

Let's get the user data from the layout `load` function higher up in the component tree so we can access it in the layout:

```ts:routes/+layout.ts
export async function load({ url }) {
	const user = {
		id: url.searchParams.get('id'),
		name: url.searchParams.get('name'),
	}
	return { user }
}
```

Then you can set the context higher up in the parent layout and access the context in a child component:

```svelte:routes/+layout.svelte
<script lang="ts">
	import { setContext } from 'svelte'

	let { data } = $props()

  // create signal
	let user = $state(data.user)

	$effect(() => {
    // update signal when data changes
    user.id = data.user.id
    user.name = data.user.name
	})

  // set context with reactive state
	setContext('user', user)
</script>
```

Let's say you're using the `<Avatar>` component inside `/user/+page.svelte`, so now you can access the context inside of it:

```svelte:lib/Avatar.svelte
<script lang="ts">
	import { getContext } from 'svelte'

	const user = getContext<{ id: string; name: string }>('user')
</script>

<div class="avatar">
	<div class="id">{user.id}</div>
	<div class="name">{user.name}</div>
</div>
```

If you're not using SSR this is not a problem, but [the docs recommend you avoid keeping state in a shared module](https://svelte.dev/docs/kit/state-management#Using-stores-with-context) and use the Context API. If you want to learn more about the Context API, I wrote [Sharing State Without Props And Events In Svelte](https://joyofcode.xyz/master-the-svelte-context-api).

In conclusion, **always return the data from the `load` function and update the state on the client.**
