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

<form onsubmit={submitPost}>
	<label>
		<span>Title</span>
		<input
			type="text"
			placeholder="A quick headline"
			bind:value={form.title}
			maxlength="120"
		/>
	</label>

	<label>
		<span>Content</span>
		<textarea
			placeholder="What would you like to share?"
			bind:value={form.content}
			rows="4"
		></textarea>
	</label>

	<button class="btn" type="submit" disabled={!formHasContent}>Publish</button>
</form>

<style>
	form {
		display: grid;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}

	label {
		display: grid;
		gap: 0.35rem;
	}

	input,
	textarea {
		width: 100%;
		padding: 0.5rem 0.6rem;
		border: 1px solid #cbd5e1;
		border-radius: 8px;
		font: inherit;
	}
	textarea {
		resize: vertical;
	}

</style>
