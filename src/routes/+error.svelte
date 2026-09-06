<script lang="ts">
	import { page } from '$app/state'
</script>

<div class="grid h-full place-content-center">
	<h1 class="mt-16 text-center font-sans text-heading normal-case">
		{page.status}: {page?.error?.message}
	</h1>
</div>
