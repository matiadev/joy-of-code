<script lang="ts">
	import { getAbortSignal } from 'svelte'
	import { SvelteMap } from 'svelte/reactivity'

	let name = $state('')

	const pokemon = new SvelteMap<string, unknown>()

	async function getPokemon() {
		if (!name || pokemon.has(name)) return

		const baseUrl = 'https://pokeapi.co/api/v2/pokemon'
		const response = await fetch(`${baseUrl}/${name}`, {
			signal: getAbortSignal(),
		})
		if (!response.ok) throw new Error('💣️ oops!')
		const data = await response.json()

		pokemon.set(name, data)
	}

	$effect(() => {
		getPokemon()
	})
</script>

<div class="container">
	<div style:width="400px">
		<input type="search" bind:value={name} placeholder="Enter Pokemon name" />

		<div class="pokemon">
			{#each pokemon as [name, details]}
				<details>
					<summary>{name}</summary>
					<div class="data">
						<pre>{JSON.stringify(details, null, 2)}</pre>
					</div>
				</details>
			{/each}
		</div>

		<button onclick={() => pokemon.clear()}>🧹 Clear</button>
	</div>
</div>

<style>
	.container {
		text-align: left;
	}

	input,
	button {
		width: 100%;
	}

	input {
		margin-bottom: 2rem;
		padding: 1rem;
		color: #000;
		border-radius: 20px;
	}

	summary {
		text-transform: capitalize;
	}

	details {
		overflow: hidden;
		margin-bottom: 2rem;

		.data {
			height: 200px;
		}
	}
</style>
