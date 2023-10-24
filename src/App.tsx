import React from "react"
import * as NostrTools from "nostr-tools"
import NDK, * as NDKUtil from "@nostr-dev-kit/ndk"

const App = () => {
	const nip07signer = new NDKUtil.NDKNip07Signer()
	const ndk = new NDK({
		explicitRelayUrls: ["wss://relay.damus.io", "wss://bitcoiner.social"],
		signer: nip07signer,
	})

	const [foundEvents, setFoundEvents] = React.useState<NDKUtil.NDKEvent[]>([])

	const connect = async () => {
		// get the user from the browser extension - if we can
		const user = await nip07signer.user()
		if (!!user.npub) {
			console.log("Permission granted to read their public key:", user.npub)

			const { data: hexUser } = NostrTools.nip19.decode(user.npub)

			await ndk.connect()

			const filter = {
				kinds: [1],
				authors: [hexUser as string],
			}

			const events = await ndk.fetchEvents(filter)
			setFoundEvents(Array.from(events))
		}
	}

	React.useEffect(() => {
		if (ndk) {
			// get the user via browser and find their notes from relays
			connect()
		}
	}, [ndk])

	return (
		<>
			[todo]
			<br />
			{foundEvents.length}
			<br />
			<ul>
				{foundEvents.map((event, key) => (
					<li key={key}>{event.content}</li>
				))}
			</ul>
		</>
	)
}

export default App
