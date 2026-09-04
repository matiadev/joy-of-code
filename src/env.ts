import { defineEnvVars } from '@sveltejs/kit/env'

export const variables = defineEnvVars({ BUTTONDOWN_API_KEY: { static: true } })
