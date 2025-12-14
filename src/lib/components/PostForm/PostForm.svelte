<script lang="ts">
	import { pbClient, pbConnected } from '$lib/states/pocketbaseState.svelte'

	type PostForm = { title: string; content: string }

	let { onPosted } = $props<{ onPosted?: () => void | Promise<void> }>()

	const form = $state<PostForm>({ title: '', content: '' })
	const formHasContent = $derived(Boolean(form.title.trim() || form.content.trim()))

	const resetForm = () => {
		form.title = ''
		form.content = ''
	}

	const submitPost = async (event?: SubmitEvent) => {
		event?.preventDefault()

		if (!$pbConnected) return
		if (!formHasContent) return

		const userId = $pbClient.authStore.model?.id
		if (!userId) return

		try {
			await $pbClient.collection('posts').create({
				title: form.title.trim(),
				content: form.content.trim(),
				userId
			})
			resetForm()
			if (onPosted) await onPosted()
		} catch (error) {
			console.error(error)
		}
	}
</script>

<form class="composer-form" onsubmit={submitPost}>
	<label class="field">
		<div class="field__head">
			<span>Title</span>
			<small>Optional headline</small>
		</div>
		<input
			class="control"
			type="text"
			placeholder="A quick headline"
			bind:value={form.title}
			maxlength="120"
		/>
	</label>

	<label class="field">
		<div class="field__head">
			<span>Content</span>
			<small>What do you want to share?</small>
		</div>
		<textarea
			class="control"
			placeholder="What would you like to share?"
			bind:value={form.content}
			rows="4"
		></textarea>
	</label>

	<div class="form__footer">
		<p class="hint">Stored on PocketBase after wallet auth.</p>
		<button class="btn primary" type="submit" disabled={!formHasContent}>Publish</button>
	</div>
</form>

<style>
	.composer-form {
		display: grid;
		gap: 0.85rem;
		margin-top: 0.35rem;
	}

	.field {
		display: grid;
		gap: 0.35rem;
	}

	.field__head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.5rem;
		color: var(--muted);
		font-size: 0.95rem;
	}

	.control {
		width: 100%;
		padding: 0.75rem 0.85rem;
		border: 1px solid var(--border);
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.04);
		color: var(--text);
		font: inherit;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
		transition: border-color 140ms ease, box-shadow 140ms ease, background 140ms ease;
	}

	.control:focus {
		outline: none;
		border-color: var(--accent);
		box-shadow: 0 0 0 3px rgba(104, 242, 201, 0.2);
		background: rgba(255, 255, 255, 0.08);
	}

	.control::placeholder {
		color: rgba(255, 255, 255, 0.55);
	}

	textarea {
		resize: vertical;
		min-height: 120px;
	}

	.form__footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.hint {
		margin: 0;
		color: var(--muted);
		font-size: 0.9rem;
	}
</style>
