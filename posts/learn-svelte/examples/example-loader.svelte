<script lang="ts">
	import { fade } from 'svelte/transition'
	import type { Component as SvelteComponent } from 'svelte'

	let { name } = $props()
	let status = $state<'load' | 'loaded'>('load')
	let Component = $state<SvelteComponent>(null)

	// @ts-ignore
	const modules = import.meta.glob('./*.svelte')

	async function load() {
		const module = modules[`./${name}.svelte`]
		if (module) {
			Component = (await module()).default
			status = 'loaded'
		} else {
			console.error(`${name}.svelte not found`)
		}
	}
</script>

<svelte:head>
	<script
		src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"
	></script>
	<script
		src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/Flip.min.js"
	></script>
</svelte:head>

<div class="example">
	{#if status === 'load'}
		<div class="container">
			<button onclick={load}>Show example</button>
		</div>
	{:else}
		<div class="content" transition:fade>
			<Component />
		</div>
	{/if}
</div>

<style>
	.example {
		accent-color: orangered;

		height: 400px;
		margin-bottom: 2rem;
		background: linear-gradient(hsl(226 19% 13%), hsl(226 19% 16%));
		border-radius: 20px;
		text-align: center;
		box-shadow: var(--shadow-md);
		overflow: hidden auto;

		.content {
			height: 100%;
		}

		:global {
			.container {
				height: 100%;
				display: grid;
				place-content: center;
				padding: 1.5rem;
			}

			button {
				padding: 1rem;
				border: 4px solid var(--color-primary);
				border-radius: 20px;
				text-transform: capitalize;
				transition: scale 0.15s ease-out;

				&:active {
					scale: 0.9;
				}
			}
		}
	}
</style>
