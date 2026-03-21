export const prerender = true

export async function load({ url }) {
	return {
		url: url.pathname,
	}
}
