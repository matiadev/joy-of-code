---
title: TypeScript Fundamentals
description: Learn TypeScript through example — the missing TypeScript reference.
slug: typescript-fundamentals
published: '2021-7-7'
category: typescript
---

<script lang="ts">
	import Image from '#lib/components/image.svelte'
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="Giu1uoiNbGk" title="TypeScript Fundamentals" />

## Table of Contents

If you're learning TypeScript for the first time or need a refresher this is the resource for you.

There's a lot of great resources out there for learning TypeScript, but I've always felt they use abstract examples that are hard to relate to and don't explain how to help yourself to figure out types.

That being said nothing can substitute the experience of using TypeScript in your project, so dust off an old JavaScript project or start a new one to learn from and use this as reference.

## You're Already Using TypeScript

If you're a web developer, you're probably using [Visual Studio Code](https://code.visualstudio.com/) (not to be confused with [Visual Studio](https://visualstudio.microsoft.com/)) and if you're not at least consider it.

Have you ever asked yourself how **code completion** in your editor works?

```js:example.js
const pokemon = ['Bulbasaur', 'Charmander', 'Squirtle']
```

<Image src="hover-type.webp" alt="Type on hover" />

The editor knows that `pokemon` is an **array** of strings.

<Image src="intellisense.webp" alt="Intellisense" />

Since `pokemon` is an **array** the [editor intellisense](https://code.visualstudio.com/docs/editor/intellisense) is smart enough to only show us **array** methods.

Imagine not having this feature. You would have to remember and look every method up on the [MDN Web Docs](https://developer.mozilla.org/en-US/).

<Image src="signature-call.webp" alt="Signature call" />

If we look at the `map` array method we can see it's **call signature** and description in the tooltip.

This is **JavaScript** — yet it's using **TypeScript** under the hood.

TypeScript isn't just types — it's popular because this is the kind of **developer experience** that every other developer is used to in other languages.

We can add `@ts-check` at the top of a JavaScript file to enable **type checking** in JavaScript.

```js:example.js showLineNumbers
// @ts-check

const pokemon = ['Bulbasaur', 'Charmander', 'Squirtle']

pokemon.push(1) // oops! 💩
```

<Image src="ts-error.webp" alt="TypeScript error" />

The `pokemon` array contains only strings, so we get a **type error** when trying to assign `number` to `string`.

The **VS Code** editor uses the **TypeScript language server** under the hood.

<Image src="built-in-extensions.webp" alt="Built-in extensions" />

If we look at the built-in **VS Code** extensions, we can notice some usual suspects. Look, there's [Emmet](https://www.emmet.io/). 😄

The language server provides us with sophisticated features such as **code completion**, **refactoring**, **syntax highlighting**, and **error and warnings**.

> The Language Server Protocol allows for decoupling language services from the editor so that the services may be contained within a general-purpose language server. Any editor can inherit sophisticated support for many different languages by making use of existing language servers. Similarly, a programmer involved with the development of a new programming language can make services for that language available to existing editing tools. — [Language Server Protocol (Wikipedia)](https://en.wikipedia.org/wiki/Language_Server_Protocol).

[Visual Studio Code](https://code.visualstudio.com/) and [TypeScript](https://www.typescriptlang.org/) are made by Microsoft, so that explains the tight integration. This doesn't mean you're left in the dark if you're using another editor like [WebStorm](https://www.jetbrains.com/webstorm/) or [Vim](https://www.vim.org/). The **TypeScript language server** is available as a **plugin** for those editors.

Your editor already has some great features that get **enhanced** by TypeScript:

- **Auto imports** (as you type imports get added)
- **Code navigation** (definitions, lookup)
- **Rename** (rename symbols across file)
- **Refactoring** (extracting code to functions)
- **Quick fixes** (suggested edits like fixing a mispelled property name)
- **Code suggestions** (for example converting `.then` to use `async` and `await`)

You can learn more about these features in-depth if you read the [documentation for the JavaScript language](https://code.visualstudio.com/docs/languages/javascript).

## Why Should You Use TypeScript?

**When writing JavaScript we don't get a lot of information before we run our code.**

There's no way for us to know if the JavaScript code has errors until we see the result on the page and go back to our code editor to fix the mistake and rerun the code.

```js:example.js showLineNumbers
const pikachu = {
  name: 'Pikachu',
  weight: 60
}

pikachu.weigth // oops! 💩
```

<Image src="no-checking.webp" alt="No checking" />

To prove my point I'm sure you barely noticed the mistake and had to look at what it was. 😄

The editor didn't warn us about mispelling `weight`.

Imagine the same scenario with an API where you pass wrong arguments to a method — **you just hope it works**.

```js:example.ts showLineNumbers
const pikachu = {
  name: 'Pikachu',
  weight: 60
}

pikachu.weigth // 🤔 Did you mean 'weight'?
```

<Image src="checking.webp" alt="Checking" />

**Code completion** already makes it hard to make such a mistake writing regular JavaScript because of the benefits we get from TypeScript under the hood, but when we do there's nothing to warn us.

> The most common kinds of errors that programmers write can be described as type errors: a certain kind of value was used where a different kind of value was expected. This could be due to simple typos, a failure to understand the API surface of a library, incorrect assumptions about runtime behavior, or other errors. — [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

TypeScript only gives us information before we run the code. That's also known as **static type checking**.

**Static type checking** means your code is evaluated before it runs to ensure it works as expected.

That's also a **limitation** of TypeScript to keep in mind.

## Runtime and Compile Time

> TypeScript is JavaScript’s runtime with a compile time type checker. — [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

- **Runtime** is when JavaScript code gets executed
- **Compile time** is when TypeScript code gets compiled to JavaScript code

**TypeScript only checks your code at compile time.**

This means **you can't rely on TypeScript for checks in your code** such as user input when you ship your code.

```ts:example.ts showLineNumbers
const pokemon = []

function addPokemon(pokemonName: string) {
  pokemon.push(pokemonName)
}

// ['Pikachu'] ✅
addPokemon('Pikachu')

// Type 'number' not assignable to type 'string'. 🚫
addPokemon(1)
```

Despite the TypeScript error, we can run the TypeScript code because **type errors aren't syntax errors**.

```js:example.js showLineNumbers
const pokemon = []

function addPokemon(pokemonName) {
  pokemon.push(pokemonName)
}

// ['Pikachu'] ✅
addPokemon('Pikachu')

// oops! 💩
addPokemon(1)
```

This is the **compiled** ([transpiled](https://en.wikipedia.org/wiki/Source-to-source_compiler) 😄) JavaScript code. TypeScript didn't betray us. We neglected to put **checks and error validation** in the code.

```ts:example.ts showLineNumbers
const pokemon = []

function addPokemon(pokemonName: string) {
  if (!pokemonName || typeof pokemonName !== 'string') {
    throw new Error('💩 You have to specify a Pokemon name.')
  }

  pokemon.push(pokemonName)
}

// Type 'number' not assignable to type 'string'. 🚫
addPokemon(1)
```

**TypeScript doesn't change how JavaScript works.**

## Gradual Adoption

So far we've seen **we can reap the benefits of TypeScript without using TypeScript directly**.

If you're on the fence about TypeScript but prefer [JSDoc](https://jsdoc.app/) you can take advantage of TypeScript being **built-in**. You can use **JSDoc** for types and have **self-documenting** code.

<Image src="jsdoc.webp" alt="JSDoc" />

You can read more about [JSDoc support](https://code.visualstudio.com/Docs/languages/javascript#_jsdoc-support) for **VS Code** and look at the examples.

That being said we can adjust how strict **type checking** is when starting to use TypeScript so we don't get overwhelmed making adding types a **gradual adoption**.

If you decide on using TypeScript you don't have to rename everything at once but instead do it on a per-file basis.

## TypeScript Introduction Summary

Let's get a clear picture of TypeScript 📸:

- TypeScript is a **static type checker** (TypeScript checks your code before you run it)
- TypeScript is a **superset of JavaScript** (this means that any JavaScript program is also a valid TypeScript program)
- TypeScript **preserves the runtime behavior of JavaScript** (TypeScript doesn't change how JavaScript works)
- TypesScript **compiles to JavaScript**
- **Types are gone once it compiles to JavaScript** (the browser and **Node** don't understand TypeScript)
- Using TypeScript is a **gradual adoption**

## JavaScript Types

_"You don't need TypeScript, we have TypeScript at home"._

True _scholars_ 🧐 among you with _keen intellect_ might observe that JavaScript already has **primitive types**.

A **primitive type** is data that is not an object and has no methods.

JavaScript has **7 primitive types**:

- **string** (sequence of characters)
- **number** (floating point is the only number type)
- **bigint** (for huge numbers)
- **boolean** (logical data type with two values)
- **undefined** (assigned to variables that have just been declared)
- **symbol** (unique values)
- **null** (points to a nonexistent object or address)

Alongside those **primitive types** there are **primitive wrapper objects**:

- **String** (for the string primitive)
- **Number** (for the number primitive)
- **BigInt** (for the bigint primitive)
- **Boolean** (for the boolean primitive)
- **Symbol** (for the symbol primitive)

Let's clear up the difference between **primitive types** and **primitive wrapper objects** so you don't get confused if you should use the lowercase `string` or capitalized `String` as a type.

```js:example.js showLineNumbers
// 'Pikachu'
const stringPrimitive = 'Pikachu'

// String { 'Pikachu' }
const stringObject = new String('Pikachu')
```

<Image src="primitives.webp" alt="Primitives" />

JavaScript converts **primitive types** to **primitive wrapper objects** behind the scenes so we can use their methods.

This is because methods like `toUpperCase` extend the `String` object.

The reason we don't use **primitive wrapper objects** is because it's more work to get the value out of the object and we could get unexpected results if we pass an object to something expecting a **primitive** value.

That being said don't confuse the `new String` **constructor** with the `String` **function** that does **type conversion**.

```js:example.js showLineNumbers
const number = '42'

const string = String(number) // '42'
```

As we've learned TypeScript doesn't save us at **runtime**, so we have to put **checks** in place.

```ts:example.ts showLineNumbers
function isString(value: string): boolean {
  return typeof value === 'string' ? true : false
}

isString('Pikachu') // true ✅
isString(1) // false 🚫
```

So why are we writing **more** code? Let's look at an example of a `addPokemon` function.

```js:example.js showLineNumbers
const pokemon = []

function addPokemon(name, timeAdded) {
  pokemon.push({ name, timeAdded })
}

addPokemon('Pikachu', new Date())
```

Writing JavaScript we have to consider a lot of things:

- Is the function **callable**?
- Does the function **return** anything?
- What are the **arguments** of the function?
- What date **format** does the argument accept?

Even if we look at the implementation of `addPokemon` we don't know what date format we should pass to `timeAdded`, so we turn to documentation.

TypeScript **prevents** us from making those mistakes in the first place by knowing we are accessing the **right properties** and passing the **right arguments** alongside **code completion**.

```ts:example.ts showLineNumbers
const pokemon = []

function addPokemon(name: string, timeAdded: Date) {
  pokemon.push({ name, timeAdded })
}
```

In the example the argument `name` is of type `string` and argument `timeAdded` is of type `Date` which is just a built-in type.

<Image src="code-completion.webp" alt="Code completion" />

This is extremely useful when dealing with some API because the documentation lives inside your editor.

```ts:example.ts showLineNumbers
// Type 'string' is not assignable to
// parameter of type 'Date'. 🚫
addPokemon('Pikachu', Date())
```

<Image src="date-string.webp" alt="Date string" />

The `Date` function returns a `string` but we have to pass the `new Date` constructor that returns an object. The type **doesn't match** so TypeScript complains that you **can't assign** `string` to `Date`.

```ts:example.ts showLineNumbers
// [{ name: 'Pikachu', added: Date... }] ✅
addPokemon('Pikachu', new Date())
```

<Image src="date-constructor.webp" alt="Date constructor" />

Let's start learning about TypeScript and using it in practice.

## TypeScript Playground

To get started open the [TypeScript Playground](https://www.typescriptlang.org/play).

The playground is a great way of seeing the compiled JavaScript code and generated TypeScript types without having to set up anything while using the same [Monaco editor](https://microsoft.github.io/monaco-editor/) that powers VS Code, so you should feel at home.

<Image src="typescript-playground.webp" alt="TypeScript Playground" />

The **right side** of the editor has some useful tabs:

- **.JS** shows the compiled JavaScript output (the default target is **ES2017** or **EcmaScript** which is the name of the JavaScript specification adjustable from the **TS Config** tab)
- **.D.TS** has the **generated** TypeScript types
- **Errors** is like the **error logs** in your console
- **Logs** show the **output** of your code

You can press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to run the code in the playground. Another tip I have is to include `console.clear()` at the top so your logs stay readable.

If you can't see the right sidebar press the **arrow icon** at the top right.

## Type Inference

TypeScript can **infer** types to provide **type information**.

```ts:playground.ts showLineNumbers
let pokemon = 'Pikachu'

pokemon = 'Charizard'

// 'CHARIZARD' ✅
pokemon.toUpperCase()

// Type 'number' is not assignable to type 'string'. 🚫
pokemon = 1

// This expression is not callable. 🚫
pokemon()
```

How great is this **instant feedback** in your editor?

TypeScript can also **infer** the **return type** of a function. If it doesn't return anything it's `void`.

```ts:playground.ts showLineNumbers
function returnPokemon() {
  // return string
  return 'Pikachu'
}

function logPokemon() {
  // we don't return anything
  console.log('Pikachu')
}
```

It's encouraged by the TypeScript documentation to let TypeScript **infer** the type when possible and later I'm going to show an example of that but you can always be **explicit** if you want.

```ts:playground.ts showLineNumbers
function returnPokemon(): string {
  // return string
  return 'Pikachu'
}

function logPokemon(): void {
  // we don't return anything
  console.log('Pikachu')
}
```

In the next example we're looking at the **return type** of a fetch API request.

```ts:playground.ts showLineNumbers
const API = 'https://pokeapi.co/api/v2/pokemon/'

async function getPokemon(name: string) {
  const response = await fetch(`${API}${name}`)
  const pokemon = await response.json()
  return pokemon
}

// shows Pikachu data from the Pokemon API
getPokemon('pikachu').then(console.log)
```

If you hover over `getPokemon` you can see TypeScript **infered** the **return type** as `Promise<any>`.

`any` is an **escape hatch** when we don't know what the type is.

```ts:playground.ts showLineNumbers
const API = 'https://pokeapi.co/api/v2/pokemon/'

async function getPokemon(
  name: string
): Promise<{ id: number, name: string }> {
  const response = await fetch(`${API}${name}`)
  const pokemon = await response.json()
  return pokemon
}

// shows Pikachu data from the Pokemon API
getPokemon('pikachu').then(console.log)
```

Here we're more **explicit** about the **return type** with using the object type `{ id: number, name: string }`.

I haven't mentioned that we can do that because `Promise<Type>` is a **generic** but more on that later.

```ts:playground.ts showLineNumbers
const API = 'https://pokeapi.co/api/v2/pokemon/'

async function getPokemon(
  name: string
): Promise<{ id: number, name: string }> {
  const response = await fetch(`${API}${name}`)
  const pokemon = await response.json()
  return pokemon
}

async function logPokemon(name: string) {
  const pokemon = await getPokemon(name)
  console.log({ id: pokemon.id, name: pokemon.name })
}

// { 'id': 25, 'name': 'pikachu' }
logPokemon('pikachu')
```

Thanks to this slight change we get **code completion** for the `pokemon` object since TypeScript knows the type. It's magic. 🪄

We're going to go in-depth later and explore how to make this more organized by using other TypeScript features such as **type alias** and **interface**.

## Type Annotations

**Type annotations** are an **explicit** way of specifying a type.

```ts:example.ts
const pokemon: string = 'Pikachu'
```

## Primitive Types

TypeScript has the same basic **primitive types**.

```ts:example.ts showLineNumbers
const pokemon: string = 'Pikachu'
const hp: number = 35
const caught: boolean = true
```

## TypeScript Types

TypeScript extends the list of types:

- **any**
- **unknown**
- **void**
- **never**

## any

Type `any` is a special type:

- You can use type `any` as an **escape hatch** when you don't want something to cause type checking errors
- Type `any` represents **all** possible values
- You get **no type checking**, so avoid using it

```ts:playground.ts showLineNumbers
const apiResponse: any = {
  data: []
}

// we don't get any warning 😱
apiResponse.doesntExist
```

Using type `any` is useful in situations where:

- You're working with a library that **lacks** types
- You have a **complex API** response you don't want to type
- The API of the code you're writing **could change**

If you want to focus on writing code I suggest instead of using `any` everywhere to include `// @ts-nocheck` at the top of your file. After you're done writing code turn **type checking** back on. Don't let your editor bully you.

Be conservative when using `any` because it defeats the purpose of using TypeScript.

## unknown

Type `unknown` is the **type-safe** version of `any`:

- You can assign **any** value to type `unknown` but **you can't do whatever you want**
- You must use **checks** to **type narrow** a value before you can use a it
- You **can't access any object properties** unless you **type narrow** first and then use **type assertion**
- Type `unknown` can only be assigned to type `unknown` and type `any`

```ts:example.ts showLineNumbers
const apiResponse: unknown = {
  data: []
}

// assignable to `any` ✅
const anyType: any = apiResponse

// assignable to `unknown` ✅
const unknownType: unknown = apiResponse

// 'unknown' not assignable to type '{ data: []; }'. 🚫
const otherType: { data: [] } = apiResponse

// we have to use checks to narrow down the type
if (apiResponse && typeof apiResponse === 'object') {
  // Property 'data' does not exist on type 'object'. 🚫
  apiResponse.data
}
```

We **narrowed** down what the type of `apiResponse` is, yet we **can't** access the `apiResponse.data` property since it's `unknown`.

To solve the problem we have to use **type assertion** that lets TypeScript know about the type.

```ts:playground.ts showLineNumbers
if (apiResponse && typeof apiResponse === 'object') {
  const response = apiResponse as { data: [] }
  response.data // no warning ✅
}
```

We're going to learn about **type assertion** later.

`unknown` is **safer** to use than `any` when we **don't know** the function argument, so instead of being able to do **anything** inside `prettyPrint` we have to **narrow** the type of the `input` argument first to be able to use it.

```ts:playground.ts showLineNumbers
function prettyPrint(input: unknown): string {
  if (Array.isArray(input)) {
    // we can run each value through prettyPrint again
    return input.map(prettyPrint).join(', ')
  }

  if (typeof input === 'string') {
    return input
  }

  if (typeof input === 'number') {
    return String(input)
  }

  return '...'
}

const values = ['Bulbasaur', 'Charmander', 'Squirtle', 1, {}]
const prettyValues = prettyPrint(values)

// 'Bulbasaur, Charmander, Squirtle, 1, ...'
console.log(prettyValues)
```

We can use `unknown` to describe a function that returns an unknown value. Because `obj` is `unknown` we have to `narrow` the type first before we do something reckless making it safe.

```ts:playground.ts showLineNumbers
const json = '{ "id": 1, "name": "Pikachu" }'

function safeParse(value: string): unknown {
  return JSON.parse(value)
}

const obj = safeParse(json) // safe ✅
```

If we didn't use `unknown` the **infered** return type for `safeParse` would be `any` meaning you could do whatever you want with `obj`.

You should avoid using `any` or `unknown` if possible.

## void

Type `void` is the **absence of having any type**.

There's no point assigning `void` to a variable since only type `undefined` is assignable to type `void`.

```ts:example.ts showLineNumbers
let pokemon: void

// only `undefined` is assignable to `void` ✅
pokemon = undefined

// Type 'string' is not assignable to type 'void'. 🚫
pokemon = 'Pikachu'
```

You mostly see type `void` used on functions that **don't** return anything.

```ts:example.ts showLineNumbers
function logPokemon(pokemon: string): void {
  console.log(pokemon)
}

logPokemon('Pikachu') // 'Pikachu'
```

Let's learn how type `void` is useful when used in a `forEach` implementation.

```ts:playground.ts showLineNumbers
function forEach(
  arr: any[],
  callback: (arg: any, index?: number) => void
): void {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i)
  }
}

forEach(
  ['Bulbasaur', 'Charmander', 'Squirtle'],
  (pokemon) => console.log(pokemon)
)
```

Because we use type `void` as the **return type** for `forEach` we're saying **the return value isn't going to be used**, so it can be called with a callback that returns **any** value.

Using the return type `void` **explicity** can save us from returning a value on accident during refactor.

```ts:playground.ts showLineNumbers
function logPokemon(pokemonList: string[]): void {
  pokemonList.forEach(pokemon => {
    // ...
    return pokemon
  })
}

function logPokemonRefactor(pokemonList: string[]): void {
  for (const pokemon of pokemonList) {
    // ...
    // Type 'string' is not assignable to type 'void'. 🚫
    return pokemon
  }
}
```

## never

Type `never` represents values that **never occur**:

- Type `never` **can't** have a value
- You use type `never` when there's **no reachable end point** like a while loop or error exception
- Variables get the type `never` when **narrowed by type guards** to **remove possibilities** (a great example is preventing impossible states when a prop is passed to a component where you can say if one type of prop gets passed another can't)

```ts:playground.ts showLineNumbers
function infiniteLoop(): never {
  while (true) {
    // ...
  }
}

function error(message: string): never {
  throw new Error(message)
}

function timeout(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('⌛ Timed out.')), ms)
  })
}
```

Type `unknown` can be used together with **type narrowing** to ensure we have a **check** for each Pokemon type.

```ts:playground.ts showLineNumbers
function getPokemonByType(
  pokemonType: 'fire' | 'water' | 'electric'
) {
  // type is 'fire' | 'water' | 'electric'
  if (pokemonType === 'fire') {
    return '🔥 Fire Pokemon'
  }

  // we narrow it down to 'water' | 'electric'
  if (pokemonType === 'water') {
    return '🌀 Water Pokemon'
  }

  // only 'electric' is left
  pokemonType

  // remainingPokemonTypes can't have any value
  // because pokemonType is 'electric' 🚫
  const remainingPokemonTypes: never = pokemonType

  return remainingPokemonTypes
}

getPokemonByType('electric')
```

Because of this **check** we know that `getPokemonByType` is missing a **check** for the `electric` type.

We haven't yet learned about some of the types in the examples. We're not glossing over them. We're going to cover each later.

## Array Types

There's **two equivalent** ways to specify an **array type** in TypeScript.

To specify an **array type** you can use the **generics** `Array<Type>` syntax or the `Type[]` syntax.

```ts:playground.ts showLineNumbers
const pokemon1: Array<string> = ['Bulbasaur', 'Charmander', 'Squirtle']

const pokemon2: string[] = ['Bulbasaur', 'Charmander', 'Squirtle']
```

I prefer the `Type[]` syntax because it's less to type.

## Function Types

You can specify the **input** and **output** type of functions.

```ts:playground.ts showLineNumbers
const pokemon: string[] = []

function addPokemon(name: string): string[] {
  pokemon.push(name)
  return pokemon
}

addPokemon('Pikachu')
```

We **explicitly** typed `pokemon` as `string[]`. If TypeScript can't **infer** the type it would use `any` by default, or in this case the **return type** of `addPokemon` would be `any[]`.

**Anonymous functions** besides using **contextual typing** aren't any different and using **type annotations** is the same.

```ts:playground.ts showLineNumbers
const pokemon: string[] = []

const addPokemon = (name: string): string[] => {
    pokemon.push(name)
    return pokemon
}

addPokemon('Pikachu')
```

TypeScript uses **contextual typing** to figure out the type of the argument based on how it's used inside an **anonymous function**.

```ts:playground.ts showLineNumbers
const pokemonList = ['Bulbasaur', 'Charmander', 'Squirtle']

// 'Bulbasaur', 'Charmander', 'Squirtle'
pokemonList.forEach(pokemon => console.log(pokemon))
```

TypeScript infered `pokemonList` is of type `string[]`. Because of this inside `forEach` it knows the individual `pokemon` type should be of type `string`.

```ts:playground.ts showLineNumbers
// being explicit ✅
const pokemonList: string[] = ['Bulbasaur', 'Charmander', 'Squirtle']

// this is redundant 🚫
pokemonList.forEach((pokemon: string) => console.log(pokemon))
```

Knowing about **contextual typing** you understand what things you **don't** have to type.

Your goal isn't to please TypeScript but use it to give you confidence your code works as expected.

Function **arguments** can be made **optional** by using the `?` operator.

```ts:playground.ts showLineNumbers
function logPokemon(name: string, hp?: number) {
  console.log({ name, hp })
}

// { name: 'Pikachu', hp: undefined } ✅
logPokemon('Pikachu')

// { name: 'Pikachu', hp: 35 } ✅
logPokemon('Pikachu', 35)
```

## Function Overloads

**Function overloading** is the ability to create **multiple functions of the same name with different implementations**. Which implementation gets used depends on the **arguments** you pass in.

In JavaScript there is no **function overloading** because we can pass **any** number of parameters of **any** type we then perform **checks** on inside the function.

```js:example.js showLineNumbers
function logPokemon(arg1, arg2) {
  if (typeof arg1 === 'string' && typeof arg2 === 'number') {
    console.log(`${arg1} has ${arg2} HP.`)
  }

  if (typeof arg1 === 'object') {
    const { name, hp } = arg1
    console.log(`${name} has ${hp} HP.`)
  }
}

// 'Pikachu has 35 HP.' ✅
logPokemon('Pikachu', 35)

// 'Pikachu has 35 HP.' ✅
logPokemon({ name: 'Pikachu', hp: 35 })
```

TypeScript has **overload signatures** that let you call a function in different ways.

```ts:playground.ts showLineNumbers
interface Pokemon {
  name: string
  hp: number
}

function logPokemon(name: string, hp: number): void
function logPokemon(pokemonObject: Pokemon): void

function logPokemon(arg1: unknown, arg2?: unknown): void {
  // matches the first overload signature
  if (typeof arg1 === 'string' && typeof arg2 === 'number') {
    // arg1 is `name` and arg2 is `hp`
    console.log(`${arg1} has ${arg2} HP.`)
  }

  // matches the second overload signature
  if (typeof arg1 === 'object') {
    // since it's an object we can assert the type to be Pokemon
    const { name, hp } = arg1 as Pokemon
    // log the destructured values
    console.log(`${name} has ${hp} HP.`)
  }
}

// 'Pikachu has 35 HP.' ✅
logPokemon('Pikachu', 35)

// 'Pikachu has 35 HP.' ✅
logPokemon({ name: 'Pikachu', hp: 35 })
```

Let's break it down into steps:

- We wrote two **overload signatures** for `logPokemon`
- The first **overload signature** accepts `name` and `hp` arguments
- The second **overload signature** accepts a `pokemonObject` argument
- After that we wrote a **function implementation** with a **compatible signature** where the second `arg2` argument is optional since the minimal amount of arguments is one
- If `arg1` is `string` and `arg2` is `number` we know it matches the first signature
- If `arg1` is an `object` we know it matches the second signature, so we can use **type assertion** and destructure the `name` and `hp` values from it

<Image src="first-overload-signature.webp" alt="Overload signature" />

<Image src="second-overload-signature.webp" alt="Overload signature" />

## Object Types

The **object type** is like a regular object in JavaScript.

If you hover over `pokemonInferedType` TypeScript already knows it's shape.

```ts:playground.ts showLineNumbers
// infered type
const pokemonInferedType = {
  name: 'Pikachu'
}

// explicit type
const pokemonExplicitType: { name: string } = {
  name: 'Pikachu'
}
```

In the next examples we can see how TypeScript treats **missing**, **optional**, and **extra** object properties.

```ts:playground.ts showLineNumbers
// Property 'id' is missing in type '{ name: string; }' but
// required in type '{ id: number; name: string; }'. 🚫
const pokemonMissingProperty: { id: number, name: string } = {
  name: 'Pikachu'
}

// `id` is optional ✅
const pokemonOptionalArgument: { id?: number, name: string } = {
  name: 'Pikachu'
}

// Object literal may only specify known properties. 🚫
const pokemonExtraProperty: { id?: number, name: string } = {
  id: 1,
  name: 'Pikachu',
  pokemonType: 'electric'
}
```

We're going to learn ways to **abstract** types to make them more **readable** and **reusable** next.

## Type Aliases

So far we've been using types directly using **type annotations**. This is hard to read and not reusable.

A **type alias** is as the name suggests — just an **alias** for a type.

Just how we assign names to different _types_ 🤭 of people.

You should already be familiar with the **object type** syntax.

```ts:playground.ts showLineNumbers
type Pokemon = { id: number, name: string, pokemonType: string }

const pokemon: Pokemon[] = [{
  id: 1,
  name: 'Pikachu',
  pokemonType: 'electric'
}]

// { 'id': 1, 'name': 'Pikachu', 'pokemonType': 'electric' }
pokemon.forEach(pokemon => console.log(pokemon))
```

Instead of writing `Pokemon[]` where `[]` indicates to TypeScript it's an array of Pokemon we can say `{ id: number, name: string, type: string }[]` which is equivalent.

```ts:playground.ts showLineNumbers
type Pokemon = { id: number, name: string, pokemonType: string }[]

const pokemon: Pokemon = [{
  id: 1,
  name: 'Pikachu',
  pokemonType: 'electric'
}]

// { 'id': 1, 'name': 'Pikachu', 'pokemonType': 'electric' }
pokemon.forEach(pokemon => console.log(pokemon))
```

I prefer the `Pokemon[]` syntax because of reusability. We can use the `Pokemon` type on **single** Pokemon where it makes sense and `Pokemon[]` on a **collection** of Pokemon.

This saves us from creating another type and using weird grammar like `Pokemons` to indicate there's many despite Pokemon already being plural.

The next example shows how we can reuse the `Pokemon` type by using it as the **argument** and **return type** of the `logPokemon` function.

```ts:playground.ts showLineNumbers
type Pokemon = string[] | string

function logPokemon(pokemon: Pokemon): Pokemon {
  if (Array.isArray(pokemon)) {
    return pokemon.map(pokemon => pokemon.toUpperCase())
  }

  if (typeof pokemon === 'string') {
    return pokemon.toUpperCase()
  }

  return 'Please enter a Pokemon.'
}

// ['BULBASAUR', 'CHARMANDER', 'SQUIRTLE']
console.log(logPokemon(['Bulbasaur', 'Charmander', 'Squirtle']))

// 'PIKACHU'
console.log(logPokemon('Pikachu'))

// 'Please enter a Pokemon.'
console.log(logPokemon())
```

**Functions are just special objects in JavaScript** which is a roundabout way of saying we can type them as any other object.

<Image src="functions-are-objects.webp" alt="Functions are objects" />

The next examples shows ways to type different **function expressions** using a **type alias**.

```ts:playground.ts showLineNumbers
type LogPokemon = (pokemon: string) => void

// named function expression
const logPokemon1: LogPokemon = function logPokemon(pokemon) {
  console.log(pokemon)
}

// anonymous function expression
const logPokemon2: LogPokemon = function(pokemon) {
  console.log(pokemon)
}

// anonymous arrow function expression
const logPokemon3: LogPokemon = (pokemon) => console.log(pokemon)
```

The next example shows how we can use a **construct signature** inside a **type alias** to type a **constructor** function.

```ts:playground.ts showLineNumbers
type Pokemon = {
  name: string
  pokemonType: string
}

type PokemonConstructor = {
  new(name: string, pokemonType: string): Pokemon
}

class PokemonFactory implements Pokemon {
  name: string
  pokemonType: string

  constructor(name: string, pokemonType: string) {
    this.name = name
    this.pokemonType = pokemonType
  }
}

function addPokemon(
  pokemonConstructor: PokemonConstructor,
  name: string,
  pokemonType: string
): Pokemon {
  return new pokemonConstructor(name, pokemonType);
}

const pokemon: Pokemon = addPokemon(
  PokemonFactory,
  'Pikachu',
  'electric'
)

// PokemonFactory: { "name": "Pikachu", "pokemonType": "electric" }
console.log(pokemon)
```

Confusing, right? This is just showing you it's possible, so don't think about it.

## Interfaces

**Interfaces** are another way to name an object type.

```ts:playground.ts showLineNumbers
interface Pokemon {
  id?: number
  name: string
  pokemonType: string
  ability: string
  attack(): void
}

const pokemon: Pokemon[] = [{
  id: 1,
  name: 'Pikachu',
  pokemonType: 'electric',
  ability: '⚡ Thunderbolt',
  attack() {
    console.log(`${this.name} used ${this.ability}.`)
  }
}]

// 'Pikachu used ⚡ Thunderbolt'
pokemon.forEach(pokemon => pokemon.attack())
```

Inside the **interface** we can say properties are **optional** using `?` and type **function signatures** like `attack(): void`.

**Interfaces** and **type aliases** are almost interchangable.

You can also use a semicolon or period after each property if you want as it's purely optional.

## Type Aliases or Interfaces?

> For the most part, you can choose based on personal preference, and TypeScript will tell you if it needs something to be the other kind of declaration. If you would like a heuristic, use interface until you need to use features from type. - [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)

The short answer is — **doesn't matter**. Pick one and if it doesn't work for you use the other one.

I use **both** when it makes sense:

- **Interface** is more appropriate for describing **shapes** of objects
- You can add new fields to an existing **interface** but not to a **type alias**

We haven't learned about **intersections** yet but briefly it just lets us **combine** types.

The next example shows how using **intersections** we can extend a **type alias** by combining the type `Pokemon` and `{ pokemonType: 'electric' }` into a new type `Electric`.

```ts:playground.ts showLineNumbers
type Pokemon = {
  id: number
  name: string
}

type Electric = Pokemon & { pokemonType: 'electric' }

// has to satisfy the same checks ✅
const pikachu: Electric = {
  id: 1,
  name: 'Pikachu',
  pokemonType: 'electric'
}
```

In the case of **interfaces** we use the **extends** keyword to extend them.

```ts:playground.ts showLineNumbers
interface Pokemon {
  id: number
  name: string
}

interface Electric extends Pokemon {
  pokemonType: 'electric'
}

// has to satisfy the same checks ✅
const pikachu: Electric = {
  id: 1,
  name: 'Pikachu',
  pokemonType: 'electric'
}
```

When using an **interface** you should always keep in mind that you can use an **existing interface** which could lead to some unexpected results.

```ts:playground.ts showLineNumbers
interface Window {
  color: string
  style: 'double-hung' | 'casement' | 'awning' | 'slider'
}

// Type '{ color: string; style: "double-hung"; }' is missing
// the following properties from type 'Window': applicationCache,
// clientInformation, closed, customElements, and 207 more. 🚫
const item: Window = {
  color: 'white',
  style: 'double-hung'
}
```

The type `Window` is already declared in `lib.dom.d.ts` types for the global `window` object. 💩

Let's briefly touch upon naming conventions. For the most part I just name the type the **capitalized** version of what I'm trying to type. For example `pokemon` would be `Pokemon`.

Sometimes that won't work like in the case of React where component names are capitalized so you can use a **suffix** such as `PokemonProps`.

For whatever reason using the **prefix** `IPokemon` for an **interface** is [controversial](https://github.com/microsoft/TypeScript-Handbook/issues/121) inside TypeScript circles but you probably shouldn't care as long as your naming convention is consistent.

## Union Types

A **union type** is a type made from at least two types and represents **any** values of those types.

```ts:playground.ts showLineNumbers
function logPokemon(pokemon: string[] | string) {
  console.log(pokemon)
}

// ['Bulbasaur', 'Charmander', 'Squirtle'] ✅
logPokemon(['Bulbasaur', 'Charmander', 'Squirtle'])

// Pikachu ✅
logPokemon('Pikachu')
```

The `pokemon` argument can only be an **array** of Pokemon of type `string[]` or a **single** Pokemon of type `string`.

**You can only do things with the union type that every member supports** meaning that you can't just use a `string` method **without checks** because you said to TypeScript the type could either be `string[]` or `string`.

```ts:playground.ts showLineNumbers
function logPokemon(pokemon: string[] | string) {
  // Property 'toUpperCase' does not exist on type 'string[]'. 🚫
  console.log(pokemon.toUpperCase())
}

logPokemon(['Bulbasaur', 'Charmander', 'Squirtle'])
logPokemon('Pikachu')
```

Instead we have to put **checks** in place to **narrow** down the type so TypeScript knows the **exact type**.

```ts:playground.ts showLineNumbers
function logPokemon(pokemon: string[] | string) {
  if (Array.isArray(pokemon)) {
    // `pokemon` can only be an array ✅
    console.log(pokemon.map(pokemon => pokemon.toUpperCase()))
  }

  if (typeof pokemon === 'string') {
    // `pokemon` can only be string ✅
    console.log(pokemon.toUpperCase())
  }
}

// ['BULBASAUR', 'CHARMANDER', 'SQUIRTLE']
logPokemon(['Bulbasaur', 'Charmander', 'Squirtle'])

// PIKACHU
logPokemon('Pikachu')
```

Unfortunately the second `if...else` statement is required because TypeScript can't **narrow** down the `pokemon` type to `string`.

In situations where the **union members** like `string[]` and `string` **overlap** and **share** the same methods such as `slice` you don't have to **narrow** the type.

```ts:playground.ts showLineNumbers
function logPokemon(pokemon: string[] | string) {
  // works for both types ✅
  console.log(pokemon.slice(0, 1))
}

// ['Bulbasaur']
logPokemon(['Bulbasaur', 'Charmander', 'Squirtle'])

// 'P'
logPokemon('Pikachu')
```

## Discriminated Unions

A **discriminated union** is the result of **narrowing** the **members** of the union that have the same **literal type**.

For example we can use a **type guard** to **narrow** the Pokemon type `'fire' | 'water'` to `'fire'` or `'water'`.

The next example shows what you might expect would work but **doesn't** because TypeScript **can't** determine if the property exists.

Let's _switch_ 🤭 it up for fun.

```ts:playground.ts showLineNumbers
interface Pokemon {
  flamethrower?: () => void
  whirlpool?: () => void
  pokemonType: 'fire' | 'water'
}

function pokemonAttack(pokemon: Pokemon) {
  switch (pokemon.pokemonType) {
    case 'fire':
      // Cannot invoke an object which is possibly 'undefined'. 🚫
      pokemon.flamethrower()
      break
    case 'water':
      // Cannot invoke an object which is possibly 'undefined'. 🚫
      pokemon.whirlpool()
      break
  }
}

// 🔥 'Flamethrower'
pokemonAttack({
  pokemonType: 'fire',
  flamethrower: () => console.log('🔥 Flamethrower')
})

// 🌀 'Whirlpool'
pokemonAttack({
  pokemonType: 'water',
  whirlpool: () => console.log('🌀 Whirlpool')
})
```

The type-checker can't determine if `flamethrower` or `whirpool` is present based on the `pokemonType` property because they could not exist as they're both **optional**.

To solve this problem we have to be more **explicit** and **separate** the arguments so TypeScript can be sure of the type.

```ts:playground.ts showLineNumbers
interface Fire {
  flamethrower: () => void
  pokemonType: 'fire'
}

interface Water {
  whirlpool: () => void
  pokemonType: 'water'
}

type Pokemon = Fire | Water

function pokemonAttack(pokemon: Pokemon) {
  switch (pokemon.pokemonType) {
    case 'fire':
      pokemon.flamethrower() // ✅
      break
    case 'water':
      pokemon.whirlpool() // ✅
      break
  }
}

// 🔥 'Flamethrower'
pokemonAttack({
  pokemonType: 'fire',
  flamethrower: () => console.log('🔥 Flamethrower')
})

// 🌀 'Whirlpool'
pokemonAttack({
  pokemonType: 'water',
  whirlpool: () => console.log('🌀 Whirlpool')
})
```

By the use of a **type guard** style check `==`, `===`, `!=`, `!==` or `switch` on the **discriminant** property `pokemonType` TypeScript can do **type narrowing** based on the **literal type**.

This also helps us **catch mistakes** if something passed through the `switch` statement that shouldn't have.

## Intersection Types

**Intersection types** let us combine types using the `&` operator.

The next example also shows how we can use **interfaces** and **type aliases** together.

```ts:playground.ts showLineNumbers
interface Pokemon {
  name: string
  hp: number
  pokemonType: [string, string?]
}

interface Ability {
  blaze(): void
}

interface Moves {
  firePunch(): void
}

type Fire = Ability & Moves

type FirePokemon = Pokemon & Fire

const charizard: FirePokemon = {
  name: 'Charizard',
  hp: 100,
  pokemonType: ['fire', 'flying'],
  blaze() {
    console.log(`${this.name} used 🔥 Blaze.`)
  },
  firePunch() {
    console.log(`${this.name} used 🔥 Fire Punch.`)
  }
}


charizard.blaze() // 'Charizard used 🔥 Blaze.'
charizard.firePunch() // 'Charizard used 🔥 Fire Punch.'
```

I threw in a sneaky **tuple** in `pokemonType` because a Pokemon can have dual-types. We're going to learn more about **tuple** later.

If we wanted to use an **interface** we could and it works just the same.

```ts:example.ts showLineNumbers
interface Fire extends Ability, Moves {}

interface FirePokemon extends Pokemon, Fire {}
```

It's easier to compose types using **type aliases**.

## Type Assertion

**Type assertion** is like **type casting** in TypeScript where it can be used to **specify** or **override** another type.

In this example TypeScript only knows that `formEl` returns some kind of `HTMLElement` or `null` from `document.getElementById` meaning we can't use some of the built-in form methods.

```ts:playground.ts
// formEl is `HTMLElement | null` because it might not exist
const formEl = document.getElementById('form')
```

These types correspond to the [browser API](https://developer.mozilla.org/en-US/docs/Web/API). [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) is the **base class** other elements inherit from. [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) is the **base interface** for HTML elements. That's how we get to the [HTMLFormElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement) that represents a `<form>` element in the DOM (Document Object Model).

```ts:playground.ts showLineNumbers
const formEl = document.getElementById('form')

// Property 'reset' does not exist on type 'HTMLElement'. 🚫
formEl?.reset()
```

If you're not familiar with the [optional chaining operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) it just says to TypeScript the value can't be `null`.

```js:example.js showLineNumbers
// short-circuit evaluation
formEl && formEl.reset()

// optional chaining equivalent
formEl?.reset()
```

It's a relatively recent addition to JavaScript but it's been a part of TypeScript for a while, so you might not be familiar with it. If the value doesn't exist it's just going to return `undefined`.

If we look at the API for **HTMLElement** the TypeScript error makes complete sense since that method doesn't exist.

We can be more **specific** about the type of element with **type assertion** using the `as` keyword.

```ts:playground.ts showLineNumbers
const formEl = document.getElementById('form') as HTMLFormElement

formEl?.reset() // works ✅
```

The 🧠 pro-tip for how to figure out what element you want is fumbling around until your **code completion** gives you an option that looks like what you want.

There's also the alternative angle bracket `<>` syntax for **type assertion**.

```ts:playground.ts showLineNumbers
const formEl = <HTMLFormElement>document.getElementById('form')

formEl?.reset() // works ✅
```

Don't confuse this syntax with TypeScript **generics**.

The angle bracket syntax is avoided because it gets mistaken for React components because of JSX.

We can observe this error in the TypeScript Playground because in the **TS Config** the **JSX for React** option is **on** by default.

```ts:playground.ts
// JSX element 'HTMLFormElement' has no corresponding closing tag. 🚫
const formEl = <HTMLFormElement>document.getElementById('form')
```

**Event listeners** are a big part of JavaScript and something we use often even in JavaScript frameworks.

In the next example we have an **input field** with an **event listener** that takes a Pokemon name.

```html:example.html
<input type="text" id="pokemon" />
```

```ts:playground.ts showLineNumbers
const pokemonInputEl = document.getElementById('pokemon') as HTMLInputElement

function handleInput(event) {
  // ...
}

pokemonInputEl.addEventListener('input', (event) => handleInput(event))
```

When you hover over `event` in `addEventListener` notice the **infered** type `Event`.

This makes sense because [Event](https://developer.mozilla.org/en-US/docs/web/api/event) is the **base interface** for events. Derived from Event there's [UIEvent](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) that has other interfaces like [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent), [TouchEvent](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent) and [KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent) among others.

This is a **teachable moment** that lets us know we can **leverage TypeScript to help us figure out built-in types** instead of having to look it up.

```ts:playground.ts showLineNumbers
const pokemonInputEl = document.getElementById('pokemon') as HTMLInputElement

function handleInput(event: Event) {
  // Object is possibly 'null'. 🚫
  // Property 'value' does not exist on type 'EventTarget'. 🚫
  event.target.value
}

pokemonInputEl.addEventListener('input', (event) => handleInput(event))
```

The problem we face has to do again with the type not being specific enough. We want the `value` from `event.target` but we can see the type is `EventTarget` so TypeScript doesn't let us access that property.

```ts:playground.ts showLineNumbers
const pokemonInputEl = document.getElementById('pokemon') as HTMLInputElement

function handleInput(event: Event) {
  const targetEl = event.target! as HTMLInputElement
  targetEl.value
}

pokemonInputEl.addEventListener('input', (event) => handleInput(event))
```

TypeScript knows the type is `HTMLInputElement`, so we can use it's methods and properties.

You **don't** have to keep this knowledge in your head. Let TypeScript and your editor **help you** figure out what type to use.

```ts:playground.ts showLineNumbers
// event is `MouseEvent` 🐭
window.addEventListener('mouseover', (event) => console.log('Mouse event'))

// event is `TouchEvent` 👆
window.addEventListener('touchmove', (event) => console.log('Touch event'))

// event is `KeyboardEvent` 🎹
window.addEventListener('keyup', (event) => console.log('Keyboard event'))
```

In the previous example we used `!` that asserts the type can't be `null` but keep in mind that when using any **type assertion** you're saying the element can't be `null`.

```ts:playground.ts showLineNumbers
// HTMLElement | null
const pokemonInputEl = document.getElementById('pokemon')

// HTMLInputElement
const pokemonInputEl = document.getElementById('pokemon') as HTMLInputElement
```

That being said **don't lie** to the TypeScript compiler and only use **type assertion** when you have to.

## Type Assertion Using `!`

Using the `!` syntax after any expression is a **type assertion** that the value isn't going to be `null` or `undefined`.

```ts:playground.ts showLineNumbers
const formEl = document.getElementById('form')! as HTMLFormElement

formEl.reset() // works ✅
```

## Type Assertion Conversion

Using `any` and **type assertion** is great when you're just writing code but avoid using them unless you have to.

TypeScript tries it's best to not let you do something stupid.

```ts:playground.ts showLineNumbers
// Conversion of type 'string' to type 'number' may be a mistake because
// neither type sufficiently overlaps with the other. If this was
// intentional, convert the expression to 'unknown' first. 🚫
const pokemon = 'Pikachu' as number
```

That doesn't mean you can't do whatever you want.

```ts:playground.ts showLineNumbers
const pokemon = 'Pikachu' as unknown as number

// looks great 💥
pokemon.toFixed()
```

TypeScript only allows **type assertions** that convert to a **more** specific or **less** specific version of a type.

## Literal Types

**Literal types** are **exact values** of strings and numbers.

> Both `var` and `let` allow for changing what is held inside the variable, and `const` does not. This is reflected in how TypeScript creates types for literals. — [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types)

TypeScript has `string`, `number`, and `boolean` literals. The `boolean` type itself is just an **alias** for the `true | false` union.

```ts:playground.ts showLineNumbers
// type is string
let pokemonGeneralType = 'Pikachu'

// type is 'Pikachu'
const pokemonLiteralType = 'Pikachu'
```

This concept is more useful if we combine **type literals** into **unions**.

```ts:playground.ts showLineNumbers
function movePokemon(
  direction: 'up' | 'right' | 'down' | 'left'
) {
  // ...
}

movePokemon('up') // acceptable value ✅
movePokemon('rigth') // oops! typo. 🚫
```

## Literal Inference

**Literal inference** is when TypeScript thinks properties on an object **might change**, so instead of infering a **literal type** it infers a **primitive type**.

Types are used to determine **reading** and **writing** behavior.

```ts:playground.ts showLineNumbers
function addPokemon(
  name: string,
  pokemonType: '🔥 fire' | '🌀 water' | '⚡ electric'
) {
  console.log({ name, pokemonType })
}

const pokemon = {
  name: 'Pikachu',
  pokemonType: '⚡ electric'
}

// Argument of type 'string' is not assignable to
// parameter of type '"🔥 fire" | "🌀 water" | "⚡ electric"'. 🚫

// `pokemonType` is 'string' instead of '⚡ electric' 🚫
addPokemon(pokemon.name, pokemon.pokemonType)
```

We can use **type assertion** on `pokemonType`.

```ts:playground.ts showLineNumbers
const pokemon = {
  name: 'Pikachu',
  pokemonType: '⚡ electric' as '⚡ electric'
}
```

The easier method is using the `as const` suffix that acts like the **type equivalent** of `const`.

```ts:playground.ts showLineNumbers
const pokemon = {
  name: 'Pikachu',
  pokemonType: '⚡ electric'
} as const
```

TypeScript adds a `readonly` type on the `pokemon` properties that signals they **won't change**, so TypeScript knows it's a **literal type** instead of a **general type** like `string` or `number`.

```ts:example.ts showLineNumbers
const pokemon: {
  readonly name: "Pikachu"
  readonly pokemonType: "electric"
}
```

This **signals** to TypeScript the values of `pokemon` won't change.

## Object Index Signatures

When we don't know the **properties** of an object ahead of time but know the **shape** of the values we can use **index signatures**.

JavaScript has two ways to **access** a property on an object:

- The dot operator: `object.property`
- Square brackets: `object['property']`

The second syntax is called **index accessors**.

This is reflected in the types system where you can add an **index signature** to unknown properties.

```ts:playground.ts showLineNumbers
interface PokemonAPIResponse {
  [index: string]: unknown
}
```

<Image src="pokemon-api.webp" alt="Pokemon API" />

This shows the [Pokemon API response](https://pokeapi.co/api/v2/pokemon/pikachu).

We're using an **index signature** syntax `[key: type]: type` to indicate that the keys of the object are going to be a `string` with an `unknown` property.

This is useful when we don't have control over an API or time to type out a complex **interface**.

In the example we might only care about **some** properties and not the rest.

```ts:playground.ts showLineNumbers
interface PokemonAPIResponse {
  // let any other property through that
  // matches the index signature
  [index: string]: unknown
  base_experience: number
  id: number
  name: string
  abilities: Array<{ ability: { name: string, url: string }}>
  moves: Array<{ move: { name: string, url: string }}>
}

const API = 'https://pokeapi.co/api/v2/pokemon/'

async function getPokemon(
  name: string
): Promise<PokemonAPIResponse> {
  const response = await fetch(`${API}${name}`)
  const pokemon = await response.json()
  return pokemon
}

async function logPokemon(name) {
  const pokemon = await getPokemon(name)

  // Object is of type 'unknown'. 🚫
  console.log(pokemon.order.toString())

  // we need checks in place for properties we don't know about
  console.log((pokemon.order as number).toString())

  // we get great code completion for properties we know about
  pokemon.abilities.forEach(
    ({ ability }) => console.log(ability.name)
  )
}

logPokemon('pikachu') // '35', 'static', 'lightning-rod'
```

Here's another example where we have Pokemon ratings but don't know all the Pokemon ahead of time.

```ts:playground.ts showLineNumbers
type Rating = 1 | 2 | 3 | 4 | 5

interface PokemonRatings {
  [pokemon: string]: Rating
  bulbasaur: Rating
  charmander: Rating
  squirtle: Rating
}
```

This is a great opportunity to explain something that might confuse you when dealing with dynamic code where you're accesing object properties such as `object[key]` where `key` is dynamic.

```ts:playground.ts showLineNumbers
interface Stats {
  id: number
  hp: number
  attack: number
  defense: number
}

interface Pokemon {
  bulbasaur: Stats
  charmander: Stats
  squirtle: Stats
}

const pokemon: Pokemon = {
  bulbasaur: { id: 1, hp: 45, attack: 49, defense: 49 },
  charmander: { id: 2, hp: 39, attack: 52, defense: 43 },
  squirtle: { id: 3, hp: 44, attack: 48, defense: 65 }
}

const bulbasaur: string = 'bulbasaur'

// No index signature with a parameter of type 'string'
// was found on type 'Pokemon'. 🚫
pokemon[bulbasaur]
```

TypeScript thinks we're trying to access the object property by using a **string index** when objects are **number indexed** by default.

In reality we want to access the `pokemon` object using the **type literal** `bulbasaur` instead of `string`.

We can see this is true if we change the **index signature** to `string` meaning we can pass **anything** that matches that **index signature**.

```ts:playground.ts showLineNumbers
interface Pokemon {
  [pokemon: string]: Stats
  bulbasaur: Stats
  charmander: Stats
  squirtle: Stats
}

// careful if this is what you want ⚠️
// general type 'string' ✅
pokemon[bulbasaur]
```

What you should do is make sure you're passing a **type literal** instead or use the `as const` assertion. I'm only **explicit** here so it's obvious but using **const** already does that.

```ts:playground.ts showLineNumbers
const bulbasaur: 'bulbasaur' = 'bulbasaur'

// string literal 'bulbasaur' ✅
pokemon[bulbasaur]
```

## Type Narrowing

**Type narrowing** is when you **narrow** types to **more specific types**, so you can **limit** what you can do with a certain value.

```ts:playground.ts showLineNumbers
function getPokemonByType(
  pokemonType: 'fire' | 'water' | 'electric'
) {
  // type is 'fire' | 'water' | 'electric'
  if (pokemonType === 'fire') {
      return '🔥 Fire type Pokemon'
  }

  // we narrow it down to 'water' | 'electric'
  if (pokemonType === 'water') {
      return '🌀 Water type Pokemon'
  }

  // we narrow it down to 'electric'
  pokemonType

  // TypeScript knows only 'electric' is possible
  return '⚡ Electric type Pokemon'
}

getPokemonByType('electric')
```

Let's appreciate for a moment how cool it is that TypeScript just knows the type we're dealing with based on **analyzing the code flow**. 🤯

The next example shows **type narrowing** using the `in` operator that checks if a property is **in** the object.

```ts:playground.ts showLineNumbers
type Fire = { flamethrower: () => void }

type Water = { whirlpool: () => void }

type Electric = { thunderbolt: () => void }

function pokemonAttack(pokemon: Fire | Water | Electric) {
  if ('flamethrower' in pokemon) {
    pokemon.flamethrower()
  }

  if ('whirlpool' in pokemon) {
    pokemon.whirlpool()
  }

  if ('thunderbolt' in pokemon) {
    pokemon.thunderbolt()
  }
}

const pokemon = {
  name: 'Pikachu',
  thunderbolt() {
    console.log(`${this.name} used ⚡ Thunderbolt.`)
  }
}

pokemonAttack(pokemon) // 'Pikachu used ⚡ Thunderbolt.'
```

If you remember from a previous example there's a distinction between the constructor `new Date()` that returns an `object` and function `Date()` that returns a `string`.

In the same way we can use `instanceof` to check if a value is an instance of another value.

```ts:playground.ts showLineNumbers
function logDate(date: Date | string) {
  if (date instanceof Date) {
    console.log(date.toUTCString())
  } else {
    console.log(date.toUpperCase())
  }
}

// 'THU JUL 01 2021 20:00:00 GMT+0200 (CENTRAL EUROPEAN SUMMER TIME)'
logDate(Date())

// 'Thu, 01 Jul 2021 20:00:00 GMT'
logDate(new Date())
```

You can [read more about narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) that covers some plain JavaScript concepts if you're not familiar with concepts such as **truthiness** and **equality checks**.

## Type Guards

A **type guard** is a check against the value returned by `typeof`.

Because TypeScript often knows more than us about some intricacies of JavaScript it can save us from some JavaScript quirks.

```ts:playground.ts showLineNumbers
function logPokemon(pokemon: string[] | null) {
  if (typeof pokemon === 'object') {
    // Object is possibly 'null'. 🚫
    pokemon.forEach(pokemon => console.log(pokemon))
  }

  return pokemon
}

logPokemon(['Bulbasaur', 'Charmander', 'Squirtle'])
```

TypeScript lets us know the `pokemon` type was narrowed down to `string[] | null` instead of just `string[]`.

In `logPokemon` we naively check if `pokemon` is an array by checking if it's an `object`.

This isn't a bad assumption since almost everything in JavaScript is an object. We don't know one thing — `null` is also an object.

In JavaScript `null` is a primitive value that returns `object`.

```js:example.js
console.log(typeof null) // 'object'
```

This mistake is part of the JavaScript language. You can read [The history of “typeof null”](https://2ality.com/2013/10/typeof-null.html) to learn why that is so.

## Type Predicates

**Type predicates** are a special return type that's like a **type guard** for functions.

Take for example a Pokemon list where not every item is a Pokemon. We can use the `isPokemon` function to check if a value is a Pokemon. In `filterPokemon` the `pokemonList` array is of type `unknown[]` so `pokemon` is `unknown`.

We expect TypeScript to **narrow** the type through the `if...else` statement to make sure the item we're passing is a Pokemon, so we can access it's properties but `pokemon` is `unknown`.

```ts:playground.ts showLineNumbers
interface Pokemon {
  name: string
  itemType: string
}

const pokemonList: Pokemon[] = [
  {
    name: 'Pikachu',
    itemType: 'pokemon',
  },
  {
    name: 'Berry',
    itemType: 'consumable'
  }
]

function isPokemon(value: any): boolean {
  return value.itemType === 'pokemon' ? true : false
}

function filterPokemon(pokemonList: unknown[]) {
  return pokemonList.filter(pokemon => {
    if (isPokemon(pokemon)) {
      // Object is of type 'unknown'. 🚫
      console.log(pokemon.name)
    }
  })
}

filterPokemon(pokemonList) // 'Pikachu'
```

How do we **narrow** the type of `pokemon` to be `Pokemon`?

We can use **type predicates** to **narrow** the `pokemon` type to `Pokemon` by using the `argumentName is Type` syntax that changes the argument type if the function returns `true`.

```ts:playground.ts showLineNumbers
function isPokemon(value: any): value is Pokemon {
  return value.itemType === 'pokemon' ? true : false
}
```

The `pokemon` type is **narrowed** to `Pokemon` and we can access it's properties.

## Generics

**Generics** are variables for types.

We use **generics** to create **reusable** pieces of code that can work over a **variety** of types rather than a single one.

The first **generic** we have encountered was the **array type**.

```ts:playground.ts
const pokemon: Array<string> = ['Bulbasaur', 'Charmander', 'Squirtle']
```

The `Array` type is using an interface `Array<T>` where `T` represents a type variable. That means we can pass our own types.

```ts:playground.ts
const pokemon: Array<{ name: string, pokemonType: string }> = [{ name: 'Pikachu', pokemonType: 'electric' }]
```

To make the code more readable we can use a **type alias** or **interface**.

```ts:playground.ts showLineNumbers
interface Pokemon {
  name: string
  pokemonType: string
}

const pokemon: Array<Pokemon> = [{ name: 'Pikachu', pokemonType: 'electric' }]
```

If you remember what we learned before, instead of the `Array<Pokemon>` syntax we can use the equivalent `Pokemon[]` syntax.

Let's look at an example where we use `logPokemon` to log Pokemon where we don't know the type ahead of time because a user could pass anything from a `string` to an `array`.

```ts:playground.ts showLineNumbers
function logPokemon(pokemon: any) {
  return pokemon
}

const log1 = logPokemon('Pikachu')
const log2 = logPokemon(['Bulbasaur', 'Charmander', 'Squirtle'])
```

Hovering over the values we can see the infered type for `logPokemon` is `(pokemon: any): any` and `log1` and `log2` types are `any`.

We might think of using a **union type** to handle the types but it's not ideal since it wouldn't **narrow** the type without **type guards**.

```ts:playground.ts showLineNumbers
function logPokemon(pokemon: string | string[]) {
  return pokemon
}

const log1 = logPokemon('Pikachu')
const log2 = logPokemon(['Bulbasaur', 'Charmander', 'Squirtle'])

// Property 'toUpperCase' does not exist on type 'string[]'. 🚫
log1.toUpperCase()

// Property 'map' does not exist on type 'string'. 🚫
log2.map(pokemon => pokemon.toUpperCase)
```

Hovering over `logPokemon` the call signature type is `(pokemon: string | string[]): string | string[]` and the type for `log1` and `log2` is `string | string[]`.

It would be easier to let the user pass in their **own type** using **generics**.

The **generics** syntax is `<Type>` where `Type` represents the **type variable.** You might see the single letter `T` used instead but I think it's confusing. It makes the code harder to read and you might assume you have to use `T` as a type name. **You can name the type variable anything you want.**

```ts:playground.ts showLineNumbers
function logPokemon<Type>(pokemon: Type): Type {
  return pokemon
}

const log1 = logPokemon('Pikachu')
const log2 = logPokemon(['Bulbasaur', 'Charmander', 'Squirtle'])

// string ✅
log1.toUpperCase()

// string of arrays ✅
log2.map(pokemon => pokemon.toUpperCase)
```

In the above example we're saying the `logPokemon` is a **generic** function that takes a type parameter `Type` and an argument `pokemon` of `Type` and returns `Type`.

Hovering over `logPokemon` for `log1` we can see the call signature matches the string we passed in `logPokemon<"Pikachu">(pokemon: "Pikachu"): "Pikachu"` and `log1` is the **type literal Pikachu**.

Hovering over `logPokemon` for `log2` we can see the **call signature** matches the array we passed in `logPokemon<string[]>(pokemon: string[]): string[]` and `log2` is the type `string[]`.

Like we've seen in the first example we can be **explicit** when using **generics** and pass the type directly.

```ts:playground.ts
const log1 = logPokemon<string>('Pikachu')
const log2 = logPokemon<string[]>(['Bulbasaur', 'Charmander', 'Squirtle'])
```

You can also nest **generics** which can get hard to read, for example `logPokemon<Array<Pokemon>>`.

In the next example we're going to look at a `map` array method implementation that takes advantage of **generics**.

Let's think about the problem:

- We can't know the type of `arr` since you're able to pass **any** type of array
- The `callback` function could have **any** argument and return type based on that array
- `formatPokemon` is of type `any` because we **don't** know the return type

```ts:playground.ts showLineNumbers
function map(
  arr: any,
  callback: (arg: any) => any
): any {
  return arr.map(callback)
}

const formatPokemon = map(
  ['Bulbasaur', 'Charmander', 'Squirtle'],
  (pokemon) => pokemon.toUpperCase()
)

// ["BULBASAUR", "CHARMANDER", "SQUIRTLE"]
console.log(formatPokemon)
```

So far we have only seen **generics** with **one** type variable but we can use **as many** type variables as we want.

Hovering over `formatPokemon` in the log we see it's of type `string[]` and `map` has the signature type of `map<string, string>(arr: string[], callback: (arg: string) => string): string[]` as you would expect.

Using proper names for **type variables** makes the code so much easier to reason about.

```ts:playground.ts showLineNumbers
function map<Input, Output>(
  arr: Input[],
  callback: (arg: Input) => Output
): Output[] {
  return arr.map(callback)
}

const formatPokemon = map(
  ['Bulbasaur', 'Charmander', 'Squirtle'],
  (pokemon) => pokemon.toUpperCase()
)

// ["BULBASAUR", "CHARMANDER", "SQUIRTLE"]
console.log(formatPokemon)
```

## Generic Interface

An **interface** can also be generic.

We're creating a **generic** interface `Dictionary` with a **index signature** that accepts any `string` as the object key and it's property has to match the shape of `Type`.

```ts:playground.ts showLineNumbers
interface Dictionary<Type> {
  [key: string]: Type
}

interface Pokemon {
  name: string
  hp: number
  pokemonType: string
}

interface Consumable {
  name: string
  amount: number
}

const pokemon: Dictionary<Pokemon> = {
  1: { name: 'Bulbasaur', hp: 45, pokemonType: 'grass' },
  2: { name: 'Charmander', hp: 39, pokemonType: 'fire' },
  3: { name: 'Squirtle', hp: 44, pokemonType: 'water' }
}

const consumables: Dictionary<Consumable> = {
  1: { name: 'Antidote', amount: 4 },
  2: { name: 'Potion', amount: 8 },
  3: { name: 'Elixir', amount: 2 }
}
```

## Generic Constraints

So far we've seen **generics** that work with **any** kind of value. We can use a **constraint** to limit what a **type parameter** can accept.

We use the `extends` keyword to say that `Type` has to have a `length` property.

```ts:playground.ts showLineNumbers
interface Length {
  length: number
}

function itemLength<Type extends Length>(item: Type) {
  return item.length
}

// `array` has .length ✅
const pokemonArrayLength = itemLength(
  ['Bulbasaur', 'Charmander', 'Squirtle']
)

// `string` has .length ✅
const singlePokemonLength = itemLength('Pikachu')

// Argument of type 'number' is not assignable to
// parameter of type 'Length'. 🚫
const numberLength = itemLength(1)

console.log(pokemonArrayLength) // 3
console.log(singlePokemonLength) // 7
console.log(numberLength) // undefined
```

The next example shows a `sortPokemon` function that uses a **generic constraint** to **constrain** the **shape** of the `pokemon` argument to the `Pokemon` interface.

```ts:playground.ts showLineNumbers
interface Pokemon {
  name: string
  hp: number
}

type Stat = 'hp'

function sortPokemon<Type extends Pokemon>(
  pokemon: Type[],
  stat: Stat
): Type[] {
  return pokemon.sort(
    (firstEl, secondEl) => secondEl[stat] - firstEl[stat]
  )
}

const pokemon: Pokemon[] = [
  {
    name: 'Charmander',
    hp: 39
  },
  {
    name: 'Charmeleon',
    hp: 58
  },
  {
    name: 'Charizard',
    hp: 78
  },
]

// sort Pokemon by highest stat
console.log(sortPokemon(pokemon, 'hp'))
```

TypeScript **generics** are **flexible**. 💪

## Generic Constraints Using Type Parameters

In situations where we want to know if properties of an object we are trying to access **exist** we can use the `keyof` operator.

Before I show you that let's first look at an example in JavaScript.

```js:example.js showLineNumbers
const pokemon = {
  hp: 35,
  name: 'Pikachu',
  pokemonType: 'electric'
}
```

In JavaScript we can use `Object.keys` to get the keys of an object.

```js:example.js
Object.keys(pokemon) // ['hp', 'name', 'pokemonType']
```

We can do the type equivalent in TypeScript to make sure the property exists using the `Key extends keyof Type` syntax.

The `keyof` operator takes an object type and gives us a **string or numeric literal union** of its keys.

```ts:playground.ts showLineNumbers
function getProperty<Type, Key extends keyof Type>(
  obj: Type,
  key: Key
) {
  return obj[key]
}

const pokemon = {
  hp: 35,
  name: 'Pikachu',
  pokemonType: 'electric'
}

// the property 'hp' exists on `pokemon` ✅
getProperty(pokemon, 'hp')

// Argument of type '"oops"' is not assignable to
// parameter of type '"hp" | "name" | "pokemonType"'. 🚫
getProperty(pokemon, 'oops')
```

## Enums

**Enums** are a set of **named constants**.

You might be familiar with **enums** from other languages. **Enums** are a **feature** of TypeScript and **don't** exist in JavaScript.

In JavaScript it's popular to create an object with some **constants** to reduce the amount of typos.

```js:example.js showLineNumbers
const direction = {
  up: 'UP',
  right: 'RIGHT',
  down: 'DOWN',
  left: 'LEFT'
}
```

```js:example.js showLineNumbers
function movePokemon(direction) {
  console.log(direction) // 'UP'
}

movePokemon(direction.up)
```

This is very useful when you have some dynamic code.

```js:example.js showLineNumbers
function movePokemon(direction) {
  console.log(direction) // whatever got passed
}

movePokemon(direction[direction])
```

**Enums** are what you could use in such a case.

```ts:playground.ts showLineNumbers
enum Direction {
  Up = 'UP',
  Right = 'RIGHT',
  Down = 'DOWN',
  Left = 'LEFT'
}

function movePokemon(direction: Direction) {
  console.log(direction) // UP
}

movePokemon(Direction.Up)
```

TypeScript **compiles** Enums to some _interesting_ 🧐 JavaScript code you can look at in the JavaScript output tab if you're curious.

This looks like a _fun_ 😅 interview question.

```js:output.js showLineNumbers
var Direction

(function (Direction) {
    Direction["Up"] = "UP"
    Direction["Right"] = "RIGHT"
    Direction["Down"] = "DOWN"
    Direction["Left"] = "LEFT"
})(Direction || (Direction = {}))
```

You can [learn more about enums](https://www.typescriptlang.org/docs/handbook/enums.html) since I just gave a brief overview.

## Tuple

A **tuple** is an array with a **fixed** number of elements.

Use a **tuple** where the order is important.

```ts:playground.ts showLineNumbers
type RGBColor = [number, number, number]

const color: RGBColor = [255, 255, 255]
```

You can specify optional values.

```ts:playground.ts showLineNumbers
type RGBAColor = [number, number, number, number?]

const color: RGBAColor = [255, 255, 255, 0.4]
```

Cartesian coordinates anyone? 🗺️

```ts:playground.ts showLineNumbers
type CartesianCoordinates = [x, y]

const coordinates: CartesianCoordinates = [3, 4]
```

## Classes

Using TypeScript **doesn't** mean you have to use classes. That being said let's explore what TypeScript adds to classes.

If you're unfamiliar with classes you can [read about Classes from the MDN Web Docs](https://www.typescriptlang.org/docs/handbook/2/classes.html).

The `readonly` member prevents assignments to the field outside of the constructor.

```ts:playground.ts showLineNumbers
class Pokemon {
  readonly name: string

  constructor(name: string) {
    this.name = name
  }
}

const pokemon = new Pokemon('Pikachu')

// Cannot assign to 'name' because it is a read-only property. 🚫
pokemon.name = 'Charizard'
```

The `public` member can be accessed anywhere and it's used by default, so you don't have to type it unless you want to be explicit.

```ts:playground.ts showLineNumbers
class Pokemon {
  public name: string

  constructor(name: string) {
    this.name = name
  }
}

const pokemon = new Pokemon('Pikachu')

pokemon.name = 'Charizard' // no problem ✅
```

The `protected` member is only visible to subclasses of the class it's declared in.

```ts:playground.ts showLineNumbers
class Pokemon {
  protected name: string

  constructor(name: string) {
    this.name = name
  }
}

class LogPokemon extends Pokemon {
  public logPokemon() {
    console.log(this.name)
  }
}

const pokemon = new LogPokemon('Pikachu')

// Property 'name' is protected and only accessible within
// class 'Pokemon' and its subclasses. 🚫
pokemon.name

// no problem ✅
pokemon.logPokemon() // 'Pikachu'
```

The `private` member is like `protected` but doesn’t allow access to the member even from subclasses.

```ts:playground.ts showLineNumbers
class Pokemon {
  private name: string

  constructor(name: string) {
    this.name = name
  }
}

class LogPokemon extends Pokemon {
  public logPokemon() {
    // Property 'name' is private and only
    // accessible within class 'Pokemon'. 🚫
    console.log(this.name)
  }
}

const pokemon = new LogPokemon('Pikachu')

// Property 'name' is protected and only accessible within
// class 'Pokemon' and its subclasses. 🚫
pokemon.name

// no problem ✅
pokemon.logPokemon() // 'Pikachu'
```

TypeScript gives us a shorter syntax for declaring a class property from the constructor using **parameter properties** by prefixing it with `public`, `private`, `protected`, or `readonly`.

```ts:playground.ts showLineNumbers
class Pokemon {
  name: string

  constructor(name: string) {
    this.name = name
  }
}

class Pokemon {
  constructor(public name: string) {
    // no body necessary
  }
}
```

You can _*implement* 🤭_ an **interface** using the `implements` keyword.

```ts:playground.ts showLineNumbers
interface LogPokemon {
  logPokemon(): void
}

class Pokemon implements LogPokemon {
  constructor(public name: string) {}

  public logPokemon() {
    console.log(this.name)
  }
}

class Pokedex implements LogPokemon {
  // Property 'logPokemon' is missing in type 'Pokedex' but
  // required in type 'LogPokemon'. 🚫
}
```

The syntax for a **generic** class is similar to a **generic** interface syntax.

```ts:playground.ts showLineNumbers
class Pokemon<Type> {
  constructor(public pokemon: Type) {}
}

// Pokemon<string> ✅
const pokemonString = new Pokemon('Pikachu')

// Pokemon<string[]> ✅
const pokemonArray = new Pokemon(['Bulbasaur', 'Charmander', 'Squirtle'])
```

TypeScript introduces the concept of an **abstract class** that's a **contract** used by other classes to **extend** from. The **abstract class** doesn't contain **implementation** and can't be **instantiated**.

```ts:playground.ts showLineNumbers
abstract class Pokemon {
  constructor(public name: string) {}

  abstract useItem(item: string): void
}

class FirePokemon extends Pokemon {
  useItem(item: string) {
    console.log(`${this.name} used 🧪 ${item}`)
  }
}

const charizard = new FirePokemon('Charizard')

charizard.useItem('Potion') // 'Charizard used 🧪 Potion.'
```

We glanced over classes in TypeScript because it's a large topic deserving it's own post.

If classes are something you want to learn more about using in TypeScript [read the Classes section in the TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/classes.html).

In the next section we're going to briefly introduce another concept that TypeScript introduced to classes — **decorators**.

## Decorators

**Decorators** are like **higher-order functions** (function that takes another function as an argument or returns a function) that can **hook** into a class and it's methods and properties, so we end up with composable and reusable pieces of code logic.

JavaScript has a [proposal for decorators](https://github.com/tc39/proposal-decorators), so they might get added to the language in the future.

I want to preface this by saying that **decorators** are primarily used by library authors and frameworks such as [Angular](https://angular.io/) and [NestJS](https://nestjs.com/).

Don't sweat it when you would use **decorators** because they're mainly given to you to use them to improve your developer experience without having to think about how it works.

If you're using **decorators** you have to enable **experimental** support for decorators inside `tsconfig.json`.

```json:tsconfig.json showLineNumbers
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

In the next example we're going to see how we can use a **method decorator** for validation to check if a Pokemon has enough experience to evolve by using **@requiredExperience** above the `evolve` method.

The **decorator** implementation is inside `requiredExperience` that's also known as a **decorator factory** because it returns a function that will be called by the **decorator** at runtime.

```ts:playground.ts showLineNumbers
function requiredExperience() {
  return function(
    target: any,
    propertyKey: string,
    descriptor: any
  ) {
    // the original method
    const originalMethod = descriptor.value

    // overwrite the method
    descriptor.value = function(...args: any[]) {
      // if check passes...
      if (this.experience > this.experienceThreshold) {
        // use original method
        originalMethod.apply(this, args)
      } else {
        // otherwise do something else
        console.log(`${this.name} doesn't have enough experience to evolve into ${this.evolution}. 🚫`)
      }
    }

    return descriptor
  }
}

class Pokemon {
  constructor(
    private name: string,
    private experience: number,
    private evolution: string,
    private experienceThreshold: number
  ) {}

  @requiredExperience()
  evolve() {
    console.log(`${this.name} evolved to ${this.evolution}. ✨`)
  }
}

const pikachu = new Pokemon('Pikachu', 80, 'Raichu', 120)

// "Pikachu doesn't have enough experience to
// evolve into Raichu." 🚫
pikachu.evolve()
```

We barely touched upon **decorators** because it would get lengthy and it's enough you just know about them.

Hooking into code like this is called [metaprogramming](https://en.wikipedia.org/wiki/Metaprogramming) and is often more useful in frameworks where you might need to add metadata to measure or analyze code.

There's a great video by [Fireship](https://fireship.io/) on [The Magic of TypeScript Decorators](https://www.youtube.com/watch?v=O6A-u_FoEX8) you should watch. 🍿

<YouTube id="O6A-u_FoEX8" title="The Magic of TypeScript Decorators" />

If you want to dive deep into **decorators** you can read [Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) from the TypeScript Handbook.

## Set Up TypeScript

You're probably learning TypeScript to use with a JavaScript framework and that's great because most popular JavaScript frameworks require **zero configuration** for enabling TypeScript support. You should consult the docs for your framework how to set up TypeScript.

If you want to use vanilla TypeScript on a passion project I highly recommend using [Vite](https://vitejs.dev/). To set up your project just run `npm init vite` and pick a template.

Let's look at how to set up TypeScript from scratch and show you around the TypeScript compiler settings.

Start by initializing a project inside an empty folder.

```shell:terminal
npm init -y
```

Install TypeScript as a development dependency.

```shell:terminal
npm i -D typescript
```

Next create a `app.ts` file at the root of the project and add some TypeScript code.

```ts:app.ts
const pokemon: string = 'Pikachu'
```

<Image src="typescript-setup.webp" alt="TypeScript setup" />

Since your web browser and **Node** don't understand TypeScript we have to **transpile** the TypeScript code to JavaScript.

```shell:terminal
npx tsc app.ts
```

<Image src="typescript-compiler.webp" alt="TypeScript compiler" />

[npm](https://www.npmjs.com/) includes a `npx` tool that runs executables without having to install a package globally. It just downloads the binary to your `.bin` folder in `node_modules` and removes it when you're done.

The `tsc` command invokes the TypeScript compiler that creates a `app.js` file. This is what your browser and **Node** would run.

It would be a drag having to run this each time when you make a change, so you can pass a **watch flag** to the TypeScript compiler.

```shell:terminal
npx tsc app.ts -w
```

It's easier to add a command to scripts in your `package.json`.

```json:package.json showLineNumbers
{
  "name": "typescript",
  "scripts": {
    "dev": "npx tsc app.ts -w"
  },
  "devDependencies": {
    "typescript": "^4.3.5"
  }
}
```

This lets us just run `npm run dev`.

```shell:terminal
npm run dev
```

<Image src="typescript-watch.webp" alt="TypeScript watch" />

If you're not using **Vite** and want **live reload** for your site you can use [live-server](https://www.npmjs.com/package/live-server) together with TypeScript at the same time.

```json:package.json showLineNumbers
{
  "name": "example",
  "scripts": {
    "dev": "live-server && npx tsc pokemon.ts -w"
  },
  "devDependencies": {
    "typescript": "^4.3.5"
  }
}
```

You only have to include the JavaScript file in your HTML file. Using the `defer` attribute loads the JavaScript code after the DOM (Document Object Model) has loaded.

```html:example.html showLineNumbers
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>TypeScript</title>
    <script src="app.js" defer></script>
  </head>
  <body>
    <h1>TypeScript</h1>
  </body>
</html>
```

If you're a **Node** chad 💪 you can use [ts-node](https://www.npmjs.com/package/ts-node) that lets you run TypeScript files without having to **transpile** them first by using `ts-node app.ts`.

You also get a live code environment (**REPL**) if you run `ts-node` like you would typing `node` in your terminal.

<Image src="ts-node.webp" alt="ts-node" />

If you're using `ts-node` you can use [nodemon](https://www.npmjs.com/package/nodemon) to watch the files by creating a `nodemon app.ts` script in `package.json`.

Tooling is a subject that deserves it's own post. I just want to expose you to what is out there.

Let's look at the TypeScript **compiler options**.

TypeScript looks for a `tsconfig.json` file that we can create by hand or generate by using the `--init` flag.

```shell:terminal
npx tsc --init
```

<Image src="tsconfig.webp" alt="TSConfig" />

Inside the generated `tsconfig.json` file we can see useful descriptions alongside the TypeScript **compiler options**.

You can look at the [TypeScript compiler options](https://www.typescriptlang.org/docs/handbook/compiler-options.html) and the [TSConfig Reference](https://www.typescriptlang.org/tsconfig) that explains each option if you want to learn more.

Let's make the `tsconfig.json` file more readable by removing most of the TypeScript **compiler options** and focusing on a couple of options.

```json:tsconfig.json showLineNumbers
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "lib": ["ESNext", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src",
    "noEmitOnError": true,
    "strict": true
  }
}
```

- **target**: specifies the target JavaScript version the TypeScript code compiles to where **ESNext** is the latest
- **module**: specifies the module system we're going to transpile to where [CommonJS](https://en.wikipedia.org/wiki/CommonJS) uses the `const package = require('package')` syntax and the **ES6** and onwards option uses **ECMAScript modules** (**ESM**) `import package from 'package'` syntax which is supported natively in browsers only as of recent
- **lib**: decides what types to include with our code because we might not need **DOM** types if we're writing for **Node** or want to target some other JavaScript features (TypeScript includes a default set of type definitions for built-in JavaScript APIs)
- **outDir**: specifies the **output** directory for transpiled JavaScript code
- **rootDir**: specifies the **root** directory for TypeScript files
- **noEmitOnError**: doesn't output anything if there's a TypeScript error
- **strict**: enables all the strict flags so our code is more type-safe

Since we set the **rootDir** we don't have specify what file to run inside `package.json` since it watches the entire directory.

```json:package.json showLineNumbers
"scripts": {
  "dev": "npx tsc -w"
}
```

<Image src="typescript-output.webp" alt="TypeScript output" />

If you want to fire up a quick TypeScript demo you can use an online editor like [CodeSandbox](https://codesandbox.io/) so you can try things out for any project or framework.

Hope this helps you get started using TypeScript.

## Reading Type Definitions

TypeScript gives us documentation inside our editor.

This is useful as **code completion** since you can dive into the types directly to understand the surface area of an API.

If you just started to learn TypeScript don't be intimidated as it requires practice to understand the types first.

We can inspect the **generic** `Array` interface by selecting `Array` and pressing <kbd>F12</kbd> or right-clicking it and selecting **Go to Definition**.

```ts:example.ts
const pokemon: Array<string> = ['Bulbasaur', 'Charmander', 'Squirtle']
```

<Image src="array-interface.webp" alt="Array interface" />

There's always going to be a lot of information in **type definition** files, so focus on what you're inspecting. You can jump from one **type definition** to another by doing the same to other types inside.

There's a couple of interesting things to note:

- The file ends with a `.d.ts` extension which is just a **declaration file** for types (it's used to add TypeScript types to things that aren't built with TypeScript)
- There's multiple **type declarations** on the right depending on the version of JavaScript the features were added in among other things (remember it's one **interface** since we can declare it again)

If we poke around **lib.es2015.core.d.ts** we can find the types that describe how to create arrays on the fly.

<Image src="array-constructor.webp" alt="Array constructor" />

If we go back and look at **lib.es5.d.ts** on the right it looks like something we would expect. You can double-click it or <kbd>Alt</kbd> + <kbd>Click</kbd> the **type definition** to open it in a separate tab.

<Image src="array-interface-es5.webp" alt="es5 interface" />

This has properties we would expect like `length`, `pop`, `push`, and `map`.

By looking at the **type definitions** we can learn how they typed the `map` array method.

```ts:example.ts showLineNumbers
interface Array<T> {
  // ...
  map<U>(
    callbackfn: (
      value: T,
      index: number,
      array: T[]
    ) => U, thisArg?: any
  ): U[]
  // ...
}
```

You can get a real idea how **generics** are used in practice.

## Reading TypeScript Errors

Arguably, the hardest part about TypeScript can be reading and understanding errors.

First open the **problems** tab in your editor by pressing <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>M</kbd> so you have an easier time reading TypeScript errors.

```ts:example.ts showLineNumbers
const pokemon = {
  bulbasaur: { id: 1, hp: 45, attack: 49, defense: 49 },
  charmander: { id: 2, hp: 39, attack: 52, defense: 43 },
  squirtle: { id: 3, hp: 44, attack: 48, defense: 65 },
}

const bulbasaur: string = 'bulbasaur'

// TypeScript is mad. 🙅‍♀️
const chosenPokemon = pokemon[bulbasaur]
```

<Image src="problems-tab.webp" alt="Problems tab" />

```json:error
Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{ bulbasaur: { id: number; hp: number; attack: number; defense: number; }; charmander: { id: number; hp: number; attack: number; defense: number; }; squirtle: { id: number; hp: number; attack: number; defense: number; }; }'.
  No index signature with a parameter of type 'string' was found on type '{ bulbasaur: { id: number; hp: number; attack: number; defense: number; }; charmander: { id: number; hp: number; attack: number; defense: number; }; squirtle: { id: number; hp: number; attack: number; defense: number; }; }'.
```

Sometimes you're going to have these sort of errors that make you question your sanity when using TypeScript when it's a simple fix.

The error message is **verbose** because it's describing the entire object as a **literal type** since we're not using a **type alias** or **interface** it can refer to instead.

```json:error
Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'Pokemon'.
  No index signature with a parameter of type 'string' was found on type 'Pokemon'.
```

You can read TypeScript errors like sentences with **because** inbetween.

```json:error
Element implicitly has an 'any' type because expression of type 'string' can't be used to index type ...
  because no index signature with a parameter of type 'string' was found on type ...
```

The further you go down the **because chain** the more specific the error is, so start from there.

This problem might be harder to reason about if you don't understand things like **object index signatures** tying everything we learned so far together.

The second part of the error message reveals the problem.

We don't care if `chosenPokemon` type is `any` because that's what TypeScript cares about — we care about what causes it.

This is what TypeScript thinks is going on.

```ts:example.ts showLineNumbers
// TypeScript sees the general type `string` 🚫
const chosenPokemon = pokemon['random string']

// TypeScript expects the literal type `bulbasaur` ✅
const chosenPokemon = pokemon['bulbasaur']
```

TypeScript freaks out because it thinks we're passing some random string since we haven't specified the **index signature**.

If you remember, objects are **number indexed** by default.

```ts:example.ts showLineNumbers
interface Pokemon {
  [index: string]: {
    id: number
    hp: number
    attack: number
    defense: number
  }
}

const pokemon: Pokemon = {
  bulbasaur: { id: 1, hp: 45, attack: 49, defense: 49 },
  charmander: { id: 2, hp: 39, attack: 52, defense: 43 },
  squirtle: { id: 3, hp: 44, attack: 48, defense: 65 },
}

const bulbasaur: string = 'bulbasaur'

const chosenPokemon = pokemon[bulbasaur] // ok ✅
```

That works, but it's not what we want.

We just want TypeScript to **infer** the type for us here so we don't have to do it by hand, otherwise we would have to update the **interface** each time there's another Pokemon.

```ts:example.ts showLineNumbers
interface Pokemon {
  bulbasaur: {
    id: number
    hp: number
    attack: number
    defense: number
  }
  charmander: {
    id: number
    hp: number
    attack: number
    defense: number
  }
  squirtle: {
    id: number
    hp: number
    attack: number
    defense: number
  }
}
```

The problem is that we're not passing the **type literal** `bulbasaur`, so TypeScript can't compare it to the key `bulbasaur` in `pokemon`.

```ts:example.ts showLineNumbers
const pokemon = {
  bulbasaur: { id: 1, hp: 45, attack: 49, defense: 49 },
  charmander: { id: 2, hp: 39, attack: 52, defense: 43 },
  squirtle: { id: 3, hp: 44, attack: 48, defense: 65 },
}

const bulbasaur: 'bulbasaur' = 'bulbasaur'

const chosenPokemon = pokemon[bulbasaur] // ✅
```

You're going to encounter this when dealing with dynamic values.

If you used `const` it would infer it as a **literal type**, so the type assignment isn't required and it's only there so it's obvious.

There's times when TypeScript goes **cuckoo for Cocoa Puffs** and something goes wrong. Instead of closing and opening your editor just **restart the TypeScript server** by pressing <kbd>F1</kbd> to open the **command palette** in VS Code and find **TypeScript: Restart TS server**.

<Image src="ts-server.webp" alt="Restart TS server" />

If you don't understand the error open up the [TypeScript Playground](https://www.typescriptlang.org/play/) and **reproduce** it there so you have a shareable link you can send to anyone.

You can always ask a question in the [TypeScript Community Discord Server](https://discord.com/invite/typescript).

## Dealing With Untyped Libraries

Almost every library you want to use supports TypeScript today.

The great thing about TypeScript is that the community can gather around to create types for libraries that don't use TypeScript.

**Ambient declarations** describe the types that would have been there if the project was written in TypeScript and they have the `.d.ts` file extension that TypeScript picks up.

[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) is a project that holds a repository for types that everyone gathered around to contribute types having over **80,000** commits and it's used to [search for types](https://www.typescriptlang.org/dt/search?search=) on the official TypeScript page.

<Image src="type-search.webp" alt="Type search" />

In the example we have a simple **HTTP server** in **Node** that sends a JSON response.

```ts:app.ts showLineNumbers
const http = require('http')

function requestListener(req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ pokemon: 'Pikachu' }))
}

const server = http.createServer(requestListener)
server.listen(8080)
```

<Image src="type-definitions.webp" alt="Type definitions" />

You don't have to use search to figure out if what you're using is typed or not — TypeScript is going to let you know.

To install a **type definition** you just have to do `npm i -D @types/package` to install it as a development dependency.

Let's install the types for Node.

```shell:terminal
npm i -D @types/node
```

<Image src="require-to-import.webp" alt="Require to import" />

TypeScript lets us know we can convert `require` to an `import`.

```ts:app.ts
import * as http from 'http'
```

You have to keep in mind these older libraries use **CommonJS** that uses **module exports**, so we can't expect it to use **ECMAScript modules** where you can import a package simply as `import http from 'http'` using the **default export** syntax or `import { http } from http` syntax if it's a **named import**.

Try it first and if it doesn't work you can use `import * as http from 'http'` to import the entire module's contents.

You can brush up on how JavaScript modules work by reading [JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) on the MDN Web Docs.

We still haven't resolved the types for `req` and `res` for `requestListener` since we can't do that alone by just installing **type definitions**.

How do we figure the types in this case?

You can always search for the answer and that's a valid approach but let's dig through the **type definitions** to figure it out.

Let's select the `http` part and press <kbd>F12</kbd> to **Go to Definition**. This is going to open the `http.d.ts` type declaration file.

Inside the file we can do a <kbd>Ctrl</kbd> + <kbd>F</kbd> search for `requestListener`. If that wouldn't work we coud look for `req` or `res` until we find something.

<Image src="type-declaration-search.webp" alt="Type declaration search" />

We found our types! 🎉 The `req` argument expects `IncomingMessage` and the `res` argument expects `ServerResponse`.

We can import the types from the `http` package.

```ts:app.ts showLineNumbers
import * as http from 'http'

import type { IncomingMessage, ServerResponse } from 'http'
```

The `type` keyword is optional but it makes it clear we're using types and not importing some method.

```ts:app.ts showLineNumbers
import * as http from 'http'

import type { IncomingMessage, ServerResponse } from 'http'

function requestListener(req: IncomingMessage, res: ServerResponse) {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ pokemon: 'Pikachu' }))
}

const server = http.createServer(requestListener)
server.listen(8080)
```

Now we have the entire `http` API at our fingertips we can look at without leaving our editor.

Using types is easy in most cases when it's properly documented in a project that uses TypeScript. I wanted to show you how to deal with a scenario where that isn't the case.

In the rare case when there's no types for a package you can create a `index.d.ts` file and place it inside a `types` folder. The name could be anything.

```ts:index.d.ts
declare module 'http'
```

This says to TypeScript the package exists and it's going to stop bothering you.

## Generate Types

In case where we have some complex JSON object from an API response we can generate types from it to make our lives easier instead of typing it out by hand.

We can use [quicktype](https://quicktype.io/) to generate types for more than just TypeScript. There's also a [quicktype extension for VS Code](https://marketplace.visualstudio.com/items?itemName=quicktype.quicktype).

Their default example uses Pokemon, so it's perfect! Consistency. 💪

<Image src="quicktype.webp" alt="Convert JSON into gorgeous, typesafe code in any language" />

This is also great as a learning tool.

## Conclusion

You learned a lot about TypeScript fundamentals to give you confidence in using it in your projects. TypeScript itself is a tool that gives confidence about your code but don't forget it **doesn't save you at runtime**.

TypeScript is only gaining more popularity and since more projects are using TypeScript that means we as developers have to step up if we want to contribute to those projects.

Even if TypeScript fades and JavaScript gets types we didn't have to learn another language to use types because **TypeScript is JavaScript**.

Thank you for your time! 😄
