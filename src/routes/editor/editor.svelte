<script lang="ts">
	import { onMount } from 'svelte'

	type Props = {
		value: string
		onchange: (value: string) => void
	}

	let { value, onchange }: Props = $props()

	let container: HTMLDivElement
	let view: any
	let pendingValue: string | null = null

	onMount(() => {
		let destroyed = false
		Promise.all([
			import('codemirror'),
			import('@codemirror/lang-markdown'),
			import('@codemirror/language'),
			import('@lezer/highlight'),
			import('@codemirror/view'),
			import('@codemirror/state'),
		]).then(
			([
				{ EditorView, basicSetup },
				{ markdown },
				{ HighlightStyle, syntaxHighlighting, indentUnit },
				{ tags: t },
				{ keymap },
				{ EditorState },
			]) => {
				if (destroyed) return

				// Poimandres color palette
				const bg = '#1b1e28'
				const focus = '#303340'
				const selection = '#717cb425'
				const offWhite = '#e4f0fb'
				const gray = '#a6accd'
				const darkerGray = '#767c9d'
				const bluishGray = '#506477'
				const lightBlue = '#ADD7FF'
				const lowerBlue = '#89ddff'
				const desatBlue = '#91B4D5'
				const brightMint = '#5DE4c7'
				const lowerMint = '#5fb3a1'
				const hotRed = '#d0679d'

				const poimandresTheme = EditorView.theme(
					{
						'&': { color: gray, backgroundColor: bg },
						'.cm-content': { caretColor: gray },
						'.cm-cursor, .cm-dropCursor': { borderLeftColor: gray },
						'&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
							{ backgroundColor: selection },
						'.cm-activeLine': { backgroundColor: selection },
						'.cm-activeLineGutter': { backgroundColor: focus },
						'.cm-gutters': {
							backgroundColor: bg,
							color: darkerGray,
							border: 'none',
						},
						'.cm-lineNumbers .cm-gutterElement': { color: darkerGray + '80' },
						'.cm-foldPlaceholder': {
							backgroundColor: 'transparent',
							border: 'none',
							color: darkerGray,
						},
						'.cm-tooltip': {
							backgroundColor: bg,
							border: '1px solid ' + offWhite + '10',
							color: gray,
						},
						'.cm-tooltip-autocomplete ul li[aria-selected]': {
							backgroundColor: focus,
							color: offWhite,
						},
						'.cm-searchMatch': {
							backgroundColor: lightBlue + '40',
							outline: '1px solid ' + lightBlue,
						},
						'.cm-searchMatch.cm-searchMatch-selected': {
							backgroundColor: lightBlue + '60',
						},
						'.cm-matchingBracket, .cm-nonmatchingBracket': {
							backgroundColor: offWhite + '20',
							outline: '1px solid ' + offWhite + '40',
						},
						'.cm-panels': { backgroundColor: bg, color: gray },
						'.cm-panels.cm-panels-top': {
							borderBottom: '1px solid ' + offWhite + '10',
						},
						'.cm-panels.cm-panels-bottom': {
							borderTop: '1px solid ' + offWhite + '10',
						},
						'.cm-selectionMatch': {
							backgroundColor: lightBlue + '20',
							outline: '1px solid ' + lightBlue + '80',
						},
					},
					{ dark: true }
				)

				const poimandresHighlight = HighlightStyle.define([
					{ tag: t.comment, color: darkerGray + 'b0', fontStyle: 'italic' },
					{ tag: t.name, color: offWhite },
					{ tag: t.variableName, color: offWhite },
					{ tag: t.propertyName, color: offWhite },
					{ tag: t.definition(t.variableName), color: offWhite },
					{ tag: t.definition(t.propertyName), color: lightBlue },
					{ tag: t.function(t.variableName), color: offWhite + 'd0' },
					{ tag: t.function(t.propertyName), color: offWhite + 'd0' },
					{ tag: t.definition(t.function(t.variableName)), color: lightBlue },
					{ tag: t.typeName, color: gray + 'c0' },
					{ tag: t.typeOperator, color: desatBlue },
					{ tag: t.className, color: lightBlue },
					{ tag: t.namespace, color: desatBlue },
					{ tag: t.self, color: brightMint },
					{ tag: t.keyword, color: gray },
					{ tag: t.controlKeyword, color: brightMint + 'c0' },
					{ tag: t.moduleKeyword, color: brightMint },
					{ tag: t.operatorKeyword, color: desatBlue },
					{ tag: t.definitionKeyword, color: desatBlue },
					{ tag: t.modifier, color: brightMint },
					{ tag: t.operator, color: desatBlue },
					{ tag: t.punctuation, color: gray },
					{ tag: t.bracket, color: gray },
					{ tag: t.separator, color: gray },
					{ tag: t.string, color: brightMint },
					{ tag: t.special(t.string), color: lowerMint },
					{ tag: t.regexp, color: lowerMint },
					{ tag: t.escape, color: lowerMint },
					{ tag: t.number, color: brightMint },
					{ tag: t.bool, color: hotRed },
					{ tag: t.null, color: hotRed },
					{ tag: t.tagName, color: brightMint },
					{ tag: t.angleBracket, color: gray },
					{ tag: t.attributeName, color: desatBlue, fontStyle: 'italic' },
					{ tag: t.attributeValue, color: brightMint },
					{ tag: t.constant(t.name), color: lightBlue },
					{ tag: t.invalid, color: hotRed },
					{ tag: t.heading, color: offWhite, fontStyle: 'bold' },
					{ tag: t.heading1, color: offWhite, fontStyle: 'bold' },
					{ tag: t.heading2, color: offWhite, fontStyle: 'bold' },
					{ tag: t.heading3, color: offWhite, fontStyle: 'bold' },
					{ tag: t.emphasis, color: bluishGray, fontStyle: 'italic' },
					{ tag: t.strong, color: bluishGray, fontStyle: 'bold' },
					{
						tag: t.strikethrough,
						color: darkerGray,
						textDecoration: 'line-through',
					},
					{ tag: t.link, color: lightBlue, textDecoration: 'underline' },
					{ tag: t.url, color: lightBlue, textDecoration: 'underline' },
					{ tag: t.monospace, color: lowerBlue },
					{ tag: t.quote, color: gray, fontStyle: 'italic' },
					{ tag: t.list, color: lightBlue },
					{ tag: t.meta, color: darkerGray },
					{ tag: t.inserted, color: lightBlue },
					{ tag: t.deleted, color: bluishGray },
					{ tag: t.changed, color: desatBlue },
				])

				view = new EditorView({
					doc: value,
					// capture value at creation time in case it changed while imports were loading
					extensions: [
						basicSetup,
						markdown(),
						poimandresTheme,
						syntaxHighlighting(poimandresHighlight),
						EditorState.tabSize.of(2),
						indentUnit.of('\t'),
						keymap.of([
							{
								key: 'Tab',
								run(view) {
									view.dispatch(view.state.replaceSelection('\t'))
									return true
								},
							},
						]),

						EditorView.updateListener.of((update) => {
							if (update.docChanged) {
								onchange(update.state.doc.toString())
							}
						}),
						EditorView.theme({
							'&': { height: '100%', fontSize: '14px' },
							'.cm-scroller': {
								overflow: 'auto',
								fontFamily: 'var(--font-mono)',
							},
							'.cm-content': { padding: '16px 0' },
							'.cm-line': { lineHeight: '1.7' },
						}),
					],
					parent: container,
				})

				// apply any value that changed while imports were in-flight
				const target = pendingValue ?? value
				pendingValue = null
				if (target !== view.state.doc.toString()) {
					view.dispatch({
						changes: { from: 0, to: view.state.doc.length, insert: target },
					})
				}
			}
		)

		return () => {
			destroyed = true
			view?.destroy()
		}
	})

	// sync external value changes (e.g. switching posts) back into the editor
	$effect(() => {
		if (!view) {
			// editor not ready yet — stash it so the init callback can pick it up
			pendingValue = value
			return
		}
		if (value !== view.state.doc.toString()) {
			view.dispatch({
				changes: {
					from: 0,
					to: view.state.doc.length,
					insert: value,
				},
			})
		}
	})
</script>

<div bind:this={container} class="editor-wrap"></div>

<style>
	.editor-wrap {
		height: 100%;
		overflow: hidden;
	}

	.editor-wrap :global(.cm-editor) {
		height: 100%;
	}

	.editor-wrap :global(.cm-focused) {
		outline: none;
	}
</style>
