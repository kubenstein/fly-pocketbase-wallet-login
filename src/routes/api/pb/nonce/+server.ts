import { generateNonce } from 'siwe';
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ cookies }) => {
	const nonce = generateNonce();
	cookies.set('nonce', nonce, { httpOnly: true, secure: true, sameSite: 'strict', path: '/' });
	return new Response(nonce, { headers: { 'Content-Type': 'text/plain' } });
}
