<script lang="ts">
	import '../../styles/styles.css'
	import { browser } from '$app/environment'
	// browser guard still needed for the debounce preview trigger
	import { untrack } from 'svelte'

	import { snippets, frontmatterTemplate } from './snippets.js'
	import type { Snippet } from './snippets.js'
	import { renderPreview, savePost as savePostRemote } from './editor.remote'
	import Editor from './editor.svelte'
	import Preview from './preview.svelte'

	import type { TreeNode, TreeFile, TreeFolder } from './+page.server.ts'

	let { data } = $props()

	type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

	let tree = $derived<TreeNode[]>(data.tree)
	let openFolders = $state<Set<string>>(new Set())

	function folderKey(parent: string, name: string) {
		return `${parent}/${name}`
	}
	let selectedPath = $state<string | null>(null)

	function toggleFolder(name: string) {
		const next = new Set(openFolders)
		if (next.has(name)) {
			next.delete(name)
		} else {
			next.add(name)
		}
		openFolders = next
	}

	let selectedSlug = $state<string | null>(null)
	let content = $state(frontmatterTemplate)
	let previewHtml = $state('')
	let previewPending = $state<Promise<void> | null>(null)
	let debounceTimer = $state<ReturnType<typeof setTimeout> | null>(null)

	let saveStatus = $state<SaveStatus>('idle')
	let saveStatusTimer = $state<ReturnType<typeof setTimeout> | null>(null)
	let dropdownOpen = $state(false)

	function insertComponent(snippet: Snippet) {
		dropdownOpen = false
		// insert at end of content with a newline separator
		const separator = content.endsWith('\n') ? '\n' : '\n\n'
		content = content + separator + snippet.code + '\n'
	}

	function selectFile(file: TreeFile) {
		if (!file.raw) return
		selectedSlug = file.slug
		selectedPath = file.path
		content = file.raw
	}

	function newPost() {
		selectedSlug = null
		content = frontmatterTemplate
	}

	// derive the slug from frontmatter when creating a new post
	function resolveSlug(): string | null {
		if (selectedSlug) return selectedSlug
		const match = content.match(/^slug:\s*(.+)$/m)
		return match ? match[1].trim() : null
	}

	async function savePost() {
		const slug = resolveSlug()
		if (!slug) {
			alert('Add a slug to the frontmatter before saving.')
			return
		}

		saveStatus = 'saving'
		try {
			await savePostRemote({ content, slug })
			selectedSlug = slug
			saveStatus = 'saved'
			// add new post folder to tree if it doesn't exist yet
			const exists = tree.some((n) => n.name === slug)
			if (!exists) {
				const newFolder: TreeFolder = {
					kind: 'folder',
					name: slug,
					children: [
						{
							kind: 'file',
							name: `${slug}.md`,
							path: `posts/${slug}/${slug}.md`,
							slug,
							raw: content,
						},
					],
				}
				tree = [newFolder, ...tree]
				openFolders.add(slug)
				openFolders = openFolders
				selectedPath = `posts/${slug}/${slug}.md`
			} else {
				// keep raw in sync so re-selecting the file shows current content
				tree = tree.map((n) => {
					if (n.kind !== 'folder' || n.name !== slug) return n
					return {
						...n,
						children: n.children.map((c) =>
							c.kind === 'file' && c.name === `${slug}.md`
								? { ...c, raw: content }
								: c
						),
					}
				})
			}
		} catch (e) {
			console.error(e)
			saveStatus = 'error'
		} finally {
			if (saveStatusTimer) clearTimeout(saveStatusTimer)
			saveStatusTimer = setTimeout(() => (saveStatus = 'idle'), 2500)
		}
	}

	function triggerPreview(markdown: string) {
		if (!browser) return
		const slug = selectedSlug ?? 'preview'
		previewPending = renderPreview({ content: markdown, slug })
			.then((html) => {
				previewHtml = html
			})
			.catch((e) => {
				console.error('Preview render failed', e)
			})
			.finally(() => {
				previewPending = null
			})
	}

	function handleContentChange(value: string) {
		content = value
		if (debounceTimer) clearTimeout(debounceTimer)
		debounceTimer = setTimeout(() => triggerPreview(value), 400)
	}

	function handleKeydown(e: KeyboardEvent) {
		if ((e.ctrlKey || e.metaKey) && e.key === 's') {
			e.preventDefault()
			savePost()
		}
	}

	$effect(() => {
		// only track `content` as a dependency — read selectedSlug via untrack
		// so that saving (which sets selectedSlug) doesn't re-trigger this effect
		const markdown = content
		untrack(() => triggerPreview(markdown))
	})
</script>

<svelte:head>
	<title>Editor</title>
</svelte:head>

<svelte:window
	onkeydown={handleKeydown}
	onclick={(e) => {
		if (dropdownOpen && !(e.target as HTMLElement).closest('.dropdown-wrap')) {
			dropdownOpen = false
		}
	}}
