import { Signature, BrowserProvider, type TypedDataField } from 'ethers'
import { type WalletState } from '@web3-onboard/core'

export const fetchPocketbaseToken = async (wallet: WalletState) => {
	const data = {
		types: {
			Login: [
				{ name: 'signedBy', type: 'address' }
			]
		},
		values: {
			signedBy: await addressForWallet(wallet)
		}
	}
	const payload = await signContent(wallet, data)
	const response = await fetch(`/api/pb/token`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	})

	const token = (await response.json()).token as string
	return token
}


// support functions ----------------------------------- //
const addressForWallet = async (wallet: WalletState) => {
	const provider = new BrowserProvider(wallet.provider)
	const signer = await provider.getSigner()
	return signer.address
}

const signContent = async <T extends Record<string, string | number>>(
	wallet: WalletState,
	data: { types: Record<string, TypedDataField[]>; values: T }
): Promise<{ content: T; signature: { v: number; r: string; s: string } }> => {
	const provider = new BrowserProvider(wallet.provider)
	const signer = await provider.getSigner()

	const signature = await signer.signTypedData({}, data.types, data.values)
	const { v, r, s } = Signature.from(signature)
	const payload = {
		types: data.types,
		content: data.values,
		signature: { v, r, s }
	}
	return payload
}


