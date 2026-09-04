import { browser } from '$app/env'

const DEFAULT_TEXT_SIZE = 20
const DEFAULT_TEXT_LENGTH = 70
const DEFAULT_TEXT_HEIGHT = 34

class Preferences {
	#textSize = $state(DEFAULT_TEXT_SIZE)
	#textLength = $state(DEFAULT_TEXT_LENGTH)
	#textHeight = $state(DEFAULT_TEXT_HEIGHT)
	#htmlEl: HTMLElement | undefined
	resetTheme = $state(false)

	get textSize() {
		return this.#textSize
	}

	set textSize(value) {
		this.#textSize = value
		localStorage.textSize = `${value}px`
		this.#htmlEl?.style.setProperty('--post-txt-size', `${value}px`)
	}

	get textLength() {
		return this.#textLength
	}

	set textLength(value) {
		this.#textLength = value
		localStorage.textLength = `${value}ch`
		this.#htmlEl?.style.setProperty('--post-txt-length', `${value}ch`)
	}

	get textHeight() {
		return this.#textHeight
	}

	set textHeight(value) {
		this.#textHeight = value
		localStorage.textHeight = `${value}px`
		this.#htmlEl?.style.setProperty('--post-txt-height', `${value}px`)
	}

	constructor() {
		if (!browser) return

		const { textSize, textLength, textHeight } = localStorage

		if (textSize) this.textSize = +textSize.replace('px', '')
		if (textLength) this.textLength = +textLength.replace('ch', '')
		if (textHeight) this.textHeight = +textHeight.replace('px', '')

		this.#htmlEl = document.documentElement
	}

	reset() {
		this.textSize = DEFAULT_TEXT_SIZE
		this.textLength = DEFAULT_TEXT_LENGTH
		this.textHeight = DEFAULT_TEXT_HEIGHT

		this.#htmlEl!.dataset.theme = '🌛 Night'
		delete this.#htmlEl!.dataset.font

		localStorage.theme = '🌛 Night'
		localStorage.removeItem('font')

		this.resetTheme = !this.resetTheme
	}
}

export const preferences = new Preferences()
