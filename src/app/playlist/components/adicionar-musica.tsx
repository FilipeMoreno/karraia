'use client'

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
import { userAuthContext } from '@/context/AuthContext'
import { addMusic } from '@/lib/add-musica'
import { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { useMediaQuery } from 'usehooks-ts'

const AddMusicComponent: React.FC = () => {
	const [url, setUrl] = useState<string>('')
	const [error, setError] = useState<string>('')
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const [open, setOpen] = useState(false)
	const { userAuth } = userAuthContext()

	useEffect(() => {
		setError('')
		setUrl('')
	}, [open])

	const handleAddMusic = async () => {
		if (url) {
			const success = await addMusic(url, userAuth)
			if (!success) {
				setError('Ocorreu um erro ao adicionar a música.')
			} else {
				setOpen(false)
				setUrl('')
				setError('')
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
					<Input
						type="text"
						placeholder="Link do YouTube"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
					/>
					{error && <p className="text-red-500">{error}</p>}
					<Button onClick={handleAddMusic}>Adicionar música</Button>
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
				<Button onClick={handleAddMusic}>Adicionar música</Button>
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
