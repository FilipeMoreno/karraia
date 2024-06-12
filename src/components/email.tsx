export default function EmailTemplate() {
	return (
		<div className="bg-gray-100 p-5">
			<div className="mx-auto max-w-2xl rounded-lg bg-white p-5 shadow-lg">
				<div className="relative h-36 rounded-t-lg bg-[#c83e73] p-5 text-center text-white">
					<img
						src="https://karraia.filipemoreno.com.br/logo.png"
						alt="Logo"
						className="absolute top-[-25px] right-0 left-0 mx-auto w-52"
					/>
				</div>
				<div className="p-5">
					<h1 className="mb-4 font-bold text-2xl text-[#c83e73]">Bão sô! 🎉</h1>
					<p className="mb-2">
						Sua presença e pagamento foram confirmados no KArraiá! 🥳
					</p>
					<p className="mb-2">Não esqueça as informações principais:</p>
					<p className="mb-2">
						📅 <strong>29/06/2024</strong>
					</p>
					<p className="mb-2">
						📍 <strong>Recanto Faviana</strong> (Avenida Alcebíades de Paula
						Neto, 31 - Jardom Oriental - Maringá/PR)
					</p>
					<p className="mb-2">
						⏰ <strong>18h às 00h</strong>
					</p>
					<p>Nos vemos lá! 😘</p>
				</div>
				<div className="mt-5 rounded-b-lg bg-[#c83e73] p-5 text-center text-white">
					<p>Estamos ansiosos para celebrar com você!</p>
				</div>
			</div>
		</div>
	)
}
