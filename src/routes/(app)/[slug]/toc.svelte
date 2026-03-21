<script lang="ts">
	import { onMount } from 'svelte'
	import { fly } from 'svelte/transition'
	import { ChevronDoubleLeft, ChevronDoubleRight } from '$lib/icons'

	type TableOfContentsItem = {
		active: boolean
		title: string
		href: string
	}

	const TABLE_OF_CONTENTS = '#table-of-contents + ul'

	let tableOfContents = $state<TableOfContentsItem[]>([])
	let showSidebar = $state(false)

	onMount(() => {
		const toc = document.querySelector(TABLE_OF_CONTENTS) as HTMLUListElement
		if (!toc) return

		tableOfContents = [...toc.querySelectorAll('a')].map((a, i) => ({
			title: a.textContent!,
			href: a.getAttribute('href')!,
			active: false,
		}))

		if (window.innerWidth >= 1440) {
			const observer = new IntersectionObserver(([entry]) => {
				showSidebar = entry.boundingClientRect.bottom < 0
			})
			observer.observe(toc)
			return () => observer.unobserve(toc)
		}
	})

	onMount(() => {
		const headings = document.querySelectorAll('h2')
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					tableOfContents.forEach((i) => (i.active = false))
					const title = entry.target.textContent
					const index = tableOfContents.findIndex((i) => i.title === title)
					if (index >= 0) tableOfContents[index].active = true
				}
			},
			{
				rootMargin: '0px 0px -90% 0px',
			}
		)
		headings.forEach((heading) => observer.observe(heading))
		return () => observer.disconnect()
	})

	function toggleSidebar() {
		showSidebar = !showSidebar
	}
</script>

{#if tableOfContents}
	<aside>
		<section>
			{#if showSidebar}
				<div
					transition:fly={{ x: '100%', duration: 300 }}
					class="table-of-contents"
				>
					<button onclick={toggleSidebar} aria-label="Hide table of contents">
						<ChevronDoubleRight width={24} height={24} aria-hidden={true} />
						<h2 class="table-of-contents-title">Sections</h2>
					</button>

					<ul>
						{#each tableOfContents as { active, title, href }}
							<li>
								<a {href} data-active={active}>{title}</a>
							</li>
						{/each}
					</ul>
				</div>
			{:else}
				<button
					in:fly={{ x: '100%', duration: 300, delay: 300 }}
					onclick={toggleSidebar}
					class="sidebar-toggle"
					aria-label="Show table of contents"
				>
					<ChevronDoubleLeft width={24} height={24} aria-hidden={true} />
				</button>
			{/if}
		</section>
	</aside>
{/if}

<style>
	aside {
		max-width: 400px;
		position: fixed;
		top: 50%;
		right: 8px;
		translate: 0% -50%;
		z-index: 10;
	}

	.sidebar-toggle,
	.table-of-contents {
		padding: var(--spacing-16);
		background-color: var(--clr-bg);
		border-top: 1px solid var(--clr-menu-border);
		border-left: 1px solid var(--clr-menu-border);
		border-radius: var(--rounded-20);
		box-shadow: var(--shadow-sm);
	}

	.table-of-contents {
		counter-reset: section;

		button {
			padding-block: var(--spacing-8);
			display: flex;
			align-items: center;
			gap: var(--spacing-4);
		}

		ul {
			max-height: 400px;
			padding: var(--spacing-4);
			overflow-y: auto;
			scrollbar-width: thin;
		}

		li {
			padding-block: var(--spacing-16);
			font-size: var(--font-18);

			&:not(:last-of-type) {
				border-bottom: 0.5px solid var(--clr-menu-border);
			}
		}

		a {
			display: inline-block;
			font-weight: 400;

			&[data-active='true'] {
				color: var(--clr-primary);
			}

			&::before {
				all: unset;
				counter-increment: section;
				content: counter(section) '. ';
			}
		}
	}

	.table-of-contents-title {
		font-size: var(--font-24);
	}

	:global {
		[data-theme='🌛 Night'] .table-of-contents a {
			--color: hsl(0 0% 80%);
		}

		[data-theme='☀️ Daylight'] .table-of-contents a {
			--color: hsl(0 0% 40%);
		}

		[data-theme='🧠 Night Mind'] .table-of-contents a {
			--color: hsl(280 20% 80%);
		}
	}
</style>
