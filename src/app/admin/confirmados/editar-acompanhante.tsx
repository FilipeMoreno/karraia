import { Button } from '@/components/ui/button'
import { DialogHeader } from '@/components/ui/dialog'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'

export default function EditarAcompanhante() {
	const [open, setOpen] = useState(false)
	const isDesktop = useMediaQuery('(min-width: 768px)')

	if (isDesktop) {
		return (
			<DropdownMenuItem>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<p>Editar acompanhante</p>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Edit profile</DialogTitle>
							<DialogDescription>
								Make changes to your profile here. Click save when you're done.
							</DialogDescription>
						</DialogHeader>
						{/* <ProfileForm /> */}
					</DialogContent>
				</Dialog>
			</DropdownMenuItem>
		)
	}
	return (
		<DropdownMenuItem>
			<Drawer open={open} onOpenChange={setOpen}>
				<DrawerTrigger asChild>
					<Button variant="outline">Edit Profile</Button>
				</DrawerTrigger>
				<DrawerContent>
					<DrawerHeader className="text-left">
						<DrawerTitle>Edit profile</DrawerTitle>
						<DrawerDescription>
							Make changes to your profile here. Click save when you're done.
						</DrawerDescription>
					</DrawerHeader>
					{/* <ProfileForm className="px-4" /> */}
					<DrawerFooter className="pt-2">
						<DrawerClose asChild>
							<Button variant="outline">Cancel</Button>
						</DrawerClose>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</DropdownMenuItem>
	)
}
