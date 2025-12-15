<script lang="ts">
	import LoginButton from '$lib/components/LoginButton/LoginButton.svelte'
	const { children } = $props()
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
	/>
</svelte:head>

<div class="layout-shell">
	<div class="bg-veil bg-veil--one"></div>
	<div class="bg-veil bg-veil--two"></div>

	<header class="navbar">
		<div class="brand">
			<div class="brand__logo">
				<span class="beam beam--one"></span>
				<span class="beam beam--two"></span>
				<span class="brand__dot"></span>
			</div>
			<div class="brand__copy">
				<p class="eyebrow">PocketBase x Web3</p>
				<h1>Signal Board</h1>
			</div>
		</div>

		<div class="nav-actions">
			<LoginButton />
		</div>
	</header>

	<main>
		{@render children?.()}
	</main>
</div>

<style>
	:global(:root) {
		--bg: #05070f;
		--panel: rgba(255, 255, 255, 0.03);
		--panel-strong: rgba(255, 255, 255, 0.08);
		--border: rgba(255, 255, 255, 0.1);
		--border-strong: rgba(255, 255, 255, 0.2);
		--accent: #68f2c9;
		--accent-2: #7dd3fc;
		--text: #eaf2ff;
		--muted: #97a5c1;
		--shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
		--radius: 16px;
		--glass: blur(18px);
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(body) {
		margin: 0;
		min-height: 100vh;
		background:
			radial-gradient(circle at 15% 20%, rgba(104, 242, 201, 0.08), transparent 25%),
			radial-gradient(circle at 80% 0%, rgba(125, 211, 252, 0.16), transparent 24%),
			linear-gradient(135deg, #05070f, #080c18 50%, #0b1424);
		color: var(--text);
		font-family:
			'Space Grotesk',
			'Inter',
			system-ui,
			-apple-system,
			sans-serif;
		line-height: 1.6;
	}

	:global(a) {
		color: inherit;
		text-decoration: none;
	}

	:global(main) {
		max-width: 1120px;
		margin: 0 auto;
		position: relative;
		z-index: 1;
		width: 100%;
	}

	.layout-shell {
		position: relative;
		overflow: hidden;
		min-height: 100vh;
		padding: 2.5rem 1.25rem 3rem;
	}

	.bg-veil {
		position: absolute;
		inset: 0;
		filter: var(--glass);
		pointer-events: none;
	}

	.bg-veil--one {
		background: radial-gradient(circle at 20% 40%, rgba(104, 242, 201, 0.12), transparent 35%);
	}

	.bg-veil--two {
		background: radial-gradient(circle at 80% 10%, rgba(125, 211, 252, 0.18), transparent 30%);
	}

	.navbar {
		position: sticky;
		top: 1.25rem;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.25rem;
		margin: 0 auto 1.75rem;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
		box-shadow: var(--shadow);
		backdrop-filter: var(--glass);
		max-width: 1120px;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.85rem;
	}

	.brand__logo {
		position: relative;
		width: 46px;
		height: 46px;
		border-radius: 14px;
		border: 1px solid var(--border-strong);
		background: linear-gradient(145deg, rgba(104, 242, 201, 0.12), rgba(125, 211, 252, 0.08));
		overflow: hidden;
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
	}

	.brand__dot {
		position: absolute;
		inset: 8px;
		border-radius: 10px;
		background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.05));
	}

	.beam {
		position: absolute;
		width: 120%;
		height: 30%;
		top: 10px;
		left: -10%;
		border-radius: 999px;
		opacity: 0.75;
		transform: rotate(-18deg);
		filter: drop-shadow(0 0 12px rgba(104, 242, 201, 0.45));
	}

	.beam--one {
		background: linear-gradient(90deg, rgba(104, 242, 201, 0.75), rgba(125, 211, 252, 0.2));
	}

	.beam--two {
		top: 22px;
		transform: rotate(14deg);
		background: linear-gradient(90deg, rgba(255, 255, 255, 0.4), rgba(125, 211, 252, 0.45));
	}

	.brand__copy h1 {
		margin: 0;
		font-size: 1.35rem;
		letter-spacing: -0.02em;
	}

	.eyebrow {
		margin: 0 0 0.15rem 0;
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--muted);
	}

	.nav-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		justify-content: flex-end;
		flex: 1;
		min-width: 280px;
	}

	:global(.btn) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		padding: 0.6rem 1rem;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: var(--panel);
		color: var(--text);
		font-weight: 600;
		font-size: 0.95rem;
		cursor: pointer;
		transition:
			transform 160ms ease,
			box-shadow 160ms ease,
			border-color 160ms ease;
		backdrop-filter: var(--glass);
	}

	:global(.btn:disabled) {
		opacity: 0.5;
		cursor: not-allowed;
	}

	:global(.btn.primary) {
		background: linear-gradient(135deg, var(--accent), var(--accent-2));
		color: #071018;
		border-color: transparent;
		box-shadow: 0 10px 30px rgba(104, 242, 201, 0.45);
	}

	:global(.btn.ghost) {
		border-color: var(--border-strong);
		color: var(--text);
		background: rgba(255, 255, 255, 0.04);
	}

	:global(.btn.subtle) {
		border-color: rgba(255, 255, 255, 0.08);
		background: rgba(255, 255, 255, 0.03);
		color: var(--text);
	}

	:global(.btn:hover:not(:disabled)) {
		transform: translateY(-1px);
		border-color: var(--accent);
		box-shadow: 0 12px 28px rgba(104, 242, 201, 0.22);
	}

	@media (max-width: 768px) {
		.navbar {
			flex-direction: column;
			align-items: flex-start;
		}

		.nav-actions {
			width: 100%;
			justify-content: flex-start;
		}
	}
</style>
