import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { FaArrowRotateLeft, FaTrash } from 'react-icons/fa6'
import VotacaoComponent from './votos'

interface PlaylistMusicaComponentProps {
	id: string
	musica: string
	imagem: string
	onEnd?: () => void
	isAdmin: boolean
	onRemove?: (id: string) => void
	tocada?: boolean
	rank?: number
}

const PlaylistMusicaComponent = ({
	id,
	musica,
	imagem,
	isAdmin,
	onRemove,
	tocada,
	rank,
}: PlaylistMusicaComponentProps) => {
	return (
		<CardContent className="flex flex-col gap-2">
			<div className="flex flex-row items-center justify-between gap-3 rounded-lg bg-zinc-100 p-4">
				<div className="flex flex-row items-center gap-3">
					{rank && <span>#{rank}</span>}

					<Image
						src={imagem}
						alt={musica}
						width={64}
						height={64}
						className="rounded-lg"
					/>
					<div>
						<h1 className={tocada ? 'text-zinc-300' : ''}>{musica}</h1>
						{tocada && <p className="text-zinc-300">Tocada</p>}
					</div>
				</div>
				<div className="flex gap-2">
					{tocada && (
						<Button size="sm" onClick={() => alert('Desenvolvimento')}>
							<FaArrowRotateLeft />
						</Button>
					)}
					<VotacaoComponent musicId={id} />
					{isAdmin && (
						<Button onClick={() => onRemove(id)} size="sm">
							<FaTrash />
						</Button>
					)}
				</div>
			</div>
		</CardContent>
	)
}

export default PlaylistMusicaComponent
