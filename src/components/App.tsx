import React from "react"

import useData from "../hooks/useData"

type UserData = {
	hex: string
	name: string | undefined
	image: string | undefined
	website: string | undefined
}

const App = () => {
	const userData = useData()

	return (
		<>
			[todo]
			<br />
			{userData.length}
			<br />
			<ol>
				{userData.map((event, key) => {
					const { hex, name, image, website, npub } = event
					const stream = `https://primal.net/p/${npub}`
					return (
						<li key={key}>
							{hex} {!!name && `(${name})`}{" "}
							{!!website && (
								<a href={website} target="_blank" rel="noreferrer">
									{website}
								</a>
							)}
							<img src={image} height={20} width={20} />
							<a href={stream} target="_blank" rel="noreferrer">
								stream
							</a>
							<hr />
						</li>
					)
				})}
			</ol>
		</>
	)
}

export default App
