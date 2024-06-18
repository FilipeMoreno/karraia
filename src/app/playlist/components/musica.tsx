import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { FaArrowRotateLeft, FaForward, FaTrash } from 'react-icons/fa6'
import VotacaoComponent from './votos'

interface PlaylistMusicaComponentProps {
	id: string
	musica: string
	imagem: string
	onEnd?: () => void
	isAdmin: boolean
	onRemove?: (id: string) => void
	onReset?: (id: string) => void
	onForcePlay?: (id: string) => void
	tocada?: boolean
	rank?: number
}

const PlaylistMusicaComponent = ({
	id,
	musica,
	imagem,
	isAdmin,
	onRemove,
	onReset,
	onForcePlay,
	tocada,
	rank,
}: PlaylistMusicaComponentProps) => {
	return (
		<CardContent className="flex flex-col gap-2">
			<div className="flex flex-col items-center justify-between gap-3 rounded-lg bg-zinc-100 p-4 lg:flex-row">
				<div className="flex flex-col items-center gap-3 lg:flex-row">
					{rank && <span>#{rank}</span>}

					<Image
						src={imagem}
						width="0"
						height="0"
						sizes="100vw"
						alt={musica}
						className="h-auto w-[400px] rounded-lg lg:w-[120px]"
					/>
					<div>
						<h1 className={tocada ? 'text-zinc-500' : ''}>{musica}</h1>
					</div>
				</div>
				<div className="flex gap-2">
					{tocada && (
						<Badge
							className="border-zinc-500 text-[10px] text-zinc-500"
							variant={'outline'}
						>
							Reproduzida
						</Badge>
					)}
					{tocada && (
						<Button size="sm" onClick={() => onReset(id)}>
							<FaArrowRotateLeft />
						</Button>
					)}
					<VotacaoComponent musicId={id} />
					{isAdmin && (
						<>
							<Button
								variant={'destructive'}
								onClick={() => onRemove(id)}
								size="sm"
							>
								<FaTrash />
							</Button>
							<Button
								variant={'destructive'}
								onClick={() => onForcePlay(id)}
								size="sm"
							>
								<FaForward />
							</Button>
						</>
					)}
				</div>
			</div>
		</CardContent>
	)
}

export default PlaylistMusicaComponent
