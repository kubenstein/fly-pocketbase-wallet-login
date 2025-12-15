import { readable } from 'svelte/store'
import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import PocketBase from 'pocketbase'

// INIT ------------------------------------------------ //

const _client = new PocketBase(PUBLIC_POCKETBASE_URL)

// API -------------------------------------------------- //
export const pbConnected = readable<boolean>(false, (set) => {
	const unsubscribe = _client.authStore.onChange(() => {
		set(_client.authStore.isValid)
	})
	set(_client.authStore.isValid)
	return unsubscribe
})

export const pbClient = readable(_client)

export const connectPb = async ({ token }: { token: string }) => {
	_client.authStore.save(token)
	await _client.collection('users').authRefresh()
	return _client
}

export const disconnectPb = () => {
	_client.authStore.clear()
}
