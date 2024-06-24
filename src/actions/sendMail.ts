'use server'

import mail from '@/lib/mail'

const templateConfirmacao = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmação de Presença - KArraiá</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f8f8f8;
            margin: 0;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #c83e73;
            color: white;
            padding: 10px;
            border-radius: 10px 10px 0 0;
            text-align: center;
            position: relative;
            height: 150px;
        }
        .logo {
            width: 200px;
            position: relative;
            top: -35px;
        }
        .content {
            padding: 20px;
        }
        .content h1 {
            color: #c83e73;
        }
        .content p {
            margin: 0 0 10px;
        }
        .footer {
            background-color: #c83e73;
            color: white;
            padding: 10px;
            border-radius: 0 0 10px 10px;
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="https://karraia.filipemoreno.com.br/logo.png" alt="Logo" class="logo">
        </div>
        <div class="content">
            <h1>Bão sô! 🎉</h1>
            <p>Sua presença e pagamento foram confirmados no KArraiá! 🥳</p>
            <p>Não esqueça as informações principais:</p>
            <p>📅 <strong>29/06/2024</strong></p>
            <p>📍 <strong>Recanto Fabiana</strong> (Avenida Alcebíades de Paula Neto, 31 - Jardim Oriental - Maringá/PR)</p>
            <p>⏰ <strong>18h às 00h</strong></p>
            <p>Nos vemos lá! 😘</p>
        </div>
        <div class="footer">
            <p><strong>KArraiá</strong></p>
        </div>
    </div>
</body>
</html>
`

const templatePagamento = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lembrete de Pagamento - KArraiá</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f8f8f8;
            margin: 0;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #c83e73;
            color: white;
            padding: 10px;
            border-radius: 10px 10px 0 0;
            text-align: center;
            position: relative;
            height: 150px;
        }
        .logo {
            width: 200px;
            position: relative;
            top: -25px;
        }
        .content {
            padding: 20px;
        }
        .content h1 {
            color: #c83e73;
        }
        .content p {
            margin: 0 0 10px;
        }
        .footer {
            background-color: #c83e73;
            color: white;
            padding: 10px;
            border-radius: 0 0 10px 10px;
            text-align: center;
            margin-top: 20px;
        }
        .button {
            background-color: #c83e73;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-align: center;
            display: inline-block;
            margin: 10px 0;
        }
        .pix-key {
            display: inline-block;
            padding: 10px;
            border: 1px solid #c83e73;
            border-radius: 5px;
            background-color: #f8f8f8;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img
                src="https://karraia.filipemoreno.com.br/logo.png"
                alt="Logo"
                class="logo"
            />
        </div>
        <div class="content">
            <h1>Lembrete de Pagamento</h1>
            <p>Estou ansiosa para te ver no KArraiá! 🎉</p>
            <p>Por favor, finalize seu pagamento para garantir sua presença.</p>
            <p>Use o QR code abaixo para realizar o pagamento via PIX</p>
            <div style="text-align: center; margin: 20px 0;">
                <img
                    src="https://karraia.filipemoreno.com.br/pix.jpg"
                    alt="QR Code do PIX"
                    style="width: 200px; height: 200px;"
                />
            </div>
            <p>Ou copie a chave PIX abaixo:</p>
            <div style="text-align: center; margin: 20px 0;">
                <span class="pix-key">00020126550014br.gov.bcb.pix0122karolharummy@gmail.com0207KArraia5204000053039865802BR5925KAROLINE HARUMMY ROMERO M6012CAMPO MOURAO62290525Prp9SQnmN2zFCwtxEI8jvKsbi630482D1</span>
            </div>
        </div>
        <div class="footer">
            <p><strong>KArraiá</strong></p>
        </div>
    </div>
</body>
</html>
`

const templateAmanha = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lembrete: KArraiá é Amanhã!</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f8f8f8;
            margin: 0;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #c83e73;
            color: white;
            padding: 10px;
            border-radius: 10px 10px 0 0;
            text-align: center;
            position: relative;
            height: 150px;
        }
        .logo {
            width: 200px;
            position: relative;
            top: -35px;
        }
        .content {
            padding: 20px;
        }
        .content h1 {
            color: #c83e73;
        }
        .content p {
            margin: 0 0 10px;
        }
        .footer {
            background-color: #c83e73;
            color: white;
            padding: 10px;
            border-radius: 0 0 10px 10px;
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="https://karraia.filipemoreno.com.br/logo.png" alt="Logo" class="logo">
        </div>
        <div class="content">
            <h1>É amanhã! 🎉</h1>
            <p>Não se esqueça, o KArraiá é amanhã! 🥳</p>
            <p>Confira as informações:</p>
            <p>📅 <strong>29/06/2024</strong></p>
            <p>📍 <strong>Recanto Fabiana</strong> (Avenida Alcebíades de Paula Neto, 31 - Jardim Oriental - Maringá/PR)</p>
            <p>⏰ <strong>18h às 00h</strong></p>
            <p>Espero você lá! 😘</p>
        </div>
        <div class="footer">
            <p><strong>KArraiá</strong></p>
        </div>
    </div>
</body>
</html>
`

const templateHoje = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lembrete: KArraiá é Hoje!</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f8f8f8;
            margin: 0;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #c83e73;
            color: white;
            padding: 10px;
            border-radius: 10px 10px 0 0;
            text-align: center;
            position: relative;
            height: 150px;
        }
        .logo {
            width: 200px;
            position: relative;
            top: -35px;
        }
        .content {
            padding: 20px;
        }
        .content h1 {
            color: #c83e73;
        }
        .content p {
            margin: 0 0 10px;
        }
        .footer {
            background-color: #c83e73;
            color: white;
            padding: 10px;
            border-radius: 0 0 10px 10px;
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="https://karraia.filipemoreno.com.br/logo.png" alt="Logo" class="logo">
        </div>
        <div class="content">
            <h1>É Hoje! 🎉</h1>
            <p>O grande dia chegou! O KArraiá é hoje e estou ansiosa para celebrar com você! 🥳</p>
            <p>Confira as informações importantes:</p>
            <p>📅 <strong>Hoje, 29/06/2024</strong></p>
            <p>📍 <strong>Recanto Fabiana</strong> (Avenida Alcebíades de Paula Neto, 31 - Jardim Oriental - Maringá/PR)</p>
            <p>⏰ <strong>18h às 00h</strong></p>
            <p>Te vejo lá! 😘</p>
        </div>
        <div class="footer">
            <p><strong>KArraiá</strong></p>
        </div>
    </div>
</body>
</html>
`

const templateAgradecimento = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Obrigado por Participar do KArraiá!</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f8f8f8;
            margin: 0;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #c83e73;
            color: white;
            padding: 10px;
            border-radius: 10px 10px 0 0;
            text-align: center;
            position: relative;
            height: 150px;
        }
        .logo {
            width: 200px;
            position: relative;
            top: -35px;
        }
        .content {
            padding: 20px;
        }
        .content h1 {
            color: #c83e73;
        }
        .content p {
            margin: 0 0 10px;
        }
        .footer {
            background-color: #c83e73;
            color: white;
            padding: 10px;
            border-radius: 0 0 10px 10px;
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="https://karraia.filipemoreno.com.br/logo.png" alt="Logo" class="logo">
        </div>
        <div class="content">
            <h1>Obrigado por Participar! 🎉</h1>
            <p>Foi incrível ter você no KArraiá! Esperamos que você tenha se divertido tanto quanto nós. 🥳</p>
            <p>Aqui estão alguns dos melhores momentos do evento:</p>
            <ul>
                <li>🎶 Muita música boa</li>
                <li>🍔 Comida deliciosa</li>
                <li>💃 Muita dança e animação</li>
            </ul>
            <p>Estamos ansiosos para te ver no próximo evento!</p>
            <p>Até lá, fique de olho nas nossas redes sociais para mais novidades e fotos do evento:</p>
            <p>📸 <a href="https://www.instagram.com/karraia">Instagram</a></p>
            <p>🔗 <a href="https://www.facebook.com/karraia">Facebook</a></p>
            <p>Mais uma vez, muito obrigado por fazer parte do KArraiá!</p>
        </div>
        <div class="footer">
            <p>KArraiá</p>
        </div>
    </div>
</body>
</html>
`

export const sendMailConfirmacao = async (email: string) => {
	try {
		const { error } = await mail.emails.send({
			from: 'KArraiá <karraia@filipemoreno.com.br>',
			to: email,
			subject: 'Presença confirmada! 🎉',
			html: templateConfirmacao,
		})

		if (error) {
			console.error('Erro ao enviar e-mail: ', error)
		}

		return {
			error,
		}
	} catch (error) {
		console.error('Erro ao enviar e-mail: ', error)
		return { error: error as unknown }
	}
}

export const sendMailPagamento = async (email: string) => {
	try {
		const { error } = await mail.emails.send({
			from: 'KArraiá <karraia@filipemoreno.com.br>',
			to: email,
			subject: 'Não esqueça de pagar! 💸',
			html: templatePagamento,
		})

		if (error) {
			console.error('Erro ao enviar e-mail: ', error)
		}

		return {
			error,
		}
	} catch (error) {
		console.error('Erro ao enviar e-mail: ', error)
		return { error: error as unknown }
	}
}

export const sendEmailAmanha = async (email: string) => {
	try {
		const { error } = await mail.emails.send({
			from: 'KArraiá <karraia@filipemoreno.com.br>',
			to: email,
			subject: 'É amanhã! 🎉',
			html: templateAmanha,
		})

		if (error) {
			console.error('Erro ao enviar e-mail: ', error)
		}

		return {
			error,
		}
	} catch (error) {
		console.error('Erro ao enviar e-mail: ', error)
		return { error: error as unknown }
	}
}

export const sendEmailHoje = async (email: string) => {
	try {
		const { error } = await mail.emails.send({
			from: 'KArraiá <karraia@filipemoreno.com.br>',
			to: email,
			subject: 'É HOJE!!! 🎉',
			html: templateHoje,
		})

		if (error) {
			console.error('Erro ao enviar e-mail: ', error)
		}

		return {
			error,
		}
	} catch (error) {
		console.error('Erro ao enviar e-mail: ', error)
		return { error: error as unknown }
	}
}
