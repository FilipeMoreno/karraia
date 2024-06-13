'use client'

import FooterCard from '@/components/footer-card'
import Loading from '@/components/loading'
import LogoComponent from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { userAuthContext } from '@/context/AuthContext'
import { database } from '@/lib/firebaseService'
import { get, getDatabase, off, onValue, ref } from 'firebase/database'
import { InfoIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PiSignOutBold } from 'react-icons/pi'
import AvatarConfirmados from '../components/avatar-confirmados'

export default function Confirmado() {
	const { userAuth, logout } = userAuthContext()
	const [pago, setPago] = useState(false)
	const [carregando, setCarregando] = useState(true)
	const [confirmadoData, setConfirmadoData] = useState<{
		display_name: string
	} | null>(null)
	const route = useRouter()

	useEffect(() => {
		if (!userAuth) {
			route.push('/')
		} else {
			const unsubscribe = verificarPagamento()
			return () => unsubscribe()
		}
	}, [userAuth])

	const verificarPagamento = () => {
		const pagamentoRef = ref(database, `confirmados/${userAuth?.uid}/pago`)

		const pagamentoListener = onValue(
			pagamentoRef,
			(snapshot) => {
				if (snapshot.exists()) {
					const pago = snapshot.val()
					setPago(pago)
				}
				setCarregando(false)
			},
			(error) => {
				console.error('Erro ao verificar pagamento: ', error)
				setCarregando(false)
			},
		)

		return () => off(pagamentoRef, 'value', pagamentoListener)
	}

	useEffect(() => {
		const fetchConfirmadoData = async () => {
			try {
				const db = getDatabase()
				const snapshot = await get(ref(db, `confirmados/${userAuth?.uid}`))
				if (snapshot.exists()) {
					setConfirmadoData(snapshot.val())
				} else {
					console.log('No data available')
				}
			} catch (error) {
				console.error('Erro ao buscar os dados do confirmado: ', error)
			} finally {
				setCarregando(false)
			}
		}

		if (userAuth && pago) {
			fetchConfirmadoData()
		}
	}, [userAuth, pago])

	if (carregando) {
		return <Loading />
	}

	return (
		<main className="flex min-h-screen flex-col items-center gap-8 bg-fj bg-no-repeat p-4">
			<LogoComponent />
			{!pago ? (
				<Card className="w-full animate-delay-300 animate-fade-down lg:w-[600px]">
					<CardContent>
						<div className="mt-4 flex flex-col items-center justify-center gap-2">
							<InfoIcon size={60} color="orange" />
							<p className="font-bold text-xl">Aguardando confirmação!</p>
							<p className="text-justify">
								Aguarde a confirmação do seu pagamento. Assim que for
								confirmado, você receberá as informações pelo e-mail cadastrado.
							</p>
							<AvatarConfirmados modelo={1} />
						</div>
					</CardContent>
					<CardFooter>
						<Button onClick={logout} variant={'destructive'} className="w-full">
							<PiSignOutBold className="mr-2" />
							Sair do app
						</Button>
					</CardFooter>
				</Card>
			) : (
				<Card className="w-full animate-delay-300 animate-fade-down lg:w-[600px]">
					<CardContent>
						<div className="mt-4 flex flex-col items-center justify-center gap-2">
							<Image
								src="/icon.png"
								height={100}
								width={100}
								alt="KArraiá Icon"
							/>
							<p className="font-bold text-xl">Pagamento Confirmado!</p>
							<p>Sua presença e pagamento foram confirmados.</p>
							<p>Te espero no KArraiá, {confirmadoData?.display_name}!</p>
							<AvatarConfirmados modelo={3} />
						</div>
					</CardContent>
					<CardFooter>
						<Button onClick={logout} variant={'destructive'} className="w-full">
							<PiSignOutBold className="mr-2" />
							Sair do app
						</Button>
					</CardFooter>
				</Card>
			)}
			<FooterCard />
		</main>
	)
}