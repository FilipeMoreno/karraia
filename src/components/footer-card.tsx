import Image from 'next/image'
import Link from 'next/link'
import { FaHeart } from 'react-icons/fa6'
import packageJson from '../../package.json'

export default function FooterCard() {
	const version = packageJson.version

	return (
		<div className="-mt-4 flex flex-col items-center justify-center gap-1 text-xs">
			<Image src="/icon.png" width={25} height={25} alt="Logo" />
			<p className="font-bold font-vt323 text-[#c83e73] text-[16px]">
				v{version || 'N/A'}
			</p>

			{/* <div className="flex flex-row items-center justify-center gap-1">
				Development with <FaHeart className="text-red-500" /> by
				<Link
					href="https://filipemoreno.com.br"
					target="_blank"
					className="hover:text-[#c83e73] hover:underline"
				>
					Filipe Moreno
				</Link>
			</div> */}
		</div>
	)
}
