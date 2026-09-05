---
title: Testing User Interfaces For Beginners
description: Gain confidence your code works and learn how to test user interfaces with Testing Library for any frontend JavaScript framework.
slug: testing-for-beginners
published: '2022-1-28'
category: javascript
---

<script lang="ts">
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="y53wwdBr5AI" title="Make a Svelte Todo App" />

## Table of Contents

## Tests Give You Confidence

Hey friends! 👋

Testing is a subject that severely lacks content and might seem like the black arts to the uninitiated. I want to make testing more approachable and show you how it can even be fun!

We're going to learn how to test any frontend JavaScript framework to have more confidence in our code.

I'm going to use the todo app from [Make a Svelte Todo App](https://joyofcode.xyz/svelte-todo-app) we built previously but **don't think because it's Svelte it's not relevant** to you because we're going to use [Testing Library](https://testing-library.com/) that's **framework agnostic** and works for all of the popular frontend JavaScript frameworks.

Testing is important because it gives you confidence your code works as expected and if you test your application as your users you know their experience is predictable.

Imagine if you had a piece of code that other things rely on and you have to add a feature or refactor how it works. Not having tests makes this equivalent to editing styles that apply to the entire site so you have no idea what would break if you changed it.

You can use tests to prevent people from submitting code in a pull request that would otherwise break things and in the same way encourage contributions because you don't have to test it yourself and automate it instead.

## Build Your Test Framework

Let's build a simple test framework in a couple of lines of code to see how it works. Credit goes to [@kentcdodds](https://twitter.com/kentcdodds) and his great article on [But really, what is a JavaScript test?](https://kentcdodds.com/blog/but-really-what-is-a-javascript-test).

