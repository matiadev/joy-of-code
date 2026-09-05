---
title: How to Structure Your React Projects
description: Learn how to keep your React projects organized.
slug: react-project-structure
published: '2021-6-12'
category: react
---

## Table of Contents

## Use Path Aliases

You've probably seen imports like:

```js:Example.tsx
import { Component } from '../../Component'
```

Even with your editor being context-aware of where you are and helping you with autocomplete suggestions finding the path can be a pain.

This is why path aliases are awesome:

```js:Example.tsx
import { Component } from '@/root/components/Component'
```

That's not a `node_modules` import. It's a path alias resolved by the tooling around the framework. You can have paths to your components, styles, and utils. I prefer just including a root path in my project.

If you're using [Create React App (CRA)](https://create-react-app.dev/), you can look into using [Create React App Configuration Override (CRACO)](https://www.npmjs.com/package/@craco/craco) package that lets you customize Create React App without having to [eject](https://create-react-app.dev/docs/available-scripts/#npm-run-eject).

You can set it up with ease if you're using [Next.js](https://nextjs.org/) or [Vite](https://vitejs.dev/).

Next.js example:

```json:tsconfig.json showLineNumbers
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/root/*": ["./*"]
    }
  }
}
```

If you're not using TypeScript, the file is `jsconfig.json`. You can learn more about [absolute imports and module path aliases](https://nextjs.org/docs/advanced-features/module-path-aliases) for Next.js.

Vite example:

```json:tsconfig.json showLineNumbers
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@root/*": ["./*"]
    }
  }
}
```

It's necessary so TypeScript doesn't complain about the path not existing and can provide autocompletion.

```ts:vite.config.ts showLineNumbers
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@root': path.resolve(__dirname, ''),
    },
  },
})
```

