---
title: How To Create And Publish Your JavaScript Library With SvelteKit
description: Learn how to publish a JavaScript package to npm, and how to use SvelteKit to test, package, and publish a Svelte, or JavaScript library.
slug: how-to-publish-a-javascript-library
published: '2023-11-10'
category: sveltekit
---

<script lang="ts">
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="Xvq8rCl1lIM" title="How To Create And Publish Your JavaScript Library With SvelteKit" />

## Table of Contents

## Node Package Manager

In case you didn't know, npm is the package manager for [Node.js](https://nodejs.org/en).

The [npm registry](https://www.npmjs.com/) is a public collection of packages of open-source code for Node.js, front-end web apps, mobile apps, robots, routers, and countless other needs of the JavaScript community.

`npm` is the command line client that allows developers to install and publish those packages.

In this post I'm going to explain the basics of publishing a package to npm, and how using [SvelteKit](https://kit.svelte.dev/) can make testing, packaging and publishing a Svelte, or JavaScript library to npm easier.

## Creating Your First Package

You can publish any piece of code to npm, from simple utility functions, to libraries, and frameworks, so don't think of npm as this serious thing (you only have to look at [is-odd](https://www.npmjs.com/package/is-odd) with **300,000+** monthly downloads 😂).

The only thing you have to do is [sign up for an account on npm](https://www.npmjs.com/signup).

After you're done, let's start by creating your first package.

You can use `npm init`, which is going to prompt you to answer questions related to your package, and create a `package.json` file.

```shell:terminal
npm init
```

I'm going to create a basic `package.json` file instead, because most [package.json fields](https://docs.npmjs.com/cli/v10/configuring-npm/package-json) aren't relevant to us.

The only important field inside `package.json` is the **name** of the package, and the **version** number.

```json:greet/package.json {2-3} showLineNumbers
{
  "name": "greet",
	"version": "0.0.1",
	"main": "index.js",
	"type": "module"
}
```

You should respect [semantic versioning](https://semver.org/) when updating your package, but it's not enforced by npm.

If you have a build step, you can change the **main** entry point of your program from `index.js`, to another path, such as `dist/index.js`.

To use the modern JavaScript `import` syntax, you have to specify that the **type** of your package is a `module`.

Create and export a simple `greet` function from `index.js`.

```js:greet/index.js showLineNumbers
export function greet() {
	console.log('hi')
}
```

You can run the script with `node index.js`.

It would be easier if you could import `greet` inside of another project as a regular package, to make sure it works.

## Testing Your Package

Create a `test` folder with a `package.json` file, which also needs to be a **module** to work with the `greet` package.

To test a package, you can use [npm link](https://docs.npmjs.com/cli/v9/commands/npm-link), which links a package globally, and lets you use it anywhere.

Inside the `greet` package folder, run `npm link` to create a global link to the `greet` package.

```shell:terminal
npm link
```

You can run `npm ls --link --global` to see your linked packages.

```shell:terminal
└── greet@0.0.1 -> ./../../../../../greet
```

To link the `greet` package in `test`, run `npm link greet`, which is going to link the `greet` package inside `node_modules`.

```shell:terminal
npm link greet
```

You can use `greet` like a regular package inside `test/index.js`.

```js:test/index.js
import { greet } from 'greet'

greet() // "hi"
```

You can run `npm unlink greet`, to remove the linked package from `test`.

```shell:terminal
npm unlink greet
```

To completely remove the package, run `npm uninstall -g greet`.

```shell:terminal
npm uninstall -g greet
```

If you use [pnpm](https://pnpm.io/), you can use [pnpm link](https://pnpm.io/cli/link) where `pnpm link -g` creates a link to a package, and `pnpm link -g greet` links the package.

## Publishing Your Package

To publish a package to npm, run `npm publish` (if you aren't signed in to npm, you're going to be prompted to do so).

```shell:terminal
npm publish
```

You might run into this problem.

```shell:terminal
403 Forbidden
PUT https://registry.npmjs.org/greet
You do not have permission to publish "greet".
```

This package already exists!

You can rename the package to something more unique, but it's easier to scope the package to an organization, by [creating an organization on npm](https://www.npmjs.com/org/create).

Use the name of the organization you created.

```shell:terminal {2}
{
	"name": "@joyofcode/greet",
	"version": "0.0.1",
	"main": "index.js",
	"type": "module"
}
```

If you try to publish the package now, it won't work because scoped packages are private by default, which is a paid feature of npm.

```shell:terminal
 402 Payment Required
 PUT https://registry.npmjs.org/@joyofcode%2fgreet
 You must sign up for private packages.
```

You have to pass the `--access=public` flag, to [make your package public](https://docs.npmjs.com/cli/v8/commands/npm-publish#access).

```shell:terminal
npm publish --access=public
```

Your package is now available on npm, and ready to be installed.

```shell:terminal
Publishing to https://registry.npmjs.org/ with tag latest and public access
+ @joyofcode/test@0.0.1
```

Congrats! 🎉

## Unpublishing Your Package

You have 72 hours to [unpublish your package from npm](https://docs.npmjs.com/unpublishing-packages-from-the-registry).

```shell:terminal
npm unpublish @joyofcode/greet -f
```

This is because someone in the past removed [left-pad](https://www.npmjs.com/package/left-pad), and broke the internet, so npm decided to not let anyone delete a package someone depends on anymore.

## Using SvelteKit To Package Libraries

In most cases your library isn't this simple, and you want things like TypeScript, testing, linting and formatting, which is a pain to set up.

Not only does SvelteKit make this easy, but you can run the `package` command to package the `src/lib` contents into a `dist` directory, with your transpiled JavaScript files, and generated types.

To get started, run `npm create svelte`, pick the **library** template, and select the options you want.

```shell:terminal showLineNumbers
┌  Welcome to SvelteKit!
│
◇ Where should we create your project?
│  (hit Enter to use current directory)
│
◇ Which Svelte app template?
│  Library project
│
◇ Add type checking with TypeScript?
│  Yes, using TypeScript syntax
│
◆ Select additional options (use arrow
keys/space bar)
│  ◻ Add ESLint for code linting
│  ◻ Add Prettier for code formatting
│  ◻ Add Playwright for browser testing
│  ◻ Add Vitest for unit testing
└
```

Using the **library** template, `src/lib` becomes the main part of your app, and `src/routes` can be used for testing, and documentation.

Everything is already set up inside `package.json`, which you can [learn more about](https://kit.svelte.dev/docs/packaging) in the SvelteKit docs.

The most important fields are `exports` and `files`:

- `exports` helps TypeScript and Svelte tooling know what to do
- `files` is to let npm know what files to upload, and which ones to ignore

```json:package.json showLineNumbers
{
	"exports": {
		".": {
			"types": "./dist/index.d.ts",
			"svelte": "./dist/index.js"
		}
	},
	"files": [
		"dist",
		"!dist/**/*.test.*",
		"!dist/**/*.spec.*"
	]
}
```

If you're not publishing a Svelte library, rename the **svelte** field to **default**.

```json:package.json {5} showLineNumbers
{
	"exports": {
		".": {
			"types": "./dist/index.d.ts",
			"default": "./dist/index.js"
		}
	}
}
```

You can link and test your package the same way as before with `npm link`. If you're satisfied with everything, run `npm run package` to package your library.

```shell:terminal
npm run package
```

This is going to create a `dist` folder at the root.

To publish the package, run `npm publish`, or `npm publish --access=public` if you have a scoped package.
You can build your docs with `npm run build`, and host it anywhere, like any regular SvelteKit site.

That's it! 😄
