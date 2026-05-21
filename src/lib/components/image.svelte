<script lang="ts">
	import { page } from '$app/state'
	import { dev } from '$app/environment'
	import { imagesLocal, imagesUrl } from '$lib/site/config'

	type Props = {
		alt: string
		src: string
		slug: string
	}

	let { src, alt }: Props = $props()

	// TODO: figure out why doesn't work in Vercel
	// const images = dev ? imagesLocal : imagesUrl
	const images = imagesUrl
	const slug = page.params.slug
</script>

<img src="{images}/{slug}/images/{src}" {alt} loading="lazy" />
