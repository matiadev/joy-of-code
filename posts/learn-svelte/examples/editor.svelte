<script lang="ts">
	let editor = $state({
		theme: 'dark',
		content: '<h1>Svelte</h1>',
	})
</script>

<div class="container editor">
	<textarea
		value={editor.content}
		oninput={(e) => (editor.content = (e.target as HTMLTextAreaElement).value)}
		spellcheck="false"></textarea>

	{@html editor.content}
</div>

<style>
	.editor {
		text-align: left;

		textarea {
			width: 600px;
			height: 200px;
			padding: var(--spacing-8);
			border-radius: var(--rounded-4);
		}
	}
</style>