You can learn more from the [Vite docs](https://vitejs.dev/config/#resolve-alias).

## Folder Structure

I'm used to no `src` folder with Next.js. If you prefer that, you can continue using that. Everything here is framework agnostic, so I'm not going to include required things for Next.js like the `pages` or `public` folder.

This is the default project structure:

```shell:structure
root/
├─ components/
│  ├─ shared/
├─ hooks/
├─ lib/
├─ providers/
├─ scripts/
├─ styles/
├─ tests/
├─ types/
├─ utils/
```

It makes your project structure easily scannable:

- `components` are self-explanatory with the exception that they include a `shared` folder for shared components
- `hooks` are where you keep reusable React hooks
- `lib` is where you store third party code (e.g., client API for a CMS, analytics)
- `providers` is where you keep your [context](https://reactjs.org/docs/hooks-reference.html#usecontext) providers
- `scripts` could be **Bash** or **Node** scripts you can run
- `styles` could hold anything related to styles even if you're using [CSS-in-JS](https://en.wikipedia.org/wiki/CSS-in-JS) you could have some logic (I use it for cards on the site)
- `tests` are where you keep tests, I prefer this over the **\_\_tests\_\_** convention (if you want to learn testing use [Testing Library](https://testing-library.com/))
- `types` is where you keep your reusable TypeScript types (if used in a single component, I don't include it here), if you're using a npm package without types, you can add `index.d.ts` and `declare module 'package-name'` so TypeScript doesn't complain
- `utils` are helpful functions such as currency conversion

If you have static assets such as images or fonts, they should be placed inside the `assets` or `static` folder.

## Components

Let's say we're creating an audio player component:

```shell:Structure
root/
├─ components/
│  ├─ AudioPlayer/
│  │  ├─ AudioPlayer.tsx
│  │  ├─ index.ts
```

The rules I abide by are:

- Capitalized names for React components
- Have a proper `.tsx` or `.jsx` extension for React components
- If the file is not a component, it should have a proper `.ts` or `.js` extension
- Use named function exports for components
- Components have to be organized together with other nested components
- If nested components have their nested components, they should also be in a separate folder
- Nested components should be kept low to three to not get out of hand

I value semantics and clarity above everything else. You're not only saving your future self the trouble, but anyone else looking at your project.

Let me explain why I have included the `AudioPlayer.tsx` and `index.ts` file:

```tsx:AudioPlayer.tsx showLineNumbers
export function AudioPlayer() {
  // ...
}
```

```ts:index.ts
export * from './AudioPlayer'
```

This is because of how we import the component:

```tsx:App.tsx
import { AudioPlayer } from '@/root/components/AudioPlayer'
```

We're only using `index.ts` to export our component, so we get a cleaner import.

We can use this method to create a barrel file which is just a terminology that describes exports from several modules into a single file. You often see a library use this to export their methods.

This avoids doing this:

```tsx:App.tsx
import { AudioPlayer } from '@/root/components/AudioPlayer/AudioPlayer'
```

Another reason is easier file discovery in your editor. We could do a search with <kbd>Ctrl</kbd> + <kbd>P</kbd> in VS Code to look up the `AudioPlayer` component and it wouldn't have a descriptive file name if we put everything inside `index.ts`.

Let's add a `AudioPlayerControls` component:

```shell:Structure
root/
├─ components/
│  ├─ AudioPlayer/
│  │  ├─ AudioPlayer.tsx
│  │  ├─ AudioPlayerControls.tsx
│  │  ├─ index.ts
```

```tsx:AudioPlayerControls.tsx showLineNumbers
export function AudioPlayerControls() {
  // ...
}
```

```tsx:AudioPlayer.tsx showLineNumbers
import { AudioPlayerControls } from './AudioPlayerControls'

export function AudioPlayer() {
  return <AudioPlayerControls />
}
```

We don't have to use a path alias since it's clear where it's coming from and makes future refactoring easier.

If we add a shared component it's more clear:

```tsx:AudioPlayer.tsx showLineNumbers
import { AudioPlayerControls } from './AudioPlayerControls'
import { SharedComponent } from '@/root/components/shared/SharedComponent'

export function AudioPlayer() {
  return (
    <>
      <AudioPlayerControls />
      <SharedComponent />
    </>
  )
}
```

Let's say our `AudioPlayerControls` component has a nested `VolumeControl` component.

This would mean moving `AudioPlayerControls` into a separate folder:

```shell:Structure
root/
├─ components/
│  ├─ AudioPlayer/
│  │  ├─ AudioPlayerControls/
│  │  │  ├─ AudioPlayerControls.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ VolumeControl.tsx
│  │  ├─ AudioPlayer.tsx
│  │  ├─ index.ts
```

Since we moved everything inside `AudioPlayerControls` folder to keep our imports clean we add a `index.ts` file:

```ts:index.ts
export * from './AudioPlayerControls'
```

We create the new component:

```tsx:VolumeControl.tsx showLineNumbers
export default function VolumeControl() {
  // ...
}
```

Import the newly created component:

```tsx:AudioPlayerControls.tsx showLineNumbers
import { VolumeControl } from './VolumeControl'

export function AudioPlayerControls() {
  return <VolumeControl />
}
```

A good rule of thumb when writing a React component is making the component as long as possible. You do this until it becomes hard to manage.

You're going to realize what to break into components when you see things repeating. It's going to save you a lot of problems down the line if you only abstract code when it makes sense.

## Why Named Exports?

The default export is the most commonly used one:

```tsx:Component.tsx showLineNumbers
export default function Component() {
  // ...
}
```

This is a named export:

```tsx:Component.tsx showLineNumbers
export function Component() {
  // ...
}
```

Why I prefer named exports comes down to how we use it to import our components.

Importing a default export:

```tsx:Example.tsx
import Component from './Component'
```

Since the name of the import can be anything, we can get into problems when refactoring later. Our autocomplete is also worse.

Import a named export:

```tsx:Example.tsx
import { Component } from './Component'
```

In our editor, we get improved autocomplete from TypeScript on what's available from the component.

We could have a default export and later decide to add more exports. It's more work.

## Why Named Functions?

Take this component for example:

```tsx:Component.tsx
const Component = (props) => <h1>{props.greeting}</h1>
```

Anonymous arrow functions are great for inline functions and things like higher-order functions. I prefer to use it when it makes sense.

The problem I have with this used for components is you think it saves you time, but it's more typing with fewer benefits.

There's also the problem others point out that it shows as anonymous when you debug it instead of showing you the name.

We often have to log out values to the console:

```tsx:Component.tsx showLineNumbers
const Component = (props) => {
  console.log(props)
  return <h1>{props.greeting}</h1>
}
```

You can see how this would become tedious. I'm going to give you a lazier reason. It's more work.

## Sorting Your Imports

I sort imports in this order:

1. npm imports
2. Components
3. Types
4. Styles

```tsx:index.tsx showLineNumbers
import React from 'react'
import ReactDOM from 'react-dom'

import { Component } from '@/root/shared/components/Component'

import type { Types } from '@/root/types'

import '@/root/styles/style.css'

function App() {
  return <Component />
}

ReactDOM.render(<App />, document.getElementById('app'))
```

I don't even import styles. That's only in the case if you're using [CSS Modules](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/), but most people use some form of CSS-in-JS like [styled-components](https://styled-components.com/) or frameworks such as [Tailwind CSS](https://tailwindcss.com/).

## Imports And Props Sorting

The reason why I sort things in alphabetical order is that it delegates some of the decision-making I have to do and keeps the code organized.

It's one less thing I have to think about. These are just simple rules you can add to your [ESLint](https://eslint.org/) config.

Your ESLint config:

```js:.eslintrc.js showLineNumbers
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    es6: true,
    browser: true,
    jest: true,
    node: true,
  },
  rules: {
    // ...
  }
}
```

Props sorting rule:

```js:.eslintrc.js showLineNumbers
rules: {
  'react/jsx-sort-props': [
    'error',
    {
      ignoreCase: true,
      reservedFirst: true,
    },
  ]
}
```

I ignore the case of the component and put reserved React props at the top. Learn more about [enforcing props alphabetical sorting](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-sort-props.md).

Sort imports rule:

```js:.eslintrc.js showLineNumbers
rules: {
  'sort-imports': [
    'error',
    {
      ignoreCase: true,
      ignoreDeclarationSort: false,
      ignoreMemberSort: false,
      memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      allowSeparatedGroups: true,
    },
  ],
}
```

I separate imports into groups, so it doesn't treat everything as one thing. You can learn more about [import sorting](https://eslint.org/docs/rules/sort-imports).

## Prettier

Since I'm going over code organization, I have to mention the code beautifier [Prettier](https://prettier.io/). If you never used it, don't wait. It's for the same reason I mentioned above. It delegates decision-making.

## Templates

If you found a project setup you enjoy, that's great. You can always create a repository on [GitHub](https://github.com/) from which you can clone your project. It takes only a couple of steps.

You can turn the repository into a template which is like cloning a repository but gives you a clean project with no history. You can learn more on [creating a template repository](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-on-github/creating-a-template-repository).

## Conclusion

React's unopinionated nature is liberating but also tiring because you have to make more decisions.

There's no right way to structure React projects. I hope you take any ideas you read here to decide if they make sense for you.

Thanks for reading! 🏄️
