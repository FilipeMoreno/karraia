import Image from 'next/image'

export default function LogoComponent() {
	return (
		<div className="animate-duration-[1000ms] animate-fade-down">
			<Image
				src="/logo.png"
				alt="logo"
				width={300}
				height={300}
				className="animate-duration-[5000ms] animate-infinite animate-wiggle"
			/>
		</div>
	)
}
