<script lang="ts">
	import { fade } from 'svelte/transition'
	import { Envelope } from '#lib/icons/index.js'

	let email = $state('')
	let error = $state('')
	let success = $state('')

	async function onsubmit(e: SubmitEvent) {
		e.preventDefault()

		const response = await fetch('/api/subscribe', {
			method: 'post',
			body: JSON.stringify(email),
			headers: { 'Content-Type': 'application/json' },
		})
		const subscribe = await response.json()

		if (subscribe.error) {
			success = ''
			error = subscribe.error
		}

		if (subscribe.success) {
			error = ''
			success = subscribe.success
		}
	}
</script>

<form
	{onsubmit}
	class="my-4 flex h-16 max-w-field rounded border border-input-border shadow-sm"
>
	<label for="email" class="sr-only">Enter your email</label>
	<input
		bind:value={email}
		type="email"
		id="email"
		name="email"
		placeholder="your@email.com"
		autocomplete="on"
		class="w-full flex-1 rounded-l bg-input p-6 placeholder:text-input-placeholder"
	/>
	<button
		type="submit"
		class="rounded-r bg-primary p-6 text-input-fg min-[860px]:flex min-[860px]:items-center min-[860px]:justify-center min-[860px]:gap-1"
	>
		<Envelope
			width={24}
			height={24}
			aria-hidden={true}
			class="hidden min-[860px]:block"
		/>
		<span class="text-base font-bold [text-box:trim-both_cap_alphabetic]"
			>Subscribe</span
		>
	</button>
</form>

<div class="mb-4 font-bold">
	{#if error}
		<span in:fade class="text-error">{error}</span>
	{/if}

	{#if success}
		<span in:fade class="text-primary">{success}</span>
	{/if}
</div>
