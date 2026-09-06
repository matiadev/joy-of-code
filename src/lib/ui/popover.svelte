<script lang="ts">
	import type { Snippet } from 'svelte'

	type Props = {
		id: string
		label: string
		title: string
		trigger: Snippet
		children: Snippet
		panelClass?: string
		panel?: HTMLDivElement | null
		open?: boolean
	}

	let {
		id,
		label,
		title,
		trigger,
		children,
		panelClass = '',
		panel = $bindable(null),
		open = $bindable(false),
	}: Props = $props()

	function handleToggle(e: ToggleEvent) {
		open = e.newState === 'open'
	}

	function handleClick(e: MouseEvent) {
		if ((e.target as HTMLElement).closest('a')) {
			panel?.hidePopover()
		}
	}
</script>

<button
	popovertarget={id}
	aria-expanded={open}
	aria-controls={id}
	aria-label={label}
>
	{@render trigger()}
</button>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	{id}
	class="popover {panelClass}"
	popover="auto"
	bind:this={panel}
	ontoggle={handleToggle}
	onclick={handleClick}
>
	<div class="popover-arrow" aria-hidden="true"></div>
	<span class="popover-title">{title}</span>
	{@render children()}
</div>
