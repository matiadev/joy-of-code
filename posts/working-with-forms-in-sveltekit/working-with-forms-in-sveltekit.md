---
title: Working With Forms In SvelteKit
description: Learn how to work with forms in SvelteKit using form actions, progressive form enhancement and how to do validation.
slug: working-with-forms-in-sveltekit
published: '2023-1-20'
category: sveltekit
---

{% youtube id="XNbCp7ZJi-8" title="Working With Forms In SvelteKit" %}

## Table of Contents

## Previously

This is part of a [SvelteKit series](https://www.youtube.com/watch?v=obmiLi3bhkQ&list=PLA9WiRZ-IS_zfHpxmztJQLeBISsQkh9-M) and while each part is meant to be self-contained here are the previous parts in case you want to catch up:

- [What is SvelteKit?](https://joyofcode.xyz/what-is-sveltekit)
- [SvelteKit Project Structure](https://joyofcode.xyz/sveltekit-project-structure)
- [SvelteKit Routing](https://joyofcode.xyz/sveltekit-routing)
- [SvelteKit API Endpoints And Loading Data For Pages](https://joyofcode.xyz/sveltekit-loading-data)

## Setup

I’m going to initialize a skeleton SvelteKit project using TypeScript.

```shell:terminal
# install SvelteKit
npm create svelte@latest

# install dependencies
npm i

# run development server
npm run dev
```

I'm going to add a root layout with some global styles using [Pico](https://picocss.com/).

```svelte:src/routes/+layout.svelte showLineNumbers
<slot />

<style>
  @import 'https://unpkg.com/@picocss/pico@latest/css/pico.min.css';

  :global(body) {
    padding: 2rem;
  }

  :global(input, button) {
    border-radius: 1rem;
  }
</style>
```

## Creating A Fake Database

I'm going to create a [server-only module](https://kit.svelte.dev/docs/server-only-modules) inside `lib` that's going to act as a fake database for the to-do list.

```ts:src/lib/server/database.ts showLineNumbers
type Todo = {
  id: number
  text: string
  completed: boolean
}

let todos: Todo[] = [
  {
    id: Date.now(),
    text: 'Learn how forms work',
    completed: false
  }
]

export function getTodos() {
  return todos
}

export function addTodo(text: string) {
  const todo: Todo = {
    id: Date.now(),
    text,
    completed: false
  }
  todos.push(todo)
}

export function removeTodo(id: number) {
  todos = todos.filter((todo) => todo.id !== id)
}

export function clearTodos() {
  todos = []
}
```

## Reintroduction To Forms

A `form` is a way to exchange information between the browser and server — it's just a container for form controls with some optional attributes to configure how the form behaves.

```svelte:src/routes/+page.svelte showLineNumbers
<form method="GET" action="/login">
  <input type="text" name="user" />
  <input type="password" name="password" />
  <button type="submit">Login</button>
</form>
```

The `action` attribute defines the location (URL) where the form's collected data should be sent and the `method` attribute defines which [HTTP method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) to send the data with. The form attributes are optional. The default form `method` is `GET` and if you don't include `action` it's going to make the request to the same page.

The `GET` method requests a resource from the server and appends the form data at the end of the URL like `http://example.com/?user=test&password=1234` since the body is empty and it not great for sending a large amount of data and is not secure.

```svelte:src/routes/+page.svelte showLineNumbers
<form method="POST" action="/login">
  <input type="text" name="user" />
  <input type="password" name="password" />
  <button type="submit">Login</button>
</form>
```

The `POST` method is similar to `GET` but it can return a resource depending on the data sent in the request body of the HTTP request — no data is appended to the URL and the data is included in the body instead.

In our example the form is going to send data to the URL using the HTTP `POST` method. The server is going to receive the data as a list of `key: value` pairs contained in the HTTP request.

If you submit the form above you can see the parsed form data from `user=test&password=1234` under **payload** in the network tab of the developer tools.

```shell:request
user: test
password: 1234
```

The `name` attribute for each form control is important, so the browser knows which name to give each piece of data.

## Working With Forms Using API Endpoints

This part is important for understanding how forms work and it's going to give you more appreciation when you learn how simple SvelteKit makes working with forms in the next section.

I'm going to create a `routes/todos` folder with some route files.

```shell:todos
routes
└── todos
    ├── +page.server.ts
    ├── +page.svelte
    └── +server.ts
```

First I'm going to get the data for the page which is the currently empty to-do list.

```ts:src/routes/todos/+page.server.ts
import { getTodos } from '$lib/server/database'

export async function load() {
  const todos = getTodos()
  return { todos }
}
```

Let's loop over the to-do items and add the form.

```svelte:src/routes/todos/+page.svelte showLineNumbers
<script lang="ts">
  export let data

  // todo
  async function addTodo(event: Event) {}

  // todo
  async function removeTodo(event: Event) {}
</script>

<ul>
  {#each data.todos as todo}
    <li>
      <span>{todo.text}</span>
      <form on:submit|preventDefault={removeTodo} method="POST">
        <input type="hidden" name="id" value={todo.id} />
        <button class="delete" type="submit">❌</button>
      </form>
    </li>
  {/each}
</ul>

<form on:submit|preventDefault={addTodo} method="POST">
  <input type="text" name="todo" />
  <button type="submit">+ Add Todo</button>
</form>

<style>
  ul {
    padding: 0;
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  span {
    text-transform: capitalize;
  }

  .delete {
    margin: 0;
    background: none;
    border: none;
  }

  .error {
    color: tomato;
  }
</style>
```

The `action` attribute is optional because we're going to use the same endpoint for the form.

> 🐿️ You might be more used to JavaScript instead of using forms and it might feel weird using forms for what might seem easier to use a button for but it's perfectly normal and you should embrace it (you're going to see how awesome it is).

I'm going to create a `POST` and `DELETE` function inside `+server.ts` that should get the data from the form and do the appropriate action — I'm going to use a `formData` object to send `success` and `errors` to update the UI for the user.

```ts:src/routes/todos/+server.ts showLineNumbers
import { json } from '@sveltejs/kit'
import { addTodo, removeTodo } from '$lib/server/database'

type Data = {
  success: boolean
  errors: Record<string, string>
}

export async function POST({ request }) {
  const formData = await request.formData()
  const todo = String(formData.get('todo'))

  const data: Data = {
    success: false,
    errors: {}
  }

  if (!todo) {
    data.errors.todo = 'required'
    return json(data, { status: 400 })
  }

  addTodo(todo)
  data.success = true

  return json(data)
}

export async function DELETE({ request }) {
  const formData = await request.formData()
  const todoId = Number(formData.get('id'))

  removeTodo(todoId)

  return json({ success: true })
}
```

For the `todoId` I used a hidden input field to get the id for the to-do when looping through the to-do list in the template.

Let's go back to `+page.svelte` and create `addTodo` and `removeTodo` functions and update the UI based on the response.

```svelte:src/routes/todos/+page.svelte showLineNumbers
<script lang="ts">
  import { invalidateAll } from '$app/navigation'

  // we need the same type
  type Data = {
    success: boolean
    errors: Record<string, string>
  }

  export let data

  // used in the template
  let form: Data

  async function addTodo(event: Event) {
    const formEl = event.target as HTMLFormElement
    const data = new FormData(formEl)

    // you can see everything about the form
    console.dir(form)

    const response = await fetch(formEl.action, {
      method: 'POST',
      body: data
    })
    const responseData = await response.json()

    // { success: true, errors: {} } object
    form = responseData

    // reset form
    formEl.reset()

    // rerun `load` function for the page
    await invalidateAll()
  }

  async function removeTodo(event: Event) {
    const formEl = event.target as HTMLFormElement
    const data = new FormData(formEl)

    // forms only support `GET` and `POST` methods but
    // SvelteKit maps this to the `DELETE` function
    const response = await fetch(formEl.action, {
      method: 'DELETE',
      body: data
    })

    await invalidateAll()
  }
</script>

<ul>
  {#each data.todos as todo}
    <li>
      <span>{todo.text}</span>
      <form on:submit|preventDefault={removeTodo} method="POST">
        <input type="hidden" name="id" value={todo.id} />
        <button class="delete" type="submit">❌</button>
      </form>
    </li>
  {/each}
</ul>

<form on:submit|preventDefault={addTodo} method="POST">
  <input type="text" name="todo" />
  {#if form?.errors?.todo}
    <p class="error">This field is required</p>
  {/if}

  <button type="submit">+ Add Todo</button>
</form>

{#if form?.success}
  <p>Added todo! 🥳</p>
{/if}
```

If you add or remove a to-do you can see the `fetch` request and the payload in the network tab — the request also returns a JSON response that has `success` and `errors` which is then used on the front-end to update the UI for the user.

This taught us a lot about about forms but...

This is not a great user and developer experience because:

- It only works with JavaScript
- You had to invent your own wonky validation
- Using `fetch` and `invalidate` is weird and the framework should do more for you
- Repeating types feels bad

This is why you should use SvelteKit form actions and in the next section I'm going to show you why they're so awesome.

## Working With Forms The SvelteKit Way Using Form Actions

Inside a standalone `+server.ts` endpoint you can use functions that map to HTTP verbs like `GET` or `POST` but [form actions](https://kit.svelte.dev/docs/form-actions) take this idea a step further and you can define methods that map to an action inside a `+page.server.ts` file.

```ts:src/routes/+page.server.ts showLineNumbers
export const actions = {
  default: async (event) => {
  // ...
  }
}
```

If you don't define an `action` attribute you can use the `default` method but for multiple actions it's replaced by **named actions** like `action="?/addTodo"`.

```svelte:+page.svelte showLineNumbers
<form method="POST">
  <!-- ... -->
</form>
```

Actions always use `POST` requests because `GET` requests shouldn't have side-effects and they can be invoked from other pages.

```svelte:+page.svelte showLineNumbers
<form method="POST" action="/todos?/addTodo">
  <!-- ... -->
</form>
```

If you need to `POST` the same form data to a different action you can also use the `formaction` attribute.

```svelte:+page.svelte showLineNumbers
<form method="POST" action="?/addTodo">
  <!-- ... -->
  <button>+ Add todo</button>
  <button formaction="?/clearTodos">Clear</button>
  </form>
```

I'm going to convert the previous example to use form actions. First I'm going to delete the `+server.ts` file since you don't need it, so you should have this folder structure.

```shell:todos
routes
└── todos
    ├── +page.server.ts
    └── +page.svelte
```

Fetching data for the page using the `load` function is the same but now you can also export an `actions` object from `+page.server.ts`.

Let's start with creating actions for adding, removing and clear to-do items.

```ts:src/routes/todos/+page.server.ts showLineNumbers
import { fail } from '@sveltejs/kit'

import { addTodo, clearTodos, getTodos, removeTodo } from '$lib/server/database'

export async function load() {
  const todos = getTodos()
  return { todos }
}

export const actions = {
  addTodo: async ({ request }) => {
    const formData = await request.formData()
    const todo = String(formData.get('todo'))

    if (!todo) {
      return fail(400, { todo, missing: true })
    }

    addTodo(todo)

    return { success: true }
  },
  removeTodo: async ({ request }) => {
    const formData = await request.formData()
    const todoId = Number(formData.get('id'))

    removeTodo(todoId)

    return { success: true }
  },
  clearTodos: () => {
    clearTodos()
  }
}
```

You can already see how much less code you have to write and SvelteKit handles returning validation errors using the `fail` function that can have the data you can use for the input `value` to get around the form reset.

The action responds with data that's available through the `form` property and `$page.form` store and reruns the `load` function for the page.

```svelte:src/routes/todos/+page.svelte showLineNumbers
<script lang="ts">
  export let data
  export let form
</script>

<ul>
  {#each data.todos as todo}
    <li>
      <span>{todo.text}</span>
      <form method="POST" action="?/removeTodo">
        <input type="hidden" name="id" value={todo.id} />
        <button class="delete" type="submit">❌</button>
      </form>
    </li>
  {/each}
</ul>

<form method="POST" action="?/addTodo">
  <input type="text" name="todo" value={form?.todo ?? ''} />
  {#if form?.missing}
    <p class="error">This field is required</p>
  {/if}

  <button type="submit">+ Add Todo</button>

  <button	formaction="?/clearTodos" class="secondary" type="submit">
    Clear
  </button>
</form>

{#if form?.success}
  <p>Added todo! 🥳</p>
{/if}

<style>
  ul {
    padding: 0;
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  span {
    text-transform: capitalize;
  }

  .delete {
    margin: 0;
    background: none;
    border: none;
  }

  .error {
    color: tomato;
  }
</style>
```

> 🐿️ The SvelteKit language server is doing a lot of work under the hood and sometimes you might have a problem with the generated types in which case you can press <kbd>Ctrl</kbd> + <kbd>P</kbd> and type `> Svelte: Restart Language Server` but if that doesn't work restart the development server or your editor as a last resort.

If you look at the payload in the network tab when adding or removing a to-do you're going to see the parsed query string and form data.

Actions might look like magic but they're just a URL that invokes a function. If you take `/` out of `?/addTodo` you end up `?addTodo` which is just a search param but `/` lets SvelteKit know you meant to use an action.

## Progressive Form Enhancement

Try to add or remove a to-do item from the list and pay attention to the icon in the browser tab and look at your network tab.

You're going to notice each time you add or remove a to-do the page reloads. This is the default form behavior once you submit it — this means the form works without JavaScript!

[JavaScript can fail to load for many reasons](https://www.kryogenix.org/code/browser/everyonehasjs.html) but I'm not advocating that every site should work without JavaScript and should instead work before JavaScript is loaded on the page. This approach to development makes your app more resilient and you can use JavaScript once it's available on the page to improve the user experience using progressive enhancement as intended.

Remember the first example how we had to do everything by hand? SvelteKit does that for you and wraps everything in a neat `use:enhance` [Svelte action](https://learn.svelte.dev/tutorial/actions) (unrelated to form actions) that does the same thing.

```svelte:src/routes/todos/+page.svelte {2, 12, 20} showLineNumbers
<script lang="ts">
  import { enhance } from '$app/forms'

  export let data
  export let form
</script>

<ul>
  {#each data.todos as todo}
    <li>
      <span>{todo.text}</span>
      <form method="POST" action="?/removeTodo" use:enhance>
        <input type="hidden" name="id" value={todo.id} />
        <button class="delete" type="submit">❌</button>
      </form>
    </li>
  {/each}
</ul>

<form method="POST" action="?/addTodo" use:enhance>
  <input type="text" name="todo" value={form?.todo ?? ''} />
  {#if form?.missing}
    <p class="error">This field is required</p>
  {/if}

  <button type="submit">+ Add Todo</button>

  <button	formaction="?/clearTodos" class="secondary" type="submit">
    Clear
  </button>
</form>

{#if form?.success}
  <p>Added todo! 🥳</p>
{/if}

<!-- ... -->
```

It only takes one line of code if you count the import and everything works the same but instead of reloading the page it's going to prevent the default form behavior and use JavaScript — if you look at the network tab you should see the `fetch` request.

When you submit the form the `use:enhance` action is going to:

- Update the `form`, `$page.form` and `$page.status` property
- Reset the `<form>` element and rerun the `load` function for the page by using `invalidateAll`
- Use `goto` for a redirect response

If you want to learn how it works you can look at [form.js](https://github.com/sveltejs/kit/blob/master/packages/kit/src/runtime/app/forms.js) inside the SvelteKit repo which looks very familiar to what I showed you earlier — everything leads to this point because I want to give you perspective and understanding how the things you use work and why.

## Customize The Enhance Action To Show A Loading UI

You can customize the behavior of `use:enhance` by providing a submit function that runs before the form is submitted and can return a callback that has access to the result.

```svelte:src/routes/todos/+page.svelte showLineNumbers
<script lang="ts">
  import { enhance, type SubmitFunction } from '$app/forms'

  export let data
  export let form

  const addTodo: SubmitFunction = (input) => {
    // do something before the form submits
    console.log(input)

    return async (options) => {
      // do something after the form submits
      console.log(options)
    }
  }
</script>

<!-- ... -->
```

The `input` contains:

- `action` for the URL details
- `cancel` to prevent the submission
- `controller` is the `AbortController` you can use to cancel a request
- `data` is the `FormData` object
- `form` is the `<form>` element

The `options` contains:

- `action` for the URL details
- `form` is the `<form>` element
- `result` which is an `ActionResult` object
- `update` function that runs the regular logic, otherwise you would have to do it yourself

You can't always rely on a fast response from the server in which case the user might leave your site because it looks broken.

I defined a `sleep` function to simulate a slow response which I'm going to use inside the `addTodo` action.

```ts:src/routes/todos/+page.server.ts {10-12, 23} showLineNumbers
import { fail } from '@sveltejs/kit'

import { addTodo, getTodos, removeTodo } from '$lib/server/database'

export async function load() {
  const todos = getTodos()
  return { todos }
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const actions = {
  addTodo: async ({ request }) => {
    const formData = await request.formData()
    const todo = String(formData.get('todo'))

    if (!todo) {
      return fail(400, { todo, missing: true })
    }

    await sleep(2000)

    addTodo(todo)

    return { success: true }
  },
  removeTodo: async ({ request }) => {
    const formData = await request.formData()
    const todoId = Number(formData.get('id'))
    removeTodo(todoId)
  },
  clearTodos: () => {
    clearTodos()
  }
}
```

Using what we know I'm going to set `loading = true` before the form submits and when it's done we can set `loading = false`.

```svelte:src/routes/todos/+page.svelte {7, 10, 12-15, 37-39} showLineNumbers
<script lang="ts">
  import { enhance, type SubmitFunction } from '$app/forms'

  export let data
  export let form

  let loading = false

  const addTodo: SubmitFunction = () => {
    loading = true

    return async ({ update }) => {
      loading = false
      await update()
    }
  }
</script>

<ul>
  {#each data.todos as todo}
    <li>
      <span>{todo.text}</span>
      <form method="POST" action="?/removeTodo" use:enhance>
        <input type="hidden" name="id" value={todo.id} />
        <button class="delete" type="submit">❌</button>
      </form>
    </li>
  {/each}
</ul>

<form method="POST" action="?/addTodo" use:enhance={addTodo}>
  <input type="text" name="todo" value={form?.todo ?? ''} />
  {#if form?.missing}
    <p class="error">This field is required</p>
  {/if}

  <button aria-busy={loading} class:secondary={loading} type="submit">
    {#if !loading}+ Add todo{/if}
  </button>

  <button	formaction="?/clearTodos" class="secondary" type="submit">
    Clear
  </button>
</form>

{#if form?.success}
  <p>Added todo! 🥳</p>
{/if}

<!-- ... -->
```

Awesome! 😄

You can show a toast notification when a user adds and removes a to-do item but I'm going to leave that as an exercise to the reader.

## Form Validation In SvelteKit

I'm going to show you how you can validate a form using the popular schema validation library [Zod](https://github.com/colinhacks/zod) (hail Zod!) and show you a couple of tricks. 🛹

I'm going to create a `routes/login` route using the first example but I'm going to add the `required` attribute for the input fields.

```svelte:src/routes/login/+page.svelte showLineNumbers
<script lang="ts">
  import { enhance } from '$app/forms'
</script>

<form method="POST" use:enhance>
  <input type="text" name="user" required />
  <input type="password" name="password" required />
  <button type="submit">Login</button>
</form>
```

The browser has some built-in validation but the problem is that anyone can be hackerman and edit client-side code and submit whatever they want — this serves more as a nicer user experience than a guard against malicious actors and that is why you should always do server-side validation.

The next part is going to make more sense if I describe the shape of the object I want for the `form` prop on the page.

```ts:example.ts
{
  "data": {
    "name": "",
    "email": ""
  },
  "errors": {
    "user": "required",
    "password": "required"
  }
}
```

As you can see there is no rule what you should return and now you can do `form?.data?.value` to return the input value and `form?.errors?.value` to provide feedback.

Let's add the validation inside the default form action.

```ts:src/routes/login/+page.server.ts showLineNumbers
import { fail, redirect } from '@sveltejs/kit'

export const actions = {
  default: async ({ request }) => {
    // get the form data
    const formData = await request.formData()

    // get the input values
    const user = String(formData.get('user'))
    const password = String(formData.get('password'))

    // gather errors
    const errors: Record<string, unknown> = {}

    if (!user || typeof user !== 'string') {
      errors.user = 'required'
    }

    if (!password || typeof password !== 'string') {
      errors.password = 'required'
    }

    // in case of an error return the data and errors
    if (Object.keys(errors).length > 0) {
      const data = {
        data: Object.fromEntries(formData),
        errors
      }
      return fail(400, data)
    }

    // redirect the user
    redirect(303, '/todos')
  }
}
```

This can now we be used in the template.

```svelte:src/routes/login/+page.svelte showLineNumbers
<script lang="ts">
  import { enhance } from '$app/forms'

  export let form
</script>

<form method="POST" use:enhance>
  <input type="text" name="user" value={form?.data?.user ?? ''} />
  {#if form?.errors?.user}
    <p class="error">Name is required</p>
  {/if}

  <input type="password" name="password" value={form?.data?.password ?? ''} />
  {#if form?.errors?.password}
    <p class="error">Password is required</p>
  {/if}

  <button type="submit">Login</button>
</form>

<style>
  .error {
    color: tomato;
  }
</style>
```

This is great but having to get every input value and using conditional statements even for a basic form feels tedious.

This is a perfect use case for Zod that's great at validating an unknown input. First you create a schema of the fields you expect and parse it using Zod which is going to make sure the values are correct or otherwise throw an error and you can abstract the validation logic inside a function.

> 🐿️ `zod-form-data` is a great example of using web standards because it was made for Remix but works for SvelteKit because `FormData` is a web standard.

I'm going to install `zod` and the `zod-form-data` package that makes it simple to parse `FormData` and `URLSearchParams`.

```shell:terminal
npm i z zod-form-data
```

I'm going to change the previous example to use Zod for validation.

```ts:src/routes/login/+page.server.ts showLineNumbers
import { fail, redirect } from '@sveltejs/kit'
import { zfd } from 'zod-form-data'

export const actions = {
  default: async ({ request }) => {
    // get the form data
    const formData = await request.formData()

    // define the validation schema
    const loginSchema = zfd.formData({
      user: zfd.text(),
      password: zfd.text()
    })

    // parse the validation schema
    const result = loginSchema.safeParse(formData)

    // in case of an error return the data and errors
    if (!result.success) {
      const data = {
        data: Object.fromEntries(formData),
        errors: result.error.flatten().fieldErrors
      }
      return fail(400, data)
    }

    // redirect the user
    redirect(303, '/todos')
  }
}
```

This isn't the only way to do validation with Zod and you can read more about [error handling in Zod](https://zod.dev/?id=error-handling) from the docs but form validation deserves its own post.

You can abstract the validation logic inside a `validation` function that you can use alongside other utils and have a separate file for your validation schemas.

```ts:utils.ts showLineNumbers
export const validate(formData: FormData, schema: Schema) {
  // ...
}
```

You can use it like this inside your project.

```ts:+page.server.ts showLineNumbers
const formData = await request.formData()
const { data, errors } = validate(formData)
```

## Advanced Enhance Action Customization

You might want to reproduce a part of the default `use:enhance` behavior in which case you can use `applyAction`.

I mentioned how actions can be invoked from other pages and in this example I want to reuse the `/login` endpoint in `routes/+page.svelte` and I copied over everything from `routes/login/+page.svelte`.

If you submit the form it kinda works but you don't get the validation data back because `form` is never updated.

```svelte:src/routes/+page.svelte showLineNumbers
<script lang="ts">
  import { enhance } from '$app/forms'

  export let form
</script>

<form method="POST" action="/login" use:enhance>
  <input type="text" name="name" value={form?.data?.name ?? ''} />
  {#if form?.errors?.name}
    <p class="error">Name is required</p>
  {/if}

  <input type="email" name="email" value={form?.data.email ?? ''} />
  {#if form?.errors?.email}
    <p class="error">Email is required</p>
  {/if}

  <button type="submit">Login</button>
</form>

<style>
  .error {
    color: tomato;
  }
</style>
```

Let's try using the `update` method and see if it works.

```svelte:src/routes/+page.svelte {2, 6-10, 13} showLineNumbers
<script lang="ts">
  import { enhance, type SubmitFunction } from '$app/forms'

  export let form

  const login: SubmitFunction = () => {
    return async ({ update }) => {
      await update()
    }
  }
</script>

<form method="POST" action="/login" use:enhance={login}>
  <!-- ... -->
</form>
```

That won't work because `update` can't update `form` and `$form.page` from anywhere else but you can use `applyAction` and pass it `result` to customize the `use:enhance` behavior further.

```svelte:src/routes/+page.svelte {2, 7-9} showLineNumbers
<script lang="ts">
  import { applyAction, enhance, type SubmitFunction } from '$app/forms'

  export let form

  const login: SubmitFunction = () => {
    return async ({ result }) => {
      await applyAction(result)
    }
  }
</script>

<form method="POST" action="/login" use:enhance={login}>
  <!-- ... -->
</form>
```

If you submit the form `form` and `$page.form` is going to get updated.

As I mentioned previously `result` is an `ActionResult` object but I haven't talk about its properties which are:

- `data` returned from the action
- `status` code
- `type` which can be `succes`, `failure`, `redirect`, `error`

Using `applyAction(result)` is going to do different things based on `result.type`:

- `success` and `failure` is going to update `form`, `$page.form` and `$page.status` regardless where you're submitting from
- `redirect` is going to invoke `goto(result.location)`
- `error` is going to render the nearest `+error.svelte` page

Here's an example of how that looks in action. 🥁

```ts:example.ts showLineNumbers
const submit: SubmitFunction = ({ form, data, action, cancel }) => {
  // do something before the form submits

  return async ({ result }) => {
    // do something after the form submits

    if (result.type === 'success') {
      // do something...

      // use the default behavior for this result type
      await applyAction(result)
    }

    if (result.type === 'failure') { /* ... */ }

    if (result.type === 'redirect') { /* ... */ }

    if (result.type === 'error') { /* ... */ }
  }
}
```

This way you can customize the behavior of `use:enhance` and dip in and out of the regular behavior when you need it.

That's everything you should know to feel confident working with forms in SvelteKit and I hope you learned how forms work but more importantly how to make your app more resilient.

In the next part you're going to [learn about using advanced layouts in SvelteKit](https://joyofcode.xyz/sveltekit-advanced-layouts).
