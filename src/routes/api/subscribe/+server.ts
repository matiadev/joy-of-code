import { BUTTONDOWN_API_KEY } from '$app/env/private'

export async function POST({ request }) {
	const API_URL = 'https://api.buttondown.email/v1/subscribers'
	const API_KEY = BUTTONDOWN_API_KEY
	const email = await request.json()

	if (!email) {
		return Response.json(
			{ error: 'You forget the email. 😊' },
			{
				status: 400,
			}
		)
	}

	try {
		const response = await fetch(API_URL, {
			method: 'post',
			body: JSON.stringify({ email }),
			headers: {
				Authorization: `Token ${API_KEY}`,
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			const text = await response.text()

			if (text.includes('already subscribed')) {
				return Response.json(
					{ error: `You're already subscribed. 😊` },
					{
						status: 400,
					}
				)
			}

			return Response.json({ error: text }, { status: 400 })
		}

		return Response.json(
			{ success: 'Thank you for subscribing! 🥳' },
			{
				status: 201,
				headers: { location: '/' },
			}
		)
	} catch (error) {
		if (error instanceof Error) {
			return Response.json({ error: error.message }, { status: 500 })
		}
		return Response.json({ error: 'Something went wrong. 😊' }, { status: 500 })
	}
}
