'use client'

import { getDatabase, onValue, ref } from 'firebase/database'
import { useEffect, useState } from 'react'

const OnlineUsers = () => {
	const [onlineUsers, setOnlineUsers] = useState<string[]>([])

	useEffect(() => {
		const database = getDatabase()
		const onlineUsersRef = ref(database, 'status/onlineUsers')

		onValue(onlineUsersRef, (snapshot) => {
			const users = snapshot.val()
			const onlineUserIds = users ? Object.keys(users) : []
			setOnlineUsers(onlineUserIds)
		})
	}, [])

	return (
		<div>
			<h2>Usuários Online</h2>
			<ul>
				{onlineUsers.map((userId) => (
					<li key={userId}>{userId}</li>
				))}
			</ul>
		</div>
	)
}

export default OnlineUsers
