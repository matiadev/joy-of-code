<script lang="ts">
	import { ArrowRight, PencilSquare, Heart } from '$lib/icons'

	interface Props {
		preset: 'support' | 'edit'
		editUrl?: string
	}

	let { preset, editUrl = '' }: Props = $props()
</script>

{#if preset === 'support'}
	<div class="card">
		<div class="decorative">
			<Heart width={24} height={24} aria-hidden={true} />
		</div>
		<span class="title">Support</span>
		<p class="text">
			You can <a
				href="https://www.youtube.com/@JoyofCodeDev?sub_confirmation=1"
			>
				subscribe on YouTube
			</a>, or consider becoming a patron if you want to support my work.
		</p>
		<a
			class="link"
			href="https://www.patreon.com/joyofcode"
			target="_blank"
			rel="noreferrer"
		>
			<span>Patreon</span>
			<ArrowRight width={24} height={24} aria-hidden={true} />
		</a>
	</div>
{/if}

{#if preset === 'edit'}
	<div class="card">
		<div class="decorative">
			<PencilSquare width={24} height={24} aria-hidden={true} />
		</div>
		<span class="title">Found a mistake?</span>
		<p class="text">
			Every post is a Markdown file so contributing is simple as following the
			link below and pressing the pencil icon inside GitHub to edit it.
		</p>
		<a class="link" href={editUrl} target="_blank" rel="noreferrer">
			<span>Edit on GitHub</span>
			<ArrowRight width={24} height={24} aria-hidden={true} />
		</a>
	</div>
{/if}

<style>
	.card {
		position: relative;
		padding: var(--spacing-32);
		border: 4px solid var(--clr-primary);
		border-radius: var(--rounded-20);

		.decorative {
			display: grid;
			place-content: center;
			width: 48px;
			height: 48px;
			position: absolute;
			top: 0;
			left: 0;
			transform: translateX(-50%) translateY(-50%);
			border-radius: 50%;
			background-color: var(--clr-bg);

			:global(svg) {
				color: var(--clr-primary);
			}
		}

		.title {
			font-size: var(--font-24);
			font-weight: 700;
			line-height: 32px;
		}

		.text {
			color: var(--clr-card-txt);
			margin-top: var(--spacing-8);
			margin-bottom: var(--spacing-32);

			a {
				text-decoration: underline;
			}
		}

		.link {
			width: max-content;
			display: flex;
			gap: var(--spacing-16);
		}

		:global(form) {
			margin: var(--spacing-16) 0;
			background: red;
		}
	}
</style>
