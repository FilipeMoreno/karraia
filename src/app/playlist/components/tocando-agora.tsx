import { CardContent } from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { FaTrash } from 'react-icons/fa6'
import ReactPlayer from 'react-player'
import VotacaoComponent from './votos'

interface PlaylistMusicaComponentProps {
	id: string
	musica: string
	imagem: string
	url: string
	onEnd?: () => void
	isAdmin: boolean
	onRemove?: (id: string) => void
}

const PlaylistTocandoAgora: React.FC<PlaylistMusicaComponentProps> = ({
	id,
	musica,
	url,
	isAdmin,
	imagem,
	onEnd,
	onRemove,
}) => {
	const handleEnd = () => {
		if (onEnd) {
			onEnd()
		}
	}

	return (
		<CardContent className="flex flex-col gap-2">
			<div className="flex flex-col justify-between gap-3 rounded-lg bg-zinc-100 p-4">
				{musica && (
					<div className="flex flex-col items-center justify-between gap-3 lg:flex-row">
						<div className="flex w-full flex-col items-center gap-3 lg:flex-row">
							<div className="flex items-center justify-center">
								{isAdmin && (
									<div className="h-[178px] w-[300px] rounded-lg p-4 lg:h-[225px] lg:w-[400px]">
										<ReactPlayer
											url={url}
											playing={true}
											onEnded={handleEnd}
											width="100%"
											height="100%"
											controls={true}
										/>
									</div>
								)}
								{!isAdmin && (
									<Image
										src={imagem}
										alt={musica}
										width={400}
										height={225}
										className="rounded-lg"
									/>
								)}
							</div>

							<div className="w-full">
								<h1 className="font-bold text-lg">{musica}</h1>
							</div>
						</div>
						<div className="flex gap-2">
							<VotacaoComponent musicId={id} />
							{isAdmin && (
								<Button
									variant={'destructive'}
									onClick={() => onRemove?.(id)}
									size="sm"
								>
									<FaTrash />
								</Button>
							)}
						</div>
					</div>
				)}
				{!musica && <p>Nenhuma música tocando agora</p>}
			</div>
		</CardContent>
	)
}

export default PlaylistTocandoAgora
