<script lang="ts">
	import { connectWallet, disconnectWallet, walletConnected, connectedWallet } from '$lib/states/walletState'
	import { pbConnected, connectPb, disconnectPb } from '$lib/states/pocketbaseState'
	import { BrowserProvider } from 'ethers'
	import { type WalletState } from '@web3-onboard/core'
	import { SiweMessage } from 'siwe'

	let status: 'disconnected' | 'walletConnected' | 'systemConnected' | 'errored' = 'disconnected'

	$: {
		if ($pbConnected) {
			status = 'systemConnected'
		} else if ($walletConnected) {
			status = 'walletConnected'
		} else {
			status = 'disconnected'
		}
	}

	$: ((connected: boolean) => {
		if (!connected) status = 'walletConnected'
	})($pbConnected)

	$: ((connected: boolean) => {
		if (!connected) status = 'disconnected'
	})($walletConnected)

	// actions ------------------------------------------------------------
	const login = async () => {
		status = 'disconnected'
		await connectWallet()
		status = 'walletConnected'
		const token = await fetchPocketbaseToken($connectedWallet)
		await connectPb({ token })
		status = 'systemConnected'
	}

	const loginToSystem = async () => {
		const token = await fetchPocketbaseToken($connectedWallet)
		await connectPb({ token })
		status = 'systemConnected'
	}

	const relog = async () => {
		await logout()
		await login()
	}

	const logout = async () => {
		await disconnectPb()
		await disconnectWallet()
		status = 'disconnected'
	}

	// support ------------------------------------------------------------
	const fetchPocketbaseToken = async (wallet: WalletState) => {
		const signer = await new BrowserProvider(wallet.provider).getSigner()

		const message = new SiweMessage({
			version: '1',
			chainId: 1,
			scheme: window.location.protocol.slice(0, -1),
			domain: window.location.host,
			uri: window.location.origin,
			address: signer.address,
			statement:
				'By signing, you are proving you own this wallet and logging in. This does not initiate a transaction or cost any fees.',
			nonce: await (await fetch('/api/pb/nonce', { credentials: 'include' })).text()
		}).prepareMessage()

		const signature = await signer.signMessage(message)

		const siweVerifyResponse = await fetch('/api/pb/verify', {
			credentials: 'include',
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ message, signature })
		})

		const token = (await siweVerifyResponse.json()).token as string
		return token
	}
</script>

{#if status === 'disconnected'}
	<button class="btn primary" on:click={login}>
		<span>Connect to Wallet</span>
	</button>
{:else if status === 'walletConnected'}
	<button class="btn primary" on:click={loginToSystem}>
		<span>Login</span>
	</button>
{:else if status === 'systemConnected'}
	<button class="btn primary" on:click={logout}>
		<span>Logout</span>
	</button>
{:else if status === 'errored'}
	<button class="btn primary" on:click={relog}>
		<span>Retry</span>
	</button>
{/if}
