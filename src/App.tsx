import React from "react"
import * as NostrTools from "nostr-tools"

import "./App.css"

function App() {
	const [sk, setSk] = React.useState<string>(NostrTools.generatePrivateKey())

	const [pk, setPk] = React.useState<string>(NostrTools.getPublicKey(sk))
	const [relay, setRelay] = React.useState<NostrTools.Relay | null>(null)
	const [eventStream, setEventStream] = React.useState<null | any>(null)
	const [events, setEvents] = React.useState<NostrTools.Event[] | undefined>(
		undefined
	)

	const connectRelay = async () => {
		const relay = NostrTools.relayInit("wss://nos.lol")
		await relay.connect()

		relay.on("connect", () => {
			setRelay(relay)
		})
		relay.on("error", () => {
			console.log("Failed to connect")
		})
	}

	React.useEffect(() => {
		connectRelay()
	}, [])

	const event: NostrTools.EventTemplate = {
		kind: 1,
		created_at: Math.floor(Date.now() / 1000),
		tags: [],
		content: "playing with nostr from react :>",
	}

	const publishEvent = async (eventToPublish: any) => {
		try {
			const definedEvent = NostrTools.finishEvent(eventToPublish, sk)
			const pub = await relay?.publish(definedEvent)
			console.log("published ok?", pub)
		} catch (err) {
			console.log("error published defined event", err)
		}
	}

	const getEvent = async () => {
		const sub = relay?.sub([
			{
				kinds: [1],
				authors: [pk],
			},
		])

		sub?.on("event", (event) => {
			console.log("event in on event from sub", event)
			setEventStream(event)
		})
	}

	const getEvents = async () => {
		const events = await relay?.list([
			{
				kinds: [0, 1],
				authors: [pk],
			},
		])
		console.log("events", events)
		setEvents(events)
	}

	return (
		<>
			<h4>nostr play</h4>
			<p>private key: {sk}</p>
			<p>public key: {pk}</p>
			<hr />
			{!!relay ? <p>connected to {relay?.url}</p> : <p>[not connected]</p>}
			<button onClick={() => publishEvent(event)}>broadcast event</button>
			<hr />
			<button onClick={() => getEvent()}>get event</button>
			<br />
			{!!eventStream ? (
				<p>streamed?: {eventStream.content}</p>
			) : (
				<p>no new event</p>
			)}
			<hr />
			<button onClick={() => getEvents()}>get events</button>
			<br />
			{(events ?? [])?.length > 0 ? (
				<p>
					events?:{" "}
					{events?.map((item: { content: string }, key: number) => (
						<p key={key}>{item.content}</p>
					))}
				</p>
			) : (
				<p>no new events</p>
			)}
		</>
	)
}

export default App
