import { generateNonce } from 'siwe'
import { randomUUID } from 'node:crypto'
import { nonceStore } from '../lib'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ cookies }) => {
	const nonce = generateNonce()
	const nonceId = randomUUID()
	nonceStore.set(nonceId, nonce)
	cookies.set('nonce_id', nonceId, { httpOnly: true, secure: true, sameSite: 'strict', path: '/' })
	return new Response(nonce, { headers: { 'Content-Type': 'text/plain' } })
}
