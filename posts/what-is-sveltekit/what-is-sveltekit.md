---
title: What Is SvelteKit?
description: SvelteKit is the swiss army knife of JavaScript frameworks and blurs the line between frontend and backend.
slug: what-is-sveltekit
published: '2022-12-20'
category: sveltekit
---

{% youtube id="obmiLi3bhkQ" title="What Is SvelteKit?" %}

## Table of Contents

## Welcome To The Learn SvelteKit Series

> **🔥 Update:** In the past you had to type special SvelteKit values which is no longer required. I updated the posts and removed those types. If you want to learn more watch [Stop Using Types In SvelteKit](https://www.youtube.com/watch?v=Xk3vjociFt4) but you can ignore it.

This is the first part of the [Learn SvelteKit](https://www.youtube.com/playlist?list=PLA9WiRZ-IS_zfHpxmztJQLeBISsQkh9-M) series.

Each part is self-contained and doesn't depend on previous parts but I recommend you read or watch them in order:

- [What is SvelteKit?](https://joyofcode.xyz/what-is-sveltekit)
- [SvelteKit Project Structure](https://joyofcode.xyz/sveltekit-project-structure)
- [SvelteKit Routing](https://joyofcode.xyz/sveltekit-routing)
- [SvelteKit API Endpoints And Loading Data For Pages](https://joyofcode.xyz/sveltekit-loading-data)
- [Working With Forms In SvelteKit](https://joyofcode.xyz/working-with-forms-in-sveltekit)
- [Using Advanced Layouts In SvelteKit](https://joyofcode.xyz/sveltekit-advanced-layouts)
- [Learn SvelteKit Hooks Through Example](https://joyofcode.xyz/sveltekit-hooks)
- [Deploy A Full Stack SvelteKit App](https://joyofcode.xyz/sveltekit-deployment)

## SvelteKit Is The Swiss Army Knife Of JavaScript Frameworks

SvelteKit is a **meta-framework** built on top of Svelte for building rich web apps but **it's easier to think of it as a backend framework that uses Svelte as the component framework**.

If you're familiar with other JavaScript frameworks **SvelteKit is to Svelte what Next.js or Remix is to React** but philosophically it's closer to Remix where it encourage you to use the web platform and progressive enhancement to build more resilient sites.

SvelteKit is a [Vite plugin](https://github.com/sveltejs/vite-plugin-svelte) that uses [Vite](https://vitejs.dev/) as the server and like any other server it's responsible for turning a request into a response and it can [adapt](https://kit.svelte.dev/docs/adapters) to any platform meaning SvelteKit runs anywhere JavaScript can run.

## SvelteKit Blurs The Line Between Frontend And Backend

SvelteKit blurs the line between frontend and backend and makes the integration between them seamless since it has control over both which means you can start working on your project and not suffer from decision fatigue since it's opinionated in the right way.

You can use SvelteKit to create an API just like you can with [Express](https://expressjs.com/).

```ts:src/routes/api/posts/+server.ts showLineNumbers
import { json } from '@sveltejs/kit'

export function GET() {
  // get posts from database
  const posts = [
    {
      slug: 'sveltekit',
      content: `
        <h1>SvelteKit</h1>
        <p>This data came from the server. 🔥</p>
    `,
    },
  ]

  return json(posts)
}
```

SvelteKit shines when it comes to data fetching for your pages because of how seamless the integration between the backend and frontend is while giving you type safety like [tRPC](https://trpc.io/). 🤯

```ts:src/routes/+page.server.ts showLineNumbers
export function load() {
  // get post from database
  const post = {
    slug: 'sveltekit',
    content: `
      <h1>SvelteKit</h1>
      <p>This data came from the server. 🔥</p>
    `,
  }

  return { post }
}
```

```svelte:src/routes/+page.svelte showLineNumbers
<script lang="ts">
  export let data // 👈️ typed
</script>

<!-- You get autocompletion as you type -->
{@html data.post.content}
```

## Convention Over Configuration

SvelteKit sparks joy because it doesn't get in your way, so you can start hacking at your idea and not spend hours configuring things.

I mentioned how SvelteKit is a Vite plugin but that's an oversimplification (and sounds like a weekend project) considering the problems it solves:

- Routing
- Server-side rendering
- Data fetching
- Zero config (ESLint, Prettier, TypeScript, Playwright, Vitest work out of the box)
- Code splitting (loading data on demand)
- Handling environment variables
- Configurable rendering (SSR, SSG, CSR)
- Deployment

One of the most powerful things about SvelteKit is the flexibility in how you build your app — you can **prerender** your about page, use **SSR** (server-side rendering) for dynamic pages and your app section can be a **SPA** (single page application) inside the same app.

```ts:src/routes/+layout.ts showLineNumbers
// turns app into a SPA
export const ssr = false

// turns app into SSG
export const prerender = true

// don't even load the SvelteKit client
export const csr = false
```

Since `ssr` is set to `false` inside the root layout the entire app becomes a client-rendered SPA or SSG if you set `prerender` to `true` and you can even disable the client altogether — you can override these values on a per-page basis or groups of pages inside your app.

## Best Of Both Worlds: Server-Side Rendering With Client-Side Navigation

Most frameworks make you decide between SSR (server-side rendering) or SSG (prerendering everything) but SvelteKit lets you chose what method you want on a per-page basis.

Traditional SPAs (single-page application) rely on JavaScript to load first before they can fetch any data causing a round-trip and loading spinners.

{% img src="spa.webp" alt="Single page application" %}

SvelteKit apps are server-side rendered by default for speed and SEO (search engine optimization) but once the page is loaded the client-side router kicks in which makes your app feel like a SPA to avoid reloading the page between page navigation.

{% img src="ssr.webp" alt="Server-side rendering" %}

## SvelteKit Uses The Web Platform

There's no weird wrappers for links because it's just regular HTML.

```svelte:src/routes/about/+page.svelte showLineNumbers
<a href="/about">About</a>
```

You're going to spend more time on the [MDN Web Docs](https://developer.mozilla.org/en-US/) learning about the web platform than some weird abstraction that's only useful inside SvelteKit

SvelteKit uses the web platform meaning you're not learning some framework specific abstraction but using web standards like the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) and [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) objects, [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers) and [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) for working with forms.

```svelte:src/routes/login/+page.svelte showLineNumbers
<h1>Login</h1>

<form method="POST" action="?/login">
  <input type="text" name="name" />
  <input type="password" name="password" />
  <button>Login</button>
</form>
```

```ts:src/routes/login/+page.server.ts showLineNumbers
export const actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData()

    const credentials = {
      name: data.get('name'),
      password: data.get('password'),
    }

    // do whatever you need
    console.log(credentials)
  },
}
```

This is how easy working with forms is in SvelteKit.

## SvelteKit Apps Are More Resilient Using Progressive Enhancement

SvelteKit apps are more resilient because they work before JavaScript if you use progressive enhancement.

Instead of disabling the default form behavior and implementing what the browser does yourself SvelteKit makes it simple to use the web platform and progressively enhance the user experience when JavaScript is available on the page.

```svelte:src/routes/login/+page.svelte showLineNumbers
<script lang="ts">
  import { enhance } from '$app/forms'
</script>

<h1>Login</h1>

<form method="POST" action="?/login" use:enhance>
  <input type="text" name="name" />
  <input type="password" name="password" />
  <button>Login</button>
</form>
```

Notice how you didn't have to use a single `fetch` and the form would work without JavaScript but using the `enhance` Svelte action from SvelteKit you can enable progressive enhancement.

## SvelteKit Runs Where JavaScript Runs

SvelteKit by default uses the Node.js adapter but it can run anywhere where JavaScript can run requiring zero configuration thanks to [adapters](https://kit.svelte.dev/docs/adapters).

You can write your own adapter but one of the supported environments are Cloudflare pages, Netlify, Vercel, Node.js or static and you can find [community adapters](https://sveltesociety.dev/components#adapters) like the adapter for Deno.

Keep in mind if you're going to run SvelteKit in an environment that is not Node.js and you try using the Node.js file system API in your project it won't work.

## SvelteKit For Component Libraries

SvelteKit helps you create and publish packages if you're working on component libraries using `svelte-package`.

A component library is similar to a SvelteKit app in structure but it uses `src/lib` as the root and running `svelte-package` takes the content of `src/lib` and generates a `package` directory you can publish on [npm](https://www.npmjs.com/).

## SvelteKit Is Made For Everyone

SvelteKit is an open source project governed by [@rich_harris](https://twitter.com/Rich_Harris) and a team of core contributors.

The development is funded by the [Open Collective](https://opencollective.com/svelte) and [Vercel](https://vercel.com/) but it's not governed by a corporation whose goals and ambitions are unclear.

The future of SvelteKit is bright and I hope you give it a try but be warned in case you do you might not want to use anything else and side effects include a permanent grin on your face.

In the next part [learn how to set up a SvelteKit project from scratch](https://joyofcode.xyz/sveltekit-project-structure) and understand how it works.
