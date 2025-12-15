import { json } from '@sveltejs/kit'
import { SiweMessage } from 'siwe'
import { generatePbUserToken } from './lib'
import type { RequestHandler } from './$types'

type RequestParams = {
	message: string
	signature: string
}

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { message, signature } = (await request.json()) as RequestParams
	const nonce = cookies.get('nonce')

	try {
		const {
			data: { address: verifiedAddress }
		} = await new SiweMessage(message).verify({ signature, nonce })
		const token = await generatePbUserToken(verifiedAddress)
		return json({ token })
	} catch {
		return json({ error: 'Invalid signature' }, { status: 400 })
	}
}
