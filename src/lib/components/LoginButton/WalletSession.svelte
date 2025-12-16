<script lang="ts">
	import LoginButton from './LoginButton.svelte'
	import { walletConnected, connectedWalletAddress } from '$lib/states/walletState'
</script>

<div class="session-card">
	<div class="status-row">
		<div class={`status-pill ${$walletConnected ? 'online' : ''}`}>
			<span class="dot"></span>
			<div>
				<p class="pill__label">Wallet</p>
				<p class="pill__value">
					{$walletConnected ? $connectedWalletAddress : 'Not connected'}
				</p>
			</div>
		</div>
	</div>

	<div class="actions">
		<LoginButton />
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

	@media (max-width: 640px) {
		.actions {
			justify-content: flex-start;
		}
	}
</style>
