<script lang="ts">
	import { onMount } from 'svelte'
	import { pbClient, pbConnected } from '$lib/states/pocketbaseState.svelte'
	import PostForm from '$lib/components/PostForm/PostForm.svelte'
	type PostRecord = {
		id: string
		created: string
		updated: string
		userId: string
		title?: string
		content?: string
	}

	let posts: PostRecord[] | null = null

	const loadPosts = async () => {
		try {
			posts = await $pbClient.collection('posts').getFullList<PostRecord>({ sort: '-created' })
		} catch (error: unknown) {
			console.error(error)
		}
	}

	onMount(loadPosts)
</script>

<section class="panel hero">
	<div>
		<p class="eyebrow">Live feed</p>
		<h2>Signal stream</h2>
		<p class="muted">Backed by the PocketBase `posts` collection and gated by your wallet.</p>
	</div>
	<div class="hero__actions">
		<button class="btn ghost" on:click={loadPosts}>Refresh feed</button>
	</div>
</section>

<div class="grid">
	<section class="panel posts">
		<header class="panel__header">
			<div>
				<p class="eyebrow">Latest</p>
				<h3>Recent drops</h3>
				<p class="muted">Time-ordered snapshots signed by connected wallets.</p>
			</div>
		</header>

		{#if posts?.length}
			<ul class="post-grid">
				{#each posts as post}
					<li class="post-card">
						<div class="post-card__meta">
							<span class="chip">{new Date(post.created).toLocaleString()}</span>
							<span class="chip chip--id">User {post.userId}</span>
						</div>
						<h3>{post.title || 'Untitled post'}</h3>
						{#if post.content}
							<p>{post.content}</p>
						{/if}
					</li>
				{/each}
			</ul>
		{:else if posts}
			<p class="muted">No posts yet.</p>
		{:else}
			<p class="muted">Loading feed...</p>
		{/if}
	</section>

	<section class="panel composer">
		<header class="panel__header">
			<div>
				<p class="eyebrow">Create</p>
				<h3>Drop a new signal</h3>
				<p class="muted">Post after authenticating via wallet + PocketBase.</p>
			</div>
		</header>

		{#if !$pbConnected}
			<p class="muted">Connect your wallet and log into PocketBase to share a post.</p>
		{:else}
			<PostForm onPosted={loadPosts} />
		{/if}
	</section>
</div>

<style>
	.panel {
		position: relative;
		border-radius: var(--radius);
		border: 1px solid var(--border);
		background: linear-gradient(160deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
		padding: 1.2rem 1.35rem;
		backdrop-filter: var(--glass);
		box-shadow: var(--shadow);
		overflow: hidden;
	}

	.panel::before {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at 20% 20%, rgba(104, 242, 201, 0.08), transparent 28%),
			radial-gradient(circle at 80% 0%, rgba(125, 211, 252, 0.12), transparent 25%);
		pointer-events: none;
		opacity: 0.8;
	}

	.panel > * {
		position: relative;
		z-index: 1;
	}

	.hero {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.hero h2 {
		margin: 0.1rem 0 0.2rem 0;
		font-size: 1.8rem;
		letter-spacing: -0.02em;
	}

	.hero__actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.grid {
		display: grid;
		grid-template-columns: 1.6fr 1fr;
		gap: 1rem;
		align-items: start;
	}

	.panel__header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1.1rem;
	}

	.panel__header h3 {
		margin: 0.15rem 0;
		font-size: 1.2rem;
		letter-spacing: -0.01em;
	}

	.posts .panel__header {
		margin-bottom: 1.25rem;
	}

	.post-grid {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.85rem;
	}

	.post-card {
		padding: 1rem 1.1rem;
		border-radius: 14px;
		border: 1px solid var(--border);
		background: linear-gradient(160deg, rgba(255, 255, 255, 0.04), rgba(0, 0, 0, 0.2));
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
		transition: border-color 150ms ease, transform 150ms ease, box-shadow 150ms ease;
	}

	.post-card:hover {
		border-color: var(--accent);
		transform: translateY(-2px);
		box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
	}

	.post-card__meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-bottom: 0.35rem;
	}

	.post-card h3 {
		margin: 0.1rem 0;
	}

	.post-card p {
		margin: 0.35rem 0 0;
		color: #d8e2ff;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.35rem 0.65rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.18);
		background: rgba(255, 255, 255, 0.06);
		font-size: 0.85rem;
		color: var(--text);
	}

	.chip--id {
		border-color: rgba(125, 211, 252, 0.35);
		background: rgba(125, 211, 252, 0.1);
	}

	.chip.warning {
		border-color: rgba(255, 178, 71, 0.7);
		background: rgba(255, 178, 71, 0.12);
		color: #ffd596;
	}

	.muted {
		color: var(--muted);
		margin: 0;
	}

	.eyebrow {
		margin: 0;
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--muted);
	}

	@media (max-width: 960px) {
		.grid {
			grid-template-columns: 1fr;
		}

		.hero {
			flex-direction: column;
		}
	}

	@media (max-width: 640px) {
		.panel,
		.hero {
			padding: 1rem 1.05rem;
		}

		.panel__header,
		.hero__actions {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
