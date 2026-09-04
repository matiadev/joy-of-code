---
title: SvelteKit Project Structure Explained
description: Understand how SvelteKit works by creating a SvelteKit project from scratch.
slug: sveltekit-project-structure
published: '2022-12-22'
category: sveltekit
---

{% youtube id="5VBdyfGhs7A" title="SvelteKit Project Structure Explained" %}

## Table of Contents

## Previously

This is part of a [SvelteKit series](https://www.youtube.com/watch?v=obmiLi3bhkQ&list=PLA9WiRZ-IS_zfHpxmztJQLeBISsQkh9-M) and while each part is meant to be self-contained here are the previous parts in case you want to catch up:

- [What is SvelteKit?](https://joyofcode.xyz/what-is-sveltekit)

## Introduction

I don't know about you but when I'm learning something I want at least a high level understanding of what makes it work.

Understanding what makes SvelteKit work is going to give you more confidence using it as you get more familiar with it like getting to know a friend.

In this post I'm going to show you how to set up SvelteKit yourself without the CLI — don't worry I'm going to use off the shelf parts instead of doing SvelteKit from scratch 😅.

After that I'm going to walk you through the SvelteKit CLI and explain every file, so you at least understand the purpose of it.

If you're one of those weird people that want to understand how SvelteKit works under the hood I'm also the weird type of person that wrote [Learn How SvelteKit Works](https://joyofcode.xyz/learn-how-sveltekit-works) you can read or watch.

## SvelteKit From Scratch

I'm going to initialize an empty `package.json` file using the `y` flag to skip questions.

```shell:terminal
npm init -y
```

SvelteKit needs these development dependencies at least to work.

```shell:terminal
npm i -D vite @sveltejs/kit @sveltejs/adapter-auto svelte
```

If you don't know, SvelteKit is built on top of Vite!

At the top of the `package.json` I'm going to specify the project uses [JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) (ECMAScript modules) using the `import` syntax instead of the old CommonJS modules using the `require` syntax.

```json:package.json showLineNumbers
{
  type: "module"
}
```

To run the development mode or build the project and preview it you're going to need to include some scripts that just runs some scripts from `node_modules` on your system.

```json:package.json showLineNumbers
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

This is the finished `package.json` file.

```json:package.json showLineNumbers
{
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
  },
  "devDependencies": {
    "@sveltejs/adapter-auto": "^1.0.0",
    "@sveltejs/kit": "^1.0.0",
    "svelte": "^3.54.0",
    "vite": "^4.0.0"
  }
}

```

SvelteKit requires a Vite config at the root of the project and in the previous [What Is SvelteKit?](https://joyofcode.xyz/what-is-sveltekit) I mentioned how SvelteKit is a Vite plugin and here it is — the beating heart of SvelteKit.

```js:vite.config.js showLineNumbers
import { sveltekit } from '@sveltejs/kit/vite'

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()]
}

export default config
```

You can include a Svelte config if you want to use a preprocessor and adapter.

```js:svelte.config.js showLineNumbers
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter()
  }
};

export default config
```

A preprocessor transforms your `.svelte` files before passing them to the compiler. In this case `vitePreprocess` handles TypeScript, PostCSS and SCSS as some of the language flavors which you can read more about in the [SvelteKit documentation](https://kit.svelte.dev/docs/integrations#preprocessors-vitepreprocess).

An adapter is used to **adapt** 🥁 your SvelteKit app to the deployment target. You could write your own adapter but the supported adapters include [Cloudflare Pages](https://developers.cloudflare.com/pages/), [Netlify](https://www.netlify.com/), [Vercel](https://vercel.com/) including Node.js and a static adapter or community adapters for platforms like Deno.

Next I'm going to add the HTML page template with placeholders SvelteKit uses and replaces for your pages.

```svelte:src/app.html showLineNumbers
<head>
  %sveltekit.head%
</head>

<body>
  %sveltekit.body%
