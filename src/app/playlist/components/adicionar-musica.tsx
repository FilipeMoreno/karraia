import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerPortal,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { userAuthContext } from '@/context/AuthContext'
import { addMusic } from '@/lib/add-musica'
import { getYouTubeVideoData } from '@/lib/youtube-api'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { useMediaQuery } from 'usehooks-ts'

const AddMusicComponent: React.FC = () => {
	const [url, setUrl] = useState<string>('')
	const [error, setError] = useState<string>('')
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const [open, setOpen] = useState(false)
	const { userAuth } = userAuthContext()
	const [musicDetails, setMusicDetails] = useState<any>(null)
	const drawerContentRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (open) {
			resetForm()
		}
	}, [open])

	const resetForm = () => {
		setUrl('')
		setError('')
		setMusicDetails(null)
		setIsLoading(false)
	}

	const fetchMusicDetails = async (videoUrl: string) => {
		setIsLoading(true)
		try {
			const details = await getYouTubeVideoData(videoUrl)
			setMusicDetails(details)
			setError(details.error || '')
		} catch (error) {
			console.error('Erro ao obter detalhes da música:', error)
			setError('Erro ao obter detalhes da música.')
			setMusicDetails(null)
		} finally {
			setIsLoading(false)
		}
	}

	const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newUrl = e.target.value
		setUrl(newUrl)
		fetchMusicDetails(newUrl)
	}

	const handleAddMusic = async () => {
		try {
			if (!url) {
				setError('Por favor, insira um link do YouTube.')
				return
			}

			const success = await addMusic(url, userAuth)
			if (success) {
				setOpen(false)
				resetForm()
			} else {
				setError('Ocorreu um erro ao adicionar a música.')
			}
		} catch (error) {
			console.error('Erro ao adicionar a música:', error)
			setError('Ocorreu um erro ao adicionar a música.')
		}
	}

	const handleCloseModal = () => {
		setOpen(false)
		resetForm()
	}

	const renderMusicDetails = () => {
		if (isLoading) {
			return (
				<div className="flex flex-col items-center gap-3 rounded-lg bg-zinc-100 p-4">
					<Skeleton className="h-36 w-64 rounded-lg" />
					<Skeleton className="mt-4 h-6 w-48" />
				</div>
			)
		}

		if (musicDetails) {
			return (
				<div className="flex flex-col items-center gap-3 rounded-lg bg-zinc-100 p-4">
					<Image
						src={musicDetails.thumbnail}
						alt={musicDetails.title}
						width={400}
						height={225}
						className="rounded-lg"
					/>
					<p className="text-center text-sm">{musicDetails.title}</p>
				</div>
			)
		}
		return null
	}

	useEffect(() => {
		if (drawerContentRef.current && !isDesktop) {
			drawerContentRef.current.style.height = 'auto'
			drawerContentRef.current.scrollTo(0, 0)
		}
	}, [musicDetails, isDesktop])

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button>
						<FaPlus className="mr-2" />
						Adicionar Música
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Adicionar Música</DialogTitle>
						<DialogDescription>
							Insira o link da música do YouTube abaixo.
						</DialogDescription>
					</DialogHeader>
					{error && <p className="text-red-500">{error}</p>}
					{!error && renderMusicDetails()}
					<Input
						type="text"
						placeholder="Link do YouTube"
						value={url}
						onChange={handleUrlChange}
					/>
					<Button onClick={handleAddMusic}>
						<FaPlus className="mr-2" /> Adicionar música
					</Button>
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button>
					<FaPlus className="mr-2" /> Adicionar Música
				</Button>
			</DrawerTrigger>
			<DrawerOverlay className="fixed inset-0 bg-black/40" />
			<DrawerPortal>
				<DrawerContent
					ref={drawerContentRef}
					className="fixed right-0 bottom-0 left-0 flex h-auto max-h-[97%] flex-col rounded-t-lg border border-gray-200 bg-white p-3"
				>
					<DrawerHeader className="text-left">
						<DrawerTitle>Adicionar Música</DrawerTitle>
						<DrawerDescription>
							Insira o link da música do YouTube abaixo.
						</DrawerDescription>
					</DrawerHeader>
					<div className="flex flex-col gap-4">
						{error && <p className="text-center text-red-500">{error}</p>}

						<Input
							type="text"
							placeholder="Link do YouTube"
							value={url}
							onChange={handleUrlChange}
						/>
						<Button onClick={handleAddMusic}>Adicionar música</Button>
						{!error && renderMusicDetails()}
					</div>
					<DrawerFooter className="w-full">
						<DrawerClose asChild onClick={handleCloseModal}>
							<Button variant="outline" className="w-full">
								Cancelar
							</Button>
						</DrawerClose>
					</DrawerFooter>
				</DrawerContent>
			</DrawerPortal>
		</Drawer>
	)
}

export default AddMusicComponent