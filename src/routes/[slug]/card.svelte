<script lang="ts">
	import { ArrowRight, PencilSquare, Heart } from '#lib/icons/index.js'

	interface Props {
		preset: 'support' | 'edit'
		editUrl?: string
	}

	let { preset, editUrl = '' }: Props = $props()

	const presets = {
		support: {
			Icon: Heart,
			title: 'Support',
			text: 'You can support my work on Patreon.',
			cta: 'Patreon',
		},
		edit: {
			Icon: PencilSquare,
			title: 'Found a mistake?',
			text: 'Every post is a Markdown file so contributing is simple as following the link below and pressing the pencil icon inside GitHub to edit it.',
			cta: 'Edit on GitHub',
		},
	} as const

	let card = $derived(presets[preset])
	let link = $derived(
		preset === 'edit' ? editUrl : 'https://www.patreon.com/joyofcode'
	)
</script>

<div class="relative rounded-2xl border-4 border-primary p-8">
	<div
		class="absolute top-0 left-0 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-content-center rounded-full bg-base text-primary"
	>
		<card.Icon width={24} height={24} aria-hidden={true} />
	</div>
	<span class="text-title font-bold">{card.title}</span>
	<p class="mt-2 mb-8 text-card-fg">{card.text}</p>
	<a class="flex w-max gap-4" href={link} target="_blank" rel="noreferrer">
		<span>{card.cta}</span>
		<ArrowRight width={24} height={24} aria-hidden={true} />
	</a>
</div>
