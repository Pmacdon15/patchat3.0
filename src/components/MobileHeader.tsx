'use client'

import { Menu, Users } from 'lucide-react'

export default function MobileHeader({
	onMenuClick,
	title = 'PatChat 3.0',
}: {
	onMenuClick: () => void
	title?: string
}) {
	return (
		<header className="fixed top-0 right-0 left-0 z-50 flex h-14 items-center justify-between border-b bg-primary-700 px-4 md:hidden">
			<div className="flex items-center gap-2 font-bold text-lg">
				<Users className="text-primary-600" size={20} />
				<span className="truncate">{title}</span>
			</div>
			<button
				aria-label="Open menu"
				className="rounded-md p-2 hover:bg-gray-100"
				onClick={onMenuClick}
				type="button"
			>
				<Menu size={24} />
			</button>
		</header>
	)
}
