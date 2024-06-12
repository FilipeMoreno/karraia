import Image from 'next/image'
import Link from 'next/link'

export default function LogoComponent() {
	return (
		<div className="animate-duration-[1000ms] animate-fade-down">
			<Link href={'/'}>
				<Image
					src="/logo.png"
					alt="logo"
					width={300}
					height={300}
					className="animate-duration-[5000ms] animate-infinite animate-wiggle"
				/>
			</Link>
		</div>
	)
}
