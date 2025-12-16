<script lang="ts">
	import { connectWallet, disconnectWallet, walletConnected, connectedWallet } from '$lib/states/walletState'
	import { pbConnected, connectPb, disconnectPb } from '$lib/states/pocketbaseState'
	import { fetchPocketbaseToken } from './lib'

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
</script>

{#if status === 'disconnected'}
	<button class="btn primary" on:click={login}>
		<span>Login</span>
	</button>
{:else if status === 'walletConnected'}
	<button class="btn primary" on:click={loginToSystem}>
		<span>Login to System</span>
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
