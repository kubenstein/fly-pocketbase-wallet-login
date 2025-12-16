<script lang="ts">
	import {
		connectWallet,
		disconnectWallet,
		walletConnected,
		connectedWallet
	} from '$lib/states/walletState'
	import { pbConnected, connectPb, disconnectPb } from '$lib/states/pocketbaseState'
	import { fetchPocketbaseToken } from './lib'

	let status: 'disconnected' | 'connectingWallet' | 'connectingSystem' | 'connected' | 'errored' = 'disconnected'

	// Keep local status in sync with restored sessions from the stores
	$: {
		const waitingOnWallet = status === 'connectingWallet'

		if ($walletConnected && $pbConnected) {
			if (status !== 'connected') status = 'connected'
		} else if ($walletConnected) {
			if (status !== 'connectingSystem') status = 'connectingSystem'
		} else if ($pbConnected) {
			if (status !== 'connectingWallet') status = 'connectingWallet'
		} else if (!waitingOnWallet && status !== 'disconnected') {
			status = 'disconnected'
		}
	}

	const login = async () => {
		status = 'connectingWallet'
		await connectWallet()
		status = 'connectingSystem'
		const token = await fetchPocketbaseToken($connectedWallet)
		await connectPb({ token })
		status = 'connected'
	}

	const logout = async () => {
		await disconnectWallet()
		await disconnectPb()
		status = 'disconnected'
	}
</script>

<button class="btn primary" on:click={$walletConnected ? logout : login}>
	<span>
		{#if status === 'connected'}
			Logout
		{:else if status === 'connectingWallet'}
			Connecting wallet...
		{:else if status === 'connectingSystem'}
			Connecting to system...
		{:else if status === 'errored'}
			Retry login
		{:else}
			Login
		{/if}
	</span>
</button>
