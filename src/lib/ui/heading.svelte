<script lang="ts">
	let props = $props()
</script>

<h1 class="my-16 text-center text-primary text-display min-[860px]:my-32">
	{@render props.children?.()}
</h1>
