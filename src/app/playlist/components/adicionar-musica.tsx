import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { userAuthContext } from '@/context/AuthContext'
import { addMusic } from '@/lib/add-musica'
import { getYouTubeVideoData, searchYouTubeVideos } from '@/lib/youtube-api'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { useMediaQuery } from 'usehooks-ts'

const AddMusicComponent: React.FC = () => {
	const [query, setQuery] = useState<string>('')
	const [isUrl, setIsUrl] = useState<boolean>(true)
	const [error, setError] = useState<string>('')
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [searchResults, setSearchResults] = useState<any[]>([])
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
		setQuery('')
		setError('')
		setMusicDetails(null)
		setIsLoading(false)
		setSearchResults([])
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

	const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value)
		setMusicDetails(null)
		setSearchResults([])
	}

	useEffect(() => {
		if (isUrl && query) {
			fetchMusicDetails(query)
		}
	}, [query, isUrl])

	const handleSearch = async () => {
		if (!isUrl) {
			setIsLoading(true)
			try {
				const { error, videos } = await searchYouTubeVideos(query)
				setSearchResults(videos)
				setError(error || '')
			} catch (error) {
				console.error('Erro ao buscar músicas:', error)
				setError('Erro ao buscar músicas.')
				setSearchResults([])
			} finally {
				setIsLoading(false)
			}
		}
	}

	const handleAddMusic = async (url: string) => {
		try {
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
					<Button className="w-full" onClick={() => handleAddMusic(query)}>
						Adicionar música
					</Button>
				</div>
			)
		}

		return null
	}

	const renderSearchResults = () => {
		return searchResults.map((video, index) => (
			<div
				key={index}
				className="mb-3 flex flex-col items-center gap-2 rounded-lg bg-zinc-100 p-4"
			>
				<Image
					src={video.thumbnail}
					alt={video.title}
					width={200}
					height={225}
					className="rounded-lg"
				/>
				<p className="text-center text-sm">{video.title}</p>
				<Button className="w-full" onClick={() => handleAddMusic(video.url)}>
					Adicionar música
				</Button>
			</div>
		))
	}

	const toggleSearchType = () => {
		setIsUrl(!isUrl)
		setError('')
		setMusicDetails(null)
		setSearchResults([])
		setQuery('')
	}

	const renderFormContent = () => (
		<>
			<Button variant="outline" onClick={toggleSearchType}>
				{isUrl ? 'Adicionar pelo Nome' : 'Adicionar pela URL'}
			</Button>
			{error && <p className="text-red-500">{error}</p>}
			<Input
				type="text"
				placeholder={isUrl ? 'Link do YouTube' : 'Nome da música'}
				value={query}
				onChange={handleQueryChange}
			/>
			{!error && renderMusicDetails()}
			{!isUrl && <Button onClick={handleSearch}>Buscar músicas</Button>}
			{!isLoading && !error && !isUrl && searchResults.length > 0 && (
				<ScrollArea className="h-72 w-full rounded-md">
					{renderSearchResults()}
				</ScrollArea>
			)}
		</>
	)

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
						<DialogTitle>
							{isUrl
								? 'Adicionar música pela URL'
								: 'Adicionar música pelo Nome'}
						</DialogTitle>
						<DialogDescription>
							{isUrl
								? 'Insira o link da música do YouTube abaixo.'
								: 'Insira o nome da música abaixo.'}
						</DialogDescription>
					</DialogHeader>
					{renderFormContent()}
					<DialogFooter>
						<Button
							variant="outline"
							className="w-full"
							onClick={handleCloseModal}
						>
							Cancelar
						</Button>
					</DialogFooter>
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
					className="fixed right-0 bottom-0 left-0 flex flex-col rounded-t-lg border border-gray-200 bg-white p-3"
				>
					<DrawerHeader className="text-left">
						<DrawerTitle>Adicionar Música!</DrawerTitle>
						<DrawerDescription>
							{isUrl
								? 'Insira o link da música do YouTube abaixo.'
								: 'Insira o nome da música abaixo.'}
						</DrawerDescription>
					</DrawerHeader>
					<div className="flex flex-col gap-4">{renderFormContent()}</div>
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
