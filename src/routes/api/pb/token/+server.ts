import { json } from '@sveltejs/kit'
import { type TypedDataField } from 'ethers'
import { generatePbUserToken, verifyPayload } from './lib'
import type { RequestHandler } from './$types'

type RequestParams = {
	types: Record<string, TypedDataField[]>
	content: { signedBy: string }
	signature: { v: number, r: string, s: string }
}

export const POST: RequestHandler = async ({ request }) => {
	const data = (await request.json()) as RequestParams

	if (!(await verifyPayload(data))) {
		return json({ error: 'Invalid signature' }, { status: 400 })
	}

	const token = await generatePbUserToken(data.content.signedBy)

	return json({ token })
}
