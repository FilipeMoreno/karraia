'use client'
import { getDatabase, onValue, ref } from 'firebase/database'
import { useEffect, useState } from 'react'

const OnlineUsers = () => {
	const [onlineUsers, setOnlineUsers] = useState<
		{ id: string; name: string }[]
	>([])

	useEffect(() => {
		const database = getDatabase()
		const onlineUsersRef = ref(database, 'status')

		onValue(onlineUsersRef, (snapshot) => {
			const users = snapshot.val()
			const onlineUserIds = users ? Object.keys(users) : []

			const onlineUsersArray = onlineUserIds
				.filter((userId) => users[userId]?.state === 'online')
				.map((userId) => ({
					id: userId,
					name: users[userId]?.name || 'Usuário desconhecido',
				}))

			setOnlineUsers(onlineUsersArray)
		})
	}, [])

	return (
		<div>
			<h2>Usuários Online</h2>
			<ul>
				{onlineUsers.map((user) => (
					<li key={user.id}>{user.name}</li>
				))}
			</ul>
		</div>
	)
}

export default OnlineUsers