/>

<div class="shell">
	<!-- sidebar -->
	<aside class="sidebar">
		<div class="sidebar-section">
			<div class="sidebar-heading-row">
				<h2 class="sidebar-heading">Posts</h2>
				<button class="new-btn" onclick={newPost}>+ New</button>
			</div>
			<ul class="tree">
				{#each tree as node (node.name)}
					{#if node.kind === 'folder'}
						<li class="tree-folder">
							<button
								class="tree-folder-btn"
								onclick={() => toggleFolder(node.name)}
							>
								<span
									class="tree-arrow"
									class:open={openFolders.has(node.name)}
								>
									▶
								</span>
								<span class="tree-folder-icon">📁</span>
								{node.name}
							</button>
							{#if openFolders.has(node.name)}
								<ul class="tree-children">
									{#each node.children as child (child.name)}
										{#if child.kind === 'folder'}
											{@const key = folderKey(node.name, child.name)}
											<li class="tree-folder">
												<button
													class="tree-folder-btn"
													onclick={() => toggleFolder(key)}
												>
													<span
														class="tree-arrow"
														class:open={openFolders.has(key)}>▶</span
													>
													<span class="tree-folder-icon">📁</span>
													{child.name}
												</button>
												{#if openFolders.has(key)}
													<ul class="tree-children tree-children--nested">
														{#each child.children as subfile (subfile.name)}
															<li>
																<button
																	class="tree-file-btn"
																	class:active={subfile.kind === 'file' &&
																		selectedPath === subfile.path}
																	onclick={() =>
																		subfile.kind === 'file' &&
																		selectFile(subfile)}
																>
																	<span class="tree-file-icon">📄</span>
																	{subfile.name}
																</button>
															</li>
														{/each}
													</ul>
												{/if}
											</li>
										{:else}
											<li>
												<button
													class="tree-file-btn"
													class:active={selectedPath === child.path}
													onclick={() =>
														child.kind === 'file' && selectFile(child)}
												>
													<span class="tree-file-icon">📄</span>
													{child.name}
												</button>
											</li>
										{/if}
									{/each}
								</ul>
							{/if}
						</li>
					{/if}
				{/each}
			</ul>
		</div>
	</aside>

	<!-- editor -->
	<section class="editor-panel">
		<div class="panel-header">
			<span class="panel-label">
				{selectedSlug ? selectedSlug : 'new post'}
			</span>
			<div class="panel-actions">
				<div class="dropdown-wrap">
					<button
						type="button"
						class="insert-btn"
						onclick={() => (dropdownOpen = !dropdownOpen)}
					>
						+ Insert
					</button>
					{#if dropdownOpen}
						<div class="dropdown" role="menu">
							{#each snippets as snippet (snippet.label)}
								<button
									class="dropdown-item"
									onclick={() => insertComponent(snippet)}
									role="menuitem"
								>
									<span class="dropdown-label">{snippet.label}</span>
									<span class="dropdown-desc">{snippet.description}</span>
								</button>
							{/each}
						</div>
					{/if}
				</div>
				{#if saveStatus === 'saved'}
					<span class="save-status saved">✓ Saved</span>
				{:else if saveStatus === 'error'}
					<span class="save-status error">✕ Error</span>
				{:else if saveStatus === 'saving'}
					<span class="save-status saving">Saving…</span>
				{/if}
				<button
					type="button"
					class="save-btn"
					onclick={savePost}
					disabled={saveStatus === 'saving'}
				>
					Save <kbd>Ctrl+S</kbd>
				</button>
			</div>
		</div>
		<div class="panel-body">
			<Editor value={content} onchange={handleContentChange} />
		</div>
	</section>

	<!-- preview -->
	<section class="preview-panel">
		<div class="panel-header">
			<span class="panel-label">Preview</span>
		</div>
		<div class="panel-body">
			<Preview html={previewHtml} loading={previewPending !== null} />
		</div>
	</section>
</div>

<style>
	.shell {
		display: grid;
		grid-template-columns: 280px 1fr 1fr;
		height: 100vh;
		border: 1px solid hsl(0 0% 100% / 10%);
		overflow: hidden;
	}

	/* sidebar */
	.sidebar {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-24);
		overflow-y: auto;
		padding: var(--spacing-16);
		background: hsl(0 0% 100% / 3%);
		border-right: 1px solid hsl(0 0% 100% / 8%);
	}

	.sidebar-heading {
		font-size: var(--font-16);
		font-family: var(--font-mono);
		color: var(--clr-primary);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-bottom: var(--spacing-8);
	}

	.tree {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
	}

	.tree-folder {
		display: flex;
		flex-direction: column;
	}

	.tree-folder-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		width: 100%;
		padding: 4px var(--spacing-8);
		font-size: 1.3rem;
		font-family: var(--font-mono);
		text-align: left;
		color: var(--clr-txt);
		background: none;
		border: none;
		cursor: pointer;
		border-radius: var(--rounded-4);
		transition: background 0.15s ease;

		&:hover {
			background: hsl(0 0% 100% / 6%);
		}
	}

	.tree-arrow {
		font-size: 0.7rem;
		transition: transform 0.15s ease;
		opacity: 0.4;
		flex-shrink: 0;

		&.open {
			transform: rotate(90deg);
		}
	}

	.tree-folder-icon,
	.tree-file-icon {
		font-size: 1.2rem;
		flex-shrink: 0;
	}

	.tree-children {
		list-style: none;
		margin: 0;
		padding: 0 0 2px 20px;
		display: flex;
		flex-direction: column;
	}

	.tree-children--nested {
		padding-left: 16px;
	}

	.tree-file-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		width: 100%;
		padding: 4px var(--spacing-8);
		font-size: 1.3rem;
		font-family: var(--font-mono);
		text-align: left;
		color: var(--clr-txt);
		background: none;
		border: none;
		cursor: pointer;
		border-radius: var(--rounded-4);
		transition: background 0.15s ease;
		opacity: 0.7;

		&:hover {
			background: hsl(0 0% 100% / 6%);
			opacity: 1;
		}

		&.active {
			background: hsl(0 0% 100% / 10%);
			color: var(--clr-primary);
			opacity: 1;
		}
	}

	/* panels */
	.editor-panel,
	.preview-panel {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.preview-panel {
		border-left: 1px solid hsl(0 0% 100% / 8%);
	}

	.panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 var(--spacing-16);
		height: 40px;
		border-bottom: 1px solid hsl(0 0% 100% / 8%);
		background: hsl(0 0% 100% / 3%);
		flex-shrink: 0;
	}

	.panel-label {
		font-family: var(--font-mono);
		font-size: 1.3rem;
		color: var(--clr-txt);
		opacity: 0.6;
	}

	.panel-actions {
		display: flex;
		align-items: center;
		gap: var(--spacing-8);
	}

	.dropdown-wrap {
		position: relative;
	}

	.insert-btn {
		display: flex;
		align-items: center;
		padding: 4px 12px;
		font-size: 1.3rem;
		color: var(--clr-txt);
		background: none;
		border: 1px solid hsl(0 0% 100% / 15%);
		border-radius: var(--rounded-4);
		cursor: pointer;
		transition: border-color 0.15s ease;

		&:hover {
			border-color: hsl(0 0% 100% / 30%);
		}
	}

	.dropdown {
		position: absolute;
		top: calc(100% + 6px);
		right: 0;
		z-index: 10;
		min-width: 220px;
		background: var(--clr-bg);
		border: 1px solid hsl(0 0% 100% / 10%);
		border-radius: var(--rounded-4);
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.dropdown-item {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: var(--spacing-8) var(--spacing-16);
		text-align: left;
		background: none;
		border: none;
		cursor: pointer;
		transition: background 0.15s ease;

		&:hover {
			background: hsl(0 0% 100% / 6%);
		}
	}

	.dropdown-label {
		font-size: 1.3rem;
		color: var(--clr-txt);
	}

	.dropdown-desc {
		font-size: 1.1rem;
		color: var(--clr-txt);
		opacity: 0.5;
	}

	.save-btn {
		display: flex;
		align-items: center;
		gap: var(--spacing-4);
		padding: 4px 12px;
		font-size: 1.3rem;
		color: var(--clr-bg);
		background: var(--clr-primary);
		border: none;
		border-radius: var(--rounded-4);
		cursor: pointer;
		opacity: 1;
		transition: opacity 0.15s ease;

		&:hover {
			opacity: 0.85;
		}

		&:disabled {
			opacity: 0.5;
			cursor: default;
		}

		kbd {
			font-size: 1.1rem;
			opacity: 0.7;
		}
	}

	.save-status {
		font-family: var(--font-mono);
		font-size: 1.2rem;

		&.saved {
			color: var(--clr-primary);
		}
		&.error {
			color: hsl(0 100% 60%);
		}
		&.saving {
			color: var(--clr-txt);
			opacity: 0.6;
		}
	}

	.sidebar-heading-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--spacing-8);
	}

	/* override margin on heading since the row handles it now */
	.sidebar-heading-row .sidebar-heading {
		margin-bottom: 0;
	}

	.new-btn {
		font-size: 1.2rem;
		padding: 2px 8px;
		color: var(--clr-primary);
		background: none;
		border: 1px solid var(--clr-primary);
		border-radius: var(--rounded-4);
		cursor: pointer;
		opacity: 0.7;
		transition: opacity 0.15s ease;

		&:hover {
			opacity: 1;
		}
	}

	.panel-body {
		flex: 1;
		overflow: hidden;
	}
</style>