</body>
```

The markup might be questionable but the browser is going to construct a proper HTML page despite which always fascinates me.

As the last step I'm going to add a route that's going to be the first page someone sees when they visit the site.

```svelte:src/routes/+page.svelte showLineNumbers
<h1>Hello</h1>
```

If you run `npm run dev` you have a working SvelteKit site! 🥳

SvelteKit creates a special `.svelte-kit` folder which you can ignore or delete that's going to generate files as you develop and regenerates each time you run `dev` or `build` — that's how the magic sauce works for generating types for your pages which you can find in `.svelte-kit/types`.

## Using The SvelteKit CLI

I'm going to create an empty SvelteKit project.

```shell:terminal
npm create svelte
```

I'm going with TypeScript and selecting ESLint, Prettier, Playwright and Vitest from the options.

```shell:terminal
┌  Welcome to SvelteKit!
│
◆ Where should we create your project?
│  sveltekit
│
◇  Which Svelte app template?
│  Skeleton project
│
◇  Add type checking with TypeScript?
│  Yes, using TypeScript syntax
│
◆  Select additional options (use arrow keys/space bar)
│  ◼ Add ESLint for code linting
│  ◼ Add Prettier for code formatting
│  ◼ Add Playwright for browser testing
│  ◼ Add Vitest for unit testing
└
```

You can use [JSDoc](https://jsdoc.app/) with regular JavaScript or TypeScript for types but I leave that up to you.

[ESLint](https://eslint.org/) is like a spell checker for your code that gives you useful warnings in your editor from checking your code for problems like accessibility. You're going to discover that ESLint and TypeScript make a great combination ensuring you don't do something goofy.

[Prettier](https://prettier.io/) is an opinionated code formatter. You might find it does some things you don't like but it's a great trade-off considering you don't have to think about formatting your code and it's going to be consistent for everyone else working on the project (I recommend you enable format on save which you can look up how to do for your editor).

[Playwright](https://playwright.dev/) is used for end-to-end testing. You can test how your user might use the site using a real browser and check for example if some content is showing or test your registration or checkout process.

[Vitest](https://vitest.dev/) is used for unit testing. That means you're testing one unit of your code. For example you can use Playwright to test your site using a real browser and see if your content works but you would use Vite to test the input and output of the function responsible for sorting the content in some order.

After everything is done you're going to inherit this beautiful tree (you might have to run `npm i` and `npm run dev` to generate some files).

```shell:terminal
.
├── .svelte-kit
├── node_modules
├── src
│   ├── lib
│   └── routes
│	├── app.d.ts
│   ├── app.html
│   ├── index.test.ts
├── static
├── tests
│   ├── test.ts
├── .eslint.cjs
├── .npmrc
├── .prettierrc
├── package.json
├── playwright.config.ts
├── package-lock.json
├── README.md
├── svelte.config.js
├── tsconfig.json
└── vite.config.ts
```

Here is the breakdown of the files:

- `.svelte-kit` folder is generated by SvelteKit and it's safe to remove
- `node_modules` is where your npm packages and binaries go
- `src` folder is the heart of your project:
  - `lib` can hold your shared components, utils or library code which can be imported using the `$lib` alias
  - `routes` contain the routes for your app
  - `app.d.ts` is used to add type information for some special SvelteKit objects
  - `app.html` is a template used by SvelteKit for your pages
  - `index.test.ts` is an example of a unit test using Vitest
- `static` is used for static assets (`robots.txt`, `favicon.png`)
- `tests`
  - `test.ts` is an example end-to-end test using Playwright
- `.eslint.cjs` is the ESLint config
- `.npmrc` is the npm config
- `.prettierrc` is the Prettier config
- `package.json` holds your dependencies and uses `"type": "module"` for native JavaScript modules with `import` and `export` keywords and legacy CommonJS files need a `.cjs` extension
- `playwright.config.ts` are the options for Playwright used for testing
- `package-lock.json` keeps track of your npm dependencies version
- `tsconfig.json` are the compiler options for TypeScript
- `svelte.config.js` contains your Svelte and SvelteKit configuration
- `vite.config.ts` contains your Vite config

There are some files I **ignored** 🥁 like `.gitignore`, `.eslintignore`, `.prettierignore` as they're not meaningful and do what the name implies specifying files to ignore in their config.

If you're newer to development you might be hearing for the first time about some of these things but you can ignore most of them.

I hope this gave you a better understanding of these configuration files in general because you're going to see them in every JavaScript project but now you're a certified SvelteKit connoisseur.

In the next part you're going to [learn everything about SvelteKit routing](https://joyofcode.xyz/sveltekit-routing) including how to create pages, layouts and nested routes.
