import * as React from "react"

import * as NostrTools from "nostr-tools"
import NDK, * as NDKUtil from "@nostr-dev-kit/ndk"

type UserData = {
	hex: string
	npub: string
	name: string | undefined
	image: string | undefined
	website: string | undefined
}

const useData = (): UserData[] => {
	const [following, setFollowing] = React.useState<NDKUtil.NDKTag[]>([])

	const [userData, setUserData] = React.useState<Record<string, UserData>>({})

	const nip07signer = new NDKUtil.NDKNip07Signer()
	const ndk = new NDK({
		explicitRelayUrls: ["wss://relay.damus.io", "wss://bitcoiner.social"],
		signer: nip07signer,
	})

	React.useEffect(() => {
		if (ndk) {
			// get the user via browser and find their notes from relays
			connect()
		}
	}, [ndk])

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

			lookUpUserData()
		}
	}

	const lookUpUserData = async () => {
		console.log("user count", following.length)
		let users: Record<string, UserData> = {}

		for (let i = 0; i < following.length; i++) {
			const hex = following[i][1]
			console.log("hex " + i, hex)

			const user = ndk.getUser({
				hexpubkey: hex,
			})
			console.log("user " + i, user)
			await user.fetchProfile()

			const userData: UserData = {
				hex,
				npub: user.npub,
				name: user.profile?.name,
				image: user.profile?.image,
				website: user.profile?.website,
			}
			users[hex] = userData

			console.log("user " + i + " profile:", user.profile)
			setUserData(users)
		}
	}

	return Object.values(userData)
}

export default useData
