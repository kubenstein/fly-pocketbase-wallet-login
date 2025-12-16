import { json } from '@sveltejs/kit'
import { SiweMessage } from 'siwe'
import { generatePbUserToken, nonceStore } from '../lib'
import type { RequestHandler } from './$types'

type RequestParams = {
	message: string
	signature: string
}

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { message, signature } = (await request.json()) as RequestParams
	const nonceId = cookies.get('nonce_id') || ''
	const nonce = nonceStore.get(nonceId)

	if (!nonceId) return json({ error: 'Missing nonce' }, { status: 400 })
	if (!nonce) return json({ error: 'Invalid nonce' }, { status: 400 })

	nonceStore.delete(nonceId)
	cookies.delete('nonce_id', { path: '/' })

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
