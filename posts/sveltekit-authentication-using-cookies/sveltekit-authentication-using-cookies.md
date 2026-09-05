---
title: SvelteKit Authentication Using Cookies
description: Learn SvelteKit user authentication using cookies.
slug: sveltekit-authentication-using-cookies
published: '2022-5-12'
category: sveltekit
---

<script lang="ts">
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="E3VG-dLCRUk" title="SvelteKit Authentication Using Cookies" />

## Table of Contents

## Setting Up The Database

> 🔥 The post has been updated for Svelte 5.

If you want to follow along I'm using a regular SvelteKit project with TypeScript you can set up with `npx sv create`.

> 🧪 You can find the project files on [GitHub](https://github.com/joysofcode/sveltekit-auth-cookies).

To set up the database I'm going to use [Prisma](https://www.prisma.io/) because you can just write a schema to define the tables instead of writing raw SQL.

I'm using [SQLite](https://www.sqlite.org/index.html) for the database because it doesn't require any setup since the database is just a regular file on your system.

```shell:terminal
npx prisma init --datasource-provider sqlite
```

This is going to create a `prisma` folder and a `.env` file with the connection string at the root of your project, inside the folder you're going to find the Prisma schema and the SQLite database.

```ts:schema.prisma showLineNumbers
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id            String @id @default(uuid())
  username      String @unique
  passwordHash  String
  userAuthToken String @unique

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  role   Roles @relation(fields: [roleId], references: [id])
  roleId Int
}

model Roles {
  id   Int    @id @default(autoincrement())
  name String @unique
  User User[]
}
```

The schema is going to create the `User` and `Roles` tables.

> 🐿️ Later when you change to a MySQL or PostgreSQL database you only need to change the connection string and don't have to change your schema but you can also use other features only those databases support like [enums](https://www.prisma.io/docs/concepts/components/prisma-schema/data-model#defining-enums) for the user role.

I'm going to create a unique `passwordHash` which is safer than storing a plain text password in case you get compromised and a unique `userAuthToken` which I'm going to use for the session ID later.

> 🐿️ You could create a separate table for the password to reduce the risk of querying it and sending it to the frontend.

To query the database with Prisma you need to install the `@prisma/client` package that also runs `prisma generate` which generates the Prisma Client that's unique to your project.

```shell:terminal
npm i @prisma/client
```

Create the database from the Prisma schema.

```shell:terminal
npx prisma db push
```

I'm going to open [Prisma Studio](https://www.prisma.io/studio) that's a nice graphical user interface for your database and go to the `Roles` table and press **Add record** to add `ADMIN` and `USER` roles, enter the role name and press **Save** for each one.

```shell:terminal
npx prisma studio
```

Initialize and export the Prisma client to use it in our project.

```ts:lib/database.ts showLineNumbers
import prisma from '@prisma/client'

export const db = new prisma.PrismaClient()
```

## User Registration

To register the user I'm going to use [form actions](https://kit.svelte.dev/docs/form-actions) that's an easy way to write an action you want your form to take once you submit it and return form validation errors.

```svelte:register/+page.svelte showLineNumbers
<script lang="ts">
  let { form } = $props()
</script>

<h1>Register</h1>

<form action="?/register" method="POST">
  <div>
    <label for="username">Username</label>
    <input id="username" name="username" type="text" required />
  </div>

  <div>
    <label for="password">Password</label>
    <input id="password" name="password" type="password" required />
  </div>

  {#if form?.user}
    <p class="error">Username is taken.</p>
  {/if}

  <button type="submit">Register</button>
</form>
```

I'm going to use `bcrypt` for hashing the password.

```shell:terminal
# for hashing the password
npm i bcrypt

# optional bcrypt types
npm i -D @types/bcrypt
```

If there are no validation errors I'm going to create the user by hashing the password, creating the user authentication token and assigning it a role after which I'm going to redirect the user.

```ts:register/+page.server.ts showLineNumbers
import { fail, redirect } from '@sveltejs/kit'
import bcrypt from 'bcrypt'

import { db } from '$lib/database'

// using an enum for user roles to avoid typos
// if you're not using TypeScript use an object
enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export const load = async () => {
  // todo
}

const register = async ({ request }) => {
  const data = await request.formData()
  const username = data.get('username')
  const password = data.get('password')

  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    !username ||
    !password
  ) {
    return fail(400, { invalid: true })
  }

  const user = await db.user.findUnique({
    where: { username },
  })

  if (user) {
    return fail(400, { user: true })
  }

  await db.user.create({
    data: {
      username,
      passwordHash: await bcrypt.hash(password, 10),
      userAuthToken: crypto.randomUUID(),
      role: { connect: { name: Roles.USER } },
    },
  })

  redirect(303, '/login')
}

export const actions = { register }
```

You should be able to register a user with a role but the redirect doesn't work yet because the login page doesn't exist yet.

## User Login

The user login is similar to the user registration for the page.

> 🐿️ If you have sensitive information be vague with the error messages to not help bad actors who might be trying to abuse it.

```svelte:login/+page.svelte showLineNumbers
<script lang="ts">
  let { form } = $props()
</script>

<h1>Login</h1>

<form action="?/login" method="POST">
  <div>
    <label for="username">Username</label>
    <input id="username" name="username" type="text" required />
  </div>

  <div>
    <label for="password">Password</label>
    <input id="password" name="password" type="password" required />
  </div>

  {#if form?.invalid}
    <p class="error">Username and password is required.</p>
  {/if}

  {#if form?.credentials}
    <p class="error">You have entered the wrong credentials.</p>
  {/if}

  <button type="submit">Log in</button>
</form>
```

I'm going to check if the user already exists and compare if the passwords match. I want to generate a new authentication token each time in case it gets compromised and authenticate and redirect the user.

SvelteKit provides a nice API for interacting with cookies, so you don't have to import it.

```ts:login/+page.server.ts showLineNumbers
import { fail, redirect } from '@sveltejs/kit'
import bcrypt from 'bcrypt'

import { db } from '$lib/database'

export const load = async () => {
  // todo
}

const login = async ({ cookies, request }) => {
  const data = await request.formData()
  const username = data.get('username')
  const password = data.get('password')

  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    !username ||
    !password
  ) {
    return fail(400, { invalid: true })
  }

  const user = await db.user.findUnique({ where: { username } })

  if (!user) {
    return fail(400, { credentials: true })
  }

  const userPassword = await bcrypt.compare(password, user.passwordHash)

  if (!userPassword) {
    return fail(400, { credentials: true })
  }

  // generate new auth token just in case
  const authenticatedUser = await db.user.update({
    where: { username: user.username },
    data: { userAuthToken: crypto.randomUUID() },
  })

  cookies.set('session', authenticatedUser.userAuthToken, {
    // send cookie for every page
    path: '/',
    // server side only cookie so you can't use `document.cookie`
    httpOnly: true,
    // only requests from same site can send cookies
    // https://developer.mozilla.org/en-US/docs/Glossary/CSRF
    sameSite: 'strict',
    // only sent over HTTPS in production
    secure: process.env.NODE_ENV === 'production',
    // set cookie to expire after a month
    maxAge: 60 * 60 * 24 * 30,
  })

  // redirect the user
  redirect(302, '/')
}

export const actions = { login }
```

You can see the cookie if you go to your developer tools in the **Application** tab under **Storage** > **Cookies** and you can see it has the name **session** and the value of the **auth token** which if someone copied becomes you and that's why it's important to change it.

At first the code might look daunting but if you ignore the user validation the code required to make the login work is under twenty lines of code.

## User Logout

To make the user logout work you only need to eat the cookie and redirect the user.

```ts:logout/+page.server.ts showLineNumbers
import { redirect } from '@sveltejs/kit'

export const load = async () => {
  // we only use this endpoint for the api
  // and don't need to see the page
  redirect(302, '/')
}

export const actions = {
  default({ cookies }) {
    // eat the cookie
    cookies.set('session', '', {
      path: '/',
      expires: new Date(0),
    })

    // redirect the user
    redirect(302, '/login')
  },
}
```

You need a form to `POST` the action to `/login` and it would eat the cookie which I'm going to show you after the next chapter.

> 🐿️ You can use a standalone `+server.ts` endpoint instead if you want but I'm going to show you progressive enhancement later and that would require JavaScript.

## Passing User Data To Pages

So far everything works great but we need to somehow pass data to pages to know if the user is authenticated or not.

Each page has a `load` option that has an `event` argument.

```ts:+page.server.ts showLineNumbers
export const load = async (event) => {
  console.log(event)
}
```

> 🐿️ `*.server.ts` files only run on the server.

The `event` contains `clientAddress`, `cookies`, `locals`, `platform` and `request` but to us the most interesting one is `event.locals` to store the user information and make it available wherever you use the `load` function.

In the same way to get access to that information on the client you can use `$page.data` from the `$page` store that holds the combined data of all `load` functions.

This might not make sense yet but our goal is to populate `locals.user` and pass a `user` prop to the `$page` store.

First I'm going to create a `hooks.server.ts` at the root of the project.

In SvelteKit a “hook” is just a file that runs every time the SvelteKit server receives a request and lets you modify incoming requests and change the response.

```ts:hooks.server.ts showLineNumbers
// this is the default behavior
export const handle: Handle = async ({ event, resolve }) => resolve(event)

// you could return a 🍌 instead of a page
export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname === '/') {
    return new Response('🍌')
  }
}
```

I'm going to use the `handle` function inside `hooks.server.ts` to pass custom data to `event.locals`.

```ts:hooks.server.ts showLineNumbers
import type { Handle } from '@sveltejs/kit'
import { db } from '$lib/database'

export const handle: Handle = async ({ event, resolve }) => {
  // get cookies from browser
  const session = event.cookies.get('session')

  if (!session) {
    // if there is no session load page as normal
    return await resolve(event)
  }

  // find the user based on the session
  const user = await db.user.findUnique({
    where: { userAuthToken: session },
    select: { username: true, role: true },
  })

  // if `user` exists set `events.local`
  if (user) {
    event.locals.user = {
      name: user.username,
      role: user.role.name,
    }
  }

  // load page as normal
  return await resolve(event)
}
```

After the user is authenticated and the cookie is created we can populate `event.locals.user` with the user `name` and `role`.

> 🐿️ The `event.locals.user` naming is arbitrary. You can name it `event.locals.banana` and pass `event.locals.banana = '🍌'` if you wanted.

Since the `locals.user` is populated we can pass it to the `$page` store from `+layout.server.ts`.

```ts:routes/+layout.server.ts showLineNumbers
// get `locals.user` and pass it to the `page` store
export const load = async ({ locals }) => {
  return {
    user: locals.user,
  }
}
```

If you're using TypeScript you have to type `locals` because it could be anything.

```ts:src/app.d.ts showLineNumbers
declare namespace App {
  interface Locals {
    user: {
      name: string
      role: string
    }
  }
}
```

## Protected Routes

You can use the `$page` store on the client to know if the user is authenticated.

```svelte:routes/+layout.svelte showLineNumbers
<script lang="ts">
  import { page } from '$app/stores'

  let { children } = $props()
</script>

<svelte:head>
  <title>SvelteKit Auth</title>
</svelte:head>

<nav>
  {#if !$page.data.user}
    <a href="/login">Login</a>
    <a href="/register">Register</a>
  {/if}

  {#if $page.data.user}
    <a href="/admin">Admin</a>

    <form action="/logout" method="POST">
      <button type="submit">Log out</button>
    </form>
  {/if}
</nav>

<main>
  {@render children?.()}
</main>
```

I'm also going to update the register and login page `load` functions.

```ts:register/+page.server.ts showLineNumbers
export const load = async ({ locals }) => {
  // redirect user if logged in
  if (locals.user) {
    redirect(302, '/')
  }
}

// ...
```

```ts:login/+page.server.ts showLineNumbers
export const load = async ({ locals }) => {
  // redirect user if logged in
  if (locals.user) {
    redirect(302, '/')
  }
}

// ...
```

Here's how you create a protected route.

```svelte:admin/+page.svelte showLineNumbers
<script lang="ts">
  import { page } from '$app/stores'
</script>

<h1>Admin</h1>

{#if $page.data.user}
  <p>Welcome {$page.data.user.name}!</p>
{/if}

{#if $page.data.user.role === 'ADMIN'}
  <form action="/logout" method="POST">
    <button type="submit">Log out</button>
  </form>
{/if}
```

```ts:admin/+page.server.ts showLineNumbers
import { redirect } from '@sveltejs/kit'

export const load = async ({ locals }) => {
  // redirect user if not logged in
  if (!locals.user) {
    redirect(302, '/')
  }
}
```

In the final example I used a [(group)](https://kit.svelte.dev/docs/advanced-routing#advanced-layouts-group) to group the auth related routes inside an `(auth)` group and the protected routes inside a `(protected)` group.

## Progressive Enhancement

Have you noticed how so far we didn't use any JavaScript? 😄

Your app is going to be more resilient and using progressive enhancement we can use JavaScript to improve the user experience.

The only thing you have to do is import the `enhance` action from SvelteKit and it's going to progressively enhance the form and use JavaScript when it can.

```svelte:register/+page.svelte showLineNumbers
<script lang="ts">
  import { enhance } from '$app/forms'
  // ...
</script>

<form action="?/register" method="POST" use:enhance>
  <!-- ... -->
</form>
```

For the login page we need to rerun the `load` function for the page to update it.

```svelte:login/+page.svelte showLineNumbers
<script lang="ts">
  import { enhance } from '$app/forms'
  // ...
</script>

<h1>Login</h1>

<form action="?/login" method="POST" use:enhance>
  <!-- ... -->
</form>
```

The same goes for logout.

```svelte:routes/+layout.svelte showLineNumbers
<script lang="ts">
  import { enhance } from '$app/forms'
  // ...
</script>

<!-- ... -->

<form class="logout" action="/logout" method="POST" use:enhance>
  <button type="submit">Log out</button>
</form>
```

## Conclusion

I hope at least you found the post educational and learned more about SvelteKit because it's mostly about just using the web platform.

If you have a serious project I would look into using an authentication library because security is hard and you don't want to run into edge cases and maintain one yourself:

- [SvelteKit Auth](https://github.com/Dan6erbond/sk-auth)
- [Lucia](https://github.com/pilcrowOnPaper/lucia-sveltekit)

Thank you for reading! 🏄️
