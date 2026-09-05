import { visit } from 'unist-util-visit'

/**
 * Minimal hast shapes used by this plugin. (`hast` itself isn't a
 * direct dependency, so its types can't be imported here.)
 *
 * @typedef {object} HastText
 * @property {'text'} type
 * @property {string} value
 *
 * @typedef {object} HastComment
 * @property {'comment'} type
 * @property {string} value
 *
 * @typedef {object} HastProperties
 * @property {Array<string>} [className]
 *
 * @typedef {object} HastElement
 * @property {'element'} type
 * @property {string} tagName
 * @property {HastProperties} [properties]
 * @property {Array<HastElement | HastText | HastComment>} children
 *
 * @typedef {object} HastRoot
 * @property {'root'} type
 * @property {Array<HastElement | HastText | HastComment>} children
 */

/**
 * Adds a title and copy button to code blocks.
 * @returns {(tree: HastRoot) => undefined}
 */
export function rehypeCopyCode() {
	/**
	 * Whether a node is a `<div class="rehype-code-title">` title
	 * element created by `rehype-code-titles`.
	 * @param {any} node
	 * @returns {boolean | undefined}
	 */
	function codeTitle(node) {
		if (node.tagName === 'div') {
			return node.properties?.className?.[0] === 'rehype-code-title'
		}
	}

	/**
	 * @param {HastRoot} tree
	 */
	return (tree) => {
		visit(tree, codeTitle, (node) => {
			if (node.type !== 'element') return

			const value =
				node.children[0].type === 'text' ? node.children[0].value : ''

			node.children = [
				{
					type: 'element',
					tagName: 'span',
					children: [{ type: 'text', value }],
				},
				{
					type: 'element',
					tagName: 'button',
					properties: { className: ['copy'] },
					children: [{ type: 'text', value: `Copy` }],
				},
			]
		})
	}
}
