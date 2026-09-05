---
title: Svelte For Beginners
description: Start building things with the Svelte JavaScript framework today.
slug: svelte-for-beginners
published: '2021-12-16'
category: svelte
---

<script lang="ts">
	import Card from '#lib/components/card.svelte'
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="BrkrOjknC_E" title="Svelte For Beginners" />

## Table of Contents

## Learning Svelte

<Card type="warning">This is an outdated guide for an older version of Svelte I decided to leave up for reference. You can <a href='https://joyofcode.xyz/learn-svelte'>read the updated Svelte 5 version</a> here.</Card>

The best way to learn Svelte is to go through the [Svelte tutorial](https://learn.svelte.dev/) which is great but also contains information overload if you just want to get started writing Svelte. I'm going to show you everything you should know for the majority of things you're going to build.

I'm not going to assume your knowledge and try to explain everything along the way so if you're new to JavaScript frameworks or Svelte you should learn a lot.

You can watch the [Svelte For Beginners](https://www.youtube.com/playlist?list=PLA9WiRZ-IS_ylnMYxIFCsZN6xVVSvLuHk) playlist on YouTube.

## What is Svelte?

**Writing Svelte feels like writing regular HTML, CSS, and JavaScript.**

[Svelte](https://svelte.dev/) is a JavaScript framework created by [Rich Harris](https://twitter.com/Rich_Harris) that aims to solve the problem of abundance of JavaScript on the web while delivering a delightful developer and user experience.

Svelte is **compiled** meaning it's more of a language than a traditional JavaScript framework so it's not constrained by limitations of JavaScript. Because of that it can deliver the best **developer experience** and ship **less code** because the framework melts away when you ship code and you're only left with generated JavaScript. That's a couple of kilobytes compared to something like React that has to ship the entire runtime or library to work.

Svelte doesn't have to concern itself with the bundle size of the framework so it can have features such as animations built-in because only what you use gets bundled.

Svelte is comparable to React and Vue for building **single page applications** where your entire application lives inside one element but if you want a framework with more opinions how to write applications with routing and server-side rendering there's [SvelteKit](https://kit.svelte.dev/) that's comparable to [Remix](https://remix.run/) and [Next.js](https://nextjs.org/) for React or [Nuxt.js](https://nuxtjs.org/) for Vue.

## The Single File Component

To appreciate Svelte's simplicity we're going to start with a simple **counter** example using regular HTML and JavaScript. If you want to code along [open a new Codepen project](https://pen.new/).

```svelte:Example.html showLineNumbers
<p></p>
<button onclick="increment()">Click</button>

<script>
  let count = 0

  function increment() {
    count += 1
    updateUI()
  }

  function updateUI() {
    let counterElement = document.querySelector('p')
    counterElement.innerText = `
			Clicked ${count} ${count === 1 ? 'time' : 'times'}
		`
  }

  updateUI()
</script>
```

Ponder for a second how amazing it is that this is valid HTML in the first place and doesn't break things because how browsers are so smart.

You would write similar code like this but query elements once at the top since querying `counterElement` each time you update the user interface is wasteful. These are **easy mistakes** to make and could cause severe **performance issues** and **unexpected bugs** in your software.

**I love JavaScript** but every time you get into updating and keeping track of your data and updates to the DOM (Document Object Model) it drains your enthusiasm and starts feeling like a **chore**. This is where JavaScript frameworks come in.

I encourage you to **code along** and open the [Svelte REPL](https://svelte.dev/repl/hello-world) so you can start building muscle memory and type things out when learning instead of copying but I leave that choice up to you.

This is the same example in Svelte.

```svelte:App.svelte showLineNumbers
<script>
  let count = 0

  function increment() {
    count += 1
  }
</script>

<p>Clicked {count} {count === 1 ? 'time' : 'times'}</p>
<button on:click={increment}>Click</button>
```

**Svelte is a superset of HTML meaning it's like actual HTML and JavaScript but with superpowers.**

Svelte lets you write code in a **declarative** way meaning you don't have to query elements and worry about keeping the state of your application in sync with the user interface.

Svelte treats `App.svelte` as a **single file component**. The `<script>` tag is where you write JavaScript. There's a `<style>` tag for CSS and the rest is treated as HTML. The Svelte compiler takes this special `App.svelte` file and processes each part separately before compiling it into regular HTML, CSS, and JavaScript.

Inside the Svelte template you can use JavaScript **expressions** like `{count * 2}` and see the output directly. This should be familiar if you ever used a templating language or a JavaScript framework like Angular and Vue.

Let's add some styles at the bottom of `App.svelte`.

```svelte:App.svelte showLineNumbers
<style>
  p {
    color: teal;
  }
</style>
```

In Svelte styles are **scoped to the component** by default meaning any styles used in the component aren't going to affect other components or parts of your site.

You never have to worry about changing CSS unless it's global. You can make a style global inside a component by using the `global` modifier `:global(p)` and if you want to affect only nested components use `.element :global(p)`.

If you look at the CSS output in the Svelte REPL you can see Svelte generated `p.svelte-omwhvp {color: teal }` so it's impossible for your styles to clash.

If you want [Sass](https://sass-lang.com/) support you can just add `lang="scss"` attribute in the `<style>` tag. You can do the same with the `lang="ts"` attribute in the `<script>` tag to enable TypeScript support. Unfortunately the Svelte REPL doesn't support it so you're going to have to trust me it works in a real project.

## Reactivity

Reactivity is Svelte's superpower. If you're unfamiliar **reactivity is how you keep your DOM in sync with your application state**.

When you're developing an application you want a change in your application state like adding a song to a playlist be reflected immediately in the DOM and re-render what changed.

**You would have to write all this boilerplate code to update the user interface before you even start developing your application** and that's what JavaScript frameworks like Svelte do for us so you don't have to think about it.

Svelte's reactivity is based on **assignments**. To change state and trigger a re-render you assign a value to a variable you declared and it's going to update. We have already done this.

```svelte:App.svelte {5} showLineNumbers
<script>
	let count = 0

	function increment() {
	  count = count + 1
	}
</script>
```

Because we need to assign a value for Svelte to pick it up methods like `push` won't trigger an update until we reassign it. We can avoid doing the extra step by using the JavaScript spread operator `...` to keep existing items and add the new item.

```svelte:App.svelte {10} showLineNumbers
<script>
  let list = ['React', 'Vue']

  function handleClick() {
    // doesn't update
    list.push('Svelte')
    // until you assign it
    list = list
    // so it's easier doing this
    list = [...list, 'Svelte']
  }
</script>

<p>{list}</p>
<button on:click={handleClick}>Click</button>
```

Sometimes you need to change a value based on other values. This is referred to as a **computed property**.

Svelte has **reactive declarations** using the `$:` syntax which is valid [JavaScript label syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label) that Svelte stole for itself.

Using the `$:` syntax is saying **"re-run this code whenever any of the referenced values change"**.

```svelte:App.svelte {6, 13} showLineNumbers
<script>
	// state
	let items = [1, 2, 3, 4]

	// computed
	$: amount = items.length

	function addItem() {
		items = [...items, items.length + 1]
	}
</script>

<p>The amount is {amount}</p>
<button on:click={addItem}>Add item</button>
```

**Think about it as giving Svelte dependencies to watch and rerun the code when the value changes** because in `$: albumLength = getAlbumLength(album)` on the right `album` is the referenced value.

```svelte:App.svelte {10, 32-35} showLineNumbers
<script>
	// state
	let album = [
		{ track: 'Track 1', length: 180 },
		{ track: 'Track 2', length: 240 },
		{ track: 'Track 3', length: 280 },
	]

	// computed
	$: albumLength = getAlbumLength(album)

	function getAlbumLength(album) {
		let lengthSeconds = album.reduce(
			(totalLength, currentValue) => {
			return totalLength + currentValue.length
		}, 0)

		let [minutes, seconds] =
		(lengthSeconds / 60)
		.toFixed(2)
		.toString()
		.split('.')

		return { minutes, seconds }
	}

	function addTrack() {
		album = [...album, { track: 'Track 4', length: 420 }]
	}
</script>

<p>
	Album length is {albumLength.minutes} minutes and
	{albumLength.seconds} seconds.
</p>
<button on:click={addTrack}>Add track</button>
```

One of the cool things you can do is log a value whenever it changes so it's easy to see what's going on.

```svelte:App.svelte {3} showLineNumbers
<script>
	let count = 0
	$: console.log(count)
</script>

<button on:click={() => count += 1}>Click</button>
```

You can have reactive blocks.

```svelte:App.svelte {4-11} showLineNumbers
<script>
	let count = 0

	$: {
		console.log(`The count is ${count}`)

		if (count >= 4) {
			console.log('Restarting count.')
			count = 0
		}
	}
</script>

<button on:click={() => count += 1}>Click</button>
```

Ignore the weird syntax highlighting because there isn't an extension for `.svelte` files so it's treated like `.html` which can be fixed by using quotes `on:click="{() => count += 1}"`. Your editor is going to support the syntax if you use the [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) extension.

## Logic

Since HTML can't express logic such as conditionals and loops you would have to write something like this using JavaScript.

```svelte:Example.html showLineNumbers
<div id="app"></div>

<script>
  let appElement = document.querySelector('#app')

  let user = {
	  loggedIn: false
	}

	function toggle() {
	  user.loggedIn = !user.loggedIn
		updateUI()
	}

	function updateUI() {
    let html

	  if (user.loggedIn) {
		  html = `<button>Log out</button>`
		}

		if (!user.loggedIn) {
		  html = `<button>Log in</button>`
		}

	  appElement.innerHTML = html
    appElement.querySelector('button').onclick = toggle
	}

  updateUI()
</script>
```

It doesn't look bad but I think we can do better. This is the same example using an `#if` block in Svelte.

```svelte:App.svelte {11-13, 15-17} showLineNumbers
<script>
	let user = {
		loggedIn: false
	}

	function toggle() {
		user.loggedIn = !user.loggedIn
	}
</script>

{#if user.loggedIn}
  <button on:click={toggle}>Log out</button>
{/if}

{#if !user.loggedIn}
  <button on:click={toggle}>Log in</button>
{/if}
```

Awesome, right? I want to emphasize how close Svelte is to HTML and I hope you're excited about it.

There's more logic blocks like `#if`, `#each`, `#await`, and `#key` for you to play around with.

This is using JavaScript to loop over a list of items and render them.

```svelte:Example.html showLineNumbers
<div id="app"></div>

<script>
  let appElement = document.querySelector('#app')

	let todos = [
		{ id: 1, text: 'Todo 1', completed: true },
		{ id: 2, text: 'Todo 2', completed: false },
		{ id: 3, text: 'Todo 3', completed: false },
		{ id: 4, text: 'Todo 4', completed: false },
	]

	let todosHtml = ''

	for (let todo of todos) {
    let checked = todo.completed ? 'checked' : null

	  todosHtml += `
      <li data-id=${todo.id}>
		    <input ${checked} type="checkbox" />
		    <span>${todo.text}</span>
	    </li>
		`
	}

	appElement.innerHTML = `<ul>${todosHtml}</ul>`
</script>
```

The same example using `#each` in Svelte.

```svelte:App.svelte {11-16} showLineNumbers
<script>
	let todos = [
		{ id: 1, text: 'Todo 1', completed: true },
		{ id: 2, text: 'Todo 2', completed: false },
		{ id: 3, text: 'Todo 3', completed: false },
		{ id: 4, text: 'Todo 4', completed: false },
	]
</script>

<ul>
{#each todos as todo}
  <li>
		<input checked={todo.completed} type="checkbox" />
		<span>{todo.text}</span>
	</li>
{/each}
</ul>
```

You can [destructure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) values from the item you're iterating over, get the index, and provide a key so Svelte can keep track of changes. **Avoid using the index as the key** because it's not guaranteed to be unique so use a unique value instead.

```svelte:App.svelte {2} showLineNumbers
<ul>
{#each todos as {id, text, completed}, index (id)}
  <li>
		<input checked={completed} type="checkbox" />
		<span>{text}</span>
	</li>
{/each}
</ul>
```

If you're fetching data on the client this is how it would look using JavaScript.

```svelte:Example.html showLineNumbers
<div id="app"></div>

<script>
  let appElement = document.querySelector('#app')

  async function fetchPokemon(pokemonName) {
    let url = `https://pokeapi.co/api/v2/pokemon/`
    let response = await fetch(`${url}${pokemonName}`)
    let { name, sprites } = await response.json()

    return {
      name,
      image: sprites['front_default']
    }
  }

  async function renderUI() {
    let { name, image } = await fetchPokemon('pikachu')

    appElement.innerHTML = `
      <h1>${name}</h1>
      <img src=${image} alt=${name} />
    `
  }

  renderUI()
</script>
```

In Svelte you can easily resolve a promise using the `#await` block but you can also resolve the promise in the `<script>` tag if you want .

```svelte:App.svelte {14-21} showLineNumbers
<script>
  async function fetchPokemon(pokemonName) {
    let url = `https://pokeapi.co/api/v2/pokemon/`
    let response = await fetch(`${url}${pokemonName}`)
    let { name, sprites } = await response.json()

		 return {
      name,
      image: sprites['front_default']
    }
  }
</script>

{#await fetchPokemon('pikachu')}
	<p>Fetching Pokemon...</p>
{:then pokemon}
	<h1>{pokemon.name}</h1>
	<img src={pokemon.image} alt={pokemon.name} />
{:catch error}
	<p>Something went wrong: {error.message}</p>
{/await}
```

In the JavaScript example we didn't even add checks for scenarios where the promise could be pending, fulfilled, or rejected and just hope it works. 😬 Using Svelte you don't have to think about it.

## Events

If you're new to JavaScript frameworks you might be confused by the use of **inline event handlers** because so far everyone told you to avoid doing so in JavaScript. That's for a good reason because of **separation of concerns** to have our markup, styles, and logic separate which makes it easy to change and maintain.

Using a modern JavaScript framework all our **concerns are in one place** using components and writing declarative code and the framework doing the heavy DOM lifting and under the hood performance optimization.

If you want to know about all the Svelte events you won't find them in the Svelte documentation because it's just JavaScript so you can look at the MDN documentation for [event listing](https://developer.mozilla.org/en-US/docs/Web/Events#event_listing). Under the generic `Element` you can find the event listener `dblclick` when someone performs a double click or `mousemove` when the user moves the mouse.

This is an example of an event listener in JavaScript.

```svelte:Example.html showLineNumbers
<style>
  html,
  body {
    width: 100%;
    height: 100%;
    margin: 0;
  }

  div {
    height: 100%;
  }
</style>

<div id="app"></div>

<script>
  let appElement = document.querySelector('#app')

  let mouse = { x: 0, y: 0 }

  function handleMouseMove(event) {
    mouse.x = event.clientX
    mouse.y = event.clientY
    updateUI()
  }

  function updateUI() {
    appElement.innerHTML = `
      The mouse position is ${mouse.x} x ${mouse.y}
    `
  }

  appElement.addEventListener('mousemove', handleMouseMove)
</script>
```

In Svelte you use the `on:` directive to listen to DOM events.

```svelte:App.svelte {10} showLineNumbers
<script>
	let mouse = { x: 0, y: 0 }

	function handleMouseMove(event) {
		mouse.x = event.clientX
		mouse.y = event.clientY
	}
</script>

<div on:mousemove={handleMouseMove}>
	The mouse position is {mouse.x} x {mouse.y}
</div>

<style>
	div {
		height: 100vh;
	}
</style>
```

Svelte sends the `event` alongside your function if you do `on:mousemove={handleMouseMove}` but if you do it inline you have to pass it yourself `on:mousemove={(event) => handleMouseMove(event)}`.

Svelte has special modifiers for DOM events such as `preventDefault`. You can find a complete list under [element directives](https://svelte.dev/docs#Element_directives) and you can chain special modifiers together.

```svelte:App.svelte {7} showLineNumbers
<script>
	function handleSubmit() {
		console.log('Submit')
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	<input type="text" />
	<button type="submit">Submit</button>
</form>
```

Using `preventDefault` which is short for `event.preventDefault()` prevents the default behavior such as the form submitting causing a page reload because we want to control it using JavaScript on the client.

## Bindings

**Data binding is keeping your application state and user interface synchronized.**

Svelte supports **data binding** using the `bind:` directive.

Often you have a value that other parts depend on for example if you had a text search input and want to filter a list of items whenever the user types a search query.

You can implement data binding in JavaScript but it's not part of the language so you often get the value from the `event`. This is true for other JavaScript frameworks like React that use a synthetic event system and doesn't have data binding.

Filtering a list of items using JavaScript.

```svelte:Example.html showLineNumbers
<input type="text" />
<ul></ul>

<script>
  let list = ['React', 'Vue', 'Svelte']
  let filteredList = []

  let inputElement = document.querySelector('input')
  let listElement = document.querySelector('ul')

  function filterList(event) {
    let searchQuery = event.target.value
    filteredList = list.filter(item => {
      return item
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
    })
    updateUI()
  }

  function updateUI() {
    listElement.innerHTML = filteredList.map(item =>
			`<li>${item}</li>`).join('')
  }

  inputElement.addEventListener('input', filterList)
</script>
```

Instead of using `event.target.value` which we could also do in Svelte we can bind the value of the text input field to `searchQuery` instead.

```svelte:App.svelte {4, 17} showLineNumbers
<script>
 	let list = ['React', 'Vue', 'Svelte']
  let filteredList = []
	let searchQuery = ''

	function filterList() {
    filteredList = list.filter(item => {
      return item
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
    })
  }
</script>

<input
	on:input={filterList}
	bind:value={searchQuery}
	type="text"
/>

<ul>
{#each filteredList as item}
  <li>{item}</li>
{/each}
</ul>
```

You can have text, numeric, checkbox, group and textarea among other bindings. Instead of overwhelming you with examples you lack context for to find useful right now you can learn more about [bindings in the Svelte documentation](https://svelte.dev/docs#template-syntax-element-directives-bind-property) or by following the [Svelte tutorial](https://learn.svelte.dev/tutorial/text-inputs) when you encounter it in your project.

## Components

**Components are the primary reason of using any modern JavaScript framework** because it lets you **organize** code and have your **concerns in one place**.

If you ever used classes you can think of components as new instances of a class that can be used as a blueprint to have its own independent state.

It's easy to get carried away with components so in general **don't look for what to turn into a component** but write everything inside a single file until it becomes hard to manage and you start noticing repeating parts.

You might have an `<Artist />` component:

- `<Artist />` components gets passed the `artistName` property
- `<Album />` component has `albumTitle` and `albumTracks` property passed to `<AlbumTrack />`
- `<AlbumTrack />` component has `track` and `length` properties but also a `playing` state

The filename can be whatever but a capitalised tag such as `<Artist />` indicates to Svelte that something is a component. You import another Svelte component using the `import Component as './Component'` syntax.

Pretend that `artists` is some data we fetched as a JSON response from the Spotify API.

```svelte:App.svelte {2, 3} showLineNumbers
<script>
	import Artist from './Artist.svelte'
	import Album from './Album.svelte'

	let artists = [
		{
			name: 'Fleetwood Mac',
			albums: [
				{
					name: 'Tango in the Night',
					year: 1987,
					tracks: [
						{ title: 'Big Love', length: '3:37' },
						{ title: 'Seven Wonders', length: '3:38' },
						{ title: 'Everywhere', length: '3:48' },
						{ title: 'Caroline', length: '3:50' },
						{ title: 'Tango in the Night', length: '3:56' },
						{ title: 'Mystified', length: '3:08' },
					],
				},
			],
		},
	]
</script>

{#each artists as artist}
  <Artist artistName={artist.name} />
  {#each artist.albums as album}
		<Album
			albumTitle={album.name}
			albumTracks={album.tracks}
		/>
  {/each}
{/each}
```

The `<Artist />` component takes an `artistName` prop. To define something as a prop that's passed in to your component you use the `export let prop` syntax. You can define multiple props on the same line such as `export let prop1, prop2`.

```svelte:Artist.svelte {2, 5} showLineNumbers
<script>
	export let artistName
</script>

<h1>{artistName}</h1>
```

The `<Album />` component imports `<AlbumTrack />` and loops over the tracks. The `{...track}` syntax is just spreading the `track` props which is equivalent to `title={title} length={length}`. If your props share the same name as the value you can do `{title} {length}`.

```svelte:Album.svelte {2, 18} showLineNumbers
<script>
	import AlbumTrack from './AlbumTrack.svelte'

	export let albumTitle
	export let albumTracks

	let playing

	function setPlaying(track) {
		playing = track
	}
</script>

<h2>{albumTitle}</h2>

<ul>
  {#each albumTracks as track}
    <AlbumTrack {setPlaying} {playing} {...track} />
  {/each}
</ul>
```

We're passing `setPlaying` to the child component so we can set the currently playing song and check if `currentlyPlaying` is equal to the current track.

The `<AlbumTrack />` component applies a `.playing` style using the `class:` directive based on what song is playing which is shorter than using a ternary inside an expression `class={playing === title ? 'playing' : ''}`.

```svelte:AlbumTrack.svelte {3, 4, 8, 15-17} showLineNumbers
<script>
	export let setPlaying
	export let playing
  export let title
	export let length
</script>

<li class:playing={playing === title}>
	<button on:click={() => setPlaying(title)}>▶️</button>
  <span>{title}</span>
	<span>🕒️ {length}</span>
</li>

<style>
	.playing {
		color: teal;
	}
</style>
```

We can also use a reactive statement `$: playing = playing === title` for `playing` and since it matches the class name we want to apply we can simplify the code and write `class:playing`.

```svelte:AlbumTrack.svelte {7, 10} showLineNumbers
<script>
	export let setPlaying
	export let playing
  export let title
	export let length

	$: playing = playing === title
</script>

<li class:playing>
	<button on:click={() => setPlaying(title)}>▶️</button>
  <span>{title}</span>
	<span>🕒️ {length}</span>
</li>

<style>
	.playing {
		color: teal;
	}
</style>
```

## Slots

**In Svelte we can use slots to compose components** meaning our components can contain other components and elements to be more reusable like regular HTML.

```svelte:Example.html showLineNumbers
<button>
	<span>Child</span>
</button>
```

The `<slot>` element lets us do that with components. If you're familiar with React this is similar to the `children` prop and Vue also has slots. We can provide a **fallback** if no content is provided.

```svelte:Button.svelte {2} showLineNumbers
<button>
  <slot>Placeholder</slot>
</button>

<style>
	button {
		color: teal;
	}
</style>
```

```svelte:App.svelte {2, 6} showLineNumbers
<script>
	import Button from './Button.svelte'
</script>

<Button>
  <span>Child</span>
</Button>

<Button />
```

You can use **named slots** for more control over the placement of elements. If you want multiple elements going into the same slot use the `<svelte:fragment>` element as the wrapper.

```svelte:Button.svelte {2-3} showLineNumbers
<button>
	<slot name="icon"></slot>
	<slot name="text"></slot>
</button>
```

```svelte:App.svelte {6-7, 11-12} showLineNumbers
<script>
	import Button from './Button.svelte'
</script>

<Button>
  <span slot="icon">➕</span>
	<span slot="text">Add</span>
</Button>

<Button>
  <span slot="icon">💩</span>
	<span slot="text">Delete</span>
</Button>
```

You might be asking when you'd use slots over regular components and the answer might be not often and that's fine.

Here's an example of slots and composition used in a real-world scenario in [Svelte Cubed](https://svelte-cubed.vercel.app/) that's a wrapper around [Three.js](https://threejs.org/) so you write less code because it's more declarative:

```svelte:Example.svelte
<script>
	import * as SC from 'svelte-cubed';
	import * as THREE from 'three';
</script>

<SC.Canvas>
	<SC.Mesh geometry={new THREE.BoxGeometry()} />
	<SC.PerspectiveCamera position={[1, 1, 3]} />
</SC.Canvas>
```

This is only a couple of lines of code compared to the equivalent Three.js code which has more than 20 lines of code and it's harder to read.

There's a lot more you can do with slot props but I encourage you to [read the slots documentation](https://svelte.dev/docs#template-syntax-slot) because slots deserve their separate post.

## Transitions

**Animations in Svelte are first-class** so you don't have to reach for an animation library unless you want to. To use transitions you can import `blur`, `fly`, `slide`, `scale`, `draw` and `crossfade` from `svelte/transition`.

To use a transition use `transition:fade`. You can specify parameters such as `delay`, `duration`, `easing` for `fade`. To learn what they are for each transition [consult the documentation](https://svelte.dev/docs#svelte_transition).

```svelte:App.svelte {2, 14} showLineNumbers
<script>
	import { fade } from 'svelte/transition'

	let showFade = false

	function toggleFade() {
		showFade = !showFade
	}
</script>

<button on:click={toggleFade}>Wax poetic</button>

{#if showFade}
	<blockquote transition:fade={{delay: 250, duration: 300}}>
		Memories fade, but friends are forever
	</blockquote>
{/if}
```

You can specify a enter animation with `in:fade` and exit animation with `out:fade` but you're not limited to one transition.

In Svelte you can define custom animations such as this [typewriter effect](https://learn.svelte.dev/tutorial/custom-js-transitions), use [spring and tweened motion](https://learn.svelte.dev/tutorial/tweens) and make smooth transitions between elements using [flip animations](https://learn.svelte.dev/tutorial/animate).

## Svelte Store

Passing data from parent to child component is described as **data flowing top to bottom** but Svelte lets you **reverse** the flow using **bindings**, **event forwarding** and the **context API** which you don't have to know right now because passing props is fine in most cases where you don't have deeply nested components.

However, one feature you're going to use all the time is the [Svelte store](https://svelte.dev/docs#run-time-svelte-store) which is Svelte's answer to **global state management**. You would reach for a store if you have **information that is required by multiple unrelated components** such as the logged in user or theme.

The Svelte store is just an object you can `subscribe` to for updates when the store value changes and `set` and `update` values. You can have `writable` stores to read and write to, `readable` stores if you don't want values to be set from the outside and `derived` stores if you want to use values from multiple stores.

(If you're trying this out in the Svelte REPL it's not obvious how to change the file extension but if you just type the file name such as `stores.js` it's going to change it.)

```js:stores.js showLineNumbers
import { writable } from 'svelte/store'

export let message = writable('Hello 👋')
```

You can use the reactive `$message` syntax to access the value. This also **subscribes and unsubscribes** to the store for you.

```svelte:Alert.svelte {2, 5, 9} showLineNumbers
<script>
	import { message } from './stores.js'

	function updateStore() {
		$message = 'Bye 👋'
	}
</script>

<p>{$message}</p>
<button on:click={updateStore}>Click</button>
```

You can create your own stores by implementing the [store contract](https://svelte.dev/docs#component-format-script-4-prefix-stores-with-$-to-access-their-values-store-contract). It must contain a `subscribe` method that's going to be a subscription function and return a `unsubscribe` function and it may include a `set` method to update the value.

Here's an example of a writable local storage store you can use to set and update a value in local storage.

```js:localStorageStore.js showLineNumbers
import { writable } from 'svelte/store'

export function localStorageStore(key, initial) {
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(initial))
  }

  let saved = JSON.parse(localStorage.getItem(key))
  let { subscribe, set, update } = writable(saved)

  return {
    subscribe,
    set: (value) => {
      localStorage.setItem(key, JSON.stringify(value))
      return set(value)
    },
    update
  }
}
```

```svelte:App.svelte showLineNumbers
<script>
import { localStorageStore } from './localStorageStore.js'

let message = localStorageStore('message', 'Hello 👋')

$message = 'Bye 👋'
</script>

{$message}
```

The Svelte store is incredibly powerful and deserves an entire post so I encourage you to go through the [Svelte tutorial](https://learn.svelte.dev/tutorial/writable-stores) and [consult the documentation](https://svelte.dev/docs#run-time-svelte-store) to learn more.

## Further Reading

Join me in the next post where we take what we learned to build a [Svelte todo app](https://joyofcode.xyz/svelte-todo-app) with animations and persistent storage 😍.

You're ready to build some Svelte apps! 👏 When you get more comfortable or encounter problems that require these solutions then you should learn and reach for them:

- [Lifecycle functions](https://learn.svelte.dev/tutorial/onmount)
- [Tick](https://svelte.dev/docs#run-time-svelte-tick)
- [Actions](https://learn.svelte.dev/tutorial/actions)
- [Event forwarding](https://learn.svelte.dev/tutorial/event-forwarding)
- [Context API](https://learn.svelte.dev/tutorial/context-api)
- [Module context](https://learn.svelte.dev/tutorial/sharing-code)
- [Special Elements](https://learn.svelte.dev/tutorial/svelte-self)
- [The @debug tag](https://learn.svelte.dev/tutorial/debug)

## Conclusion

Svelte is amazing for building all kinds of things and delivers a great developer and user experience.

I hope what stuck most is learning the concepts behind JavaScript frameworks because **if you understand JavaScript you can learn any JavaScript framework** and be productive quicker.

Thanks for reading! 🏄️
