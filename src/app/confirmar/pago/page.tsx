'use client'

import LogoComponent from '@/components/logo'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { userAuthContext } from '@/context/AuthContext'
import { InfoIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { PiSignOutBold } from 'react-icons/pi'

export default function Confirmado() {
	const { userAuth, logout } = userAuthContext()
	const route = useRouter()

	if (!userAuth) {
		return route.push('/')
	}

	return (
		<main className="flex min-h-screen flex-col items-center gap-8 bg-fj p-4">
			<LogoComponent />
			<Card className="w-full lg:w-[600px]">
				<CardContent>
					<div className="mt-4 flex flex-col items-center justify-center gap-2">
						<InfoIcon size={60} color="orange" />
						<p className="font-bold text-xl">Aguardando confirmação!</p>
						<p>
							Aguarde a confirmação do pagamento. Assim que o pagamento for
							confirmado, você recebera as informações pelo e-mail cadastrado.
						</p>
					</div>
				</CardContent>
				<CardFooter>
					<Button onClick={logout} variant={'destructive'} className="w-full">
						<PiSignOutBold className="mr-2" />
						Sair do app
					</Button>
				</CardFooter>
			</Card>
			<Card className="w-full lg:w-[600px]">
				<CardContent>
					<div className="mt-4 flex flex-col items-center justify-center gap-2">
						{/* <CheckCircleIcon size={60} color="green" /> */}
						<Image
							src="/favicon.ico"
							height={100}
							width={100}
							alt="KArraiá Icon"
						/>
						<p className="font-bold text-xl">Pagamento Confirmado!</p>

						<p>Seu pagamento e sua presença foram confirmados.</p>
						<p>Te espero no KArraiá, {userAuth?.displayName}!</p>
						<div className="flex items-center justify-center gap-2">
							<p>Você e mais </p>
							<div className="-space-x-3 flex *:ring *:ring-white">
								<Avatar>
									<AvatarImage
										src={userAuth?.photoURL ?? '/favicon.ico'}
										alt={userAuth?.displayName ?? 'KA'}
									/>
									<AvatarFallback>
										{userAuth?.displayName
											?.split(' ')
											.map((name) => name[0])
											.join('')}
									</AvatarFallback>
								</Avatar>
								<Avatar>
									<AvatarImage
										src={userAuth?.photoURL ?? '/favicon.ico'}
										alt={userAuth?.displayName ?? 'KA'}
									/>
									<AvatarFallback>
										{userAuth?.displayName
											?.split(' ')
											.map((name) => name[0])
											.join('')}
									</AvatarFallback>
								</Avatar>
								<Avatar>
									<AvatarImage
										src={userAuth?.photoURL ?? '/favicon.ico'}
										alt={userAuth?.displayName ?? 'KA'}
									/>
									<AvatarFallback>
										{userAuth?.displayName
											?.split(' ')
											.map((name) => name[0])
											.join('')}
									</AvatarFallback>
								</Avatar>
								<Avatar>
									<AvatarImage
										src={userAuth?.photoURL ?? '/favicon.ico'}
										alt={userAuth?.displayName ?? 'KA'}
									/>
									<AvatarFallback>
										{userAuth?.displayName
											?.split(' ')
											.map((name) => name[0])
											.join('')}
									</AvatarFallback>
								</Avatar>
								<Avatar>
									<AvatarFallback>+10</AvatarFallback>
								</Avatar>
							</div>
							<p>estão confirmados!</p>
						</div>
					</div>
				</CardContent>
				<CardFooter>
					<Button onClick={logout} variant={'destructive'} className="w-full">
						<PiSignOutBold className="mr-2" />
						Sair do app
					</Button>
				</CardFooter>
			</Card>
		</main>
	)
}
