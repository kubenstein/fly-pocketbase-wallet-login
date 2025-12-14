<script lang="ts">
	import { connectWallet, disconnectWallet, walletConnected, connectedWallet, connectedWalletAddress } from '$lib/states/walletState.svelte'
	import { pbConnected, connectPb, disconnectPb } from '$lib/states/pocketbaseState.svelte'
  import { fetchPocketbaseToken } from './lib';


	async function authPocketbase() {
		const token = await fetchPocketbaseToken($connectedWallet);
		await connectPb({ token });
	}

	async function disconnectEverything() {
		await disconnectWallet();
		await disconnectPb();
	}
</script>

<button onclick={$walletConnected ? disconnectEverything : connectWallet}>
	{$walletConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
	{#if $walletConnected}
		({$connectedWalletAddress})
	{/if}
</button>

<br />
<br />
<br />

{#if $walletConnected}
	<button onclick={$pbConnected ? disconnectPb: authPocketbase}>
		{$pbConnected ? 'Logout (Disconnect pocketbase)' : 'Login (Connect pocketbase)'}
	</button>
{/if}
