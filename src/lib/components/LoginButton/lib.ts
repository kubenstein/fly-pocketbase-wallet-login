import { BrowserProvider } from 'ethers'
import { type WalletState } from '@web3-onboard/core'
import { SiweMessage } from 'siwe';

export const fetchPocketbaseToken = async (wallet: WalletState) => {
	const scheme = window.location.protocol.slice(0, -1);
	const domain = window.location.host;
	const uri = window.location.origin;
	const statement = 'Sign in with Ethereum to the app.';
	const address = await addressForWallet(wallet);
	const nonce = await(await fetch("/api/pb/nonce", { credentials: 'include' })).text();

	const message = new SiweMessage({
		scheme,
		domain,
		address,
		statement,
		uri,
		nonce,
		version: '1',
		chainId: 1,
	}).prepareMessage();

	const provider = new BrowserProvider(wallet.provider)
	const signer = await provider.getSigner()
	const signature = await signer.signMessage(message);

	const siweVerifyResponse = await fetch("/api/pb/verify", {
		credentials: 'include',
		method: "POST",
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ message, signature }),
	});

	const token = (await siweVerifyResponse.json()).token as string
	return token
}


// support functions ----------------------------------- //
const addressForWallet = async (wallet: WalletState) => {
	const provider = new BrowserProvider(wallet.provider)
	const signer = await provider.getSigner()
	return signer.address
}
