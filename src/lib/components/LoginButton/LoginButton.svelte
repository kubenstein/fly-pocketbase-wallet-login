<script lang="ts">
	import {
		connectWallet,
		disconnectWallet,
		walletConnected,
		connectedWallet,
		connectedWalletAddress
	} from '$lib/states/walletState'
	import { pbConnected, connectPb, disconnectPb } from '$lib/states/pocketbaseState'
	import { fetchPocketbaseToken } from './lib'

	const formatAddress = (address: string | null) => (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '')

	async function authPocketbase() {
		const token = await fetchPocketbaseToken($connectedWallet)
		await connectPb({ token })
	}

	async function disconnectEverything() {
		await disconnectWallet()
		await disconnectPb()
	}
</script>

<div class="session-card">
	<div class="status-row">
		<div class={`status-pill ${$walletConnected ? 'online' : ''}`}>
			<span class="dot"></span>
			<div>
				<p class="pill__label">Wallet</p>
				<p class="pill__value">
					{$walletConnected ? formatAddress($connectedWalletAddress) : 'Not connected'}
				</p>
			</div>
		</div>
		<div class={`status-pill ${$pbConnected ? 'online' : ''}`}>
			<span class="dot"></span>
			<div>
				<p class="pill__label">PocketBase</p>
				<p class="pill__value">
					{$pbConnected ? 'Authenticated' : 'Not connected'}
				</p>
			</div>
		</div>
	</div>

	<div class="actions">
		<button class="btn primary" on:click={$walletConnected ? disconnectEverything : connectWallet}>
			<span>{$walletConnected ? 'Disconnect wallet' : 'Connect wallet'}</span>
			{#if $walletConnected}
				<span class="tag">{formatAddress($connectedWalletAddress)}</span>
			{/if}
		</button>

		{#if $walletConnected}
			<button class="btn primary" on:click={$pbConnected ? disconnectPb : authPocketbase}>
				<span>{$pbConnected ? 'Logout' : 'Login'}</span>
			</button>
		{/if}
	</div>
</div>

<style>
	.session-card {
		display: grid;
		gap: 0.65rem;
		width: 100%;
	}

	.status-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 0.6rem;
	}

	.status-pill {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		padding: 0.65rem 0.85rem;
		border-radius: 14px;
		border: 1px solid var(--border);
		background: var(--panel);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
		backdrop-filter: var(--glass);
	}

	.status-pill.online {
		border-color: rgba(104, 242, 201, 0.55);
		box-shadow: 0 12px 36px rgba(104, 242, 201, 0.22);
	}

	.dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--border-strong);
		box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.03);
	}

	.status-pill.online .dot {
		background: var(--accent);
		box-shadow: 0 0 0 6px rgba(104, 242, 201, 0.15);
		animation: pulse 3.4s ease-in-out infinite;
	}

	.pill__label {
		margin: 0;
		font-size: 0.75rem;
		text-transform: uppercase;
		color: var(--muted);
		letter-spacing: 0.08em;
	}

	.pill__value {
		margin: 0.1rem 0 0 0;
		font-weight: 600;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 0.5rem;
	}

	.actions .btn {
		min-width: 190px;
	}

	.tag {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.35rem 0.7rem;
		border-radius: 999px;
		border: 1px solid transparent;
		background:
			linear-gradient(120deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04)) padding-box,
			linear-gradient(120deg, rgba(104, 242, 201, 0.5), rgba(125, 211, 252, 0.45), rgba(104, 242, 201, 0.5)) border-box;
		font-size: 0.85rem;
		letter-spacing: 0.01em;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
		position: relative;
		overflow: hidden;
	}

	.tag::after {
		content: '';
		position: absolute;
		inset: -120% 0;
		background: linear-gradient(120deg, transparent 30%, rgba(255, 255, 255, 0.18) 50%, transparent 70%);
		animation: shimmer 5s infinite;
	}

	.tag--sync {
		border-color: rgba(255, 178, 71, 0.6);
		background:
			linear-gradient(120deg, rgba(255, 178, 71, 0.18), rgba(255, 178, 71, 0.08)) padding-box,
			linear-gradient(120deg, rgba(255, 178, 71, 0.65), rgba(255, 255, 255, 0.08)) border-box;
		color: #ffd8a2;
	}

	.tag--synced {
		border-color: rgba(104, 242, 201, 0.9);
		background:
			linear-gradient(120deg, rgba(104, 242, 201, 0.3), rgba(125, 211, 252, 0.22)) padding-box,
			linear-gradient(120deg, rgba(104, 242, 201, 0.8), rgba(125, 211, 252, 0.7)) border-box;
		color: #061d23;
		box-shadow: 0 12px 30px rgba(104, 242, 201, 0.28);
	}

	@keyframes pulse {
		0% {
			transform: scale(0.9);
			box-shadow: 0 0 0 4px rgba(104, 242, 201, 0.1);
		}
		100% {
			transform: scale(1.2);
			box-shadow: 0 0 0 6px rgba(104, 242, 201, 0.15);
		}
	}

	@keyframes shimmer {
		0% {
			transform: translateX(-40%);
		}
		100% {
			transform: translateX(140%);
		}
	}

	@media (max-width: 640px) {
		.actions {
			justify-content: flex-start;
		}
	}
</style>
