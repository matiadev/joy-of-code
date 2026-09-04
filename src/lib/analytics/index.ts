import posthog from 'posthog-js'
import { browser } from '$app/env'
import { beforeNavigate, afterNavigate } from '$app/navigation'

const POSTHOG_KEY = 'phc_nZDwmyGFBKKFyA7fag8ia0Lq9PYMqxeofhojcOX67jW'

export function initAnalytics() {
	if (browser) {
		posthog.init(POSTHOG_KEY, {
			api_host: 'https://eu.i.posthog.com',
			capture_pageview: false,
			capture_pageleave: false,
		})
	}
	return
}

export function useAnalytics() {
	if (browser) {
		beforeNavigate(({ shallow }) => {
			if (shallow) return

			return posthog.capture('$pageleave')
		})

		afterNavigate(({ shallow }) => {
			if (shallow) return

			return posthog.capture('$pageview')
		})
	}
}
