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
			<ul>
				{userData.map((event, key) => {
					const { hex, name, image, website } = event
					return (
						<li key={key}>
							{hex} {!!name && `(${name})`}{" "}
							{!!website && (
								<a href={website} target="_blank" rel="noreferrer">
									{website}
								</a>
							)}
							<img src={image} height={20} width={20} />
							<hr />
						</li>
					)
				})}
			</ul>
		</>
	)
}

export default App
