---
title: Make a Svelte Todo App
description: Learn Svelte by making an awesome Svelte todo app.
slug: svelte-todo-app
published: '2022-1-12'
category: svelte
---

<script lang="ts">
	import Embed from '#lib/components/embed.svelte'
	import Image from '#lib/components/image.svelte'
	import Video from '#lib/components/video.svelte'
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="cQYLPhBmqG8" title="Make a Svelte Todo App" />

## Table of Contents

## The Project

You can watch the [Make A Svelte Todo App](https://www.youtube.com/playlist?list=PLA9WiRZ-IS_xz1M4H0fjZAii4vzRffTno) playlist on YouTube and find the [source files on GitHub](https://github.com/JoysOfCode/svelte-todo).

This is an interactive example! 🦄

<Embed src="https://svelte-todo-list-app.netlify.app/" title="Svelte Todo App" />

In the previous [Svelte For Beginners](https://joyofcode.xyz/svelte-for-beginners) post we learned Svelte fundamentals and now it's time to put what we learned into practice.

At the end I told you to go and build something but sometimes it's nice to have a friend to guide you through it. I also want to share my thought process instead of just making you do things because that's not a great way to learn and I'd rather you learn by working on things you care about.

I know from the title of the post some of you might be yawning 🥱 at the idea of yet another todo app but stick around!

This is just an excuse for us to learn more about how using Svelte might look in a real project and in another post I'm going to show you how to add tests to have more confidence your code works as expected. It's going to be awesome!

We're going to be making a todo list app based on [TodoMVC](https://todomvc.com/) which is one of my favorite examples when learning anything new because it teaches us everything we need to know about what we're trying to learn because everything you build includes creating, reading, updating and deleting content.

## Learn From Reverse Engineering

I understand a lot of you might struggle with how to get started and I want you to know that's **normal**.

The more you work on things the more experience you have and your tool belt helps you solve more problems like Batman (ignoring striking fear in the hearts of criminals at night 🦇).

Let's say you were tasked to make something like [TodoMVC](https://todomvc.com/examples/vanilla-es6/). It might be intimidating at first but let's break everything into smaller parts. It's mostly a text input field adding what you just typed to the screen.

Focus on one step at a time. 👍️

One thing I would be distracted by is the animations when you complete a todo and notice if you double-click the todo you can edit it.

This might look complicated, right? 😱

Here is where I would open the browser developer tools with <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd> and spend some time inspecting how it works.

<Image src="todomvc-editing.webp" alt="TodoMVC editing a todo item" />

Huh? it's not bad as you thought! If you see it's just hiding the todo label and replacing it with a text input field of the same value if you're in the editing state.

This is such a great touch that might look complicated at first but if you spend time figuring out how it works you can see it's not that complicated.

Next thing I would do to learn how it works is to copy the HTML and CSS. You don't even need JavaScript because you can just use fake data in the markup.

In fact you can even disable the styles on the page by removing the `<head>` so you can focus on how it works.

If we did this before we would immediately see through the magic trick. 🪄

<Image src="todomvc-without-styles.webp" alt="TodoMVC todo list markup without styles" />

This can be great fun! Instead of getting overwhelmed by everything observe how it works and write it down as a todo list (I know 🤭).

- **Add todo**
  - Input should be focused when page loads
  - Only show add todo if there are no other todos
  - After adding todo clear and focus input
  - Only show mark todos as completed if there are todos
  - Use enter to add todo
  - Mark todo as completed
  - Mark all todos as completed
  - Mark all todos as uncompleted
- **Remove todo**
  - Hovering over a todo shows the option to remove it
- **Edit todo**
  - Using **Escape** and **Enter** saves the edit
  - When focus leaves input save todo
- **Show how many todos are left**
  - Use **item** when there's a single todo and **items** for many
- **Filter todos**
  - All, Active, Completed
  - Highlight selected filter
- **Clear completed todos**
  - Show only when there is at least one completed todo
- **Add persistent storage**

## Project Setup

We're going to use [Vite](https://vitejs.dev/) which is a fast and simple build tool with a lot of presets for different frameworks so we can focus on Svelte instead of configuring things.

I'm going to be using [VS Code](https://code.visualstudio.com/) as my editor (you're going to need the [Svelte for VS Code extension](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)) but you can use a web based editor like [CodeSandbox](https://codesandbox.io/) which is great if you're on a potato 🥔. In that case, just pick the Svelte preset and you're good.

🖌️ In your terminal create the Vite project and pick Svelte with TypeScript.

```shell:terminal
npm init vite@latest
```

```shell:terminal
✔ Project name: … svelte-todo
✔ Package name: … svelte-todo
? Select a framework: › - Use arrow-keys. Return to submit.
    vanilla
    vue
    react
    preact
    lit
❯   svelte
```

I'm going to use Svelte with TypeScript so select `svelte-ts` but it's purely optional. When you see types you can simply ignore them.

```shell:terminal
? Select a variant: › - Use arrow-keys. Return to submit.
    svelte
❯   svelte-ts
```

Don't forget to install the packages.

```shell:terminal
npm i
```

This is the typical folder structure you're going to see.

```shell:terminal
svelte-todo/
├── .vscode
├── dist
├── public
└── src/
    ├── assets
    ├── lib
    ├── App.svelte
    └── main.ts
```

- **.vscode** contains workspace settings for Visual Studio Code and is safe to remove
- **dist** is the build output (you're not going to see it until your run `npm run build`)
- **public** is where you keep your public files such as images and your favicon
- **src** is where you keep your source files
- **assets** and **lib** are for your assets and components but it's safe to remove because it's not convention

🖌️ Remove what we don't need:

- **.vscode**
- **/src/assets**
- **/src/lib**

🖌️ Inside **App.svelte** remove everything.

```svelte:src/App.svelte
<h1>Hello, World 👋</h1>
```

If you run the project and visit http://localhost:3000/ you should see "Hello, World 👋" on the screen. If you want you can also change the title of the page inside `index.html`.

```shell:terminal
npm run dev
```

## Path Alias

Before we continue let's set up a **path alias** so we can import files using `$root` which means the root of our project so if you have nested imports you don't have to do `../../Component.svelte` gymnastics.

You can set up as many of path aliases as you want for example `$components`, `$styles` and so on but I prefer to keep it simple. I'm using the `$` prefix because that's what [SvelteKit](https://kit.svelte.dev/) uses.

🖌️ Change `vite.config.js`.

```js:vite.config.js {3,7-11} showLineNumbers
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      $root: path.resolve('./src'),
    },
  },
})
```

🖌️ If you're using TypeScript we also need to let the TypeScript compiler know about this.

```json:tsconfig.json {10-13} showLineNumbers
{
  "extends": "@tsconfig/svelte/tsconfig.json",
  "compilerOptions": {
    "target": "esnext",
    "useDefineForClassFields": true,
    "module": "esnext",
    "resolveJsonModule": true,
    "allowJs": true,
    "checkJs": true,
    "baseUrl": ".",
    "paths": {
      "$root/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.d.ts", "src/**/*.ts", "src/**/*.js", "src/**/*.svelte"]
}
```

## Global Styles

🖌️ Add a `global.css` file that includes a CSS reset, CSS variables, some utilities and focus styles.

<details>
	<summary>src/styles/global.css</summary>

```css:global.css showLineNumbers
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap');

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --sans-serif: 'Inter', sans-serif;

  --color-bg: hsl(220, 20%, 14%);
  --color-text: hsl(0, 0%, 2%);
  --color-title: hsl(357, 49%, 48%);
  --color-highlight: hsl(0, 33%, 64%);
  --color-gray-28: hsl(0, 0%, 28%);
  --color-gray-58: hsl(0, 0%, 58%);
  --color-gray-90: hsl(0, 0%, 90%);

  --font-24: 1.5rem;
  --font-32: 2rem;
  --font-80: 5rem;

  --spacing-4: 0.25rem;
  --spacing-8: 0.5rem;
  --spacing-16: 1rem;

  --shadow-1: hsl(0, 0%, 0%, 0.1);

  --radius-base: 4px;
}

html,
body {
  height: 100%;
}

body {
  display: grid;
  place-content: center;
  font-family: var(--sans-serif);
  font-weight: 300;
  line-height: 1.4;
  background-color: var(--color-bg);
  color: var(--color-text);
}

label,
input,
button {
  font-family: inherit;
  font-weight: inherit;
  line-height: inherit;
  color: inherit;
}

button {
  background: none;
  border: 0;
  cursor: pointer;
}

.hidden {
  visibility: hidden;
}

:focus,
.toggle:focus + label,
.toggle-all:focus + label {
  box-shadow: 0 0 2px 2px var(--color-highlight);
  outline: 0;
}
```

</details>

You can include the styles inside `index.html` but you wouldn't benefit from HMR (hot module replacement) meaning you won't see updates instantly as you make changes so let's include the styles inside `App.svelte`.

```svelte:src/App.svelte {2} showLineNumbers
<script lang="ts">
	import '$root/styles/global.css'
</script>

<h1>Hello, World 👋</h1>
```

Path aliases are awesome! 😄

## Adding The Markup

I prefer to keep everything inside one file until it becomes hard to manage. We're going to keep everything inside `Todos.svelte` until I conveniently need to split things up for the sake of the tutorial.

First let's create a `Todos.svelte` file in `src/components` and then import it in `App.svelte`.

🖌️ Inside `Todos.svelte` add this markup.

```svelte:src/components/Todos.svelte showLineNumbers
<main>
  <h1 class="title">todos</h1>

  <section class="todos">
    <form>
      <input type="checkbox" id="toggle-all" class="toggle-all" />
      <label aria-label="Mark all as complete" for="toggle-all">
        Mark all as complete
      </label>

      <input
        id="new-todo"
        class="new-todo"
        placeholder="What needs to be done?"
        type="text"
        autofocus
      />
    </form>

    <ul class="todo-list">
      <li class="todo">
        <div class="todo-item">
          <div>
            <input id="todo" class="toggle" type="checkbox" />
            <label aria-label="Check todo" class="todo-check" for="todo" />
          </div>
          <span class="todo-text">Todo 1</span>
          <button aria-label="Remove todo" class="remove" />
        </div>

        <!-- <input class="edit" type="text" autofocus /> -->
      </li>
    </ul>

    <div class="actions">
      <span class="todo-count">0 left</span>
      <div class="filters">
        <button class="filter">All</button>
        <button class="filter">Active</button>
        <button class="filter">Completed</button>
      </div>
      <button class="clear-completed">Clear completed</button>
    </div>
  </section>
</main>
```

🖌️ Add the styles for `Todos.svelte`.

<details>
  <summary>Todos.svelte</summary>

```svelte:App.svelte showLineNumbers
<style>
  /* Todos */

  .title {
    font-size: var(--font-80);
    font-weight: inherit;
    text-align: center;
    color: var(--color-title);
  }

  .todos {
    --width: 500px;
    --todos-bg: hsl(0 0% 98%);
    --todos-text: hsl(220 20% 14%);

    width: var(--width);
    color: var(--todos-text);
    background-color: var(--todos-bg);
    border-radius: var(--radius-base);
    border: 1px solid var(--color-gray-90);
    box-shadow: 0 0 4px var(--shadow-1);
  }

  .todo-list {
    list-style: none;
  }

  .actions {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-8) var(--spacing-16);
    font-size: 0.9rem;
    border-top: 1px solid var(--color-gray-90);
  }

  .actions:before {
    content: '';
    height: 40px;
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    box-shadow: 0 1px 1px hsla(0, 0%, 0%, 0.2), 0 8px 0 -3px hsl(0, 0%, 96%),
      0 9px 1px -3px hsla(0, 0%, 0%, 0.2), 0 16px 0 -6px hsl(0, 0%, 96%),
      0 17px 2px -6px hsla(0, 0%, 0%, 0.2);
    z-index: -1;
  }

  /* Add todo */

  .toggle-all {
    width: 1px;
    height: 1px;
    position: absolute;
    opacity: 0;
  }

  .toggle-all + label {
    position: absolute;
    font-size: 0;
  }

  .toggle-all + label:before {
    content: '❯';
    display: block;
    padding: var(--spacing-16);
    font-size: var(--font-24);
    color: var(--color-gray-58);
    transform: rotate(90deg);
  }

  .toggle-all:checked + label:before {
    color: var(--color-gray-28);
  }

  .new-todo {
    width: 100%;
    padding: var(--spacing-16);
    padding-left: 60px;
    font-size: var(--font-24);
    border: none;
    border-bottom: 1px solid var(--shadow-1);
  }

  /* Todo */

  .todo {
    font-size: var(--font-24);
    font-weight: 400;
    border-bottom: 1px solid #ededed;
  }

  .todo:last-child {
    border-bottom: none;
  }

  .todo-check,
  .todo-text {
    display: block;
    padding: var(--spacing-16);
    color: var(--color-gray-28);
    transition: color 0.4s;
  }

  .todo-check {
    border-radius: 100%;
  }

  .completed {
    color: var(--color-gray-58);
    text-decoration: line-through;
  }

  .todo-item {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 var(--spacing-8);
  }

  .editing .todo-item {
    display: none;
  }

  .edit {
    width: 100%;
    padding: var(--spacing-8);
    font-size: var(--font-24);
    border: 1px solid #999;
    border-radius: var(--radius-base);
    box-shadow: inset 0 -1px 5px 0 var(--shadow-1);
  }

  .toggle {
    position: absolute;
    top: 26px;
    left: 13px;
    transform: scale(2);
    opacity: 0;
  }

  .toggle + label {
    background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23949494%22%20stroke-width%3D%223%22/%3E%3C/svg%3E');
    background-repeat: no-repeat;
    background-position: 84% 50%;
  }

  .toggle:checked + label {
    background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%2359A193%22%20stroke-width%3D%223%22%2F%3E%3Cpath%20fill%3D%22%233EA390%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22%2F%3E%3C%2Fsvg%3E');
  }

  .remove {
    display: none;
    margin-left: auto;
    font-size: var(--font-32);
    color: var(--color-gray-58);
    transition: color 0.2s ease-out;
  }

  .remove:hover {
    color: var(--color-highlight);
  }

  .remove:after {
    content: '×';
  }

  .todo:hover .remove {
    display: block;
  }

  /* Filters */

  .filters {
    display: flex;
    gap: var(--spacing-4);
  }

  .filter {
    text-transform: capitalize;
    padding: var(--spacing-4) var(--spacing-8);
    border: 1px solid transparent;
    border-radius: var(--radius-base);
  }

  .filter:hover {
    border: 1px solid var(--color-highlight);
  }

  .selected {
    border-color: var(--color-highlight);
  }
</style>
```

</details>

🖌️ Update `App.svelte`.

```svelte:App.svelte {2,6} showLineNumbers
<script lang="ts">
  import Todos from '$root/components/Todos.svelte'
  import '$root/styles/global.css'
</script>

<Todos />
```

I named the sections in the styles so it's easier for you to know what to move later into components.

If you notice we already checked some of the items from the list such as the input being focused when the page loads and because we're using a `<form>` we can use <kbd>Enter</kbd> to submit.

The use of `autofocus` is discouraged because it's bad for accessibility but in this case we only have one area of the page we're using.

If you're using a linter and your editor is complaining at you for using `autofocus` as it should you can disable the rule.

```svelte:App.svelte showLineNumbers
<!-- svelte-ignore a11y-autofocus -->
<input class="edit" type="text" autofocus />
```

## Showing List of Todos

🖌️ Let's use some fake data inside `Todos.svelte` to have something to work with and loop over the todo list.

```svelte:src/components/Todos.svelte {2,4-10,33-55} showLineNumbers
<script lang="ts">
	import type { ITodo } from '$root/types/todo'

  // state
  let todos: ITodo[] = [
    { id: '1e4a59703af84', text: 'Todo 1', completed: true },
    { id: '9e09bcd7b9349', text: 'Todo 2', completed: false },
    { id: '9e4273a51a37c', text: 'Todo 3', completed: false },
    { id: '53ae48bf605cc', text: 'Todo 4', completed: false },
  ]
</script>

<main>
  <h1 class="title">todos</h1>

  <section class="todos">
    <form>
      <input type="checkbox" id="toggle-all" class="toggle-all" />
      <label aria-label="Mark all as complete" for="toggle-all">
        Mark all as complete
      </label>

      <input
        id="new-todo"
        class="new-todo"
        placeholder="What needs to be done?"
        type="text"
        autofocus
      />
    </form>

    <ul class="todo-list">
      {#each todos as todo (todo.id)}
        <li class="todo">
          <div class="todo-item">
            <div>
              <input
                checked={todo.completed}
                id="todo"
                class="toggle"
                type="checkbox"
              />
              <label
								aria-label="Check todo"
								class="todo-check"
								for="todo"
							/>
            </div>
            <span class="todo-text">{todo.text}</span>
            <button aria-label="Remove todo" class="remove" />
          </div>

          <!-- <input class="edit" type="text" autofocus /> -->
        </li>
      {/each}
    </ul>

    <div class="actions">
      <span class="todo-count">0 left</span>
      <div class="filters">
        <button class="filter">All</button>
        <button class="filter">Active</button>
        <button class="filter">Completed</button>
      </div>
      <button class="clear-completed">Clear completed</button>
    </div>
  </section>
</main>

<!-- ... -->
```

🖌️ Create the types in `src/types/todo.ts`.

```ts:src/types/todo.ts showLineNumbers
export interface ITodo {
  id: string
  text: string
  completed: boolean
}
```

If you don't want to use TypeScript just ignore the types! 👍️

<Image src="todos-list.webp" alt="Showing list of todo items" />

You should see a list of todo items.

If you want to you can add `$: console.log(todos)` inside `Todos.svelte` to see the values update when you change them so it's easier to see what's going on in the future.

## Adding Todo Items

🖌️ First let's create a `AddTodo.svelte` file in `src/components` and move the markup and styles for it from `Todos.svelte`.

```svelte:src/components/AddTodo.svelte showLineNumbers
<form>
  <input type="checkbox" id="toggle-all" class="toggle-all" />
  <label aria-label="Mark all as complete" for="toggle-all">
    Mark all as complete
  </label>

  <input
    id="new-todo"
    class="new-todo"
    placeholder="What needs to be done?"
    type="text"
    autofocus
  />
</form>

<style>
  .toggle-all {
    width: 1px;
    height: 1px;
    position: absolute;
    opacity: 0;
  }

  .toggle-all + label {
    position: absolute;
    font-size: 0;
  }

  .toggle-all + label:before {
    content: '❯';
    display: block;
    padding: var(--spacing-16);
    font-size: var(--font-24);
    color: var(--color-gray-58);
    transform: rotate(90deg);
  }

  .toggle-all:checked + label:before {
    color: var(--color-gray-28);
  }

  .new-todo {
    width: 100%;
    padding: var(--spacing-16);
    padding-left: 60px;
    font-size: var(--font-24);
    border: none;
    border-bottom: 1px solid var(--shadow-1);
  }
</style>
```

`AddTodo.svelte` is going take a couple of props:

- **addTodo** function that takes a todo and updates the todo list in
- **toggleCompleted** function that's going to toggle the completion of the todos
- **todosAmount** so we know the todos count to show and hide marking the todos as completed

We're also going to use `todosAmount` to show the information and options for the todo items only if there are todo items.

Parts of our application depend on the same values such as `todos` and `todosAmount` but in the future you can use a Svelte store if you want.

🖌️ Let's keep it simple and define what we need inside `Todos.svelte` and simply pass the props to `AddTodo.svelte`.

```svelte:src/components/Todos.svelte {4,14-39,45,47,83} showLineNumbers
<script lang="ts">
  import type { ITodo } from '$root/types/todo'

  import AddTodo from './AddTodo.svelte'

  // state
  let todos: ITodo[] = [
    { id: '1e4a59703af84', text: 'Todo 1', completed: true },
    { id: '9e09bcd7b9349', text: 'Todo 2', completed: false },
    { id: '9e4273a51a37c', text: 'Todo 3', completed: false },
    { id: '53ae48bf605cc', text: 'Todo 4', completed: false },
  ]

  // computed
  $: todosAmount = todos.length

  // methods
  function generateRandomId(): string {
		return Math.random().toString(16).slice(2)
  }

  function addTodo(todo: string): void {
    let newTodo: ITodo = {
      id: generateRandomId(),
      text: todo,
      completed: false,
    }
    todos = [...todos, newTodo]
  }

  function toggleCompleted(event: MouseEvent): void {
    let { checked } = event.target as HTMLInputElement

    todos = todos.map((todo) => ({
      ...todo,
      completed: checked,
    }))
  }
</script>

<main>
  <h1 class="title">todos</h1>

  <section class="todos">
    <AddTodo {addTodo} {toggleCompleted} {todosAmount} />

    {#if todosAmount}
      <ul class="todo-list">
        {#each todos as todo (todo.id)}
          <li class="todo">
            <div class="todo-item">
              <div>
                <input
                  checked={todo.completed}
                  id="todo"
                  class="toggle"
                  type="checkbox"
                />
                <label
                  aria-label="Check todo"
                  class="todo-check"
                  for="todo"
                />
              </div>
              <span class="todo-text">{todo.text}</span>
              <button aria-label="Remove todo" class="remove" />
            </div>

            <!-- <input class="edit" type="text" autofocus /> -->
          </li>
        {/each}
      </ul>

      <div class="actions">
        <span class="todo-count">0 left</span>
        <div class="filters">
          <button class="filter">All</button>
          <button class="filter">Active</button>
          <button class="filter">Completed</button>
        </div>
        <button class="clear-completed">Clear completed</button>
      </div>
    {/if}
  </section>
</main>

<!-- ... -->
```

We're going to bind the input value to `todo` so we can clear the input after we submit a todo with `handleSubmit`.

The form right now submits and reloads the page so we need to prevent the default behavior and we don't want to show the option to mark todos as completed if there are no todos.

🖌️ Update `AddTodo.svelte`.

```svelte:src/components/AddTodo.svelte {1-16,18,19,21,29,32} showLineNumbers
<script lang="ts">
  type AddTodoType = (todo: string) => void
  type ToggleCompletedType = (event: MouseEvent) => void
  type TodosAmountType = number

  export let addTodo: AddTodoType
  export let toggleCompleted: ToggleCompletedType
  export let todosAmount: TodosAmountType

  let todo = ''

  function handleSubmit() {
    addTodo(todo)
    todo = ''
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
	{#if todosAmount > 0}
    <input
      on:click={toggleCompleted}
      type="checkbox"
      id="toggle-all"
      class="toggle-all"
    />
	  <label aria-label="Mark all as complete" for="toggle-all">
	    Mark all as complete
	  </label>
	{/if}

  <input
		bind:value={todo}
    id="new-todo"
    class="new-todo"
    placeholder="What needs to be done?"
    type="text"
    autofocus
  />
</form>

<!-- ... -->
```

That's it! 🥳

## Completing Todo Items

Before we create the `Todo.svelte` component we need to create the methods inside `Todos.svelte` we're going to pass as props:

- **todo** is going to be passed from looping over the todo list
- **completeTodo** function that's going to take the `id` of the todo and toggle it's completion

🖌️ Update `Todos.svelte`.

```svelte:src/components/Todos.svelte {5,41-48,60} showLineNumbers
<script lang="ts">
  import type { ITodo } from '$root/types/todo'

  import AddTodo from './AddTodo.svelte'
  import Todo from './Todo.svelte'

  // state
  let todos: ITodo[] = [
    { id: '1e4a59703af84', text: 'Todo 1', completed: true },
    { id: '9e09bcd7b9349', text: 'Todo 2', completed: false },
    { id: '9e4273a51a37c', text: 'Todo 3', completed: false },
    { id: '53ae48bf605cc', text: 'Todo 4', completed: false },
  ]

  // computed
  $: todosAmount = todos.length

  // methods
  function generateRandomId(): string {
    return Math.random().toString(16).slice(2)
  }

  function addTodo(todo: string): void {
    let newTodo: ITodo = {
      id: generateRandomId(),
      text: todo,
      completed: false,
    }
    todos = [...todos, newTodo]
  }

  function toggleCompleted(event: MouseEvent): void {
    let { checked } = event.target as HTMLInputElement

    todos = todos.map((todo) => ({
      ...todo,
      completed: checked,
    }))
  }

  function completeTodo(id: string): void {
    todos = todos.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed
      }
      return todo
    })
  }
</script>

<main>
  <h1 class="title">todos</h1>

  <section class="todos">
    <AddTodo {addTodo} {toggleCompleted} {todosAmount} />

    {#if todosAmount}
      <ul class="todo-list">
        {#each todos as todo (todo.id)}
          <Todo {todo} {completeTodo} />
        {/each}
      </ul>

      <div class="actions">
        <span class="todo-count">0 left</span>
        <div class="filters">
          <button class="filter">All</button>
          <button class="filter">Active</button>
          <button class="filter">Completed</button>
        </div>
        <button class="clear-completed">Clear completed</button>
      </div>
    {#if}
  </section>
</main>

<!-- ... -->
```

🖌️ Create a `Todo.svelte` file under `src/components` and move the markup and styles from `Todos.svelte` there and add the props along with types.

```svelte:src/components/Todo.svelte showLineNumbers
<script lang="ts">
  import type { ITodo } from '$root/types/todo'

  type CompleteTodoType = (id: string) => void

  export let todo: ITodo
  export let completeTodo: CompleteTodoType
</script>

<li class="todo">
  <div class="todo-item">
    <div>
      <input
        checked={todo.completed}
        id="todo"
        class="toggle"
        type="checkbox"
      />
      <label
				aria-label="Check todo"
				class="todo-check"
				for="todo"
			/>
    </div>
    <span class="todo-text">{todo.text}</span>
    <button aria-label="Remove todo" class="remove" />
  </div>

  <!-- <input class="edit" type="text" autofocus /> -->
</li>

<style>
  .todo {
    font-size: var(--font-24);
    font-weight: 400;
    border-bottom: 1px solid #ededed;
  }

  .todo:last-child {
    border-bottom: none;
  }

  .todo-check,
  .todo-text {
    display: block;
    padding: var(--spacing-16);
    color: var(--color-gray-28);
    transition: color 0.4s;
  }

  .todo-check {
    border-radius: 100%;
  }

  .completed {
    color: var(--color-gray-58);
    text-decoration: line-through;
  }

  .todo-item {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 var(--spacing-8);
  }

  .editing .todo-item {
    display: none;
  }

  .edit {
    width: 100%;
    padding: var(--spacing-8);
    font-size: var(--font-24);
    border: 1px solid #999;
    border-radius: var(--radius-base);
    box-shadow: inset 0 -1px 5px 0 var(--shadow-1);
  }

  .toggle {
    position: absolute;
    top: 26px;
    left: 13px;
    transform: scale(2);
    opacity: 0;
  }

  .toggle + label {
    background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23949494%22%20stroke-width%3D%223%22/%3E%3C/svg%3E');
    background-repeat: no-repeat;
    background-position: 84% 50%;
  }

  .toggle:checked + label {
    background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%2359A193%22%20stroke-width%3D%223%22%2F%3E%3Cpath%20fill%3D%22%233EA390%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22%2F%3E%3C%2Fsvg%3E');
  }

  .remove {
    display: none;
    margin-left: auto;
    font-size: var(--font-32);
    color: var(--color-gray-58);
    transition: color 0.2s ease-out;
  }

  .remove:hover {
    color: var(--color-highlight);
  }

  .remove:after {
    content: '×';
  }

  .todo:hover .remove {
    display: block;
  }
</style>
```

Inside `Todo.svelte` we're going to listen for changes when a user checks the checkbox and mark the todo as completed by passing the todo `id` to `completeTodo`.

We're also going to use the `class:` directive to apply a `.completed` class if the todo is completed.

> 🐿️ If you're wondering about why we use the anonymous function `() => completeTodo(todo.id)` syntax and not just invoke `completeTodo(todo.id)` it's because it would invoke the function immediately and run only once.

🖌️ Update `Todo.svelte` to reflect the changes.

```svelte:src/components/Todo.svelte {14,26} showLineNumbers
<script lang="ts">
  import type { ITodo } from '$root/types/todo'

  type CompleteTodoType = (id: string) => void

  export let todo: ITodo
  export let completeTodo: CompleteTodoType
</script>

<li class="todo">
  <div class="todo-item">
    <div>
      <input
        on:change={() => completeTodo(todo.id)}
        checked={todo.completed}
        id="todo"
        class="toggle"
        type="checkbox"
      />
      <label
				aria-label="Check todo"
				class="todo-check"
				for="todo"
			/>
    </div>
    <span class:completed={todo.completed} class="todo-text">
      {todo.text}
    </span>
    <button aria-label="Remove todo" class="remove" />
  </div>

  <!-- <input class="edit" type="text" autofocus /> -->
</li>

<!-- ... -->
```

That's it, great job! 👍️

## Removing Todo Items

🖌️ Inside `Todos.svelte` add the method for removing the todo and pass it to `Todo.svelte`.

```svelte:src/components/Todos.svelte {50-52,64} showLineNumbers
<script lang="ts">
  import type { ITodo } from '$root/types/todo'

  import AddTodo from './AddTodo.svelte'
  import Todo from './Todo.svelte'

  // state
  let todos: ITodo[] = [
    { id: '1e4a59703af84', text: 'Todo 1', completed: true },
    { id: '9e09bcd7b9349', text: 'Todo 2', completed: false },
    { id: '9e4273a51a37c', text: 'Todo 3', completed: false },
    { id: '53ae48bf605cc', text: 'Todo 4', completed: false },
  ]

  // computed
  $: todosAmount = todos.length

  // methods
  function generateRandomId(): string {
    return Math.random().toString(16).slice(2)
  }

  function addTodo(todo: string): void {
    let newTodo: ITodo = {
      id: generateRandomId(),
      text: todo,
      completed: false,
    }
    todos = [...todos, newTodo]
  }

  function toggleCompleted(event: MouseEvent): void {
    let { checked } = event.target as HTMLInputElement

    todos = todos.map((todo) => ({
      ...todo,
      completed: checked,
    }))
  }

  function completeTodo(id: string): void {
    todos = todos.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed
      }
      return todo
    })
  }

  function removeTodo(id: string): void {
    todos = todos.filter((todo) => todo.id !== id)
  }
</script>

<main>
  <h1 class="title">todos</h1>

  <section class="todos">
    <AddTodo {addTodo} {toggleCompleted} {todosAmount} />

    {#if todosAmount}
      <ul class="todo-list">
        {#each todos as todo (todo.id)}
          <Todo {todo} {completeTodo} {removeTodo} />
        {/each}
      </ul>

      <div class="actions">
        <span class="todo-count">0 left</span>
        <div class="filters">
          <button class="filter">All</button>
          <button class="filter">Active</button>
          <button class="filter">Completed</button>
        </div>
        <button class="clear-completed">Clear completed</button>
      </div>
    {/if}
  </section>
</main>

<!-- ... -->
```

🖌️ In `Todo.svelte` we need to take in the prop and wire up the event to the button.

```svelte:src/components/Todo.svelte {5,9,29} showLineNumbers
<script lang="ts">
  import type { ITodo } from '$root/types/todo'

  type CompleteTodoType = (id: string) => void
  type RemoveTodoType = (id: string) => void

  export let todo: ITodo
  export let completeTodo: CompleteTodoType
  export let removeTodo: RemoveTodoType
</script>

<li class="todo">
  <div class="todo-item">
    <div>
      <input
        on:change={() => completeTodo(todo.id)}
        checked={todo.completed}
        id="todo"
        class="toggle"
        type="checkbox"
      />
      <label aria-label="Check todo" class="todo-check" for="todo" />
    </div>
    <span class:completed={todo.completed} class="todo-text">
      {todo.text}
    </span>
    <button
      aria-label="Remove todo"
      on:click={() => removeTodo(todo.id)}
      class="remove"
    />
  </div>

  <!-- <input class="edit" type="text" autofocus /> -->
</li>

<!-- ... -->
```

That's it! 🥳

## Editing Todo Items

I'm surprised how many posts and tutorials show you the steps up to now but ignore the most important part which is editing the todo but I'm never going to give you up, let you down, run around and desert you.

We're going to create a function that takes in the todo `id` to find the todo and a `newTodo` text to replace it's content.

🖌️ Inside `Todos.svelte` we need to add the `editTodo` method and pass it to `Todo.svelte`.

```svelte:src/components/Todos.svelte {54-57,69} showLineNumbers
<script lang="ts">
  import type { ITodo } from '$root/types/todo'

	import AddTodo from './AddTodo.svelte'
  import Todo from './Todo.svelte'

  // state
  let todos: ITodo[] = [
    { id: '1e4a59703af84', text: 'Todo 1', completed: true },
    { id: '9e09bcd7b9349', text: 'Todo 2', completed: false },
    { id: '9e4273a51a37c', text: 'Todo 3', completed: false },
    { id: '53ae48bf605cc', text: 'Todo 4', completed: false },
  ]

  // computed
  $: todosAmount = todos.length

  // methods
  function generateRandomId(): string {
    return Math.random().toString(16).slice(2)
  }

  function addTodo(todo: string): void {
    let newTodo: ITodo = {
      id: generateRandomId(),
      text: todo,
      completed: false,
    }
    todos = [...todos, newTodo]
  }

  function toggleCompleted(event: MouseEvent): void {
    let { checked } = event.target as HTMLInputElement

    todos = todos.map((todo) => ({
      ...todo,
      completed: checked,
    }))
  }

  function completeTodo(id: string): void {
    todos = todos.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed
      }
      return todo
    })
  }

  function removeTodo(id: string): void {
    todos = todos.filter((todo) => todo.id !== id)
  }

  function editTodo(id: string, newTodo: string): void {
    let currentTodo = todos.findIndex((todo) => todo.id === id)
    todos[currentTodo].text = newTodo
  }
</script>

<main>
  <h1 class="title">todos</h1>

  <section class="todos">
    <AddTodo {addTodo} {toggleCompleted} {todosAmount} />

    {#if todosAmount}
      <ul class="todo-list">
        {#each todos as todo (todo.id)}
          <Todo {todo} {completeTodo} {removeTodo} {editTodo} />
        {/each}
      </ul>

      <div class="actions">
        <span class="todo-count">0 left</span>
        <div class="filters">
          <button class="filter">All</button>
          <button class="filter">Active</button>
          <button class="filter">Completed</button>
        </div>
        <button class="clear-completed">Clear completed</button>
      </div>
    {/if}
  </section>
</main>

<!-- ... -->
```

For editing the todo item we're going to have an `editing` state and `toggleEdit` function together with a couple of methods for handling updating the todo:

- **handleEdit** is going to be responsible for editing the todo and registering if the user pressed <kbd>Escape</kbd> or <kbd>Enter</kbd> to handle those scenarios
- **handleBlur** is going to save the todo when the input loses focus which is the **blur** event

The `<li>` is going to have a `class:editing` directive and a `dblclick` event listener on the span to toggle editing mode and conditionally show the editing input element based on if `editing` is true with the `keydown` and `blur` event listeners.

🖌️ Update `Todo.svelte`.

```svelte:src/components/Todo.svelte {6,11,13-42,45,58,71-80} showLineNumbers
<script lang="ts">
  import type { ITodo } from '$root/types/todo'

  type CompleteTodoType = (id: string) => void
  type RemoveTodoType = (id: string) => void
  type EditTodoType = (id: string, newTodo: string) => void

  export let todo: ITodo
  export let completeTodo: CompleteTodoType
  export let removeTodo: RemoveTodoType
  export let editTodo: EditTodoType

  let editing = false

  function toggleEdit(): void {
    editing = true
  }

  function handleEdit(event: KeyboardEvent, id: string): void {
    let pressedKey = event.key
    let targetElement = event.target as HTMLInputElement
    let newTodo = targetElement.value

    switch (pressedKey) {
      case 'Escape':
        targetElement.blur()
        break
      case 'Enter':
        editTodo(id, newTodo)
        targetElement.blur()
        break
    }
  }

  function handleBlur(event: FocusEvent, id: string): void {
    let targetElement = event.target as HTMLInputElement
    let newTodo = targetElement.value

    editTodo(id, newTodo)
    targetElement.blur()
    editing = false
  }
</script>

<li class:editing class="todo">
  <div class="todo-item">
    <div>
      <input
        on:change={() => completeTodo(todo.id)}
        checked={todo.completed}
        id="todo"
        class="toggle"
        type="checkbox"
      />
      <label aria-label="Check todo" class="todo-check" for="todo" />
    </div>
    <span
      on:dblclick={toggleEdit}
      class:completed={todo.completed}
      class="todo-text"
    >
      {todo.text}
    </span>
    <button
      aria-label="Remove todo"
      on:click={() => removeTodo(todo.id)}
      class="remove"
    />
  </div>

  {#if editing}
    <input
      on:keydown={(event) => handleEdit(event, todo.id)}
      on:blur={(event) => handleBlur(event, todo.id)}
      class="edit"
      type="text"
      value={todo.text}
      autofocus
    />
  {/if}
</li>

<!-- ... -->
```

We're done with a large part of the project so congrats if you made it so far! 🥳

That wasn't so bad, right? I spent a lot more time on this than you have so far so don't feel like everything should make sense because it never does until you get your hands dirty.

## Showing Todos Left

To see how many incomplete todos there are we're going to have a computed property `incompleteTodos` inside `Todos.svelte` and send it as a prop to `TodosLeft.svelte`.

🖌️ Update `Todos.svelte`.

```svelte:src/components/Todos.svelte {6,18,76} showLineNumbers
<script lang="ts">
  import type { ITodo } from '$root/types/todo'

	import AddTodo from './AddTodo.svelte'
  import Todo from './Todo.svelte'
  import TodosLeft from './TodosLeft.svelte'

  // state
  let todos: ITodo[] = [
    { id: '1e4a59703af84', text: 'Todo 1', completed: true },
    { id: '9e09bcd7b9349', text: 'Todo 2', completed: false },
    { id: '9e4273a51a37c', text: 'Todo 3', completed: false },
    { id: '53ae48bf605cc', text: 'Todo 4', completed: false },
  ]

  // computed
  $: todosAmount = todos.length
  $: incompleteTodos = todos.filter((todo) => !todo.completed).length

  // methods
  function generateRandomId(): string {
    return Math.random().toString(16).slice(2)
  }

  function addTodo(todo: string): void {
    let newTodo: ITodo = {
      id: generateRandomId(),
      text: todo,
      completed: false,
    }
    todos = [...todos, newTodo]
  }

  function toggleCompleted(event: MouseEvent): void {
    let { checked } = event.target as HTMLInputElement

    todos = todos.map((todo) => ({
      ...todo,
      completed: checked,
    }))
  }

  function completeTodo(id: string): void {
    todos = todos.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed
      }
      return todo
    })
  }

  function removeTodo(id: string): void {
    todos = todos.filter((todo) => todo.id !== id)
  }

  function editTodo(id: string, newTodo: string): void {
    let currentTodo = todos.findIndex((todo) => todo.id === id)
    todos[currentTodo].text = newTodo
  }
</script>

<main>
  <h1 class="title">todos</h1>

  <section class="todos">
    <AddTodo {addTodo} {toggleCompleted} {todosAmount} />

    {#if todosAmount}
      <ul class="todo-list">
        {#each todos as todo (todo.id)}
          <Todo {todo} {completeTodo} {removeTodo} {editTodo} />
        {/each}
      </ul>

      <div class="actions">
        <TodosLeft {incompleteTodos} />
        <div class="filters">
          <button class="filter">All</button>
          <button class="filter">Active</button>
          <button class="filter">Completed</button>
        </div>
        <button class="clear-completed">Clear completed</button>
      </div>
    {/if}
  </section>
</main>

<!-- ... -->
```

🖌️ Create `TodosLeft.svelte` inside `src/components`.

```svelte:src/components/TodosLeft.svelte showLineNumbers
<script lang="ts">
  export let incompleteTodos: number
</script>

<span class="todo-count">
  {incompleteTodos}
  {incompleteTodos === 1 ? 'item' : 'items'} left
</span>
```

Awesome! 👍️

## Filtering Todo Items

There's three filters we have which is **all**, **active**, and **completed**. We should keep track of the currently selected filter inside `selectedFilter` and set the filter using a function `setFilter`.

When the filter changes we could have a computed property `filteredTodos` which is responsible for filtering the todos.

🖌️ Let's quickly add the `FiltersType` so we can use it.

```ts:src/types/todo.ts {7} showLineNumbers
export interface ITodo {
  id: string
  text: string
  completed: boolean
}

export type FiltersType = 'all' | 'active' | 'completed'
```

🖌️ Update `Todos.svelte`.

```svelte:src/components/Todos.svelte {2,7,17,22,65-78,89,96} showLineNumbers
<script lang="ts">
  import type { FiltersType, ITodo } from '$root/types/todo'

  import AddTodo from './AddTodo.svelte'
  import Todo from './Todo.svelte'
  import TodosLeft from './TodosLeft.svelte'
  import FilterTodos from './FilterTodos.svelte'

  // state
  let todos: ITodo[] = [
    { id: '1e4a59703af84', text: 'Todo 1', completed: true },
    { id: '9e09bcd7b9349', text: 'Todo 2', completed: false },
    { id: '9e4273a51a37c', text: 'Todo 3', completed: false },
    { id: '53ae48bf605cc', text: 'Todo 4', completed: false },
  ]

  let selectedFilter: FiltersType = 'all'

  // computed
  $: todosAmount = todos.length
  $: incompleteTodos = todos.filter((todo) => !todo.completed).length
  $: filteredTodos = filterTodos(todos, selectedFilter)

  // methods
  function generateRandomId(): string {
    return Math.random().toString(16).slice(2)
  }

  function addTodo(todo: string): void {
    let newTodo: ITodo = {
      id: generateRandomId(),
      text: todo,
      completed: false,
    }
    todos = [...todos, newTodo]
  }

  function toggleCompleted(event: MouseEvent): void {
    let { checked } = event.target as HTMLInputElement

    todos = todos.map((todo) => ({
      ...todo,
      completed: checked,
    }))
  }

  function completeTodo(id: string): void {
    todos = todos.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed
      }
      return todo
    })
  }

  function removeTodo(id: string): void {
    todos = todos.filter((todo) => todo.id !== id)
  }

  function editTodo(id: string, newTodo: string): void {
    let currentTodo = todos.findIndex((todo) => todo.id === id)
    todos[currentTodo].text = newTodo
  }

  function setFilter(newFilter: FiltersType): void {
    selectedFilter = newFilter
  }

  function filterTodos(todos: ITodo[], filter: FiltersType): ITodo[] {
    switch (filter) {
      case 'all':
        return todos
      case 'active':
        return todos.filter((todo) => !todo.completed)
      case 'completed':
        return todos.filter((todo) => todo.completed)
    }
  }
</script>

<main>
  <h1 class="title">todos</h1>

  <section class="todos">
    <AddTodo {addTodo} {toggleCompleted} {todosAmount} />

    {#if todosAmount}
      <ul class="todo-list">
        {#each filteredTodos as todo (todo.id)}
          <Todo {todo} {completeTodo} {removeTodo} {editTodo} />
        {/each}
      </ul>

      <div class="actions">
        <TodosLeft {incompleteTodos} />
        <FilterTodos {selectedFilter} {setFilter} />
        <button class="clear-completed">Clear completed</button>
      </div>
    {/if}
  </section>
</main>

<!-- ... -->
```

Now the computed value of `filteredTodos` is in charge of showing the todos.

🖌️ Move the markup and styles for filters outside of `Todos.svelte` into a new file `FilterTodos.svelte` and include the props.

```svelte:src/components/FilterTodos.svelte showLineNumbers
<script lang="ts">
  import type { FiltersType } from '$root/types/todo'

  type SetFilterType = (newFilter: string) => void

  export let selectedFilter: FiltersType
  export let setFilter: SetFilterType
</script>

<div class="filters">
  <button class="filter">All</button>
  <button class="filter">Active</button>
  <button class="filter">Completed</button>
</div>

<style>
  .filters {
    display: flex;
    gap: var(--spacing-4);
  }

  .filter {
    text-transform: capitalize;
    padding: var(--spacing-4) var(--spacing-8);
    border: 1px solid transparent;
    border-radius: var(--radius-base);
  }

  .filter:hover {
    border: 1px solid var(--color-highlight);
  }

  .selected {
    border-color: var(--color-highlight);
  }
</style>
```

Instead of repeating the markup and adding logic for every `<button>` we can create a list of filters and loop over those.

Each `<button>` is going to have a `click` event listener and `class:selected` directive so we can apply the `.selected` class to the currently selected filter.

```svelte:src/components/FilterTodos.svelte {9,13-21} showLineNumbers
<script lang="ts">
  import type { FiltersType } from '$root/types/todo'

  type SetFilterType = (newFilter: string) => void

  export let selectedFilter: FiltersType
  export let setFilter: SetFilterType

	let filters = ['all', 'active', 'completed']
</script>

<div class="filters">
  {#each filters as filter}
    <button
      on:click={() => setFilter(filter)}
      class:selected={selectedFilter === filter}
      class="filter"
    >
      {filter}
    </button>
  {/each}
</div>

<!-- ... -->
```

Awesome, that's it! 👍️ You should be able now to filter the list of todos so give it a try.

## Clearing Completed Todos

You're almost done! 😄 For the last part we need to clear the completed todos.

🖌️ Inside `Todos.svelte` add a computed value `completedTodos` and a `clearCompleted` function we're going pass as props to `ClearTodos.svelte`.

```svelte:src/components/Todos.svelte {8,24,82-84,103} showLineNumbers
<script lang="ts">
  import type { FiltersType, ITodo } from '$root/types/todo'

  import AddTodo from './AddTodo.svelte'
  import Todo from './Todo.svelte'
  import TodosLeft from './TodosLeft.svelte'
  import FilterTodos from './FilterTodos.svelte'
  import ClearTodos from './ClearTodos.svelte'

  // state
  let todos: ITodo[] = [
    { id: '1e4a59703af84', text: 'Todo 1', completed: true },
    { id: '9e09bcd7b9349', text: 'Todo 2', completed: false },
    { id: '9e4273a51a37c', text: 'Todo 3', completed: false },
    { id: '53ae48bf605cc', text: 'Todo 4', completed: false },
  ]

  let selectedFilter: FiltersType = 'all'

  // computed
  $: todosAmount = todos.length
  $: incompleteTodos = todos.filter((todo) => !todo.completed).length
  $: filteredTodos = filterTodos(todos, selectedFilter)
  $: completedTodos = todos.filter((todo) => todo.completed).length

  // methods
  function generateRandomId(): string {
    return Math.random().toString(16).slice(2)
  }

  function addTodo(todo: string): void {
    let newTodo: ITodo = {
      id: generateRandomId(),
      text: todo,
      completed: false,
    }
    todos = [...todos, newTodo]
  }

  function toggleCompleted(event: MouseEvent): void {
    let { checked } = event.target as HTMLInputElement

    todos = todos.map((todo) => ({
      ...todo,
      completed: checked,
    }))
  }

  function completeTodo(id: string): void {
    todos = todos.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed
      }
      return todo
    })
  }

  function removeTodo(id: string): void {
    todos = todos.filter((todo) => todo.id !== id)
  }

  function editTodo(id: string, newTodo: string): void {
    let currentTodo = todos.findIndex((todo) => todo.id === id)
    todos[currentTodo].text = newTodo
  }

  function setFilter(newFilter: FiltersType): void {
    selectedFilter = newFilter
  }

  function filterTodos(todos: ITodo[], filter: FiltersType): ITodo[] {
    switch (filter) {
      case 'all':
        return todos
      case 'active':
        return todos.filter((todo) => !todo.completed)
      case 'completed':
        return todos.filter((todo) => todo.completed)
    }
  }

  function clearCompleted(): void {
    todos = todos.filter((todo) => todo.completed !== true)
  }
</script>

<main>
  <h1 class="title">todos</h1>

  <section class="todos">
    <AddTodo {addTodo} {toggleCompleted} {todosAmount} />

    {#if todosAmount}
      <ul class="todo-list">
        {#each filteredTodos as todo (todo.id)}
          <Todo {todo} {completeTodo} {removeTodo} {editTodo} />
        {/each}
      </ul>

      <div class="actions">
        <TodosLeft {incompleteTodos} />
        <FilterTodos {selectedFilter} {setFilter} />
        <ClearTodos {clearCompleted} {completedTodos} />
      </div>
    {/if}
  </section>
</main>

<!-- ... -->
```

🖌️ Create `ClearTodos.svelte` inside `src/components` with the required props.

```svelte:src/components/ClearTodos.svelte showLineNumbers
<script lang="ts">
  type ClearCompletedType = () => void
  type CompletedTodosType = number

  export let clearCompleted: ClearCompletedType
  export let completedTodos: CompletedTodosType
</script>

<button
  on:click={clearCompleted}
  class:hidden={completedTodos === 0}
  class="clear-completed"
>
  Clear completed
</button>
```

The class of `.hidden` is applied if there are no todos and it's defined in our global styles as a utility class.

Congratulations! 🥳

Stick around if you want to learn how to add persistent storage using local storage and animations.

## Adding Persistent Storage

We're going to use the [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) to save and retrieve the list of todos from the local storage in our browser.

What if I told you that you can implement local storage in Svelte in two lines of code? 🤯 Check it out!

🖌️ Replace the placeholder todos in `Todos.svelte` with this code.

```svelte:src/components/Todos.svelte {4-8} showLineNumbers
<script lang="ts">
	// ...

  let todos: ITodo[] = JSON.parse(localStorage.getItem('todos')) ?? []

  $: {
		localStorage.setItem('todos', JSON.stringify(todos))
	}

  // ...
</script>

<!-- ... -->
```

First we deserialize the todos value from local storage using `JSON.parse` because we're going to store an array and values in local storage have to be a string.

If there is nothing with the key of **todos** we default to an empty array using [the nullish coalescing operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator).

We learned that we can have reactive blocks before so we're updating local storage each time `todos` change and serializing the value using `JSON.stringify`.

This is great but it would be even better if we used a Svelte store to be able to reuse it across components. This might look familiar if you ever used React hooks.

🖌️ Create a new file `useStorage.ts` inside `src/stores`.

```ts:src/stores/useStorage.ts showLineNumbers
import { writable } from 'svelte/store'

export function useStorage(key, initialValue) {
  let serialize = JSON.stringify
  let deserialize = JSON.parse

	// get stored value
  let storedValue = deserialize(localStorage.getItem(key))

	// if value exists return it otherwise use initial value
  let store = writable(storedValue ? storedValue : initialValue)
	// subscribe to the store and update local storage when it changes
  store.subscribe((value) => localStorage.setItem(key, serialize(value)))

  return store
}
```

This is the TypeScript version because I didn't want to scare you before if you have never seen [generics](https://www.typescriptlang.org/docs/handbook/2/generics.html).

> 🐿️ Generics are just variables for types like `<Type>` so it can help us know what kind of type we're dealing with when we don't know what the user is going to pass in.

```ts:src/stores/useStorage.ts {2,4-7,11} showLineNumbers
import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'

export function useStorage<Value>(
  key: string,
  initialValue: Value
): Writable<Value> {
  let serialize = JSON.stringify
  let deserialize = JSON.parse

  let storedValue: Value = deserialize(localStorage.getItem(key))

  let store = writable(storedValue ? storedValue : initialValue)
  store.subscribe((value) => localStorage.setItem(key, serialize(value)))

  return store
}
```

We're going to see why generics are awesome in a moment.

🖌️ Update `Todos.svelte` to use the store but note we have to change `todos` with a reactive `$todos` value from the store in places where we use it.

```svelte:src/components/Todos.svelte {3,7,12-15,28,34,41,50,54-55,74} showLineNumbers
<script lang="ts">
  import type { FiltersType, ITodo } from '$root/types/todo'
  import { useStorage } from '$root/stores/useStorage'

  // ...

  let todos = useStorage<ITodo[]>('todos', [])

  let selectedFilter: FiltersType = 'all'

  // computed
  $: todosAmount = $todos.length
  $: incompleteTodos = $todos.filter((todo) => !todo.completed).length
  $: filteredTodos = filterTodos($todos, selectedFilter)
  $: completedTodos = $todos.filter((todo) => todo.completed).length

  // methods
  function generateRandomId(): string {
    return Math.random().toString(16).slice(2)
  }

  function addTodo(todo: string): void {
    let newTodo: ITodo = {
      id: generateRandomId(),
      text: todo,
      completed: false,
    }
    $todos = [...$todos, newTodo]
  }

  function toggleCompleted(event: MouseEvent): void {
    let { checked } = event.target as HTMLInputElement

    $todos = $todos.map((todo) => ({
      ...todo,
      completed: checked,
    }))
  }

  function completeTodo(id: string): void {
    $todos = $todos.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed
      }
      return todo
    })
  }

  function removeTodo(id: string): void {
    $todos = $todos.filter((todo) => todo.id !== id)
  }

  function editTodo(id: string, newTodo: string): void {
    let currentTodo = $todos.findIndex((todo) => todo.id === id)
    $todos[currentTodo].text = newTodo
  }

  function setFilter(newFilter: FiltersType): void {
    selectedFilter = newFilter
  }

  function filterTodos(todos: ITodo[], filter: FiltersType): ITodo[] {
    switch (filter) {
      case 'all':
        return todos
      case 'active':
        return todos.filter((todo) => !todo.completed)
      case 'completed':
        return todos.filter((todo) => todo.completed)
    }
  }

  function clearCompleted(): void {
    $todos = $todos.filter((todo) => todo.completed !== true)
  }
</script>

<!-- ... -->
```

Because we passed the `ITodo` type as a generic `<ITodo[]>` type for `useStorage` we know the type of `todos` is a writable that returns an array of todos or `Writable<ITodo[]>` so we get type safety and completion. Sweet! 😄

Since we're using a
store we can define and export the todos from there so we can **collocate** more
things inside of each component because we no longer have
to keep the todos state in the parent.

I want you to clean up the code if you're up for
it. I leave this up to you as an exercise dear reader. 🧠

## Adding Animations

Animations provide a delightful user experience and they're simple to add using Svelte. ✨

We're going to add a simple **slide** and **fade** transition to the todo list item depending on if the user adds or removes a todo.

🖌️ Update `Todo.svelte` to include the transitions.

```svelte:src/components/Todo.svelte {2,7} showLineNumbers
<script lang="ts">
  import { fade, slide } from 'svelte/transition'

	// ...
</script>

<li in:slide out:fade class:editing class="todo">
	<!-- ... -->
</li>

<!-- ... -->
```

That's it! 🦄

There's one problem though. The transition is happening for each todo item when we change the filter.

<Video src="filtering-todos-problem.mp4" />

Building something is the only time when you encounter a problem that requires a specific solution so you're going to learn and understand how something works instead of just watching or reading about it.

The solution we can use is to have a computed `duration` value for the animation that's going to be `0ms` or `250ms` based on if `filtering` is `true` or `false` in `Todos.svelte` which we can pass to `Todo.svelte`.

```ts:Example.ts {2,4} showLineNumbers
function setFilter(newFilter: FiltersType): void {
	filtering = true
	selectedFilter = newFilter
	filtering = false
}
```

There's one problem with the solution.

Svelte batches pending DOM changes for efficiency so nothing would happen. You can see that's true if you log the computed value `$: console.log(duration)` after we add it.

This is a great example of learning about the Svelte lifecycle function [tick](https://svelte.dev/docs#run-time-svelte-tick). Using `tick` we can let Svelte know to update the DOM immediately.

🖌️ Let's update `Todos.svelte` and pass the `duration` prop to `Todo.svelte`.

```svelte:src/components/Todos.svelte {2,16,23,66-72,99-105} showLineNumbers
<script lang="ts">
  import { tick } from 'svelte'

  import type { FiltersType, ITodo } from '$root/types/todo'
  import { useStorage } from '$root/stores/useStorage'

  import AddTodo from './AddTodo.svelte'
  import Todo from './Todo.svelte'
  import TodosLeft from './TodosLeft.svelte'
  import FilterTodos from './FilterTodos.svelte'
  import ClearTodos from './ClearTodos.svelte'

  let todos = useStorage<ITodo[]>('todos', [])

  let selectedFilter: FiltersType = 'all'
  let filtering = false

  // computed
  $: todosAmount = $todos.length
  $: incompleteTodos = $todos.filter((todo) => !todo.completed).length
  $: filteredTodos = filterTodos($todos, selectedFilter)
  $: completedTodos = $todos.filter((todo) => todo.completed).length
  $: duration = filtering ? 0 : 250

  // methods
  function generateRandomId(): string {
    return Math.random().toString(16).slice(2)
  }

  function addTodo(todo: string): void {
    let newTodo: ITodo = {
      id: generateRandomId(),
      text: todo,
      completed: false,
    }
    $todos = [...$todos, newTodo]
  }

  function toggleCompleted(event: MouseEvent): void {
    let { checked } = event.target as HTMLInputElement

    $todos = $todos.map((todo) => ({
      ...todo,
      completed: checked,
    }))
  }

  function completeTodo(id: string): void {
    $todos = $todos.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed
      }
      return todo
    })
  }

  function removeTodo(id: string): void {
    $todos = $todos.filter((todo) => todo.id !== id)
  }

  function editTodo(id: string, newTodo: string): void {
    let currentTodo = $todos.findIndex((todo) => todo.id === id)
    $todos[currentTodo].text = newTodo
  }

  async function setFilter(newFilter: FiltersType): Promise<void> {
    filtering = true
    await tick()
    selectedFilter = newFilter
    await tick()
    filtering = false
  }

  function filterTodos(todos: ITodo[], filter: FiltersType): ITodo[] {
    switch (filter) {
      case 'all':
        return todos
      case 'active':
        return todos.filter((todo) => !todo.completed)
      case 'completed':
        return todos.filter((todo) => todo.completed)
    }
  }

  function clearCompleted(): void {
    $todos = $todos.filter((todo) => todo.completed !== true)
  }
</script>

<main>
  <h1 class="title">todos</h1>

  <section class="todos">
    <AddTodo {addTodo} {toggleCompleted} {todosAmount} />

    {#if todosAmount}
      <ul class="todo-list">
        {#each filteredTodos as todo (todo.id)}
          <Todo
            {todo}
            {completeTodo}
            {removeTodo}
            {editTodo}
            {duration}
          />
        {/each}
      </ul>

      <div class="actions">
        <TodosLeft {incompleteTodos} />
        <FilterTodos {selectedFilter} {setFilter} />
        <ClearTodos {clearCompleted} {completedTodos} />
      </div>
    {/if}
  </section>
</main>

<!-- ... -->
```

```svelte:src/components/Todo.svelte {8,14,20-21} showLineNumbers
<script lang="ts">
  import { fade, slide } from 'svelte/transition'
  import type { ITodo } from '$root/types/todo'

  type CompleteTodoType = (id: string) => void
  type RemoveTodoType = (id: string) => void
  type EditTodoType = (id: string, newTodo: string) => void
  type DurationType = number

  export let todo: ITodo
  export let completeTodo: CompleteTodoType
  export let removeTodo: RemoveTodoType
  export let editTodo: EditTodoType
  export let duration: DurationType

  // ...
</script>

<li
	in:slide={{ duration }}
	out:fade={{ duration }}
	class:editing
	class="todo"
>
	<!-- ... -->
</li>

<!-- ... -->
```

That's it! 🥳

<Video src="filtering-todos-solution.mp4" />

With that we can cross off all the items from the list we wanted to do at the start.

Continue reading 🔗 [Testing For Beginners](https://joyofcode.xyz/testing-for-beginners) where I show you how to test your code to give you confidence. 🧪

## Conclusion

Hope you learned something! I want to emphasize how important it is if you want to improve at anything you have to practice to gain experience.

![Bob Ross saying "Talent is a pursued interest. In other words, anything that you're willing to practice, you can do."](https://i.giphy.com/media/B4OVvY3CVNN0Q/giphy.webp)

Don't be afraid of learning and feeling uncomfortable because that's a good sign.

You're going to learn way more struggling a week on your personal project and feeling you barely made progress than reading or watching any tutorial like a marathon and feeling a false sense of accomplishment.

Take your time learning and share your knowledge with others.

Thanks for reading! 🏄️
