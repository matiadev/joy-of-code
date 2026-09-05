---
title: Using Advanced Layouts In SvelteKit
description: Learn how to have more control over layouts and how to reset layouts using group layouts in SvelteKit.
slug: sveltekit-advanced-layouts
published: '2023-2-10'
category: sveltekit
---

<script lang="ts">
	import Image from '#lib/components/image.svelte'
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="9UpaKEVuErs" title="Using Advanced Layouts In SvelteKit" />

## Table of Contents

## Previously

This is part of a [SvelteKit series](https://www.youtube.com/watch?v=obmiLi3bhkQ&list=PLA9WiRZ-IS_zfHpxmztJQLeBISsQkh9-M) and while each part is meant to be self-contained here are the previous parts in case you want to catch up:

- [What is SvelteKit?](https://joyofcode.xyz/what-is-sveltekit)
- [SvelteKit Project Structure](https://joyofcode.xyz/sveltekit-project-structure)
- [SvelteKit Routing](https://joyofcode.xyz/sveltekit-routing)
- [SvelteKit API Endpoints And Loading Data For Pages](https://joyofcode.xyz/sveltekit-loading-data)
- [Working With Forms In SvelteKit](https://joyofcode.xyz/working-with-forms-in-sveltekit)

## Project Setup

If you want to follow along the easiest method is to [open the starting project on StackBlitz](https://stackblitz.com/github/joysofcode/advanced-layouts) but if you prefer the comfort of your editor I provided a [repository on GitHub](https://github.com/joysofcode/advanced-layouts) with the starting and final example.

Clone the project.

```shell:terminal
git clone https://github.com/joysofcode/advanced-layouts.git
```

After you clone the project you can install the dependencies and start the development server.

```shell:terminal
npm i && npm run dev
```

If you want to look at the solution switch the branch.

```shell:terminal
git checkout solution
```

## Sometimes You Want Routes With Different Layouts

Let's say I have a million dollar idea and it's named Plume — a site for discovering and sharing inspiring quotes.

<Image src="plume.webp" alt="A site for discovering and sharing inspiring quotes" />

The investors are lined up but before I can push the yacht to sea I need to push the code into production but I've ran into a problem.

I shouldn't be sharing trade secrets but here's the `routes` structure.

```txt:routes
routes
├── admin
│   ├── +layout.svelte
│   ├── +page.server.ts
│   └── +page.svelte
└── quotes
    ├── id
    │   └── [quoteId]
    │       ├── +page.server.ts
    │       └── +page.svelte
    ├── tags
    │   ├── [tag]
    │   │   ├── +page.server.ts
    │   │   └── +page.svelte
    │   ├── +page.server.ts
    │   └── +page.svelte
    ├── +layout.server.ts
    ├── +layout.svelte
    └── +page.svelte
```

That's a sweet tree but it hides dark secrets.

If you navigate to `/admin` you're going to notice the first issue where the admin layout (`/admin/+layout.svelte`) shares the root layout (`/routes/+layout.svelte`) which makes me look like a clown in the eyes of the investors. 🤡

<Image src="admin-layout.webp" alt="Admin route layout problem" />

Yikes! But that's not everything.

Notice the `/quotes` route? I want a layout that shows more quotes at the end of the page if I go to other child routes like `/quotes/id/[quoteId]` but I might not want that layout for `/quotes/tags`.

<Image src="tags-layout.webp" alt="Tags route layout problem" />

Sure, I could move the `/tags` route outside the `/quotes` route which would solve the problem but I don't want to do that. Because every child route in `/quotes` shares the same layout from `/quotes/+layout.svelte` if you go to `/quotes/tags` it shows other quotes.

This is where group layouts help.

## Using Group Layouts To Group Related Routes

[Group layouts](https://kit.svelte.dev/docs/advanced-routing#advanced-layouts) let you group routes inside a directory wrapped in parenthesis but they **don't** create a new route.

To fix the **admin layout** I'm going to create an `(app)` and `(dashboard)` group. If you want the group to be the root (`/`) of your app you can put the `+page.svelte` file inside the group.

I'm going to keep the global styles inside `/routes/+layout.svelte` but move everything else which is going to leave us with a **blank root layout**.

```svelte:src/routes/+layout.svelte showLineNumbers
<script lang="ts">
  import '@picocss/pico'
  import '../app.css'
</script>

<svelte:head>
  <link rel="icon" href="https://fav.farm/🪶" />
  <title>Plume</title>
</svelte:head>

<slot />
```

I'm going to move the navigation from `/routes/+layout.svelte` and `/routes/+page.svelte` including the `/quotes` route inside the `(app)` directory and then I only have to drag the `/admin` route inside the `(dashboard)` directory.

```txt:routes {2, 10, 15}
routes
├── (app)
│   └── quotes
│       ├── id
│       │   └── ...
│       ├── tags
│       │   └── ...
│       ├── +layout.svelte
│       └── +page.svelte
├── (dashboard)
│   └── admin
│       ├── +layout.svelte
│       ├── +page.server.ts
│       └── +page.svelte
└── +layout.svelte
```

Wonderful!

<Image src="admin-group-layout.webp" alt="Admin route using app group layout" />

To fix the **tags layout** I'm going to use a group layout to create separate groups for `(quote)` and `(tags)` under the `/quotes` route and move the `/quotes/id` route inside `quotes/(quote)` and the `/quotes/tags` route inside `/quotes/(tags)`.

```txt:routes {4, 10}
routes
├── (app)
│   └── quotes
│       ├── (quote)
│       │   ├── id
│       │   │   └── ...
│       │   ├── +layout.server.ts
│       │   ├── +layout.svelte
│       │   └── +page.svelte
│       ├── (tags)
│       │   ├── tags
│       │   │   └── ...
│       │   └── +layout.svelte
│       ├── +layout.svelte
│       └── +page.svelte
├── (dashboard)
│   └── admin
│       ├── +layout.svelte
│       ├── +page.server.ts
│       └── +page.svelte
└── +layout.svelte
```

That's it!

<Image src="tags-group-layout.webp" alt="Tags route using the dashboard group layout" />

I think what makes group layouts confusing is when you start nesting layouts because you can think of group layouts as buckets to put things into but if you're not confident in using layouts yet this is going to be hard to wrap your head around.

If you're not sure when to use a layout ask yourself if the child routes of a given route have some repeating content you want to show — also remember we previously learned that data returned from layout `load` functions is available to child routes on the `data` prop which is useful.

You don't have to use group layouts, so put this away in your pocket in case you need it and focus on the fundamentals instead.

If you thought this was mind-bending in the next section I'm going to show you that individual pages and layouts can also change layouts.

## Breaking Out Of Layouts

Group layouts are nice if you want some pages and their children to have a different layout but you can also use a different layout for a specific page and layout.

Right now the `/(app)/quotes/(quote)/id/[quoteId]/+page.svelte` route shares the **app layout** and **quotes layout** but if you didn't want to use the **quotes layout** for showing more quotes you can use the **app layout** instead and rename `+page.svelte` to `+page@(app).svelte`.

```txt:routes {8}
routes
├── (app)
│   └── quotes
│       ├── (quote)
│       │   ├── id
│       │   │   └── [quoteId]
│       │   │       ├── +page.server.ts
│       │   │       └── +page@(app).svelte
│       │   ├── +layout.server.ts
│       │   ├── +layout.svelte
│       │   └── +page.svelte
│       ├── (tags)
│       │   ├── tags
│       │   │   └── ...
│       │   └── +layout.svelte
│       ├── +layout.svelte
│       └── +page.svelte
├── (dashboard)
│   └── admin
│       ├── +layout.svelte
│       ├── +page.server.ts
│       └── +page.svelte
└── +layout.svelte
```

<Image src="page-reset.webp" alt="Example showing a page reset" />

If you ever looked up how to reset a layout in SvelteKit you were probably confused because to do so you would need a **blank root layout** which only makes sense now after you learned about group layouts and breaking out of layouts.

If you want to reset a layout and use the **root layout** you can use an empty string `+page@.svelte` or `+layout@.svelte` to use the **root layout**.

The `(app)/quotes/(tags)/+layout.svelte` route shares the **app layout** and it's children are going to inherit the **tags layout** if you visit `/quotes/tags` but if you wanted to change the parent **app layout** layout and use the **root layout** you can rename `+layout.svelte` to `+layout@.svelte`.

```txt:routes {15}
routes
├── (app)
│   └── quotes
│       ├── (quote)
│       │   ├── id
│       │   │   └── [quoteId]
│       │   │       ├── +page.server.ts
│       │   │       └── +page@(app).svelte
│       │   ├── +layout.server.ts
│       │   ├── +layout.svelte
│       │   └── +page.svelte
│       ├── (tags)
│       │   ├── tags
│       │   │   └── ...
│       │   └── +layout@.svelte
│       ├── +layout.svelte
│       └── +page.svelte
├── (dashboard)
│   └── admin
│       ├── +layout.svelte
│       ├── +page.server.ts
│       └── +page.svelte
└── +layout.svelte
```

<Image src="layout-reset.webp" alt="Example showing a layout reset" />

Now you know how to break out of layouts if you have to.

In the next part you're going to [learn about SvelteKit hooks](https://joyofcode.xyz/sveltekit-hooks) before you learn how to deploy a SvelteKit project.
