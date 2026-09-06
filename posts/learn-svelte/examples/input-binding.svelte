<script lang="ts">
	let list = $state(['Angular', 'React', 'Solid', 'Svelte', 'Vue', 'Qwik'])
	let filteredList = $derived(
		list.filter((item) => item.toLowerCase().includes(search.toLowerCase()))
	)
	let search = $state('')
</script>

<div class="container">
	<input
		type="search"
		placeholder="Search"
		value={search}
		oninput={(e) => (search = (e.target as HTMLInputElement).value)}
	/>

	<ul>
		{#each filteredList as item}
			<li>{item}</li>
		{:else}
			<p>No results</p>
		{/each}
	</ul>
</div>

<style>
	.container {
		text-align: left;
	}

	input {
		color: #000;
		padding: 1rem;
		border-radius: 20px;
	}

	ul {
		margin-top: 2rem;
	}
</style>
