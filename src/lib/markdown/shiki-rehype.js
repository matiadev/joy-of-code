/**
 * Vendored from `@shikijs/rehype` (MIT, https://github.com/shikijs/shiki).
 * Kept in sync manually: importing `@shikijs/rehype` would pull the
 * full `shiki` bundle (and its Oniguruma WASM engine) back into the
 * dependency tree, which this setup deliberately avoids.
 *
 * Hast shapes are declared locally because `hast` itself isn't a
 * direct dependency, so its types can't be imported here.
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
 * @property {string} [metastring]
 *
 * @typedef {object} HastData
 * @property {string} [meta]
 *
 * @typedef {object} HastElement
 * @property {'element'} type
 * @property {string} tagName
 * @property {HastProperties} properties
 * @property {HastData} [data]
 * @property {Array<HastElement | HastText | HastComment>} children
 *
 * @typedef {object} HastRoot
 * @property {'root'} type
 * @property {Array<HastElement | HastText | HastComment>} children
 *
 * @typedef {object} ParsedPre
 * @property {'pre'} type
 * @property {string | undefined} lang
 * @property {string} code
 * @property {string} meta
 *
 * @typedef {object} ParsedInline
 * @property {'inline'} type
 * @property {string | undefined} lang
 * @property {string} code
 * @property {string} [meta]
 *
 * @typedef {object} RehypeShikiOptions
 * @property {string} theme
 * @property {Array<any>} [transformers]
 * @property {Record<string, any>} [meta]
 * @property {Map<string, any>} [cache]
 * @property {boolean} [addLanguageClass]
 * @property {(meta: string, node: any, tree: any) => Record<string, any>} [parseMetaString]
 * @property {string} [defaultLanguage]
 * @property {string} [fallbackLanguage]
 * @property {(error: any) => void} [onError]
 * @property {boolean} [stripEndNewline]
 * @property {false | 'tailing-curly-colon'} [inline]
 * @property {boolean} [lazy]
 */

import { isSpecialLang } from '@shikijs/core'
import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'

const tailingCurlyColonPattern = /(.+)\{:([\w-]+)\}$/

const inlineCodeHandlers = {
	/**
	 * @param {any} _tree
	 * @param {HastElement} node
	 * @returns {ParsedInline | undefined}
	 */
	'tailing-curly-colon': (_tree, node) => {
		const raw = toString(node)
		const match = raw.match(tailingCurlyColonPattern)
		if (!match) return

		return {
			type: 'inline',
			code: match[1] ?? raw,
			lang: match.at(2),
		}
	},
}

const languageClassPrefix = 'language-'

/**
 * @param {any} _tree
 * @param {HastElement} node
 * @returns {ParsedPre | undefined}
 */
const preHandler = (_tree, node) => {
	const head = node.children[0]
	if (
		!head ||
		head.type !== 'element' ||
		head.tagName !== 'code' ||
		!head.properties
	) {
		return
	}

	const classes = head.properties.className
	const languageClass = Array.isArray(classes)
		? classes.find(
				(d) => typeof d === 'string' && d.startsWith(languageClassPrefix)
			)
		: undefined

	return {
		type: 'pre',
		lang:
			typeof languageClass === 'string' ? languageClass.slice(9) : undefined,
		code: toString(head),
		meta: head.data?.meta ?? head.properties.metastring?.toString() ?? '',
	}
}

const languagePrefix = 'language-'

/**
 * @param {Awaited<ReturnType<typeof import('@shikijs/core').createHighlighterCore>>} highlighter
 * @param {RehypeShikiOptions} options
 */
function rehypeShikiFromHighlighter(highlighter, options) {
	const {
		addLanguageClass = false,
		parseMetaString,
		cache,
		defaultLanguage,
		fallbackLanguage,
		onError,
		stripEndNewline = true,
		inline = false,
		lazy = false,
		...rest
	} = options

	/**
	 * @param {string} lang
	 * @param {string} code
	 * @param {string} [metaString]
	 * @param {Record<string, any>} [meta]
	 */
	function highlight(lang, code, metaString = '', meta = {}) {
		const cacheKey = `${lang}:${metaString}:${code}`
		const cachedValue = cache?.get(cacheKey)
		if (cachedValue) {
			return cachedValue
		}

		const codeOptions = {
			...rest,
			lang,
			meta: {
				...rest.meta,
				...meta,
				__raw: metaString,
			},
		}

		if (addLanguageClass) {
			// always construct a new array, avoid adding the transformer repeatedly
			codeOptions.transformers = [
				...(codeOptions.transformers ?? []),
				{
					name: 'rehype-shiki:code-language-class',
					/**
					 * @this {any}
					 * @param {any} node
					 */
					code(node) {
						this.addClassToHast(node, `${languagePrefix}${lang}`)
						return node
					},
				},
			]
		}

		if (stripEndNewline && code.endsWith('\n')) {
			code = code.slice(0, -1)
		}

		try {
			const fragment = highlighter.codeToHast(code, codeOptions)
			cache?.set(cacheKey, fragment)
			return fragment
		} catch (error) {
			if (onError) {
				onError(error)
			} else {
				throw error
			}
		}
	}

	/**
	 * @param {HastRoot} tree
	 */
	return (tree) => {
		// use this queue if lazy is enabled
		/** @type {Array<Promise<void>>} */
		const queue = []

		visit(tree, 'element', (node, index, parent) => {
			let handler

			// needed for hast node replacement
			if (!parent || index == null) {
				return
			}

			if (node.tagName === 'pre') {
				handler = preHandler
			} else if (node.tagName === 'code' && inline) {
				handler = inlineCodeHandlers[inline]
			} else {
				return
			}

			const parsed = handler(tree, node)
			if (!parsed) {
				return
			}

			let lang
			let lazyLoad = false

			if (!parsed.lang) {
				lang = defaultLanguage
			} else if (
				highlighter.getLoadedLanguages().includes(parsed.lang) ||
				isSpecialLang(parsed.lang)
			) {
				lang = parsed.lang
			} else if (lazy) {
				lazyLoad = true
				lang = parsed.lang
			} else if (fallbackLanguage) {
				lang = fallbackLanguage
			}

			if (!lang) {
				return
			}

			const meta = parsed.meta
				? parseMetaString?.(parsed.meta, node, tree)
				: undefined

			/**
			 * @param {string} targetLang
			 */
			const processNode = (targetLang) => {
				const fragment = highlight(
					targetLang,
					parsed.code,
					parsed.meta,
					meta ?? {}
				)
				if (!fragment) {
					return
				}

				if (parsed.type === 'inline') {
					const head = fragment.children[0]
					if (head.type === 'element' && head.tagName === 'pre') {
						head.tagName = 'span'
					}
				}

				parent.children[index] = /** @type {any} */ (fragment)
			}

			if (lazyLoad) {
				try {
					// passed language is checked in sync, promise `.catch()` wouldn't work
					queue.push(
						highlighter
							.loadLanguage(/** @type {any} */ (lang))
							.then(() => processNode(lang))
							.catch((error) => {
								if (fallbackLanguage) {
									processNode(fallbackLanguage)
								} else if (onError) {
									onError(error)
								} else {
									throw error
								}
							})
					)
				} catch (error) {
					if (fallbackLanguage) {
						return processNode(fallbackLanguage)
					} else if (onError) {
						onError(error)
					} else {
						throw error
					}
				}
			} else {
				processNode(lang)
			}

			// don't visit processed nodes
			return 'skip'
		})

		if (queue.length > 0) {
			async function run() {
				await Promise.all(queue)
			}

			return run()
		}
	}
}

export default rehypeShikiFromHighlighter
