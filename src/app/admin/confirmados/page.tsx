'use client'

import { sendMailConfirmacao, sendMailPagamento } from '@/actions/sendMail'
import Loading from '@/components/loading'
import LogoComponent from '@/components/logo'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { database } from '@/lib/firebaseService'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { get, onValue, ref, remove, update } from 'firebase/database'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaEllipsisVertical, FaSpinner } from 'react-icons/fa6'
import { toast } from 'sonner'

export default function Confirmados() {
	const [confirmados, setConfirmados] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [isAdmin, setIsAdmin] = useState(false)
	const [loadingButtonId, setLoadingButtonId] = useState<string | null>(null)

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

	const fetchData = () => {
		const dbRef = ref(database, 'confirmados')
		onValue(
			dbRef,
			(snapshot) => {
				if (snapshot.exists()) {
					const data = snapshot.val()
					const dataArray = Object.keys(data).map((key) => ({
						id: key,
						...data[key],
					}))

					dataArray.sort((a, b) => b.confirmado_em - a.confirmado_em)
					setConfirmados(dataArray)
				} else {
					console.log('No data available')
				}
				setLoading(false)
			},
			(error) => {
				console.error('Erro ao buscar os dados: ', error)
				setLoading(false)
			},
		)
	}

	const updateConfirmados = (id: string, updates: any) => {
		setConfirmados((prevConfirmados) =>
			prevConfirmados.map((confirmado) =>
				confirmado.id === id ? { ...confirmado, ...updates } : confirmado,
			),
		)
	}

	const confirmarPagamento = async (id: string, email: string) => {
		setLoadingButtonId(id)
		const userRef = ref(database, `confirmados/${id}`)
		try {
			await update(userRef, {
				pago: true,
				pagamento_confirmado_em: Date.now(),
			})
			toast.success('Pagamento confirmado com sucesso!', {
				description: 'E-mail de confirmação enviado',
			})
			updateConfirmados(id, { pago: true, pagamento_confirmado_em: Date.now() })
		} catch (error: any) {
			toast.error('Erro ao confirmar pagamento', {
				description: error?.message,
			})
		} finally {
			setLoadingButtonId(null)
		}
	}

	const cancelarPagamento = async (id: string) => {
		setLoadingButtonId(id)
		const userRef = ref(database, `confirmados/${id}`)
		try {
			await update(userRef, {
				pago: false,
				pagamento_confirmado_em: null,
			})
			toast.success('Pagamento cancelado com sucesso!')
			updateConfirmados(id, { pago: false, pagamento_confirmado_em: null })
		} catch (error: any) {
			toast.error('Erro ao cancelar pagamento', {
				description: error.message,
			})
		} finally {
			setLoadingButtonId(null)
		}
	}

	const cancelarPresenca = async (id: string) => {
		const userRef = ref(database, `confirmados/${id}`)
		try {
			await remove(userRef)
			setConfirmados((prevConfirmados) =>
				prevConfirmados.filter((confirmado) => confirmado.id !== id),
			)
			toast.success('Presença cancelada com sucesso!')
		} catch (error: any) {
			toast.error('Erro ao cancelar presença', {
				description: error.message,
			})
		}
	}

	const reenviarEmail = async (id: string, email: string, type: string) => {
		const userRef = ref(database, `confirmados/${id}`)
		try {
			const snapshot = await get(userRef)
			if (snapshot.exists()) {
				const data = snapshot.val()
				if (type === 'confirmacao') {
					if (!data.pago) {
						toast.error(
							'E-mail não pode ser reenviado, pagamento não confirmado',
						)
					} else {
						await sendMailConfirmacao(email)
						toast.success('E-mail reenviado com sucesso!')
					}
				} else if (type === 'pagamento') {
					if (data.pago) {
						toast.error(
							'E-mail não pode ser reenviado, pagamento já confirmado',
						)
					} else {
						await sendMailPagamento(email)
						toast.success('E-mail reenviado com sucesso!')
					}
				}
			}
		} catch (error: any) {
			toast.error('Erro ao buscar dados do usuário', {
				description: error.message,
			})
		}
	}

	const getTotalConfirmados = () =>
		confirmados.filter((confirmado) => confirmado?.presenca).length

	const getTotalPagos = () =>
		confirmados.filter((confirmado) => confirmado?.pago).length

	if (loading) {
		return <Loading />
	}

	if (!isAdmin) {
		return null
	}

	return (
		<main className="flex min-h-screen w-full flex-col items-center gap-8 bg-fj bg-no-repeat p-4">
			<LogoComponent />
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Lista dos confirmados</CardTitle>
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
										? { background: '#e7e7e7' }
										: { background: 'white' }
								}
							>
								<TableCell className="font-medium">
									<div className="flex flex-row items-center gap-2">
										<Avatar>
											<AvatarImage
												src={confirmado?.avatar}
												alt={confirmado?.name}
											/>
											<AvatarFallback>
												{confirmado?.name.split(' ')[0]}
											</AvatarFallback>
										</Avatar>

										{confirmado?.name}
									</div>
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
										<Badge variant={'success'}>Sim</Badge>
									) : (
										<Badge variant={'destructive'}>Não</Badge>
									)}
								</TableCell>
								<TableCell>
									{confirmado?.pagamento_confirmado_em
										? Intl.DateTimeFormat('pt-BR', {
												dateStyle: 'medium',
												timeStyle: 'medium',
											}).format(new Date(confirmado.pagamento_confirmado_em))
										: 'Pagamento Pendente'}
								</TableCell>
								<TableCell>{confirmado?.acompanhante || 'Ninguém'}</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size={'icon'}>
												<FaEllipsisVertical className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent className="w-56">
											<DropdownMenuSub>
												<DropdownMenuSubTrigger>
													Mudar status
												</DropdownMenuSubTrigger>
												<DropdownMenuPortal>
													<DropdownMenuSubContent>
														{confirmado?.pago && (
															<DropdownMenuItem
																onClick={() =>
																	cancelarPagamento(confirmado?.id)
																}
															>
																Cancelar pagamento
															</DropdownMenuItem>
														)}
														{!confirmado?.pago && (
															<DropdownMenuItem
																onClick={() =>
																	confirmarPagamento(
																		confirmado?.id,
																		confirmado?.email,
																	)
																}
															>
																{loadingButtonId === confirmado.id ? (
																	<FaSpinner className="animate-spin" />
																) : (
																	'Confirmar pagamento'
																)}
															</DropdownMenuItem>
														)}
													</DropdownMenuSubContent>
												</DropdownMenuPortal>
											</DropdownMenuSub>
											<DropdownMenuSub>
												<DropdownMenuSubTrigger>E-mail</DropdownMenuSubTrigger>
												<DropdownMenuPortal>
													<DropdownMenuSubContent>
														<DropdownMenuItem
															onClick={() =>
																reenviarEmail(
																	confirmado?.id,
																	confirmado?.email,
																	'confirmacao',
																)
															}
														>
															Enviar e-mail de confirmação
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() =>
																reenviarEmail(
																	confirmado?.id,
																	confirmado?.email,
																	'pagamento',
																)
															}
														>
															Enviar e-mail de pagamento
														</DropdownMenuItem>
													</DropdownMenuSubContent>
												</DropdownMenuPortal>
											</DropdownMenuSub>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={() => cancelarPresenca(confirmado?.id)}
												className="text-red-500"
											>
												Cancelar Presença
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TableCell colSpan={6}>
								<div>
									<p>
										Total de confirmados: <b>{getTotalConfirmados()}</b>
									</p>
									<p>
										Total de pagos: <b>{getTotalPagos()}</b>
									</p>
									<p>
										Faltam pagar:{' '}
										<b>{getTotalConfirmados() - getTotalPagos()}</b>
									</p>
									<p>
										Total arrecadado:{' '}
										<b>
											{Intl.NumberFormat('pt-BR', {
												style: 'currency',
												currency: 'BRL',
											}).format(getTotalPagos() * 25)}
										</b>
									</p>
								</div>
							</TableCell>
						</TableRow>
					</TableFooter>
				</Table>
			</Card>
		</main>
	)
}
