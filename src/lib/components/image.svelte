<script lang="ts">
	import { page } from '$app/state'
	import { imagesLocal, imagesUrl } from '$lib/site/config'

	type Props = {
		alt: string
		src: string
		slug: string
	}

	let { src, alt }: Props = $props()

	const images = import.meta.env.DEV ? imagesLocal : imagesUrl
	const slug = page.params.slug
</script>

<img src="{images}/{slug}/images/{src}" {alt} loading="lazy" />
