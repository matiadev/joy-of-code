import { onNavigate } from '$app/navigation'
import type { DateStyle, Fetch } from '#lib/types/index.js'

export async function fetchJSON<Data>(
	url: string,
	fetchFn: Fetch = fetch
): Promise<Data> {
	const response = await fetchFn(url)
	if (!response.ok) throw new Error(`Error fetching JSON from ${response.url}`)
	return await response.json()
}

export function formatDate(
	date: string,
	dateStyle: DateStyle = 'medium',
	locales = 'en'
) {
	// safari is mad about dashes in the date
	const dateToFormat = new Date(date.replaceAll('-', '/'))
	const dateFormatter = new Intl.DateTimeFormat(locales, { dateStyle })
	return dateFormatter.format(dateToFormat)
}

export function formatNumber(number: number, locales = 'en') {
	return new Intl.NumberFormat(locales).format(number)
}

export async function setupViewTransition() {
	onNavigate((navigation) => {
		if (navigation.shallow) return
		if (!document.startViewTransition) return

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve()
				await navigation.complete
			})
		})
	})
}
