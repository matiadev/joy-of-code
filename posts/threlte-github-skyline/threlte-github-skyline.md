---
title: Visualize GitHub Contributions In 3D With Svelte
description: Learn how to use Threlte to make a 3D visualization of your GitHub contributions.
slug: threlte-github-skyline
published: '2023-08-30'
category: svelte
---

<script lang="ts">
	import Embed from '#lib/components/embed.svelte'
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="f9fd1L1FEts" title="Visualize GitHub Contributions In 3D With Svelte" />

## Table of Contents

## GitHub Skyline

In this post I'm going to show you how to visualize your GitHub contributions graph in 3D using [Threlte](https://threlte.xyz/) inspired by [GitHub Skyline](https://skyline.github.com/).

<Embed src="https://stackblitz.com/github/joysofcode/github-skyline?ctl=1&embed=1&file=src%2Froutes%2F%2Bpage.svelte&title=GitHub Skyline" title="GitHub Skyline" />

You can find the code on [GitHub](https://github.com/joysofcode/github-skyline).

## Project Setup

The easiest way to get started is using the Threlte CLI which is going to scaffold a regular SvelteKit project with Threlte.

```shell:terminal showLineNumbers
npm create threlte
```

Select the `@threlte/extras` optional package for some helpful utilities. The Threlte CLI is also going to install `three` and `@types/three` because it uses [Three.js](https://threejs.org/).

Install the dependencies with `npm i` if you skipped it during the setup and start the development server with `npm run dev`.

I'm going to start from scratch and remove everything inside `lib` and `routes`.

## Scene Setup

Inside `routes/+page.svelte` I'm going to set up a 3D scene.

```svelte:src/routes/+page.svelte showLineNumbers
<script lang="ts">
	import { Canvas } from '@threlte/core'
	import Scene from './scene.svelte'
</script>

<div class="scene">
	<Canvas>
		<Scene />
	</Canvas>
</div>

<style>
	.scene {
		position: absolute;
		inset: 0;
		background-color: hsl(200 10% 10%);
	}
</style>
```

## The API

You don't have to read it but in another post on [using SvelteKit for web scraping](https://joyofcode.xyz/sveltekit-web-scraping) we created a [GitHub contributions API](https://gh-contributions-api.vercel.app/) for this exact purpose.

<YouTube id="T-lBPpeokfY" title="SvelteKit Web Scraping" />

Here is the [GitHub repository](https://github.com/mattcroat/github-contributions-api) which you can host yourself in case the API ever goes down, or create an API endpoint in SvelteKit and copy the code.

## Showing The Contributions

I want to get the types out of the way, which you can ignore if you're not using TypeScript.

```ts:src/lib/types.ts showLineNumbers
type Day = {
	count: number
	day: number
	level: number
	month: string
	name: string
	year: number
}

export type Contributions = Array<Day | null>
```

I'm going to fetch the data on the client because there's no need for server-side rendering.

```svelte:src/routes/scene.svelte showLineNumbers
<script lang="ts">
	import { onMount } from 'svelte'
	import type { Contributions } from '$lib/types'

	let contributions: Contributions[] = []

	onMount(async () => {
		const response = await fetch('https://gh-contributions-api.vercel.app/mattcroat/2022')
		contributions = await response.json()
	})
</script>
```

I'm going to add a grid, camera, lights, and iterate over the contribution rows to render a cube for each day.

Everything in Threlte extends Three.js from the `<T>` component.

```svelte:src/routes/scene.svelte {3,4} showLineNumbers
<script lang="ts">
	import { onMount } from 'svelte'
  import { T } from '@threlte/core'
	import { Align, Grid, OrbitControls } from '@threlte/extras'
	import type { Contributions } from '$lib/types'

	let contributions: Contributions[] = []

	onMount(async () => {
		const response = await fetch('https://gh-contributions-api.vercel.app/mattcroat/2022')
		contributions = await response.json()
	})
</script>

<Grid
	infiniteGrid
	sectionColor="#4a4b4a"
	sectionSize={20}
	cellSize={20}
	fadeDistance={400}
/>

<T.PerspectiveCamera makeDefault position={[10, 100, 100]} fov={60}>
	<OrbitControls enableDamping autoRotate />
</T.PerspectiveCamera>

<T.AmbientLight color="#fff" intensity={0.4} />
<T.DirectionalLight position={[0, 200, 200]} intensity={2} color="#fff" />
<T.DirectionalLight position={[0, 200, -200]} color="#fff" intensity={2} />

<Align auto position.y={100}>
	{#each contributions as row, i}
		{#each row as day, j}
			{#if day}
				<T.Group position={[0, 0, 12 * i]}>
					<T.Mesh position={[12 * j, day.count / 2, 0]}>
						<T.BoxGeometry args={[10, day.count, 10]} />
						<T.MeshStandardMaterial color="#fff" />
					</T.Mesh>
				</T.Group>
			{/if}
		{/each}
	{/each}
</Align>
```

## Changing The Colors

Right now the cubes are white, but I'm going to create a `getColor()` function to get the color based on the day level from the API.

```svelte:src/routes/scene.svelte {23,28} showLineNumbers
<script lang="ts">
	function getColor(level: number) {
		switch (level) {
			case 0:
				return '#0e0e0e'
			case 1:
				return '#00442a'
			case 2:
				return '#006d35'
			case 3:
				return '#00a648'
			case 4:
				return '#00d35c'
		}
	}
</script>

<!-- ... -->
<Align auto position.y={40}>
	{#each contributions as row, i}
		{#each row as day, j}
			{#if day}
				{@const color = getColor(day.level)}

				<T.Group position={[0, 0, 12 * i]}>
					<T.Mesh position={[12 * j, y / 2, 0]}>
						<T.BoxGeometry args={[10, y, 10]} />
						<T.MeshStandardMaterial {color} />
					</T.Mesh>
				</T.Group>
			{/if}
		{/each}
	{/each}
</Align>
```

## Make It Look More Interesting

I want to make the visualization more interesting by having a base height for the contributions, multiply the existing height for more visual interest, and set a limit for the height.

```svelte:src/routes/scene.svelte {20,23,24} showLineNumbers
<script lang="ts">
	function normalize(count: number, base = 4, offset = 2) {
		switch (true) {
			case count === 0:
				return base
			case count > 40:
				return count
			default:
				return count * (base + offset)
		}
	}
</script>

<!-- ... -->
<Align auto position.y={40}>
	{#each contributions as row, i}
		{#each row as day, j}
			{#if day}
				{@const color = getColor(day.level)}
				{@const y = normalize(day.count)}

				<T.Group position={[0, 0, 12 * i]}>
					<T.Mesh position={[12 * j, y / 2, 0]}>
						<T.BoxGeometry args={[10, y, 10]} />
						<T.MeshStandardMaterial color={getColor(day.level)} />
					</T.Mesh>
				</T.Group>
			{/if}
		{/each}
	{/each}
</Align>
```

## Animating The Contributions

To animate the cube height we can use the `tweened` store from Svelte and interpolate the `scale.y` value from 0 to 1.

If you try and set the scale on the mesh itself it's going to scale from the center, and for that reason we set it on the group.

```svelte:src/routes/scene.svelte {3,4,9,11-13,24} showLineNumbers
<script lang="ts">
	import { onMount } from 'svelte'
	import { tweened } from 'svelte/motion'
	import { quadInOut } from 'svelte/easing'
	import { T } from '@threlte/core'
	import { Align, Grid, OrbitControls } from '@threlte/extras'
	import type { Contributions } from '$lib/types'

	const scaleY = tweened(0, { duration: 2000, easing: quadInOut })

	onMount(() => {
		$scaleY = 1
	})
</script>

<!-- ... -->
<Align auto position.y={40}>
	{#each contributions as row, i}
		{#each row as day, j}
			{#if day}
				{@const color = getColor(day.level)}
				{@const y = normalize(day.count)}

				<T.Group position={[0, 0, 12 * i]} scale.y={$scaleY}>
					<T.Mesh position={[12 * j, y / 2, 0]}>
						<T.BoxGeometry args={[10, y, 10]} />
						<T.MeshStandardMaterial color={getColor(day.level)} />
					</T.Mesh>
				</T.Group>
			{/if}
		{/each}
	{/each}
</Align>
```

That's it! 🎉
