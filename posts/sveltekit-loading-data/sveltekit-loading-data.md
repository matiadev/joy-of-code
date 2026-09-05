---
title: SvelteKit API Endpoints And Loading Data For Pages
description: Learn about API endpoints and loading data for your pages with SvelteKit.
slug: sveltekit-loading-data
published: '2023-1-10'
category: sveltekit
---

<script lang="ts">
	import Image from '#lib/components/image.svelte'
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="rsmLu5nmh4g" title="SvelteKit API Endpoints And Loading Data For Pages" />

## Table of Contents

## Previously

This is part of a [SvelteKit series](https://www.youtube.com/watch?v=obmiLi3bhkQ&list=PLA9WiRZ-IS_zfHpxmztJQLeBISsQkh9-M) and while each part is meant to be self-contained here are the previous parts in case you want to catch up:

- [What is SvelteKit?](https://joyofcode.xyz/what-is-sveltekit)
- [SvelteKit Project Structure](https://joyofcode.xyz/sveltekit-project-structure)
- [SvelteKit Routing](https://joyofcode.xyz/sveltekit-routing)

## SvelteKit Setup

I'm going to initialize a SvelteKit project using TypeScript.

```shell:terminal
# install SvelteKit
npm create svelte@latest

# install dependencies
npm i

# run development server
npm run dev
```

I'm going to add a root layout with some navigation.

```svelte:src/routes/+layout.svelte showLineNumbers
<nav>
  <ul>
    <li>
      <a href="/">Home</a>
    </li>
    <li>
      <a href="/posts">Posts</a>
    </li>
  </ul>
</nav>

<slot />
```

## Database Setup

For the database I'm going to use Prisma with SQLite, so you get to use something real and it's quick to set up since the database is just a file on your system.

```shell:terminal
# initialize Prisma
npx prisma init --datasource-provider sqlite

# install Prisma client
npm i @prisma/client
```

I want to have some placeholder posts in the database using [DummyJSON](https://dummyjson.com/) when I create it which is done using a seed script.

```json:package.json showLineNumbers
{
  "prisma": {
    "seed": "npx vite-node prisma/seed.ts"
  }
  // ...
}
```

Instead of writing SQL you write a schema with Prisma that gets turned into SQL. I'm going to create a `Post` table with some fields in `schema.prisma`.

```ts:prisma/schema.prisma showLineNumbers
// ...

model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String
  content   String?
  slug      String   @unique
  published Boolean  @default(false)
}
```

I'm going to add a seed script to the `prisma` folder which is going to get the placeholder posts and add them to the database.

```ts:prisma/seed.ts showLineNumbers
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

type Post = {
  title: string
  body: string
}

async function getPosts() {
  const response = await fetch('https://dummyjson.com/posts')
  const { posts } = await response.json()
  return posts as Post[]
}

function slugify(text: string) {
  return text
    .replace(/\s/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
}

async function main() {
  const posts = await getPosts()

  for (const post of posts) {
    await db.post.create({
      data: {
        title: post.title,
        content: post.body,
        slug: slugify(post.title)
      }
    })
  }
}

main()
```

The `migrate` command is going to create the database from the Prisma schema and run the seed script (if you want to reset the database use `npx prisma migrate reset`).

```shell:terminal
npx prisma migrate dev --name init
```

You can use [Prisma Studio](https://www.prisma.io/studio) if you want to look at your database using a GUI which gives it a [phpMyAdmin](https://www.phpmyadmin.net/) vibe. 😎

```shell:terminal
npx prisma studio
```

To be able to query the database I'm going to initialize and export the Prisma client for use in our application inside `src/lib/database.ts`.

```ts:src/lib/database.ts showLineNumbers
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

export default db
```

## API Endpoints

You probably used an API like [https://dummyjson.com/posts](https://dummyjson.com/posts) but how does that even work?

Open your developer tools with <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd> and go to the network tab to examine it (check **disable cache** and reload the page).

<Image src="headers.webp" alt="DummyJSON headers" />

When you visit the link it does a `GET` **request method** to a server which then returns a **response** with some JSON data because it uses **content-type: application/json** and returns a `200` **status code** which is a standard response for successful HTTP requests.

SvelteKit makes creating an API endpoint simple by using a `+server.ts` file that exports a function that corresponds to a HTTP verb like `GET`, `POST`, `PATCH`, `PUT` and `DELETE` that take a request and return a `response` object.

```ts:src/routes/api/newsletter/+server.ts showLineNumbers
import { json } from '@sveltejs/kit'

// /api/newsletter GET

export async function GET(event) {
  const options: ResponseInit = {
    status: 418,
    headers: {
      X: 'Gon give it to ya',
    }
  }

  return new Response('Hello', options)
}

// /api/newsletter POST

export async function POST(event) {
  const data = await event.request.formData()
  const email = data.get('email')

  // subscribe the user to the newsletter
  console.log(email)

  // return success
  return new Response(JSON.stringify({ success: true }), {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // it's common to return JSON, so SvelteKit has a helper
  return json({ success: true })
}
```

Navigating to `/api/newsletter` is going to do a `GET` request and you can see some amusing headers for the request in the network tab — [you can learn more about the origins of the 418 response here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418).

In this example I'm using an API endpoint for a newsletter form but SvelteKit has a nicer method for working with forms which I'm going to cover in another part.

When the user submits the form it's going to make a `POST` request to `/api/newsletter`.

```svelte:src/routes/+page.svelte showLineNumbers
<script lang="ts">
  async function subscribe(event: Event) {
    const form = event.target as HTMLFormElement
    const data = new FormData(form)

    await fetch('/api/newsletter', {
      method: 'POST',
      body: data
    })
  }
</script>

<h1>Newsletter</h1>

<form on:submit|preventDefault={subscribe}>
  <input type="email" name="email" />
  <button>Subscribe</button>
</form>
```

The network tab is going to show the `fetch` request and you can see the headers and response which returns `{ "success": true }` that you can use to show the user a success message.

It's not important where you place the `+server.ts` inside file but I prefer to keep it inside `routes/api` if it's used across the app just so I know where to find it.

The [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response) object is just part of the web platform and not something specific to SvelteKit which means you should read the MDN documentation.

I want to take the posts from our database and create an API at `/api/posts` that can be used in our application (you have to set up [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) if you want to to make it public).

I'm going to create a `+server.ts` file at `routes/api/posts/+server.ts`.

```ts:src/routes/api/posts/+server.ts showLineNumbers
import { json } from '@sveltejs/kit'
import db from '$lib/database'

export async function GET(event) {
  const posts = await db.post.findMany()
  return json(posts)
}
```

If you go to `/api/posts` you can see the posts. If you're using a Chromium based browser I recommend the [JSON Viewer](https://chrome.google.com/webstore/detail/json-viewer/gbmdgpbipfallnflgajpaliibnhdgobh) extension.

The `event` argument is very useful because it provides access to some properties describing the event but also some useful helpers.

```ts:+server.ts showLineNumbers
export async function GET(event) {
  console.log(event)
  // ...
}
```

Here are some of the `event` properties and methods that are relevant to us now (some are best saved to savor later):

- `cookies` method to get and set cookies
- `fetch` with extra features like inheriting `cookie` and `authorization` headers for the page request, doing relative and internal requests on the server and preventing additional network requests because it reads the response from the HTML
- `params` of the current page like `/posts/[slug]`
- `request` gives you the original `Request` object
- `route` has the information about the route
- `setHeaders` method to set headers for the response

The post you're reading is cached on a CDN and how long it's cached is based on the age of the post. Here's an example of how you can set up caching.

```ts:src/routes/api/posts/+server.ts showLineNumbers
import { json } from '@sveltejs/kit'
import db from '$lib/database'

export async function GET(event) {
  const posts = await db.post.findMany({
    // get random numbers of posts to test caching
    take: Math.round(Math.random() * 30)
  })

  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching
  event.setHeaders({
    'Cache-Control': 'max-age=60'
  })

  return json(posts)
}
```

First let's learn how to show the data on the page.

## Showing Page Data Using Client-Side Rendering

This way of showing data on the page where you fetch the data on the client and show a loading state until you have the data might look familiar.

```svelte:src/routes/+page.svelte showLineNumbers
<script lang="ts">
  import type { Post } from '@prisma/client'

  async function getPosts() {
    const response = await fetch('/api/posts')
    const posts: Post[] = await response.json()
    return posts
  }
</script>

<h1>Posts</h1>

{#await getPosts()}
  <p>Loading...</p>
{:then posts}
  <p>Showing {posts.length} posts.</p>

  <ul>
    {#each posts as post}
      <li>
        <a href="/posts/{post.title}">{post.title}</a>
      </li>
    {/each}
  </ul>
{:catch error}
  <p>{error.message}</p>
{/await}
```

Notice if you refresh the page the caching should work since the data is going to be fresh for a minute and the data is going to be loaded from the disk cache instead (this only works if you uncheck **disable cache** or close the developer tools).

<Image src="cached.webp" alt="Cached response for posts" />

You shouldn't do this though and instead cache the result on a CDN using `s-maxage` which looks something like `'Cache-Control': 'public, max-age=0, s-maxage=60'`.

## Showing Page Data Using Server-Side Rendering

There's a couple of problem with client-side rendering:

- If you view the page source the posts are nowhere to be found because we fetched the data on the client which harms SEO
- The JavaScript has to load first which can fail for whatever reason before you even start fetching the data which is not a great user experience

Instead of using client-side rendering (CSR) I want to take advantage of server-side rendering (SSR) and fetch the data before the page is loaded which is going to result in a faster and more resilient app.

In SvelteKit a `+page.svelte` can have a sibling `+page.ts` file that exports a `load` function which returns data for the page and nothing else.

```ts:src/routes/+page.ts showLineNumbers
import type { Post } from '@prisma/client'

export async function load({ fetch }) {
  // `fetch` understands the relative path and saves the response
  // inside the HTML to be reused avoiding additional requests
  const response = await fetch('/api/posts')

  // SvelteKit is going to generate the types
  const posts: Post[] = await response.json()

  // this becomes available on the page as `data.posts`
  return { posts }
}
```

Remember how I said you're going to see the `event` argument everywhere? Same story for the `load` function but using [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).

Here is how you get the data for the page.

```svelte:src/routes/+page.svelte showLineNumbers
<script lang="ts">
  export let data
</script>

<h1>Posts</h1>

<p>Showing {data.posts.length} posts.</p>

<ul>
  {#each data.posts as post}
    <li>
      <a href="/posts/{post.slug}">{post.title}</a>
    </li>
  {/each}
</ul>
```

If you look at the network tab you're going to see the entire HTML document for your posts and no `fetch` request like before because it was server-side rendered on the first page load — if you navigate from another page you would see a `fetch` request because SvelteKit would behave like a SPA at that point.

If you view the page source you can see how SvelteKit saves the data in the HTML because you used `event.fetch`.

```svelte:example.html showLineNumbers
<script type="application/json" data-sveltekit-fetched data-url="/api/posts">
  // here is the page data as JSON
</script>
```

Using `data.whatever` can be tedious, so here's a neat trick you can use to pluck values from `data` and update the value using a reactive declaration.

```svelte:src/routes/+page.svelte showLineNumbers
<script lang="ts">
  export let data

  $: ({ posts } = data)
</script>

<h1>Posts</h1>

<p>Showing {posts.length} posts.</p>

<ul>
{#each posts as { slug, title }}
  <li>
    <a href="/posts/{slug}">{title}</a>
  </li>
{/each}
</ul>

<!-- ... -->
```

## Sometimes You Only Want To Run Code On The Server

The `+page.ts` file is great for fetching data for the page but because it runs on the server and browser it won't work if you need to use secrets or want to use the file system or database.

I'm going to create a `routes/posts/[slug]/+page.svelte` route that should get the post from the database using the `slug` parameter.

```svelte:src/routes/posts/[slug]/+page.svelte showLineNumbers
<script lang="ts">
  export let data

  function formatDate(date: Date) {
    const formatter = new Intl.DateTimeFormat('en', { dateStyle: 'long' })
    return formatter.format(date)
  }
</script>

<hgroup>
  <h1>{data.post.title}</h1>
  <h2>{formatDate(data.post.createdAt)}</h2>
</hgroup>

<div class="content">
  {@html data.post.content}
</div>
```

```ts:src/routes/posts/[slug]/+page.ts showLineNumbers
import { error } from '@sveltejs/kit'
import db from '$lib/database'

export async function load({ params }) {
  const post = await db.post.findUnique({
    where: { slug: params.slug }
  })

  if (!post) {
    error(404, 'Post not found')
  }

  return { post }
}
```

If you refresh the page you get a spooky error in the browser.

```shell:error
Error: PrismaClient is unable to be run in the browser.
```

Yikes! 💩

When you need to do something on the server like using a secret or talking to the file system or database rename `+page.ts` to `+page.server.ts` instead.

```ts:src/routes/posts/[slug]/+page.server.ts showLineNumbers
import { error } from '@sveltejs/kit'
import db from '$lib/database'

export async function load({ params }) {
  const post = await db.post.findUnique({
    where: { slug: params.slug }
  })

  if (!post) {
    error(404, 'Post not found')
  }

  return { post }
}
```

Refresh the page and it should work.

> 🐿️ In a [previous post](https://joyofcode.xyz/sveltekit-routing) I mentioned expected and unexpected errors in SvelteKit and using `error` throws an expected error that's going to be shown to the user.

Not a lot changed besides the filename and the types for the `load` function becoming `PageServerLoad` instead of `PageServer`.

In general whenever you need to create an API or make a HTTP request use `+server.ts` and when you only care about data for the page use `+page.ts` or `+page.server.ts`.

## Your Layout Files Can Also Load Data

Your `+layout.svelte` files can also load data using a `+layout.ts` or `+layout.server.ts` file the same as `+page.svelte` files .

Why would you do that? 🤔

Data returned from layout `load` functions is available to child routes and not just the layout it belongs to meaning you can pass data like a hot potato through your routes.

```ts:src/routes/+layout.ts showLineNumbers
export async function load() {
  return {
    message: 'Hello'
  }
}
```

The `message` data is now available to `routes/+layout.svelte` and every child route through `data`.

To show you a more useful example I'm going to create a layout inside `routes/posts/+layout.svelte` and get data from `routes/posts/+layout.server.ts` to show posts on the side inside `+layout.svelte` and reuse the data inside `routes/posts/[slug]/+page.svelte` to give the reader more posts to read.

```shell:layout
routes
└── posts
    ├── [slug]
    │   ├── +page.server.ts
    │   └── +page.svelte
    ├── +layout.server.ts
    ├── +layout.svelte
    └── +page.svelte
```

This is what you see when you visit `/posts`.

```svelte:src/routes/posts/+page.svelte showLineNumbers
<h1>Posts</h1>

<p>You can browse posts here.</p>
```

I only want a certain amount of posts that only have the `title` and `slug` fields from the database.

```ts:src/routes/posts/+layout.server.ts showLineNumbers
import db from '$lib/database'

export async function load() {
  const posts = await db.post.findMany({
    select: {
      title: true,
      slug: true
    },
    take: 4
  })

  return { posts }
}
```

This data is now available inside `/posts/+layout.svelte` and `/posts/+page.svelte` but also any child routes through the `data` prop.

```svelte:src/routes/posts/+layout.svelte showLineNumbers
<script lang="ts">
  export let data
</script>

<div class="layout">
  <aside>
    <nav>
      <h4>Posts</h4>

      <ul>
        {#each data.posts as { slug, title }}
          <li>
            <a href="/posts/{slug}">{title}</a>
          </li>
        {/each}
      </ul>
    </nav>
  </aside>

  <main>
    <slot />
  </main>
</div>

<style>
  .layout {
    display: grid;
    grid-template-columns: 200px minmax(auto, 60ch);
    gap: 4rem;
    margin-top: 2rem;
  }
</style>
```

The same `posts` data is available inside the `/posts/[slug]/+page.svelte` child route.

```svelte:src/routes/posts/[slug]/+page.svelte showLineNumbers
<script lang="ts">
  export let data
  // ...
</script>

<!-- ... -->

<div class="posts">
  <h3>Posts</h3>

  <ul>
    {#each data.posts as { slug, title }}
      <li>
        <a href="/posts/{slug}">{title}</a>
      </li>
    {/each}
  </ul>
</div>

<style>
  .posts {
    margin-top: 2rem;
  }
</style>
```

## Making Your Data Available Everywhere

So far we've seen how data flows in one direction but the `$page` store makes your data available everywhere.

You could use the `$page` store to set the title for the page inside `routes/+layout.svelte`.

```svelte:src/routes/+layout.svelte showLineNumbers
<script lang="ts">
  import { page } from '$app/stores'

  $: console.log($page.data)
</script>

<svelte:head>
  <title>{$page.data.post?.title}</title>
</svelte:head>

<!-- ... -->
```

If you look at the output you're going to see the `post` and `posts` data returned from their respective `load` functions `routes/posts/[slug]/+page.server.ts` and `routes/posts/+layout.server.ts`.

Here's a [real world example](https://authjs.dev/reference/sveltekit) how `$page.data` is used by [Auth.js](https://authjs.dev/) to make sure the user is authenticated.

The following code sets the session data in the `$page` store to be available to all routes inside the root layout.

```ts:src/routes/+layout.server.ts showLineNumbers
export async function load(event) {
  return {
    // `$page.data` slurps it up 😋
    session: await event.locals.getSession()
  }
}
```

If there's a session show the user information.

```svelte:src/routes/+page.svelte showLineNumbers
<script lang="ts">
  import { page } from "$app/stores"
</script>

{#if $page.data.session}
  <p>Signed in as {$page.data.session.user.name}.</p>
{/if}
```

## Using Data From The URL

The URL was the first state manager before any of these fancy JavaScript frameworks existed.

A stateful URL means you can use query parameters from the URL for providing options like filtering and sorting data.

SvelteKit makes working with the URL simple and that's why the `load` function provides you with:

- `url` which is an instance of `URL` and has properties like `origin`, `hostname`, `pathname` and `searchParams` (has the parsed query string as a `URLSearchParams` object)
- `route` contains the name of the current directory relative to `src/routes`
- `params` is derived from `url.pathname` and `route.id`

I want to improve the existing posts API so I'm able to specify the amount of posts I want and set the order such as `/api/posts?limit=4&order=desc`.

```ts:src/routes/api/posts/+server.ts showLineNumbers
import { json } from '@sveltejs/kit'
import db from '$lib/database'

export async function GET({ url }) {
  console.log(url.searchParams) // { 'limit' => '4', 'order' => 'desc' }

  const limit = Number(url.searchParams.get('limit') ?? 30)
  const order = url.searchParams.get('order') ?? 'asc'

  const posts = await db.post.findMany({
    orderBy: { id: order },
    take: limit
  })

  return json(posts)
}
```

You won't find how to use `searchParams` in the SvelteKit docs because you're using web standards, so you're going to learn how to use [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) on MDN.

Using the URL for state management is not a unique concept and something we just started rediscovering because frameworks like SvelteKit make working with the URL great again.

You're used to having component state for something like search but you can't share the link to the search result with someone else — if you store the search term in a URL you don't have to manage that state and it becomes a link such as `/search?q=banana`.

In SvelteKit you can use `goto` to update the search params which is also going to rerun the `load` function for the page.

```svelte:src/routes/+page.svelte showLineNumbers
<script lang="ts">
  import { goto } from '$app/navigation'

  export let data

  function search(event: Event) {
    const data = new FormData(event.target)
    const search = data.get('search')
    goto(`?search=${search}`, { replaceState: true, keepFocus: true })
  }
</script>

<form on:submit|preventDefault={search}>
  <input type="text" name="search">
  <button type="submit">Search</button>
</form>

<!-- ... -->
```

```ts:src/routes/+server.ts showLineNumbers
export async function load({ url }) {
  const search = url.searchParams.get('search') // "banana"
  // ...
}
```

Instead of having to manage some state you can just share the link with anyone `example.com/?search=banana`.

If this sparked your interest here's the entire [working example on StackBlitz](https://stackblitz.com/edit/sveltejs-kit-template-default-bauvcn) you can try out and learn how it works.

There's also packages that make this a lot easier such as [sveltekit-search-params]([https://github.com/paoloricciuti/sveltekit-search-params](https://github.com/paoloricciuti/sveltekit-search-params 'https://github.com/paoloricciuti/sveltekit-search-params') which you should check out if you're going to do any URL fu.

```svelte:src/routes/+page.svelte showLineNumbers
<script lang="ts">
    import { queryParam } from 'sveltekit-search-params'

    const search = queryParam('search')
</script>

<input bind:value={$search} />
```

This is just meant to give you an idea of what is possible and I would love to explore it further with you another time.

## Using Parent Layout Data

So far you learned how data returned from parent `load` functions becomes available to `+page.svelte` and `+layout.svelte` components over the `data` prop.

In case you need data from a parent layout `load` function inside a child `load` function you can use `await parent()`.

I'm going to go to our deepest route for showing a post.

```ts:src/routes/posts/[slug]/+page.server.ts showLineNumbers
export async function load({ parent }) {
  const parentData = await parent()
  console.log(parentData)
  // ...
}
```

What do you expect to see in the output?

If you guessed the four posts from `routes/posts/+layout.server.ts` you would be right because that's the only parent layout `load` function that returns data so far.

You have to be careful to not introduce waterfalls if your data doesn't depend on the result of the parent because `load` functions run in parallel.

```ts:src/routes/+page.server.ts showLineNumbers
export async function load({ parent }) {
  // 1. get the data from the parent first
  const parentData = await parent()

  // 2. because you need the parent data
  const data = await getData(parentData)

  // ...
}
```

In the next example you don't need the parent data and you're going to cause a waterfall in your network tab which you can think of as a traffic jam.

```ts:src/routes/+page.server.ts showLineNumbers
export async function load({ parent }) {
  // 1. parent `load` function runs first ⏳️
  const parentData = await parent()

  // 2. this `load` function is now blocked 🛑
  const data = await getData()

  // ...
}
```

Let the `load` functions run in parallel instead.

```ts:src/routes/+page.server.ts showLineNumbers
export async function load({ parent }) {
  // 1. this `load` function fires off 🏃
  const data = await getData()

  // 2. the parent `load` function fires off 🏃
  const parentData = await parent()

  // ...
}
```

As long as you keep this in mind you should be fine.

## How Load Functions Work

You should understand how `load` functions work because you're going to rerun a `load` function for the page which SvelteKit already does for your in certain cases but in some cases you might want to do it yourself.

SvelteKit tracks the dependencies of each `load` function to avoid having to do the same work during navigation.

Take for example the `load` function responsible for returning the data for a post — it's going to rerun each time `params.slug` has changed.

```ts:src/routes/posts/[slug]/+page.server.ts showLineNumbers
import { error } from '@sveltejs/kit'
import db from '$lib/database'

export async function load({ params, parent }) {
  const post = await db.post.findFirst({
    where: { slug: params.slug }
  })

  if (!post) {
    error(404, 'Post not found')
  }

  return { post }
}
```

The posts data hasn't changed, so SvelteKit doesn't have to rerun the `load` function.

```ts:src/routes/+page.ts showLineNumbers
import type { Post } from '@prisma/client'

export async function load({ fetch }) {
  const response = await fetch('api/posts')
  const posts: Post[] = await response.json()
  return { posts }
}
```

A `load` function that calls `await parent()` will also rerun if a parent `load` function reruns.

You can rerun `load` functions for the current page using `invalidate(url)` or `invalidateAll()` which reruns every `load` function, so be careful.

The `load` function depends on `url` if it uses `fetch(url)` or `depends(url)` which can be a custom identifier.

```ts:src/routes/+page.ts showLineNumbers
import type { Post } from '@prisma/client'

export async function load({ fetch, depends }) {
  // a) invalidate('api/posts') would rerun the `load` function
  const response = await fetch('api/posts')

  // b) or using depends which you can name anything
  depends('posts')

  // ...
}
```

You can modify the API slightly to return a random number of posts.

```ts:src/routes/+page.ts showLineNumbers
import type { Post } from '@prisma/client'

export async function load({ fetch, depends }) {
  const random = Math.round(Math.random() * 30)
  const response = await fetch(`api/posts?limit=${random}`)
  const posts: Post[] = await response.json()

  depends('posts')

  return { posts }
}
```

If you use a random URL then option `b` won't work because you can't invalidate a random URL using that method.

```svelte:src/routes/+page.svelte showLineNumbers
<script lang="ts">
  import { invalidate, invalidateAll } from '$app/navigation'

  function rerunLoadFunction() {
    // a)
    invalidate('posts')

    // b)
    invalidate('api/posts')

    // c)
    invalidate(url => url.href.includes('posts'))

    // d)
    invalidateAll()
  }
</script>

<button on:click={rerunLoadFunction}>Rerun</button>

<!-- ... -->
```

Open the network tab in the developer tools and try out every option. It should rerun the `load` functions for the page and you should see a `fetch` request that has the data from the new response.

Let's repeat what makes a `load` function rerun:

- Any reference to a property of `params` or `url`
- If the `load` function calls `await parent()` and the parent reran
- You declared a dependency with `fetch` or `depends` and marked the URL invalid with `invalidate(url)`
- You used `invalidateAll()` to force every `load` function to rerun

This doesn't cause the component to be recreated but it just updates the `data` prop inside a `+page.svelte` or `+layout.svelte` component but if you want to reset it you can use `afterNavigate` or wrap your component in a `{#key ...}` block.

That's everything you should know about API endpoints and loading data in SvelteKit.

In the next part you're going to [learn how to work with forms in SvelteKit](https://joyofcode.xyz/working-with-forms-in-sveltekit).
