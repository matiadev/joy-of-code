---
title: List Of Svelte UI Libraries
description: I tried every Svelte UI library, so you don't have to.
slug: svelte-ui-libraries
published: '2022-12-11'
category: svelte
---

<script lang="ts">
	import YouTube from '#lib/components/youtube.svelte'
</script>

<YouTube id="qyG-xWjNZKU" title="List Of Svelte UI Libraries" />

## Table of Contents

## Headless Libraries

These Svelte UI libraries don't provide ready to use components, but provide the logic and accessibility for you to create your own components, where you have complete control over the styling.

[Melt UI](https://melt-ui.com/) is a low level API for creating your own components. It's probably my favorite, but it can be intense if you need a quick, and simple component. Their code examples provide regular CSS styles and Tailwind CSS versions you can use.

```svelte:example.svelte showLineNumbers
<script lang="ts">
	import { createSelect, melt } from '@melt-ui/svelte'

	const fruits = [
		{ value: '🍎', label: 'Apple' },
		{ value: '🍌', label: 'Banana' },
		{ value: '🍊', label: 'Orange' },
		{ value: '🍐', label: 'Pear' },
	]

	const {
		elements: { trigger, menu, option },
		states: { selectedLabel, open },
	} = createSelect()
</script>

<div>
	<button use:melt={$trigger}>
		{$selectedLabel || 'Select a fruit'}
	</button>

	{#if $open}
		<div use:melt={$menu}>
			{#each fruits as fruit}
				<div use:melt={$option({ ...fruit })}>
					{fruit.value}
				</div>
			{/each}
		</div>
	{/if}
</div>
```

[Bits UI](https://www.bits-ui.com/) uses Melt UI as the base, so it's accessible, customizable, and includes a lot of components. It's simple to use, and you can use regular CSS, or Tailwind CSS to style the components.

```svelte:example.svelte showLineNumbers
<script lang="ts">
	import { Select } from 'bits-ui'

	const fruits = [
		{ value: '🍎', label: 'Apple' },
		{ value: '🍌', label: 'Banana' },
		{ value: '🍊', label: 'Orange' },
		{ value: '🍐', label: 'Pear' },
	]
</script>

<Select.Root items={fruits}>
	<Select.Trigger>
		<Select.Value placeholder="Select a fruit" />
	</Select.Trigger>

	<Select.Content>
		{#each fruits as fruit}
			<Select.Item value={fruit.value} label={fruit.label}>
				{fruit.label}
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
```

## Tailwind CSS Libraries

These Svelte UI libraries use the utility-first CSS framework [Tailwind](https://tailwindcss.com/) for styling, and provide functional, and accessible components.

[Skeleton UI](https://www.skeleton.dev/) is a UI toolkit for Svelte that comes with premade components and utilities. It has great docs, themes, including a theme generator, and a Figma design kit. I would love to see more component variety.

```svelte:example.svelte showLineNumbers
<script lang="ts">
	import { AppShell } from '@skeletonlabs/skeleton'
</script>

<AppShell>
	<svelte:fragment slot="header">Header</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">Sidebar Left</svelte:fragment>
	<slot />
	<svelte:fragment slot="pageFooter">Page Footer</svelte:fragment>
</AppShell>
```

[Flowbite Svelte](https://flowbite-svelte.com/) is opinionated but customizable, has great docs, RTL support, and comes with a lot of easy to use components. Some components seem to use native elements making the design look less cohesive, but it's simple to use.

```svelte:example.svelte showLineNumbers
<script lang="ts">
	import { Select, Label } from 'flowbite-svelte'

	let selected: string

	const fruits = [
		{ value: '🍎', name: 'Apple' },
		{ value: '🍌', name: 'Banana' },
		{ value: '🍊', name: 'Orange' },
		{ value: '🍐', name: 'Pear' },
	]
</script>

<Label>
	Select a fruit
	<Select items={fruits} bind:value={selected} />
</Label>
```

[shadcn-svelte](https://www.shadcn-svelte.com/) is an unofficial Svelte port of [shadcn/ui](https://ui.shadcn.com/) and it's unlike any other UI library because it's not a library, but a collection of reusable components that you can copy and paste, or use the CLI to add to your apps, where the styles are separate from the implementation which is genius but some people raise valid concerns about updates.

```svelte:example.svelte showLineNumbers
<script lang="ts">
	import * as Select from '$lib/components/ui/select'

	const fruits = [
		{ value: '🍎', label: 'Apple' },
		{ value: '🍌', label: 'Banana' },
		{ value: '🍊', label: 'Orange' },
		{ value: '🍐', label: 'Pear' },
	]
</script>

<Select.Root>
	<Select.Trigger>
		<Select.Value placeholder="Select a fruit" />
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			{#each fruits as fruit}
				<Select.Item value={fruit.value} label={fruit.label}>
					{fruit.label}
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
```

## Material Design Libraries

Svelte UI libraries using Material Design:

- [Smelte](https://smeltejs.com/)
- [Svelte Material UI](https://sveltematerialui.com/)

## Bootstrap Libraries

Svelte UI libraries using Bootstrap design:

- [Sveltestrap](https://sveltestrap.js.org/)
- [AgnosUI](https://amadeusitgroup.github.io/AgnosUI/latest/)

## Framework Agnostic Libraries

These are some lovely framework agnostic UI libraries:

- [daisyUI](https://daisyui.com/) (Tailwind CSS)
- [Open Props](https://open-props.style/) (like Tailwind but uses CSS variables)
- [Pico](https://picocss.com/) (minimal CSS framework)
- [Preline](https://preline.co/) (Tailwind CSS)
- [Shoelace](https://shoelace.style/) (web components)

## Other UI/UX Libraries

Interesting Svelte UI libraries that have potential, or don't fit into a specific category:

- [Attractions](https://illright.github.io/attractions/) (UI kit)
- [Carbon Components](https://carbon-components-svelte.onrender.com/) (Carbon design system)
- [Grail UI](https://grail-ui.vercel.app/) (Headless)
- [Kahi UI](https://kahi-ui.nbn.dev/) (rapid prototyping)
- [STDF](https://stdf.design/) (Mobile component library based on Svelte and Tailwind)
- [STWUI](https://stwui.vercel.app/) (Tailwind CSS)
- [SVAR Svelte Core](https://svar.dev/svelte/core/) (20+ Svelte UI components and form controls)
- [Svelte Atoms](https://svelte-atoms.web.app/) (Atol design)
- [Svelte Headless UI](https://svelte-headlessui.goss.io/) (Headless)
- [Svelte UX](https://svelte-ux.techniq.dev/) (Collection of components, actions, stores, and utilities)
- [SvelteUI](https://svelteui.dev/) (Mantine UI design system)
- [YeSvelte](https://www.yesvelte.com/) (flexible and powerful Svelte UI library)
