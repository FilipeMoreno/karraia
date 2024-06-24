import { AddToCalendarButton } from 'add-to-calendar-button-react'

export default function AdcionarAoCalendario() {
	return (
		<AddToCalendarButton
			name="KArraiá"
			description="Festa Junina da Karol!"
			startDate="2024-06-29"
			startTime="18:00"
			endDate="2024-06-30"
			endTime="00:00"
			timeZone="America/Sao_Paulo"
			location="Avenida Alcebíades de Paula Neto, 31 - Jardim Oriental - Maringá, PR"
			options="'Apple','Google','Outlook.com','Microsoft365'"
			buttonStyle="date"
			label="Adicionar ao calendário"
			language="pt"
		/>
	)
}
