import { derived, writable, get } from 'svelte/store'
import Onboard, { type WalletState } from '@web3-onboard/core'
import type { Chain } from '@web3-onboard/common'
import injectedModule from '@web3-onboard/injected-wallets'

// CONFIG ----------------------------------------------- //

// STATE ------------------------------------------------ //
export const connectedWallets = writable<WalletState[]>([])

// INIT ------------------------------------------------- //
const chains: Chain[] = [
	{
		id: '0x1',
		token: 'ETH',
		label: 'Ethereum',
		rpcUrl: 'https://rpc.ankr.com/eth'
	}
]

const onboard = Onboard({
	appMetadata: {
		name: 'PocketBase Wallet Login',
		icon: '/brand-logo.svg',
		description: 'Login to PocketBase using your wallet'
	},
	wallets: [injectedModule()],
	chains,
	connect: {
		autoConnectLastWallet: true,
		showSidebar: false
	},
	accountCenter: {
		desktop: {
			position: 'bottomRight',
			enabled: true,
			minimal: true
		},
		mobile: {
			position: 'bottomRight',
			enabled: true,
			minimal: true
		}
	}
})

onboard.state.select('wallets').subscribe((wallets) => {
	connectedWallets.set(wallets)
})

// API -------------------------------------------------- //
export const connectWallet = async () => {
	await onboard.connectWallet()
	await onboard.setChain({ chainId: '0x1' })
}

export const disconnectWallet = () => onboard.disconnectWallet({ label: get(connectedWallets)[0]?.label })

export const connectedWalletAddress = derived(connectedWallets, ($connectedWallets) => {
	if ($connectedWallets.length === 0) return null
	return $connectedWallets[0].accounts[0].address as string
})

export const connectedWallet = derived(connectedWallets, ($connectedWallets) => $connectedWallets?.[0])
export const walletConnected = derived(connectedWallets, ($connectedWallets) => $connectedWallets.length > 0)
