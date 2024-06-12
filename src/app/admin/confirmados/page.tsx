'use client'

import { sendMailConfirmacao, sendMailPagamento } from '@/actions/sendMail'
import Loading from '@/components/loading'
import LogoComponent from '@/components/logo'
import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
} from '@/components/ui/menubar'
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
import { get, ref, remove, update } from 'firebase/database'
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
				sendMailConfirmacao(email)
					.then(() => {
						toast.success('Pagamento confirmado com sucesso!', {
							description: 'E-mail de confirmação enviado',
						})
					})
					.catch((err) => {
						toast.error('Erro ao enviar e-mail de confirmação', {
							description: err.message,
						})
					})
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

	function cancelarPresenca(id: string) {
		const userRef = ref(database, `confirmados/${id}`)
		remove(userRef)
			.then(() => {
				toast.success('Presença cancelada com sucesso!')
			})
			.catch((error: Error) => {
				toast.error('Erro ao cancelar presença', {
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

	function reenviarEmail(id: string, email: string, type: string) {
		const userRef = ref(database, `confirmados/${id}`)
		if (type === 'confirmacao') {
			get(userRef)
				.then((snapshot) => {
					if (snapshot.exists()) {
						const data = snapshot.val()
						if (!data.pago) {
							toast.error(
								'E-mail não pode ser reenviado, pagamento não confirmado',
							)
						} else {
							sendMailConfirmacao(email)
								.then(() => {
									toast.success('E-mail reenviado com sucesso!')
								})
								.catch((error: Error) => {
									toast.error('Erro ao reenviar e-mail', {
										description: error.message,
									})
								})
						}
					}
				})
				.catch((error: Error) => {
					toast.error('Erro ao buscar dados do usuário', {
						description: error.message,
					})
				})
		}
		if (type === 'pagamento') {
			get(userRef)
				.then((snapshot) => {
					if (snapshot.exists()) {
						const data = snapshot.val()
						if (data.pago) {
							toast.error(
								'E-mail não pode ser reenviado, pagamento já confirmado',
							)
						} else {
							sendMailPagamento(email)
								.then(() => {
									toast.success('E-mail reenviado com sucesso!')
								})
								.catch((error: Error) => {
									toast.error('Erro ao reenviar e-mail', {
										description: error.message,
									})
								})
						}
					}
				})
				.catch((error: Error) => {
					toast.error('Erro ao buscar dados do usuário', {
						description: error.message,
					})
				})
		}
	}

	if (loading) {
		return <Loading />
	}

	if (!isAdmin) {
		return null
	}

	return (
		<main className="flex min-h-screen w-full flex-col items-center gap-8 bg-fj p-4">
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
							<TableHead>Acompanhante de</TableHead>
							<TableHead>Ações</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{confirmados.map((confirmado, index) => (
							<TableRow
								key={confirmado?.id}
								style={
									index % 2
										? { background: '#e4e4e4' }
										: { background: 'white' }
								}
							>
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
								<TableCell>
									{confirmado?.pago ? (
										<Badge className="bg-[#54ba4c]">Sim</Badge>
									) : (
										<Badge variant={'destructive'} color="#ec2d23">
											Não
										</Badge>
									)}
								</TableCell>
								<TableCell>
									{confirmado?.pagamento_confirmado_em
										? Intl.DateTimeFormat('pt-BR', {
												dateStyle: 'medium',
												timeStyle: 'medium',
											}).format(new Date(confirmado.pagamento_confirmado_em))
										: 'Não pago'}
								</TableCell>
								<TableCell>{confirmado?.acompanhante || 'Ninguém'}</TableCell>
								<TableCell>
									<Menubar>
										<MenubarMenu>
											<MenubarTrigger>Ações</MenubarTrigger>
											<MenubarContent>
												{confirmado?.pago && (
													<MenubarItem
														onClick={() => cancelarPagamento(confirmado?.id)}
													>
														Cancelar pagamento
													</MenubarItem>
												)}
												{!confirmado?.pago && (
													<MenubarItem
														onClick={() =>
															confirmarPagamento(
																confirmado?.id,
																confirmado?.email,
															)
														}
													>
														Confirmar pagamento
													</MenubarItem>
												)}
												{confirmado?.presenca && (
													<MenubarItem
														onClick={() => cancelarPresenca(confirmado?.id)}
													>
														Cancelar presença
													</MenubarItem>
												)}
												<MenubarItem
													onClick={() =>
														reenviarEmail(
															confirmado?.id,
															confirmado?.email,
															'confirmacao',
														)
													}
												>
													Reenviar e-mail de confirmação
												</MenubarItem>
												<MenubarItem
													onClick={() =>
														reenviarEmail(
															confirmado?.id,
															confirmado?.email,
															'pagamento',
														)
													}
												>
													Reenviar e-mail de pagamento
												</MenubarItem>
											</MenubarContent>
										</MenubarMenu>
									</Menubar>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card>
		</main>
	)
}
