---
title: Learn Svelte By Making A Matching Game
description: Learn state management and reactivity in Svelte by making a matching game.
slug: svelte-matching-game
published: '2023-08-08'
category: svelte
---

<script lang="ts">
	import Embed from '#lib/components/embed.svelte'
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="w2q9caYXgkg" title="Learn Svelte By Making A Matching Game" />

## Table of Contents

## Matching Game Setup

You're going to make a fun matching game and learn more about state management and reactivity in Svelte.

<Embed src="https://stackblitz.com/github/joysofcode/svelte-matching-game?ctl=1&embed=1&file=src%2Froutes%2F%2Bpage.svelte&title=Svelte Matching Game" title="Svelte Matching Game" />

[Try the game](https://www.sveltelab.dev/23ecr9zxtm5juw2) in your browser (you might need to enable cookies) and you can also find the code on [GitHub](https://github.com/joysofcode/svelte-matching-game).

You can code along using [SvelteLab](https://www.sveltelab.dev/) in your browser, or [create a SvelteKit project](https://kit.svelte.dev/docs/creating-a-project) with TypeScript (optional).

Let's get the base styles out of the way by copying them over to `src/app.css`.

```css:src/app.css showLineNumbers
@import '@fontsource/poppins';

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

:root {
	--txt-1: hsl(220 10% 98%);
	--bg-1: hsl(220 20% 10%);
	--bg-2: hsl(220 20% 20%);
	--border: hsl(180 100% 50%);
	--pulse: hsl(9 100% 64%);
}

html,
body {
	height: 100%;
}

body {
	display: grid;
	place-content: center;
	padding: 2rem;
	font-family: 'Poppins', sans-serif;
	color: var(--txt-1);
	background-color: var(--bg-1);
}

h1 {
	font-size: 4rem;
	text-align: center;
	text-transform: capitalize;
}

h1 + button {
	width: max-content;
	margin-top: 2rem;
	margin-inline: auto;
	border: 4px solid var(--border);
}

button {
	padding: 1.5rem;
	font-size: 2rem;
	font-weight: 900;
	color: inherit;
	background: none;
	border-radius: 8px;
	border: none;
	text-transform: uppercase;
	cursor: pointer;
}
```

```svelte:src/routes/+layout.svelte showLineNumbers
<script lang="ts">
	import '../app.css'
</script>

<svelte:head>
	<title>Matching Game</title>
</svelte:head>

<slot />
```

I got the emoji from [Get Emoji](https://getemoji.com/) by selecting the ones I want and turning them into array I can copy with `.split(' ')`.

```ts:src/routes/emoji.ts showLineNumbers
export const emoji = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "🥲", "🥹", "☺️", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🥸", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😮‍💨", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🫣", "🤗", "🫡", "🤔", "🫢", "🤭", "🤫", "🤥", "😶", "😶‍🌫️", "😐", "😑", "😬", "🫨", "🫠", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "😵‍💫", "🫥", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "🤡", "💩", "👻", "💀", "☠️", "👽", "👾", "🤖", "🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾"]
```

The rest of the game is going to be inside `+page.svelte`.

```svelte:src/routes/+page.svelte showLineNumbers
<script lang="ts">
	import { emoji } from './emoji'
</script>
```

## State Management

You might reach for booleans but [you shouldn't use booleans to represent state](https://www.youtube.com/watch?v=4Lom_lqSGoY) if you want to avoid impossible states.

Before you write a line of code think about the possible states the game can be in:

- start (idle)
- playing
- paused
- won
- lost

Representing state with booleans would quickly become a nightmare, but using explicit state you always know what state you're in.

You can also have intermediatary state like `playing.matching` which becomes even more powerful when combined with data attributes for animations since you know the state you're in.

I'm going to translate this into code using a type alias but you can use a JavaScript object, or TypeScript enum.

```svelte:src/routes/+page.svelte showLineNumbers
<script lang="ts">
	import { emoji } from './emoji'

  type State = 'start' | 'playing' | 'paused' | 'won' | 'lost'

  let state: State = 'start'
</script>
```

This avoid spaghetti code and makes it easy to show and hide parts of the UI based on the state you're in.

## Creating The Game

I want to make a dynamic grid to offer more variety which is simpler than you might think.

I'm going to insert a random unique emoji inside a `Set` depending on the grid size, and then duplicate them and shuffle them around.

```svelte:src/routes/+page.svelte {7,8,10,26} showLineNumbers
<script lang="ts">
	import { emoji } from './emoji'

  type State = 'start' | 'playing' | 'paused' | 'won' | 'lost'

  let state: State = 'start'
	let size = 20
	let grid = createGrid()

  function createGrid() {
		// only want unique cards
		let cards = new Set<string>()
		// half because we duplicate the cards
		let maxSize = size / 2

		while (cards.size < maxSize) {
			// pick random emoji
			const randomIndex = Math.floor(Math.random() * emoji.length)
			cards.add(emoji[randomIndex])
		}

		// duplicate and shuffle cards
		return shuffle([...cards, ...cards])
	}

	function shuffle<Items>(array: Items[]) {
		return array.sort(() => Math.random() - 0.5)
	}
</script>
```

I'm going to add more things to track the state of the game including the HTML and card styles.

```svelte:src/routes/+page.svelte {11,13,15} showLineNumbers
<script lang="ts">
  type State = 'start' | 'playing' | 'paused' | 'won' | 'lost'

  // game state
  let state: State = 'start'
  // size of the game grid
	let size = 20
  // game grid
	let grid = createGrid()
  // used to check if game is over
	let maxMatches = grid.length / 2
  // selected cards
	let selected: number[] = []
  // matched cards
	let matches: string[] = []
</script>

{#if state === 'start'}
	<h1>Matching game</h1>
	<button on:click={() => state = 'playing'}>
    Play
  </button>
{/if}

{#if state === 'playing'}
	<div class="cards">
		{#each grid as card, cardIndex}
			<button class="card">
				<div>{card}</div>
			</button>
		{/each}
	</div>
{/if}

{#if state === 'lost'}
	<h1>You lost! 💩</h1>
	<button on:click={() => state = 'playing'}>
    Play again
  </button>
{/if}

{#if state === 'won'}
	<h1>You win! 🎉</h1>
	<button on:click={() => state = 'playing'}>
    Play again
  </button>
{/if}

<style>
	.cards {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.4rem;
	}

	.card {
		height: 140px;
		width: 140px;
		font-size: 4rem;
		background-color: var(--bg-2);

		&.selected {
			border: 4px solid var(--border);
		}
	}
</style>
```

## Matching Cards

Using `selected` we can keep track of the selected variables and trigger `matchCards()` using [reactive statements](https://learn.svelte.dev/tutorial/reactive-statements) when `selected.length === 2`.

If the cards match we can update `matches` and if `maxMatches === matches.length` then the game is won.

```svelte:src/routes/+page.svelte {3,7,19,23,24,30-32,36-38,40,47} showLineNumbers
<script lang="ts">
	// ...
	function selectCard(cardIndex: number) {
		selected = selected.concat(cardIndex)
	}

	function matchCards() {
		// array destructuring can have any name for the values
		const [first, second] = selected

		if (grid[first] === grid[second]) {
			matches = matches.concat(grid[first])
		}

		// clear selected
		setTimeout(() => selected = [], 300)
	}

	function gameWon() {
		state = 'won'
	}

	$: selected.length === 2 && matchCards()
	$: maxMatches === matches.length && gameWon()
</script>

{#if state === 'playing'}
	<div class="cards">
		{#each grid as card, cardIndex}
			{@const isSelected = selected.includes(cardIndex)}
			{@const isSelectedOrMatch = selected.includes(cardIndex) || matches.includes(card)}
			{@const match = matches.includes(card)}

			<button
				class="card"
				class:selected={isSelected}
				disabled={isSelectedOrMatch}
				on:click={() => selectCard(cardIndex)}
			>
				<div class:match>{card}</div>
			</button>
		{/each}
	</div>
{/if}

<style>
	.card {
		/* ... */
		& .match {
			transition: opacity 0.3s ease-out;
			opacity: 0.4;
		}
	}
</style>
```

[Local constants](https://svelte.dev/docs/special-tags#const) are great because they let us define variables inside of an `each` block.

Let's show the matched cards.

```svelte:src/routes/+page.svelte showLineNumbers
{#if state === 'playing'}
	<div class="matches">
		{#each matches as match}
			<div>{match}</div>
		{/each}
	</div>
	<!-- .. -->
{/if}

<style>
	/* ... */
	.matches {
		display: flex;
		gap: 1rem;
		margin-block: 2rem;
		font-size: 3rem;
	}
</style>
```

## Game Timer

Let's add a game timer — when it reaches zero, the game is over.

```svelte:src/routes/+page.svelte {3-4,7,14,21,24,28-30,36-49} showLineNumbers
<script lang="ts">
	// ...
	let timerId: number | null = null
	let time = 60

	// ...
	function startGameTimer() {
		function countdown() {
			state !== 'paused' && (time -= 1)
		}
		timerId = setInterval(countdown, 1000)
	}

	function gameLost() {
		state = 'lost'
	}

	// ...
	$: if (state === 'playing') {
		//	in case you pause the game
		!timerId && startGameTimer()
	}

	$: time === 0 && gameLost()
</script>

{#if state === 'playing'}
	<h1 class="timer" class:pulse={time <= 10}>
		{time}
	</h1>
	<!-- .. -->
{/if}

<style>
	/* ... */
	.timer {
		transition: color 0.3s ease;
	}

	.pulse {
		color: var(--pulse);
		animation: pulse 1s infinite ease;
	}

	@keyframes pulse {
		to {
			scale: 1.4;
		}
	}
</style>
```

## Game Reset

Regardless if you win or lose the game we have to reset the board.

```svelte:src/routes/+page.svelte {3-11,15,20} showLineNumbers
<script lang="ts">
	// ...
	function resetGame() {
		timerId && clearInterval(timerId)
		grid = createGrid()
		maxMatches = grid.length / 2
		selected = []
		matches = []
		timerId = null
		time = 60
	}

	function gameWon() {
		state = 'won'
		resetGame()
	}

	function gameLost() {
		state = 'lost'
		resetGame()
	}
</script>
```

## Card Flip Effect

To achieve the card flip animation we can use a CSS 3D transform.

```svelte:src/routes/+page.svelte {4,8,19-20,26-29,31-38} showLineNumbers
<button
	class="card"
	class:selected={isSelected}
	class:flip={isSelectedOrMatch}
	disabled={isSelectedOrMatch}
	on:click={() => selectCard(cardIndex)}
>
	<div class="back" class:match>
		{card}
	</div>
</button>

<style>
	.card {
		height: 140px;
		width: 140px;
		font-size: 4rem;
		background-color: var(--bg-2);
		transition: rotate 0.3s ease-out;
		transform-style: preserve-3d;

		&.selected {
			border: 4px solid var(--border);
		}

		&.flip {
			rotate: y 180deg;
			pointer-events: none;
		}

		& .back {
			position: absolute;
			inset: 0;
			display: grid;
			place-content: center;
			backface-visibility: hidden;
			rotate: y 180deg;
		}

		& .match {
			transition: opacity 0.3s ease-out;
			opacity: 0.4;
		}
	}
</style>
```

## Pausing The Game

To pause the game we can listen for a keypress on the window and toggle the paused state.

```svelte:src/routes/+page.svelte {3-14,17,19-21} showLineNumbers
<script lang="ts">
	// ...
	function pauseGame(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			switch (state) {
				case 'playing':
					state = 'paused'
					break
				case 'paused':
					state = 'playing'
					break
			}
		}
	}
</script>

<svelte:window on:keydown={pauseGame} />

{#if state === 'paused'}
	<h1>Game paused</h1>
{/if}
```

The game timer is already paused because it only does a tick if the game isn't in the `paused` state.

That's it! 🎉

As an exercise try breaking the game into separate components and you could add difficulty levels for the player to choose from.

Hope you had as much fun making the game as I have and learned something along the way.
