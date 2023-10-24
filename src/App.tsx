import React from "react"
import * as NostrTools from "nostr-tools"
import NDK, * as NDKUtil from "@nostr-dev-kit/ndk"

const App = () => {
	const nip07signer = new NDKUtil.NDKNip07Signer()
	const ndk = new NDK({
		explicitRelayUrls: ["wss://relay.damus.io", "wss://bitcoiner.social"],
		signer: nip07signer,
	})

	const [following, setFollowing] = React.useState<NDKUtil.NDKTag[]>([])

	const connect = async () => {
		// get the user from the browser extension - if we can
		const user = await nip07signer.user()
		if (!!user.npub) {
			console.log("Permission granted to read their public key:", user.npub)

			const { data: hexUser } = NostrTools.nip19.decode(user.npub)

			await ndk.connect()

			const filter = {
				kinds: [3],
				authors: [hexUser as string],
			}

			const events = await ndk.fetchEvents(filter)
			console.log(events)
			const following = Array.from(events)[0].tags
			console.log("tags", following)

			setFollowing(following)
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
			{following.length}
			<br />
			<ul>
				{following.map((event, key) => {
					const [p, hex, relay] = event
					return (
						<li key={key}>
							{hex} {!!relay && <>{relay}</>}
						</li>
					)
				})}
			</ul>
		</>
	)
}

export default App
