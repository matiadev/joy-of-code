---
title: Svelte Guide For React Developers
description: Get up to speed with Svelte as a React developer.
slug: svelte-for-react-developers
published: '2022-8-8'
category: svelte
---

<script lang="ts">
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="uWDBEUkTRGk" title="Google Analytics With SvelteKit" />

## Table of Contents

## Introduction

This guide is aimed at React developers to get up to speed learning Svelte or anyone interested in comparing React and Svelte requiring only basic knowledge of JavaScript frameworks.

While I'm biased towards Svelte this guide isn't going to beat you over the head how what you're using is wrong and is just concerned with comparing the frameworks.

I decided not to use TypeScript in the examples to solely focus on the frameworks but you can find the complete typed examples on [GitHub](https://github.com/JoysOfCode/svelte-for-react-developers).

## Components

Let's start with a classic counter example in React.

```tsx:Components.tsx showLineNumbers
import { useState } from 'react'

export function Counter() {
	const [count, setCount] = useState(0)

	return (
		<>
			<p style={{ fontWeight: 700 }}>{count}</p>
			<button onClick={() => setCount(count + 1)}>
				Click
			</button>
		</>
	)
}
```

To describe what the user interface looks like React uses [JSX](https://reactjs.org/docs/introducing-jsx.html) that looks similar to writing HTML — you can think of JSX as a templating language and while you might hear “It's just JavaScript!” JSX isn't JavaScript as it has to be transpiled to JavaScript first.

To set state we use a `useState` function that returns the state variable `count` and the state setter function `setCount`.

You're not going to use inline styles in most cases as in the example and that's why there's a lot of popular CSS solutions for React like [CSS-in-JS](https://en.wikipedia.org/wiki/CSS-in-JS) where you use JavaScript to style components or [Tailwind CSS](https://tailwindcss.com/).

Here's the same example in Svelte.

```svelte:Components.svelte showLineNumbers
<script>
	let count = 0
</script>

<p>{count}</p>
<button on:click={() => (count += 1)}>Click</button>

<style lang="scss">
	p {
		font-weight: 700;
	}
</style>
```

Svelte uses a single file component similar to [Vue](https://vuejs.org/) that encapsulates HTML, CSS, and JavaScript.

The JavaScript logic lives inside the `<script>` tag and the styles inside the `<style>` tag are unique to your component — you can use preprocessors such as [SCSS](https://sass-lang.com/) for CSS or [Pug](https://pugjs.org/api/getting-started.html) for your template and the markup doesn't need a parent element.

In Svelte updates are triggered using assignments so `count + 1` wouldn't work because you need to assign it where `count += 1` is the same as `count = count + 1` .

You can also keep variables in sync with each other using reactive declarations `$: doubled = count * 2`.

> 🐿️ The `$:` syntax is valid JavaScript [label](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label) syntax but Svelte interprets it as "re-run this code whenever any of the referenced values change".

The term “magic” is often used in a negative connotation but Svelte does "magic" right because it's intuitive.

> 🐿️ Svelte is a compiler that generates the equivalent JavaScript code to surgically update the DOM meaning you don't have to ship the framework.

## Passing Props To Components

Components use props to communicate with each other where the parent component can pass some information to its child by giving them props that look like HTML attributes.

```tsx:Props.tsx showLineNumbers
 import { useState } from 'react'

export function CounterWithProps(props) {
	const [count, setCount] = useState(props.count ?? 0)

	return (
		<>
			<p>{count}</p>
			<button onClick={() => setCount(count + 1)}>
				Click
			</button>
		</>
	)
}
```

In the example we're passing an optional `count` property to `<CounterWithProps>` but if it doesn't exist we initialize `count` as `0`.

```tsx:Example.tsx showLineNumbers
<CounterWithProps count={10} /> // count is 10
<CounterWithProps />  // count is 0
```

Here's the same example in Svelte.

```svelte:Props.svelte showLineNumbers
<script>
	export let count = 0
</script>

<p>{count}</p>
<button on:click={() => (count += 1)}>Click</button>
```

In Svelte you define a prop using the `export` keyword that you can also set a default value for if you want to.

```svelte:Example.svelte showLineNumbers
<CounterWithProps count={10} /> // count is 10
<CounterWithProps />  // count is 0
```

If the value you're passing has the same name as the prop you can make it more concise.

```svelte:Example.svelte showLineNumbers
<script>
	let count = 10
</script>

<CounterWithProps {count} />
```

## Passing Children To Components

HTML elements can have children and so can components which lets you compose components however you want.

In the next example I have a reusable `<Grid>` component I want to pass elements to and specify the number of grid columns.

```tsx:Children.tsx showLineNumbers
import { useState } from 'react'

export function Grid({ children, columns }) {
	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: `repeat(${columns}, 1fr)`
			}}
		>
			{children}
		</div>
	)
}
```

To pass elements to components you use `children` from `props` and we can use `columns` to specify the amount of grid columns.

```tsx:Example.tsx showLineNumbers
<Grid columns={4}>
	<div>Column 1</div>
	<div>Column 2</div>
	<div>Column 3</div>
	<div>Column 4</div>
</Grid>
```

Here is the same example in Svelte.

```svelte:Children.svelte showLineNumbers
<script>
	export let columns
</script>

<div class="grid" style:--columns={columns}>
	<slot />
</div>

<style>
	.grid {
		--columns: 0;

		display: grid;
		grid-template-columns: repeat(var(--columns), 1fr);
	}
</style>
```

You could also use inline styles here but I wanted to showcase the `style` directive that lets you set a CSS value dynamically using [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) or properties such as `style:color={color}` or the shorthand `style:color` if the value has the same name.

In React you don't have a lot of control where you can place `children` but `slots` are more flexible and you can have multiple slots with [named slots](https://learn.svelte.dev/tutorial/named-slots) among other things.

## Expressing Logic

You can't express logic in regular HTML such as looping over values and using conditionals but you can using a JavaScript framework.

In the React example we loop over a list of todo items and check if the todo item is completed to give it some styles and the 🎉 emoji to celebrate completing it.

```tsx:Logic.tsx showLineNumbers
const todos = [
	{ id: 1, text: 'Todo 1', completed: true },
	{ id: 2, text: 'Todo 2', completed: false },
	{ id: 3, text: 'Todo 3', completed: false },
	{ id: 4, text: 'Todo 4', completed: false }
]

export function Todos() {
	return (
		<ul>
			{todos.map((todo) => (
				<li
					key={todo.id}
					style={{
						textDecoration: todo.completed
							? 'line-through'
							: ''
					}}
				>
					{todo.completed ? `${todo.text} 🎉` : todo.text}
				</li>
			))}
		</ul>
	)
}
```

Here's the same example in Svelte.

```svelte:Logic.svelte showLineNumbers
<script>
	const todos = [
		{ id: 1, text: 'Todo 1', completed: true },
		{ id: 2, text: 'Todo 2', completed: false },
		{ id: 3, text: 'Todo 3', completed: false },
		{ id: 4, text: 'Todo 4', completed: false }
	]
</script>

<ul>
	{#each todos as todo (todo.id)}
		<li class:completed={todo.completed}>
			{todo.completed ? `${todo.text} 🎉` : todo.text}
		</li>
	{/each}
</ul>

<style>
	.completed {
		text-decoration: line-through;
	}
</style>
```

In Svelte you use logic blocks like `If`, `Each` and `Await`.

This syntax might look uncomfortable but it makes sense because it mirrors how HTML works and once you start using you're going to love it — I'm not against JSX but I find this easier to read.

You can destructure the values from `todo` if you wanted as `{ id, text, completed }` and get the index `...as todo, index` or specify a key inside `(key)`.

## Handling Events

For the next event 🥁 the example uses a form that outputs the value the user entered in the input field and clears it after.

```tsx:Events.tsx showLineNumbers
import { useState } from 'react'

export function Form() {
	const [value, setValue] = useState('')

	function handleSubmit(event) {
		event.preventDefault()
		alert(value)
		setValue('')
	}

	function handleInput(event) {
		const inputEl = event.target as HTMLInputElement
		setValue(inputEl.value)
	}

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				onChange={handleInput}
				value={value}
			/>
			<button type="submit" disabled={value.length === 0}>
				Submit
			</button>
		</form>
	)
}
```

React doesn't have a way to bind the value of the input to `value` in state, so you have to use a controlled input using `onChange={handleInput}` and `value={value}` to give React control over the input which is useful if you want to disable a button based on if the input value is empty.

Here is the same example in Svelte.

```svelte:Events.svelte showLineNumbers
<script>
	let value = ''

	function handleSubmit(event) {
		alert(value)
		value = ''
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	<input type="text" bind:value />
	<button type="submit" disabled={value.length === 0}>
		Submit
	</button>
</form>
```

In Svelte you can use two-way binding using the `bind:value` directive for text inputs to bind the input value to `value` to synchronize their state.

> 🐿️ You don't have to use `value` as the variable. If you have a `name` variable then it would be `bind:value={name}`.

In Svelte you can use [event modifiers](https://learn.svelte.dev/tutorial/event-modifiers) like `preventDefault` using the `|` symbol to save you some time.

## Synchronization

Sometimes you have to synchronize your component state with something outside of it like browser APIs, data fetching and so on.

The next example shows a video player we have to hook into using `useRef` to get a reference to the element to be able to play and pause it — this is a side effect because we have to synchronize it with our component state.

```tsx:Synchronization.tsx showLineNumbers
import { useEffect, useRef, useState } from 'react'
import ein from '../assets/video.mp4'

export function Player() {
	const [status, setStatus] = useState('paused')
	const videoEl = useRef(null)

	useEffect(() => {
		status === 'paused' ? pause() : play()
	}, [status])

	function play() {
		videoEl.current?.play()
	}

	function pause() {
		videoEl.current?.pause()
	}

	function handleClick() {
		setStatus(status === 'paused' ? 'playing' : 'paused')
	}

	return (
		<>
			<video ref={videoEl} src={ein} loop />

			<button onClick={handleClick}>
				{status === 'paused' ? 'Play' : 'Pause'}
			</button>
		</>
	)
}
```

In the example if you used `videoEl.current.play()` outside `useEffect` you would get an error because it doesn't exist yet and you're trying to change the DOM during rendering.

Thanks to `useEffect` we can move it outside rendering and synchronize state each time `status` changes by passing it as a dependency.

This is the same example in Svelte.

```svelte:Synchronization.svelte showLineNumbers
<script>
	import ein from '../assets/video.mp4'

	let videoEl = null
	let status = 'paused'

	function play() {
		videoEl.play()
		status = 'playing'
	}

	function pause() {
		videoEl.pause()
		status = 'paused'
	}

	function handleClick() {
		status === 'paused' ? play() : pause()
	}
</script>

<video bind:this={videoEl} src={ein} loop />

<button on:click={handleClick}>
	{status === 'paused' ? 'Play' : 'Pause'}
</button>
```

It's much simpler and you don't have to think about `useEffect` and dependencies — if you want to start playing the video immediately you can run `play()` inside the `onMount` [lifecyle method](https://learn.svelte.dev/tutorial/onmount).

Here's an example of using the Canvas API in Svelte.

```svelte:Example.svelte showLineNumbers
<script>
	import { onMount } from 'svelte'

	let canvasEl = null

	onMount(() => {
		let context = canvasEl.getContext('2d')
		// ...
	})
</script>

<canvas bind:this={canvasEl} />
```

## Derived State

Sometimes you have values that depend on each other often referred to as “derived state” or “computed values”.

I'm going to refer to derived from the definition of the word being **“obtain something from a specified source”** because not everyone agrees what derived state is.

In the next example I want to derive state from a list of todo items for filtered todos.

Instead of creating a `filteredTodos` state using `useState` it's easier to just create the variable that gets updated when the component re-renders.

<details>
  <summary>Derived.tsx</summary>

```tsx:Derived.tsx {13} showLineNumbers
import { useState } from 'react'

export default function FilteredTodos() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Todo 1', completed: false },
    { id: 2, text: 'Todo 2', completed: false },
    { id: 3, text: 'Todo 3', completed: false },
    { id: 4, text: 'Todo 4', completed: false }
  ])
  const [todo, setTodo] = useState('')
  const [filter, setFilter] = useState('all')

  const filteredTodos = filterTodos(todos, filter)

  function addTodo(
    event: React.KeyboardEvent,
    todo: string
  ) {
    if (event.key === 'Enter') {
      setTodos([
        ...todos,
        { id: Date.now(), text: todo, completed: false }
      ])
      setTodo('')
    }
  }

  function completeTodo(id) {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed }
      }
      return todo
    })
    setTodos(updatedTodos)
  }

  function removeTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  function filterTodos(todos, filter) {
    switch (filter) {
      case 'all':
        return todos
      case 'active':
        return todos.filter((todo) => !todo.completed)
      case 'completed':
        return todos.filter((todo) => todo.completed)
    }
  }

  return (
    <div className="todos">
      <input
        onKeyPress={(event) => addTodo(event, todo)}
        onChange={(event) => setTodo(event.target.value)}
        value={todo}
        type="text"
        name="todo"
        id="todo"
        placeholder="What needs to be done?"
      />

      {filteredTodos.map(({ id, text, completed }) => (
        <div key={id} className="todo">
          <input
            type="checkbox"
            onChange={() => completeTodo(id)}
            checked={completed}
          />
          <label
            htmlFor="todo"
            style={{
              textDecoration: completed
                ? 'line-through'
                : ''
            }}
          >
            {text}
          </label>
          <button onClick={() => removeTodo(id)}>❌</button>
        </div>
      ))}

      <div className="filters">
        <button onClick={() => setFilter('all')}>
          All
        </button>
        <button onClick={() => setFilter('active')}>
          Active
        </button>
        <button onClick={() => setFilter('completed')}>
          Completed
        </button>
      </div>
    </div>
  )
}
```

</details>

If you notice performance problems you can use `useMemo` but the use is discouraged unless you have to because it hurts your performance in most cases.

```tsx:Example.tsx
const filteredTodos = useMemo(
  () => filterTodos(todos, filter),
  [todos, filter]
)
```

Here's the same example in Svelte.

<details>
  <summary>Derived.svelte</summary>

```svelte:Derived.svelte showLineNumbers
<script>
  let todos = [
    { id: 1, text: 'Todo 1', completed: false },
    { id: 2, text: 'Todo 2', completed: false },
    { id: 3, text: 'Todo 3', completed: false },
    { id: 4, text: 'Todo 4', completed: false }
  ]

  function addTodo(event) {
    if (event.key === 'Enter') {
      todos = [
        ...todos,
        { id: Date.now(), text: todo, completed: false }
      ]
      todo = ''
    }
  }

  function removeTodo(id) {
    todos = todos.filter((todo) => todo.id !== id)
  }

  function filterTodos(todos, filter) {
    switch (filter) {
      case 'all':
        return todos
      case 'active':
        return todos.filter((todo) => !todo.completed)
      case 'completed':
        return todos.filter((todo) => todo.completed)
    }
  }

  let todo = ''
  let filter: Filters = 'all'
  $: filteredTodos = filterTodos(todos, filter)
</script>

<div class="todos">
  <input
    on:keypress={addTodo}
    bind:value={todo}
    type="text"
    name="todo"
    id="todo"
    placeholder="What needs to be done?"
  />

  {#each filteredTodos as { id, text, completed } (id)}
    <div class="todo">
      <input type="checkbox" bind:checked={completed} />
      <label class:completed for="todo">{text}</label>
      <button on:click={() => removeTodo(id)}>❌</button>
    </div>
  {/each}

  <div class="filters">
    <button on:click={() => (filter = 'all')}>All</button>
    <button on:click={() => (filter = 'active')}>Active</button>
    <button on:click={() => (filter = 'completed')}>Completed</button>
  </div>
</div>

<style>
  .completed {
    text-decoration: line-through;
  }
</style>
```

</details>

In Svelte you can keep variables that depend on each other in sync using reactive declarations using the `$:` syntax where `$: filteredTodos = filterTodos(todos, filter)` means whatever values you have on the right are tracked, so `filteredTodos` is going to get updated if `todos` or `filter` changes.

## Component Composition

Being able to write code in a declarative way enables you to use composition to make your components reusable.

One example would be a map component with markers.

```tsx:Example.tsx showLineNumbers
<Map lat={45.815399} lon={15.966568} zoom={4}>
	<MapMarker lat={45.815399} lon={15.966568} label="Zagreb" />
</Map>
```

Another example would be a `<List>` component.

```tsx:Example.tsx showLineNumbers
<List>
	<Items listItems={[1, 2, 3, 4]} />
	<AddItem listItems={[1, 2, 3, 4]} addItem={addItem} />
	<RemoveItem listItems={[1, 2, 3, 4]} removeItem={removeItem} />
</List>
```

This already feels cumbersome having to pass the items down every component and it gets even worse the deeper it gets because of prop drilling.

In that case we can use the `useContext` hook at the top level of our component to expose those values to the nested components.

<details>
  <summary>useContext</summary>

```tsx:context.ts showLineNumbers
import { createContext } from 'react'

export const ListContext = createContext(null)
```

```tsx:List.tsx showLineNumbers
import { useState } from 'react'
import { ListContext } from './context'

export function List({ children, listItems }) {
  const [items, setListItems] = useState(listItems)

  function addItem() {
    setListItems((items) => [...items, items.length + 1])
  }

  function removeItem() {
    setListItems((items) =>
      items.slice(0, items.length - 1)
    )
  }

  return (
    <ListContext.Provider
      value={{ items, addItem, removeItem }}
    >
      <ul>{children}</ul>
    </ListContext.Provider>
  )
}
```

```tsx:Items.tsx showLineNumbers
import { useContext } from 'react'
import { ListContext } from './context'

export function Items() {
  const { items } = useContext(ListContext)

  return (
    <>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </>
  )
}
```

```tsx:AddItem.tsx showLineNumbers
import { useContext } from 'react'
import { ListContext } from './context'

export function AddItem() {
  const { addItem } = useContext(ListContext)

  return <button onClick={addItem}>Add</button>
}
```

```tsx:RemoveItem.tsx showLineNumbers
import { useContext } from 'react'
import { ListContext } from './context'

export function RemoveItem() {
  const { removeItem } = useContext(ListContext)

  return <button onClick={removeItem}>Remove</button>
}
```

Instead of passing items and methods to every component we can just import the components and use composition.

```tsx:index.tsx showLineNumbers
import { List } from './List'
import { Items } from './Items'
import { AddItem } from './AddItem'
import { RemoveItem } from './RemoveItem'

export function Composition() {
  return (
    <List listItems={[1, 2, 3, 4]}>
      <Items />
      <AddItem />
      <RemoveItem />
    </List>
  )
}
```

</details>

In Svelte you can do the same thing using the [Context API](https://learn.svelte.dev/tutorial/context-api) by passing values to `setContext` and receive it using `getContext` — if you need reactive values you can use a [store](https://learn.svelte.dev/tutorial/writable-stores) and pass the value.

<details>
  <summary>Context API</summary>

```svelte:List.svelte showLineNumbers
<script>
  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'
  export let listItems = []

  const items = writable(listItems)

  setContext('items', items)
  setContext('addItem', addItem)
  setContext('removeItem', removeItem)

  function addItem() {
    $items = [...$items, $items.length + 1]
  }

  function removeItem() {
    $items = $items.slice(0, $items.length - 1)
  }
</script>

<ul>
  <slot />
</ul>
```

```svelte:Items.svelte showLineNumbers
<script>
  import { getContext } from 'svelte'

  const items = getContext('items')
</script>

{#each $items as item}
  <li>{item}</li>
{/each}
```

```svelte:AddItem.svelte showLineNumbers
<script lang="ts">
  import { getContext } from 'svelte'

  const addItem = getContext('addItem')
</script>

<button on:click={addItem}>Add</button>
```

```svelte:RemoveItem.svelte showLineNumbers
<script>
  import { getContext } from 'svelte'

  const removeItem = getContext('removeItem')
</script>

<button on:click={removeItem}>Remove</button>
```

As before we can import the components and use them.

```svelte:index.svelte showLineNumbers
<script>
  import List from './List.svelte'
  import Items from './Items.svelte'
  import AddItem from './AddItem.svelte'
  import RemoveItem from './RemoveItem.svelte'
</script>

<List listItems={[1, 2, 3, 4]}>
  <Items />
  <AddItem />
  <RemoveItem />
</List>
```

</details>

That's most of the examples I wanted to show you but I also want to show you more Svelte features I love such as animations and stores.

## Global State Management

[Stores](https://learn.svelte.dev/tutorial/writable-stores) are Svelte's answer to global state management when you have values that need to be accessed by unrelated components but it's a lot more fascinating because you can create custom stores.

A store is just an object you can subscribe so you get notified when the store values change but instead of showing you some boring example of global state I want to show you how you can make a `useReducer` hook using a custom store because it's going to feel familiar coming from React.

**This is mostly for fun and I wouldn't use React conventions inside Svelte**.

The `$` syntax in `$count` is just for Svelte to understand to subscribe and unsubscribe to a store making you write less boilerplate code and it's awesome.

```svelte:Example.svelte showLineNumbers
<script>
	import { useReducer } from './hooks'

	function countReducer(count, action) {
		switch (action) {
			case 'INCREMENT':
				return count + 1
			case 'DECREMENT':
				return count - 1
			default:
				throw new Error('Impossible state 💩')
		}
	}

	const [count, dispatch] = useReducer(countReducer, 0)
</script>

<h1>The count is {$count}</h1>

<button on:click={() => dispatch('INCREMENT')}>+</button>
<button on:click={() => dispatch('DECREMENT')}>-</button>
```

To create a custom Svelte store you only have to return the `subscribe` method from `writable` and `useReducer` is just a function around it so we can pass the `reducer` and `state` values and return `dispatch` that invokes `update` with the reducer and action you passed.

```ts:hooks.ts showLineNumbers
import { writable } from 'svelte/store'

export function useReducer(reducer,	state) {
	const { subscribe, update } = writable(state)

	function dispatch(action) {
		update((state) => reducer(state, action))
	}

	return [{ subscribe }, dispatch]
}
```

I hope this sparked your imagination how powerful Svelte stores are! 😄

## Animations

Animations are just part of Svelte and you can start from simple transitions to animating between items that change with one line of code including [custom transitions](https://learn.svelte.dev/tutorial/custom-css-transitions).

This is the same todo example as before but it uses a different `fly` transition when the todo item is added with `in:fly` and removed with `out:fly` and a `flip` function to animate the elements when they change position.

```svelte:Example.svelte {2-3, 9-11} showLineNumbers
<script>
	import { flip } from 'svelte/animate'
	import { fly } from 'svelte/transition'
</script>

{#each filteredTodos as { id, text, completed } (id)}
	<div
		class="todo"
		animate:flip
		in:fly={{ x: -100 }}
		out:fly={{ x: 100 }}
	>
		<!-- ... -->
	</div>
{/each}
```

That's it! 🎉

There's a lot more to learn about Svelte and it has a great interactive [tutorial](https://learn.svelte.dev/tutorial/basics) and [examples](https://svelte.dev/examples/hello-world).

I love Svelte because it makes you want to do more for less and it's enjoyable to use and I strongly believe in the vision of [Rich Harris](https://twitter.com/Rich_Harris) after watching ["Rethinking reactivity"](https://www.youtube.com/watch?v=AdNJ3fydeao).

Hope you at least consider trying out Svelte and if you want to learn more I made [Svelte For Beginners](https://joyofcode.xyz/svelte-for-beginners) and [SvelteKit For Beginners](https://joyofcode.xyz/sveltekit-for-beginners) if you want to learn a full stack framework that uses Svelte.

Thanks for reading! 🏄️
