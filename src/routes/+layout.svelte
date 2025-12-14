<script lang="ts">
	import LoginButton from '$lib/components/LoginButton/LoginButton.svelte'
	const { children } = $props()
</script>


<LoginButton />

<main>
	{@render children?.()}
</main>
