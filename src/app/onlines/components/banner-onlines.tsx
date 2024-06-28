import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/ui/hover-card'
import { userAuthContext } from '@/context/AuthContext'
import { getDatabase, onValue, ref } from 'firebase/database'
import { useEffect, useState } from 'react'
import { FaCircle } from 'react-icons/fa6'

export default function BannerOnlines() {
	const { userAuth } = userAuthContext()
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
		<div className="w-full rounded-lg bg-white p-2">
			{onlineUsers.length === 1 ? (
				<span className="flex flex-row items-center justify-center gap-2">
					<FaCircle className="h-3 w-3 animate-pulse text-green-500" /> Só você
					está online no momento!
				</span>
			) : (
				<HoverCard>
					<span className="flex flex-row items-center justify-center gap-2 text-center">
						<FaCircle className="h-3 w-3 animate-pulse text-green-500" /> Você e
						mais
						<HoverCardTrigger asChild className="-mx-1">
							<span className="cursor-pointer">{onlineUsers.length - 1}</span>
						</HoverCardTrigger>
						pessoas estão online no momento!
					</span>
					<HoverCardContent className="ml-4 w-80">
						<div className="flex flex-col gap-2">
							{onlineUsers.map((user) => (
								<div key={user.id} className="flex items-center gap-2">
									<FaCircle className="h-3 w-3 text-green-500" />
									<span>
										{user.name} {user.id === userAuth?.uid ? '(você)' : ''}
									</span>
								</div>
							))}
						</div>
					</HoverCardContent>
				</HoverCard>
			)}
		</div>
	)
}
