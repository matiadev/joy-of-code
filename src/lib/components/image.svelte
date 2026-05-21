<script lang="ts">
	import { page } from '$app/state'
	import { building, dev } from '$app/environment'
	import { imagesLocal, imagesUrl } from '$lib/site/config'

	type Props = {
		alt: string
		src: string
		slug: string
	}

	let { src, alt }: Props = $props()

	const images = building || !dev ? imagesUrl : imagesLocal
	const slug = page.params.slug
</script>

<img src="{images}/{slug}/images/{src}" {alt} loading="lazy" />
