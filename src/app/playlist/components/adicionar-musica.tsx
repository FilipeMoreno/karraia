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
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { database } from '@/lib/firebaseService'
import { getYouTubeVideoData } from '@/lib/youtube-api'
import { child, get, push, ref, set, update } from 'firebase/database'
import { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { useMediaQuery } from 'usehooks-ts'

const AddMusicComponent: React.FC = () => {
	const [url, setUrl] = useState<string>('')
	const [error, setError] = useState<string>('')
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const [open, setOpen] = useState(false)

	useEffect(() => {
		setError('')
		setUrl('')
	}, [open])

	const addMusic = async () => {
		if (url) {
			try {
				const musicRef = ref(database, 'musicas')
				const snapshot = await get(child(musicRef, '/'))
				const data = snapshot.val()

				if (data) {
					Object.keys(data).forEach((key) => {
						if (data[key].url === url) {
							setError('Esta música já está na playlist.')
							return
						}
					})
				}

				if (!error) {
					const videoData = await getYouTubeVideoData(url)
					if (videoData) {
						const newMusicRef = push(musicRef)
						await set(newMusicRef, {
							url: url,
							title: videoData.title,
							thumbnail: videoData.thumbnail,
							likes: 0,
							dislikes: 0,
							addedAt: Date.now(),
							playing: false,
						})

						const snapshot = await get(newMusicRef)
						const newMusic = { id: snapshot.key, ...snapshot.val() }

						const musicCountRef = ref(database, 'musicas')
						const snapshotCount = await get(musicCountRef)
						const musicCount = snapshotCount.numChildren()

						const lastMusicRef = ref(database, `musicas/${musicCount}`)
						const lastMusicSnapshot = await get(lastMusicRef)
						const lastMusicData = lastMusicSnapshot.val()

						await update(ref(database, `musicas/${newMusic.id}`), {
							...lastMusicData,
							order: musicCount + 1,
						})

						setUrl('')
						setError('')
					} else {
						setError(
							'Não foi possível encontrar informações para o vídeo fornecido.',
						)
					}
				}
			} catch (error) {
				setError('URL inválida ou erro ao buscar informações do vídeo.')
				console.error('Error adding music:', error)
			}
		} else {
			setError('Por favor, insira um link do YouTube.')
		}
	}

	const handleCloseModal = () => {
		setOpen(false)
		setError('')
	}

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant="outline">Adicionar Música</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Adicionar Música</DialogTitle>
						<DialogDescription>
							Insira o link da música do YouTube abaixo.
						</DialogDescription>
					</DialogHeader>
					<Input
						type="text"
						placeholder="Link do YouTube"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
					/>
					{error && <p className="text-red-500">{error}</p>}
					<Button onClick={addMusic}>Adicionar música</Button>
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant="outline">Adicionar Música</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>Adicionar Música</DrawerTitle>
					<DrawerDescription>
						Insira o link da música do YouTube abaixo.
					</DrawerDescription>
				</DrawerHeader>
				<Input
					type="text"
					placeholder="Link do YouTube"
					value={url}
					onChange={(e) => setUrl(e.target.value)}
				/>
				{error && <p className="text-red-500">{error}</p>}
				<Button onClick={addMusic}>Adicionar música</Button>
				<DrawerFooter className="pt-2">
					<DrawerClose asChild onClick={handleCloseModal}>
						<Button variant="outline">Cancelar</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}

export default AddMusicComponent