> 🐿️ To run the code you need [Node.js](https://nodejs.org/en/) and then you can use `node example.js` in your terminal.

What's the simplest test we can write?

```js:example.js showLineNumbers
function sum(a, b) {
  return a + b
}

let actual = sum(2, 2)
let expected = 4

if (actual !== expected) {
	throw new Error(`${actual} is not equal to ${expected}`)
}
```

We made an assertion! 🥳

From this point we can build or own assertion library. After all the only limit is our imagination.

```js:example.js {5-13,18} showLineNumbers
function sum(a, b) {
  return a + b
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`${actual} is not equal to ${expected}`)
      }
    },
  }
}

let actual = sum(2, 2)
let expected = 4

expect(actual).toBe(expected)
```

Right now we don't know what test is failing, so let's add a `test` function so we can give the test a name a pass a callback function.

```js:example.js {5-13,25-29} showLineNumbers
function sum(a, b) {
  return a + b
}

function test(title, callback) {
  try {
    callback()
    console.log(`👍️ ${title}`)
  } catch (error) {
    console.error(`❌ ${title}`)
    console.error(error)
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`${actual} is not equal to ${expected}`)
      }
    },
  }
}

test('sum adds numbers', () => {
  let result = sum(2, 2)
  let expected = 4
  expect(result).toBe(expected)
})
```

```shell:terminal
~/example 🔥 node example.js
👍️ sum adds numbers
```

We need something to look for tests in our project and run them. This is what a JavaScript testing framework does.

Our example is simple but shows how testing isn't this elusive thing.

## Types of Tests

I don't want to burden you with terminology and setup so instead I'm going to focus on testing and giving you more examples beyond the basics.

Let's quickly explain the types of tests because you're going to hear these terms and discussions what you should test even if it's not helpful:

- **Unit** testing is making sure an individual part like a method or component works
- **Integration** testing is making sure that several methods or components work together
- **End-to-end** testing means simulating the actual user experience inside a browser like testing a Discord login integration ([Cypress](https://www.cypress.io/) is popular for this and works great with Testing Library but it's overkill for us)

**The only thing you should care about is writing a test.**

If you're using any of these methods to achieve that is going to be an accident and completely irrelevant.

**You don't do testing to please others but to give yourself confidence.**

If we strip away the terminology and technology we're only left with something simple — which is making our test work.

The second thing you're going to ask is **"What to test?"**. This depends of course but you always want to test something that's most critical to your application.

You might not have time or resources to test every aspect and that's fine so test the parts that are a disaster if they fail such as a checkout process.

## Testing Library

These are the tools we're going to use:

- [Jest](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Svelte Testing Library](https://github.com/testing-library/svelte-testing-library)

Jest is a JavaScript testing framework and a test runner that gives you methods to test your logic.

Testing Library is only responsible for querying and interacting with DOM nodes thanks to [jsdom](https://github.com/jsdom/jsdom) simulating the browser in [Node.js](https://nodejs.org/en/) but it doesn't care how you render the DOM but it requires a test runner like Jest and works with everything like using a real browser with Cypress.

Testing Library also has packages that extend Jest functionality such as [jest-dom](https://github.com/testing-library/jest-dom) that makes it easier to test the DOM with custom matchers like checking for the element's attributes, it's text contents, it's CSS classes and so on.

Because Testing Library is built on top of [DOM Testing Library](https://testing-library.com/docs/dom-testing-library/intro/) the reason why it's framework agnostic is because it gives you a wrapper around other libraries such as Svelte Testing Library but the API is the same regardless what framework you're using.

> 🐿️ The more your tests resemble the way your software is used, the more confidence they can give you.

Testing Library gives you a set of queries to find elements on the page such as `get`, `find`, `query` and user actions for firing events.

Types of queries:

- **getBy** returns the matching element and throws an error if it can't be found
- **queryBy** is useful for asserting an element is not present because it returns `null`
- **findBy** returns a Promise which resolves when an element is found if you have some async code

Each query has their counterpart for finding more elements such as `getAllBy`, `queryAllBy` and `findAllBy`. You can read more about [types of queries](https://testing-library.com/docs/queries/about#types-of-queries) in the documentation.

The other important part based on the guiding principles of Testing Library is the [priority](https://testing-library.com/docs/queries/about#priority) in how you should query your elements to resemble your users `getByRole` being the highest and `getByTestId` being the lowest meaning you should avoid using it.

1. **getByRole** to query an element in the accessibility tree such as `getByRole('button', { name: /submit/i })`
2. **getByLabelText** is good for form fields
3. **getByPlaceholderText** if you don't have a label but it's not a substitute for it
4. **getByText** is the main way users find non-interactive elements
5. **getByDisplayValue** for form elements with filled-in values
6. **getByAltText** for elements that support `alt` text
7. **getByTitle** for elements with a `title`
8. **getByTestId** only as a last resort if you can't match by role or text or the text is dynamic

One of the great things about Testing Library is if you follow these guiding principles it's going to expose bad accessibility which we're going to look at later.

You can learn more about other methods for [appearance and disappearance](https://testing-library.com/docs/guide-disappearance/) that are required when you're dealing with animations.

This is an example of a simple test. 🧪

```html:Component.svelte showLineNumbers
<h1>Hello, World! 👋</h1>
```

```ts:Component.test.ts showLineNumbers
import { render, screen } from '@testing-library/svelte'

import Component from '../Component.svelte'

test('shows proper heading when rendered', () => {
  render(Component)
  let title = screen.getByText(/hello, world/i)
  expect(title).toBeInTheDocument()
})
```

> 🐿️ Note that we're using a case insensitive regex pattern to match the text because from the perspective of the user we don't care what case the text is using but that it's on the page.

This is why Testing Library is framework agnostic with minor differences how you render and pass props to a component because whatever you render at the end is going to be turned into plain HTML you can query and do assertions using the same methods.

After you have some tests under your belt I highly recommend you read [Common mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library) because the same principles apply whatever framework you're using.

## Project Setup

You can find the 🔗 [finished project files](https://github.com/JoysOfCode/testing-for-beginners) on GitHub.

This is going to be hardest part I promise because we need to install a bunch of packages and configure Jest with TypeScript because the project we're testing uses TypeScript.

🖌️ Clone the project files and install development dependencies.

```shell:terminal
git clone https://github.com/JoysOfCode/svelte-todo.git
```

```shell:terminal
npm i
```

Here is everything you're going to need for the project if you want to install everything at once.

```shell:terminal
npm i -D @babel/core @babel/preset-env @babel/preset-typescript @testing-library/jest-dom @testing-library/svelte babel-jest jest svelte-jester ts-jest @types/jest
```

If you want to understand what we're testing you can start the development server and visit [http://localhost:3000/](http://localhost:3000/) to see the todo app.

```shell:terminal
npm run dev
```

I want to let you know how I set up everything because we're trying to make different things work together such as Jest and TypeScript. My hope is that this step becomes completely unnecessary in the future and every framework does it for you out of the box but it's worth learning how it works.

I don't want to put anyone under the illusion that I know everything and things comes easy to me because this took me a while to figure out and you're going to learn how I figured it out.

🖌️ First install Jest from [Getting Started](https://jestjs.io/docs/getting-started) instructions in the documentation and packages it says we need for TypeScript which includes Babel.

```shell:terminal
npm i -D jest babel-jest @babel/core @babel/preset-env @babel/preset-typescript @types/jest
```

> 🐿️ `i` is short for `install` and `-D` is short for `--dev` which means development dependencies because these packages are only used in development.

🖌️ The documentation says we should create a Babel config at the root of our project.

```js:babel.config.cjs showLineNumbers
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
}
```

> 🐿️ Because the project uses ES modules with `"type": "module"` in `package.json` we have to use the `.cjs` extension for the older CommonJS module syntax.

This is great because if we just followed steps from Testing Library this wouldn't be mentioned even though they recommend Jest so you would be sad and confused.

🖌️ Since we already have some packages from installing Jest we can get the ones specific to Svelte Testing from reading [Setup](https://testing-library.com/docs/svelte-testing-library/setup) from the Svelte Testing Library documentation.

```shell:terminal
npm i -D @testing-library/svelte svelte-jester @testing-library/jest-dom ts-jest
```

- `svelte-jester` is used to compile Svelte components before they're used in Jest and `ts-jest` is required for TypeScript
- `babel-jest` is required because we're using the ES modules `import` syntax which Babel has to transpile
- `@testing-library/jest-dom` adds more useful assertions for Jest

The documentation says you need `svelte-preprocess` to process TypeScript in Svelte but that should already be installed because we created the project with TypeScript.

🖌️ Instead of adding the Jest config inside `package.json` we're going to create a Jest config but you can also create one using `npx jest --init` and remove what you don't need.

```js:jest.config.cjs showLineNumbers
module.exports = {
  transform: {
    '^.+\\.svelte$': [
      'svelte-jester',
      {
        preprocess: true,
      },
    ],
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'ts', 'svelte'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  moduleNameMapper: {
    '^\\$app(.*)$': '<rootDir>/.svelte-kit/dev/runtime/app$1',
    '^\\$root/(.+)$': '<rootDir>/src/$1',
  },
}
```

The Jest config I have started from the Svelte Testing Library documentation and things I added after are from reading the [Jest configuration](https://jestjs.io/docs/configuration) options that I gradually added when I needed it.

- **transform** helps Jest know what to use for what file type to make it usable
- **testEnvironment** sets the testing environment to a browser instead of Node by default
- **moduleFileExtensions** is so Jest know the types of files we use in the project
- **setupFilesAfterEnv** lets you define a path to modules you commonly use so you don't have to import it inside each test file
- **moduleNameMapper** is required to resolve custom path aliases like `$app` and `$root`

I want to help you understand how **reading documentation isn't scary but an important skill to practice** because documentation is always right and most recorded tutorials can't be easily updated so you're going to be frustrated when things don't work.

🖌️ Lastly we need to update `package.json` to include the `test` and `test:watch` scripts to run our tests.

```json:package.json {9-10} showLineNumbers
{
  "name": "svelte-todo",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-check --tsconfig ./tsconfig.json",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "devDependencies": {
    "@babel/core": "^7.16.7",
    "@babel/preset-env": "^7.16.7",
    "@babel/preset-typescript": "^7.16.7",
    "@sveltejs/vite-plugin-svelte": "^1.0.0-next.30",
    "@testing-library/jest-dom": "^5.16.1",
    "@testing-library/svelte": "^3.0.3",
    "@tsconfig/svelte": "^2.0.1",
    "babel-jest": "^27.4.6",
    "jest": "^27.4.7",
    "svelte": "^3.44.0",
    "svelte-check": "^2.2.7",
    "svelte-jester": "^2.1.5",
    "svelte-preprocess": "^4.9.8",
    "ts-jest": "^27.1.2",
    "tslib": "^2.3.1",
    "typescript": "^4.4.4",
    "vite": "^2.7.2"
  }
}
```

🖌️ Let's add a test under `src/components/tests` and if we run `npm run test:watch` Jest should find our tests.

```ts:src/components/tests/example.test.js showLineNumbers
test('it should work', () => {})
```

> 🐿️ You're going to see tests placed in a `__tests__` folder as convention but it's not a rule because Jest is going to look for tests that include a `.test` or `.spec` extension.

The test should pass! 🥳

```shell:terminal
 PASS  src/components/tests/example.test.js
  ✓ it should work (1 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.296 s, estimated 1 s
Ran all test suites related to changed files.

Watch Usage: Press w to show more.
```

The watch mode is going to rerun every time you update a test and you can test one thing at a time by specifying the filename if you press the <kbd>p</kbd> key and type `src/components/tests/example.test.js`.

We don't even have to use the TypeScript extension for tests because we're not going to add types inside tests. Because an editor like Visual Studio Code has great TypeScript support you get benefits from types even if you're using a regular JavaScript file.

That actually wasn't that bad! Because we had to do it ourselves we learned a lot about how Jest works and how to configure it.

## Todos Component

If I could only test one thing about our app it would be the `Todos.svelte` component.

The `Todos.svelte` is our entire app and by testing it we're doing **integration testing** because of multiple components working together.

We only care about our tests so we're not interested in what type of testing it is even if someone pointed it out we'd say "I guess, I'm just confident it works! 🤷".

The todo app should be able to:

- Add a todo item
- Edit a todo Item
- Remove a todo item
- Filter todo items
- Clear completed todo items

Once you identify what you need to test you can start from there and explore how to achieve it.

Where you add your tests isn't important to Jest. That being said it's easier if you place them near your components. You can even place them alongside your component inside a folder if you want. This is a great option if it contains other files but I leave that up to you.

> 🐿️ If you need help join a Discord server of the framework you're using because everyone speaks the same language. You can ask how to test what you want. Provide a reproduction using [CodeSandbox](https://codesandbox.io/).

You can open a separate terminal tab and run the app with `npm run dev`.

Make sure you're running Jest in watch mode with `npm run test:watch`. Inside your terminal you can see more options if you press the <kbd>w</kbd> key. Pressing the <kbd>p</kbd> key lets you test a specific file if you specify a regex.

Since we're simulating the browser environment we need to clear local storage between our tests using `afterEach` from Jest because the todo app uses it to read and write to it.

Keep these things in mind because you might forget it. Testing Library already cleans up after every test so your component state doesn't persist but I got stumped by this!

🖌️ Create the `Todos.test.ts` file inside `src/components/tests`.

```ts:src/components/tests/Todos.test.ts showLineNumbers
import Todos from '../Todos.svelte'

afterEach(() => {
  localStorage.clear()
})
```

We're going to have an error because we haven't added any tests yet so don't worry about it.

> 🐿️ Jest exposes methods like `test` and `afterEach` globally so don't be alarmed.

It might feel weird thinking about how to write a test but it helps if you think about it from the perspective of your user:

- Find the input element with the placeholder "What needs to be done?"
- Change the value of the input
- Submit it

🖌️ Let's write your first real test.

```ts:src/components/tests/Todos.test.ts {1,9-19} showLineNumbers
import { fireEvent, render, screen } from '@testing-library/svelte'

import Todos from '../Todos.svelte'

afterEach(() => {
  localStorage.clear()
})

test('able to add a todo item', async () => {
  render(Todos)

  let value = 'Todo Item'

  let todoInputElement = screen.getByPlaceholderText(/what needs to be done?/i)
  await fireEvent.input(todoInputElement, { target: { value } })
  await fireEvent.submit(todoInputElement)

  expect(screen.getByText(value)).toBeInTheDocument()
})
```

That wasn't so bad, right? Take a minute to understand what just happened:

1. Rendered the `Todos` component so we query it's elements
2. Queried the todo input element by it's placeholder text
3. Fired an input to change the contents of the input and submit it
4. Asserted that the value we just entered exists

First passing test! 🥳

```shell:terminal
 PASS  src/components/tests/Todos.test.ts
  ✓ able to add a todo item (67 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.742 s, estimated 1 s
Ran all test suites related to changed files.

Watch Usage: Press w to show more.
```

We're using `submit` because it's inside a form but a `click` event would do the trick. Testing Library also has a [user-event](https://testing-library.com/docs/user-event/intro/) package to make interactions even more realistic but `fireEvent` does the job.

After we have queried the element and submitted it we can assert if it exists using `toBeInTheDocument`. This is from `jest-dom` and you can learn more about the [custom matchers](https://github.com/testing-library/jest-dom) it has or you can look inside the suggestions in your editor because of TypeScript ❤️.

When using Testing Library I advise you read the documentation for your framework because for example if we read [Svelte Testing Library API](https://testing-library.com/docs/svelte-testing-library/api) it gives us useful information such as the `fireEvent` being an `async` method because it calls `tick` from Svelte to update the DOM for changes.

Seriously, read the documentation! Even if it's just to understand what's possible 😄

> 🐿️ When testing it's desirable to first make the test fail so you know it works when it passes to avoid false positives.

One 🔥 hot tip I want to share with you is how to debug your tests. To see what's going on you can use `screen.debug` inside your test to see the entire DOM or pass an element to it.

You can think of it as using `console.log` because you can see the state of the DOM before and after you made a change.

```ts:example.ts {13,16} showLineNumbers
test('able to add a todo item', async () => {
  render(Todos)

  let value = 'Todo Item'

  let todoInputElement = screen.getByPlaceholderText(/what needs to be done?/i)
  await fireEvent.input(todoInputElement, { target: { value } })
  await fireEvent.submit(todoInputElement)

  expect(screen.getByText(value)).toBeInTheDocument()

	// output entire DOM
	screen.debug()

	// output single element
	screen.debug(todoInputElement)
})
```

```shell:terminal
<input
	autofocus=""
	class="new-todo svelte-dc6ekc"
	id="new-todo"
	placeholder="What needs to be done?"
	type="text"
/>
```

Alright, you're on fire! 🔥 How would we test adding multiple todo items? Whenever something is new to you like a library or framework it's easy to forget it's just JavaScript. You already know how to use loops, right?

🖌️ Lets add a new test!

```ts:src/components/tests/Todos.test.ts showLineNumbers
// ...

test('able to add multiple todo items', async () => {
  render(Todos)

  let todoInputElement = screen.getByPlaceholderText(/what needs to be done?/i)
  let values = ['Todo Item 1', 'Todo Item 2', 'Todo Item 3', 'Todo Item 4']

  for (let value of values) {
    await fireEvent.input(todoInputElement, { target: { value } })
    await fireEvent.submit(todoInputElement)
    expect(screen.getByText(value)).toBeInTheDocument()
  }
})
```

Score! 🏀

I hope you're starting to realize how testing is just JavaScript. There's also a dopamine rush when you get a passing test.

How would we test editing a todo? We know the user has to double click the todo text, change the value of the editing input and save it by pressing <kbd>Enter</kbd> on their keyboard. Try it out yourself!

There's one problem and it's that our editing todo input markup isn't that great for querying and we could refactor it but you might encounter a case where you can't so we have to resort to using a `data-testid` attribute.

🖌️ Change the editing input inside `Todo.svelte` to include a `data-testid` attribute.

```html:src/components/Todo.svelte {3} showLineNumbers
<!-- ... -->
<input
	data-testid="edit"
	on:keydown={(event) => handleEdit(event, todo.id)}
	on:blur={(event) => handleBlur(event, todo.id)}
	class="edit"
	type="text"
	value={todo.text}
	autofocus
/>
<!-- ... -->
```

🖌️ Let's add the test for editing the todo.

```ts:src/components/tests/Todos.test.ts showLineNumbers
// ...

test('able to edit a todo item', async () => {
  render(Todos)

  let value = 'Todo Item'
  let changedValue = 'Edited Todo Item'

  let todoInputElement = screen.getByPlaceholderText(/what needs to be done?/i)
  await fireEvent.input(todoInputElement, { target: { value } })
  await fireEvent.submit(todoInputElement)

  let currentTodoText = screen.getByText(value)
  await fireEvent.dblClick(currentTodoText)

  let newTodoInput = screen.getByTestId('edit')
  await fireEvent.change(newTodoInput, { target: { value: changedValue } })
  await fireEvent.keyDown(newTodoInput, { key: 'Enter' })

  expect(currentTodoText).toHaveTextContent(changedValue)
})
```

That's it! Of course it's easy for me to say because I've done it but I also had to spend time learning and figuring it out.

Not sure about you, but I already feel more confident!

Here's one that might stump you if you tried it. Whenever you're using animations you have to wait for them to finish otherwise if you make an assertion it's going to fail because the DOM isn't updated.

In this case this happens when removing a todo so you have to use the `waitFor` method and `query` to assert it's removed.

🖌️ Unfortunately our markup is also poor here so let's add `data-testid` to the button for removing the todo inside `Todo.svelte`.

```html:src/components/Todo.svelte {3} showLineNumbers
<!-- ... -->
<button
	data-testid="remove"
	aria-label="Remove todo"
	on:click={() => removeTodo(todo.id)}
	class="remove"
/>
<!-- ... -->
```

🖌️ Let's add the test for removing the todo.

```ts:src/components/tests/Todos.test.ts showLineNumbers
import {
  fireEvent,
  queryByText,
  render,
  screen,
  waitFor,
} from '@testing-library/svelte'

// ...

test('able to remove a todo item', async () => {
  let { container } = render(Todos)

  let value = 'Todo Item'

  let todoInputElement = screen.getByPlaceholderText(/what needs to be done?/i)
  await fireEvent.input(todoInputElement, { target: { value } })
  await fireEvent.submit(todoInputElement)

  expect(screen.getByText(value)).toBeInTheDocument()

  let removeTodoBtn = screen.getByTestId('remove')
  await fireEvent.click(removeTodoBtn)

  // we need to wait for the animation to finish
  await waitFor(() => {
    expect(queryByText(container, value)).not.toBeInTheDocument()
  })
})
```

Because we're using `queryByText` it requires a container that we can get from the `render` as `container`. This is documented in the [API section](https://testing-library.com/docs/svelte-testing-library/api/) of the Testing Library documentation.

Another passing test! 👏

> 🧠 If you're up for a challenge at the end you can refactor repeating code if you wish like rendering the todo and querying the todo input so it's reusable inside a `renderTodo` function. You have to return `render` so you can use the methods.

Testing filtering the todos isn't going to be harder but more verbose. As before we're going to add todo items but this time when we change the filter we're looking for if the DOM is updated properly.

🖌️ To be able to query the todo items we added we should add a `data-testid` with the todo text even if using a proper label would be more desirable but it's the markup we're working with.

```html:src/components/Todo.svelte {3} showLineNumbers
<!-- ... -->
<input
	data-testid={todo.text}
	on:change={() => completeTodo(todo.id)}
	checked={todo.completed}
	id="todo"
	class="toggle"
	type="checkbox"
/>
<!-- ... -->
```

🖌️ Add the test for filtering the todo items.

```ts:src/components/tests/Todos.test.ts showLineNumbers
// ...

test('able to filter todo items', async () => {
  let { container } = render(Todos)

  let todoInputElement = screen.getByPlaceholderText(/what needs to be done?/i)
  let values = ['Todo Item 1', 'Todo Item 2', 'Todo Item 3', 'Todo Item 4']

  for (let value of values) {
    await fireEvent.input(todoInputElement, { target: { value } })
    await fireEvent.submit(todoInputElement)
  }

  fireEvent.click(screen.getByTestId(/todo item 1/i))
  fireEvent.click(screen.getByTestId(/todo item 2/i))

  let allFilterBtn = screen.getByRole('button', { name: 'all' })
  let activeFilterBtn = screen.getByRole('button', { name: 'active' })
  let completedFilterBtn = screen.getByRole('button', { name: 'completed' })

  await fireEvent.click(activeFilterBtn)

  await waitFor(() => {
    expect(queryByText(container, /todo item 1/i)).not.toBeInTheDocument()
    expect(queryByText(container, /todo item 2/i)).not.toBeInTheDocument()
  })

  await fireEvent.click(completedFilterBtn)

  await waitFor(() => {
    expect(queryByText(container, /todo item 3/i)).not.toBeInTheDocument()
    expect(queryByText(container, /todo item 4/i)).not.toBeInTheDocument()
  })

  await fireEvent.click(allFilterBtn)

  await waitFor(() => {
    expect(queryByText(container, /todo item 1/i)).toBeInTheDocument()
    expect(queryByText(container, /todo item 2/i)).toBeInTheDocument()
    expect(queryByText(container, /todo item 3/i)).toBeInTheDocument()
    expect(queryByText(container, /todo item 4/i)).toBeInTheDocument()
  })
})
```

The removal of todo items also includes animations so we have to use `waitFor`.

For the last test inside `Todos.test.ts` we're going to test if clearing completed todo items works.

🖌️ This includes adding a bunch of todo items again and completing each one and seeing if pressing the "Clear completed" button works.

```ts:src/components/tests/Todos.test.ts showLineNumbers
// ...

test('able to clear completed todo items', async () => {
  let { container } = render(Todos)

  let todoInputElement = screen.getByPlaceholderText(/what needs to be done?/i)
  let values = ['Todo Item 1', 'Todo Item 2', 'Todo Item 3', 'Todo Item 4']

  for (let value of values) {
    await fireEvent.input(todoInputElement, { target: { value } })
    await fireEvent.submit(todoInputElement)
  }

  fireEvent.click(screen.getByTestId(/todo item 1/i))
  fireEvent.click(screen.getByTestId(/todo item 2/i))
  fireEvent.click(screen.getByTestId(/todo item 3/i))
  fireEvent.click(screen.getByTestId(/todo item 4/i))

  let clearCompletedBtn = screen.getByRole('button', {
    name: /clear completed/i,
  })

  await fireEvent.click(clearCompletedBtn)

  await waitFor(() => {
    expect(queryByText(container, /todo item 1/i)).not.toBeInTheDocument()
    expect(queryByText(container, /todo item 2/i)).not.toBeInTheDocument()
    expect(queryByText(container, /todo item 3/i)).not.toBeInTheDocument()
    expect(queryByText(container, /todo item 4/i)).not.toBeInTheDocument()
  })
})
```

All our tests should be passing! 🥳

```shell:terminal
 PASS  src/components/tests/Todos.test.ts
  ✓ able to add a todo item (73 ms)
  ✓ able to add multiple todo items (41 ms)
  ✓ able to edit a todo item (22 ms)
  ✓ able to remove a todo item (287 ms)
  ✓ able to filter todo items (233 ms)
  ✓ able to clear completed todo items (345 ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        4.364 s
Ran all test suites related to changed files.

Watch Usage: Press w to show more.
```

Having some tests is better than having no tests. Next time someone asks to add a feature and our tests are passing we can avoid manual test checking and have confidence our code works as expected.

Now we can focus on testing individual components because we couldn't test the logic inside `Todo.svelte` since it requires more components working together so we did it in the parent (unless you have global state).

For the `Todo.svelte` component itself we can test does it have the right class when a todo item is completed or does it handle keyboard events as expected.

## Todo Component

We can use everything we learned so far to test the todo component. The only new thing we're going to learn is how to pass props to a component.

Since `Todo.svelte` expects props we need to pass it a todo and mock the functions to do nothing because those come from the parent we already tested.

🖌️ Create a new file `Todo.test.ts` and add a test for displaying a todo item.

```ts:src/components/tests/Todo.test.ts showLineNumbers
import { render, screen } from '@testing-library/svelte'

import Todo from '../Todo.svelte'

test('should display todo item', () => {
  let todo = { id: '1', text: 'Todo Item', completed: false }

  let props = {
    editTodo: jest.fn(),
    removeTodo: jest.fn(),
    completeTodo: jest.fn(),
    duration: 0,
  }

  render(Todo, { todo, ...props })

  expect(screen.getByText(/todo/i)).toBeInTheDocument()
})
```

To pass props to components in Svelte you use an object. We just pass the todo item and spread the rest of the props. To mock a function we can use `jest.fn` from Jest but using a normal empty function would also work.

🖌️ We're going to do this for every test so let's make it reusable by creating a `renderTodo` function that accepts a todo and returns the props.

```ts:src/components/tests/Todo.test.ts {3-12,15} showLineNumbers
// ...

function renderTodo(todo) {
  let props = {
    editTodo: jest.fn(),
    removeTodo: jest.fn(),
    completeTodo: jest.fn(),
    duration: 0,
  }
  render(Todo, { todo, ...props })
  return props
}

test('should display todo item', () => {
  renderTodo({ id: '1', text: 'Todo Item', completed: false })
  expect(screen.getByText(/todo/i)).toBeInTheDocument()
})
```

Our tests are going to look a lot cleaner! 🪄

🖌️ Let's add a test to assert if the user is able to check and uncheck a todo item as completed.

```ts:src/components/tests/Todo.test.ts showLineNumbers
import { fireEvent, render, screen } from '@testing-library/svelte'

// ...

test('should be able to check and uncheck todo item as completed', async () => {
  renderTodo({ id: '1', text: 'Todo Item', completed: false })

  let todoInput = screen.getByTestId(/todo/i)
  await fireEvent.click(todoInput)
  expect(todoInput).toBeChecked()

  await fireEvent.click(todoInput)
  expect(todoInput).not.toBeChecked()
})
```

🖌️ Another thing I want to test is if the todo item has a class of completed when checked using the `toHaveClass` method.

```ts:src/components/tests/Todo.test.ts showLineNumbers
// ...

test('should have class of completed when checked', async () => {
  renderTodo({ id: '1', text: 'Todo Item', completed: true })
  let todoItem = screen.getByText(/todo item/i)
  expect(todoItem).toHaveClass('completed')
})
```

You can test however many things you want but I'm grasping at straws so let's test if the todo gets updated if you press the <kbd>Enter</kbd> or <kbd>Escape</kbd> key.

We just need to check if the `editTodo` function has been called using `toHaveBeenCalled`.

🖌️ Lets add the last tests for `Todo.svelte`.

```ts:src/components/tests/Todo.test.ts showLineNumbers
// ...

test('should update todo item when you press enter', async () => {
  let { editTodo } = renderTodo({ id: '1', text: 'Todo Item', completed: false })

  let todoItem = screen.getByText(/todo item/i)
  await fireEvent.dblClick(todoItem)

  let editingInput = screen.getByTestId(/edit/i)
  await fireEvent.keyDown(editingInput, { key: 'Enter' })
  expect(editTodo).toHaveBeenCalled()
})

test('should update todo item when you press escape', async () => {
  let { editTodo } = renderTodo({ id: '1', text: 'Todo Item', completed: false })

  let todoItem = screen.getByText(/todo item/i)
  await fireEvent.dblClick(todoItem)

  let editingInput = screen.getByTestId(/edit/i)
  await fireEvent.keyDown(editingInput, { key: 'Escape' })
  expect(editTodo).toHaveBeenCalled()
})
```

## Add Todo Component

For the `AddTodo.svelte` component we want to assert if the input has focus using `toHaveFocus` and if the user is able to type into the input using `toHaveValue` and submit the todo item by testing if the `addTodo` function has been invoked using `toHaveBeenCalledTimes`.

We're going to create a `renderAddTodo` function that accepts an `amount` argument and returns `props`.

🖌️ Create the `AddTodo.test.ts` file and add the tests.

```ts:src/components/tests/TodosLeft.test.ts showLineNumbers
import { fireEvent, render, screen } from '@testing-library/svelte'

import AddTodo from '../AddTodo.svelte'

function renderAddTodo(amount = 0) {
  let props = {
    addTodo: jest.fn(),
    toggleCompleted: jest.fn(),
    todosAmount: amount,
  }
  render(AddTodo, { ...props })
  return props
}

test('input should have focus on page load', () => {
  renderAddTodo()
  let todoInputElement = screen.getByPlaceholderText(/what needs to be done/i)
  expect(todoInputElement).toHaveFocus()
})

test('user is able to type into the input', async () => {
  renderAddTodo()

  let inputValue = 'Todo Item'

  let todoInputElement = screen.getByPlaceholderText(/what needs to be done/i)
  await fireEvent.change(todoInputElement, { target: { value: inputValue } })
  expect(todoInputElement).toHaveValue(inputValue)
})

test('user is able to submit todo', async () => {
  let { addTodo } = renderAddTodo()

  let inputValue = 'Todo Item'

  let todoInputElement = screen.getByPlaceholderText(/what needs to be done/i)
  await fireEvent.change(todoInputElement, { target: { value: inputValue } })
  await fireEvent.submit(todoInputElement)

  expect(addTodo).toHaveBeenCalledTimes(1)
})
```

## Todos Left Component

The goal of testing the `TodosLeft.svelte` component is seeing if it displays the right amount of incomplete todo items and if it uses the text "item" if there is only one and "items" if there is more than one todo.

We're going to create a reusable `renderTodosLeft` function that accepts a `incompleteTodos` amount argument and returns `props` and then we're just going to assert if it's the text we're expecting.

🖌️ Create the `TodosLeft.test.ts` file and add the tests.

```ts:src/components/tests/TodosLeft.test.ts showLineNumbers
import { render, screen } from '@testing-library/svelte'

import TodosLeft from '../TodosLeft.svelte'

function renderTodosLeft(incompleteTodos = 4) {
  let props = { incompleteTodos }
  render(TodosLeft, { ...props })
  return props
}

test('should display how many incomplete todos are left', () => {
  renderTodosLeft(4)
  screen.getByText(/4 items left/i)
})

test('should say "1 item left" if there is only one todo', () => {
  renderTodosLeft(1)
  screen.getByText(/1 item left/i)
})

test('should say "2 items left" if there is more than one todo', () => {
  renderTodosLeft(2)
  screen.getByText(/2 items left/i)
})

```

That's it! 🥳

```shell:terminal
 PASS  src/components/tests/TodosLeft.test.ts
  ✓ should display how many incomplete todos are left (15 ms)
  ✓ should say "1 item left" if there is only one todo (3 ms)
  ✓ should say "2 items left" if there is more than one todo (3 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        2.322 s
Ran all test suites matching /src\/components\/tests\/TodosLeft.test.ts/i.

Watch Usage: Press w to show more.
```

## Filtering Todos Component

For `FilterTodos.svelte` we want to test if the selected filter has the CSS class of selected.

We're going to create a `renderFilterTodos` function that accepts a `selectedFilter` argument, queries the filter elements and returns them and then we just have to assert one element has the selected class and others don't using the `toHaveClass` method.

🖌️ Create the `FilterTodos.test.ts` file and add the tests.

```ts:src/components/tests/FilterTodos.test.ts showLineNumbers
import { render, screen } from '@testing-library/svelte'

import FilterTodos from '../FilterTodos.svelte'

function renderFilterTodos(selectedFilter) {
  let props = {
    selectedFilter,
    setFilter: jest.fn(),
  }

  render(FilterTodos, { ...props })

  let filterAllElement = screen.getByText(/all/i)
  let filterActiveElement = screen.getByText(/active/i)
  let filterCompletedElement = screen.getByText(/completed/i)

  return {
    filterAllElement,
    filterActiveElement,
    filterCompletedElement,
  }
}

test('only "all" filter has selected styles', () => {
  let { filterAllElement, filterActiveElement, filterCompletedElement } =
    renderFilterTodos('all')

  expect(filterAllElement).toHaveClass('selected')
  expect(filterActiveElement).not.toHaveClass('selected')
  expect(filterCompletedElement).not.toHaveClass('selected')
})

test('only "active" filter has selected styles', () => {
  let { filterAllElement, filterActiveElement, filterCompletedElement } =
    renderFilterTodos('active')

  expect(filterAllElement).not.toHaveClass('selected')
  expect(filterActiveElement).toHaveClass('selected')
  expect(filterCompletedElement).not.toHaveClass('selected')
})

test('only "completed" filter has selected styles', () => {
  let { filterAllElement, filterActiveElement, filterCompletedElement } =
    renderFilterTodos('completed')

  expect(filterAllElement).not.toHaveClass('selected')
  expect(filterActiveElement).not.toHaveClass('selected')
  expect(filterCompletedElement).toHaveClass('selected')
})
```

That's it! 🥳

```shell:terminal
 PASS  src/components/tests/FilterTodos.test.ts
  ✓ only "all" filter has selected styles (25 ms)
  ✓ only "active" filter has selected styles (6 ms)
  ✓ only "completed" filter has selected styles (8 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        2.343 s
Ran all test suites matching /src\/components\/tests\/FilterTodos.test.ts/i.

Watch Usage: Press w to show more.
```

It might be verbose but it's not complicated! You can further create more reusable tests if you want but I just wanted to give you an idea.

## Clear Todo Items Component

I think you get the idea at this point! I wanted to include a lot of examples even if they're similar so we can practice and you can use it as reference.

For testing the `ClearTodos.svelte` component we want to test if it's hidden if there are no completed todo items and visible otherwise.

🖌️ Add the `ClearTodos.test.ts` file and add the tests.

```ts:src/components/tests/ClearTodos.test.ts showLineNumbers
import { render, screen } from '@testing-library/svelte'

import ClearTodos from '../ClearTodos.svelte'

function renderCompletedTodos(completedTodos = 0) {
  let props = {
    clearCompleted: jest.fn(),
    completedTodos,
  }
  render(ClearTodos, { ...props })
  return props
}

test('should be hidden if there are no completed todos', () => {
  renderCompletedTodos(0)
  let clearButtonElement = screen.getByRole('button')
  expect(clearButtonElement).toHaveClass('hidden')
})

test('should be visible if there is at least one completed todo', () => {
  renderCompletedTodos(1)
  let clearButtonElement = screen.getByRole('button')
  expect(clearButtonElement).not.toHaveClass('hidden')
})
```

If we press the <kbd>a</kbd> key in the terminal to test all components we can see everything is passing! 🥳

```shell:terminal
 PASS  src/components/tests/Todo.test.ts
 PASS  src/components/tests/ClearTodos.test.ts
 PASS  src/components/tests/FilterTodos.test.ts
 PASS  src/components/tests/AddTodo.test.ts
 PASS  src/components/tests/Todos.test.ts
 PASS  src/components/tests/TodosLeft.test.ts

Test Suites: 6 passed, 6 total
Tests:       22 passed, 22 total
Snapshots:   0 total
Time:        4.127 s, estimated 5 s
Ran all test suites.

Watch Usage: Press w to show more.
```

## Conclusion

Hope you learned a lot!

This is enough to get you started but there's a lot of other questions and test cases you might have such as "How do I test an API?".

Take for example the newsletter you can subscribe to below. You wouldn't use the real API because it might be slow or if it's not working it might break your tests so use [Mock Service Worker](https://mswjs.io/) instead.

I highly recommend reading [everything on testing](https://kentcdodds.com/blog?q=testing) from @kentcdodds including [Common mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library).

Thanks for reading! 🏄️
