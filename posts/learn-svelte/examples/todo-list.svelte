<script lang="ts">
	import { slide } from 'svelte/transition'

	type Todo = { id: string; text: string; completed: boolean }
	type Filter = 'all' | 'active' | 'completed'

	let todo = $state('')
	let todos = $state<Todo[]>([])
	let filter = $state<Filter>('all')
	let filteredTodos = $derived(filterTodos())
	let remaining = $derived(remainingTodos())

	function addTodo(e: SubmitEvent) {
		e.preventDefault()
		todos.push({
			id: crypto.randomUUID(),
			text: todo,
			completed: false,
		})
		todo = ''
	}

	function removeTodo(todo: Todo) {
		todos = todos.filter((t) => t.id !== todo.id)
	}

	function filterTodos() {
		return todos.filter((todo) => {
			if (filter === 'all') return true
			if (filter === 'active') return !todo.completed
			if (filter === 'completed') return todo.completed
		})
	}

	function setFilter(newFilter: Filter) {
		filter = newFilter
	}

	function remainingTodos() {
		return todos.filter((todo) => !todo.completed).length
	}

	function clearCompleted() {
		todos = todos.filter((todo) => !todo.completed)
	}
</script>

<div class="container">
	<form onsubmit={addTodo}>
		<input type="text" bind:value={todo} placeholder="Add todo" />
	</form>

	<ul>
		{#each filteredTodos as todo (todo.id)}
			<li transition:slide>
				<input type="checkbox" bind:checked={todo.completed} />
				<input type="text" bind:value={todo.text} />
				<button onclick={() => removeTodo(todo)}>🗙</button>
			</li>
		{/each}
	</ul>

	<div>
		<p>{remaining} {remaining === 1 ? 'item' : 'items'} left</p>

		{#each ['all', 'active', 'completed'] as const as filter}
			<button onclick={() => setFilter(filter)}>{filter}</button>
		{/each}

		<button onclick={clearCompleted}>Clear completed</button>
	</div>
</div>

<style>
	.container {
		text-align: left;
	}

	ul {
		margin-block: 1.5rem;
	}

	ul li::before {
		content: '';
	}

	input {
		padding: 1rem;
		color: #000;
		border-radius: 20px;
	}
</style>
