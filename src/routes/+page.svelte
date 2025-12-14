<script lang="ts">
	import { onMount } from 'svelte'
	import { pbClient, pbConnected } from '$lib/states/pocketbaseState.svelte'
	import PostForm from '$lib/components/PostForm/PostForm.svelte'
	import { type PostRecord } from '$lib/api/posts'

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

<section class="posts">
	<header class="posts__header">
		<div>
			<h1>Posts</h1>
			<p class="muted">Backed by the PocketBase `posts` collection.</p>
		</div>
		<button class="btn ghost" onclick={loadPosts}>Refresh</button>
	</header>

	{#if posts?.length}
		<ul class="posts__list">
			{#each posts as post}
				<li class="post">
					<div class="post__heading">
						<h3>{post.title || 'Untitled post'}</h3>
						<small>{new Date(post.created).toLocaleString()}</small>
					</div>
					{#if post.content}
						<p>{post.content}</p>
					{/if}
					<small class="muted">Posted by {post.userId}</small>
				</li>
			{/each}
		</ul>
	{:else if posts}
		<p>No posts yet.</p>
	{/if}
</section>

<section class="composer">
	<h2>Create a post</h2>
	{#if !$pbConnected}
		<p class="muted">Connect your wallet and log into PocketBase to share a post.</p>
	{:else}
		<PostForm onPosted={loadPosts} />
	{/if}
</section>

<style>
	section {
		max-width: 768px;
		margin: 0 auto 2rem;
		padding: 1rem;
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		background: #fff;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
	}

	h1,
	h2 {
		margin: 0 0 0.25rem 0;
	}

	.posts__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.posts__list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.75rem;
	}

	.post {
		padding: 0.75rem;
		border: 1px solid #e2e8f0;
		border-radius: 10px;
		background: #f9fafb;
	}

	.post__heading {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.post h3 {
		margin: 0;
	}

	.post p {
		margin: 0.35rem 0;
	}

	:global(.btn) {
		width: fit-content;
		padding: 0.55rem 1.1rem;
		border-radius: 10px;
		border: 1px solid #111827;
		background: #111827;
		color: #fff;
		cursor: pointer;
		font-weight: 600;
	}

	:global(.btn:disabled) {
		opacity: 0.7;
		cursor: not-allowed;
	}

	:global(.ghost) {
		background: transparent;
		color: #111827;
	}

	.muted {
		color: #6b7280;
		margin: 0;
	}
</style>
