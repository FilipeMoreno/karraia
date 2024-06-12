'use client'

import { sendMail } from '@/actions/sendMail'
import Loading from '@/components/loading'
import LogoComponent from '@/components/logo'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { database } from '@/lib/firebaseService'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { get, ref, update } from 'firebase/database'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function Confirmados() {
	const [confirmados, setConfirmados] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [isAdmin, setIsAdmin] = useState(false)

	const router = useRouter()

	useEffect(() => {
		const auth = getAuth()
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				const uid = user.uid
				const adminRef = ref(database, `admins/${uid}`)
				get(adminRef).then((snapshot) => {
					if (snapshot.exists()) {
						setIsAdmin(true)
						fetchData()
					} else {
						setIsAdmin(false)
						router.push('/')
					}
				})
			} else {
				setIsAdmin(false)
				router.push('/')
			}
		})

		return () => unsubscribe()
	}, [])

	const fetchData = async () => {
		const dbRef = ref(database, 'confirmados')
		try {
			const snapshot = await get(dbRef)
			if (snapshot.exists()) {
				const data = snapshot.val()
				const dataArray = Object.keys(data).map((key) => ({
					id: key,
					...data[key],
				}))
				setConfirmados(dataArray)
			} else {
				console.log('No data available')
			}
		} catch (error) {
			console.error('Erro ao buscar os dados: ', error)
		} finally {
			setLoading(false)
		}
	}

	function confirmarPagamento(id: string, email: string) {
		const userRef = ref(database, `confirmados/${id}`)
		update(userRef, {
			pago: true,
			pagamento_confirmado_em: Date.now(),
		})
			.then(() => {
				toast.success('Pagamento confirmado com sucesso!')
				sendMail(email)
			})
			.catch((error: Error) => {
				toast.error('Erro ao confirmar pagamento', {
					description: error.message,
				})
			})
	}

	function cancelarPagamento(id: string) {
		const userRef = ref(database, `confirmados/${id}`)
		update(userRef, {
			pago: false,
			pagamento_confirmado_em: null,
		})
			.then(() => {
				toast.success('Pagamento cancelado com sucesso!')
			})
			.catch((error: Error) => {
				toast.error('Erro ao cancelar pagamento', {
					description: error.message,
				})
			})
	}

	function getTotalConfirmados() {
		return confirmados.filter((confirmado) => confirmado?.presenca).length
	}

	function getTotalPagos() {
		return confirmados.filter((confirmado) => confirmado?.pago).length
	}

	if (loading) {
		return <Loading />
	}

	if (!isAdmin) {
		return null
	}

	return (
		<main className="flex min-h-screen w-full flex-col items-center gap-8 bg-fj p-4 lg:p-24">
			<LogoComponent />
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Lista dos confirmados</CardTitle>
					<CardDescription>
						<p>Total de confirmados: {getTotalConfirmados()}</p>
						<p>
							Total de pagos: {getTotalPagos()} (Faltam{' '}
							{getTotalConfirmados() - getTotalPagos()})
						</p>
						<p>
							Total arrecadado:{' '}
							{Intl.NumberFormat('pt-BR', {
								style: 'currency',
								currency: 'BRL',
							}).format(getTotalPagos() * 25)}
						</p>
					</CardDescription>
				</CardHeader>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Nome</TableHead>
							<TableHead>Data de confirmação</TableHead>
							<TableHead>Pago</TableHead>
							<TableHead>Pagamento confirmado</TableHead>
							<TableHead>Ações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{confirmados.map((confirmado) => (
							<TableRow key={confirmado?.id}>
								<TableCell className="font-medium">
									{confirmado?.name}
								</TableCell>
								<TableCell>
									{confirmado?.confirmado_em
										? Intl.DateTimeFormat('pt-BR', {
												dateStyle: 'medium',
												timeStyle: 'medium',
											}).format(new Date(confirmado.confirmado_em))
										: 'Data não disponível'}
								</TableCell>
								<TableCell>{confirmado?.pago ? 'Sim' : 'Não'}</TableCell>
								<TableCell>
									{confirmado?.pagamento_confirmado_em
										? Intl.DateTimeFormat('pt-BR', {
												dateStyle: 'medium',
												timeStyle: 'medium',
											}).format(new Date(confirmado.pagamento_confirmado_em))
										: 'Não pago'}
								</TableCell>
								<TableCell>
									{confirmado?.pago && (
										<Button
											variant={'destructive'}
											onClick={() => cancelarPagamento(confirmado?.id)}
										>
											Cancelar Pagamento
										</Button>
									)}
									{!confirmado?.pago && (
										<Button
											onClick={() =>
												confirmarPagamento(confirmado?.id, confirmado?.email)
											}
										>
											Confirmar Pagamento
										</Button>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card>
		</main>
	)
}
