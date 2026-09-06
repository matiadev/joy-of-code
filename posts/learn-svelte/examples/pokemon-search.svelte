<script lang="ts">
	import { getAbortSignal } from 'svelte'

	let pokemon = $state('charizard')
	let image = $state('')

	async function getPokemon(pokemon: string) {
		const baseUrl = 'https://pokeapi.co/api/v2/pokemon'
		const response = await fetch(`${baseUrl}/${pokemon}`, {
			signal: getAbortSignal(),
		})
		if (!response.ok) throw new Error('💣️ oops!')
		return response.json()
	}

	$effect(() => {
		getPokemon(pokemon).then((data) => {
			image = data.sprites.front_default
		})
	})
</script>

<div class="container">
	<div>
		<input
			type="search"
			placeholder="Enter Pokemon name"
			oninput={(e) => (pokemon = (e.target as HTMLInputElement).value)}
		/>
		<img src={image} alt={pokemon} />
	</div>
</div>

<style>
	input {
		padding: 1rem;
		color: #000;
		border-radius: 20px;
	}

	img {
		width: 200px;
		margin-top: 1.5rem;
		image-rendering: pixelated;
	}
</style>
