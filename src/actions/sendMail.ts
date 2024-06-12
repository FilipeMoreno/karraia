'use server'

import mail from '@/lib/mail'

const html = `
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
            <p>📍 <strong>Recanto Faviana</strong> (Avenida Alcebíades de Paula Neto, 31 - Jardom Oriental - Maringá/PR)</p>
            <p>⏰ <strong>18h às 00h</strong></p>
            <p>Nos vemos lá! 😘</p>
        </div>
        <div class="footer">
            <p>Estamos ansiosos para celebrar com você!</p>
        </div>
    </div>
</body>
</html>
`

export const sendMail = async (email: string) => {
	try {
		const { error } = await mail.emails.send({
			from: 'KArraiá <karraia@filipemoreno.com.br>',
			to: email,
			subject: 'Presença confirmada! 🎉',
			html: html,
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
