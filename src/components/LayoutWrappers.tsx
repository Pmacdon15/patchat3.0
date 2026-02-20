'use client'

import type { User } from '@supabase/supabase-js'
import { use, useState } from 'react'
import type { Profile, Room } from '@/types'
import Footer from './Footer'
import MobileHeader from './MobileHeader'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export function NavWrapper({
	userPromise,
}: {
	userPromise: Promise<{ data: { user: User | null } }>
}) {
	const {
		data: { user },
	} = use(userPromise)
	if (user) return null
	return <Navbar userPromise={userPromise} />
}

export function SidebarWrapper({
	userPromise,
	roomsPromise,
	userProfilePromise,
	directMessagesPromise,
}: {
	userPromise: Promise<{ data: { user: User | null } }>
	roomsPromise: Promise<Room[]>
	userProfilePromise: Promise<Profile | null>
	directMessagesPromise: Promise<Profile[]>
}) {
	const {
		data: { user },
	} = use(userPromise)
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)

	if (!user) return null

	return (
		<>
			<MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />
			{isSidebarOpen && (
				<button
					className="fixed inset-0 z-50 bg-black/50 md:hidden"
					onClick={() => setIsSidebarOpen(false)}
					onKeyDown={(e) =>
						e.key === 'Escape' && setIsSidebarOpen(false)
					}
					type="button"
				>
					<span className="sr-only">Close sidebar</span>
				</button>
			)}
			<div
				className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 transform bg-primary-800 transition-transform duration-300 ease-in-out md:static md:translate-x-0`}
			>
				{isSidebarOpen && (
					<button
						className="absolute top-4 right-4 text-white md:hidden"
						onClick={() => setIsSidebarOpen(false)}
						type="button"
					>
						<span className="sr-only">Close sidebar</span>
						<svg
							aria-hidden="true"
							className="h-6 w-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Close Sidebar</title>
							<path
								d="M6 18L18 6M6 6l12 12"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
							/>
						</svg>
					</button>
				)}
				<Sidebar
					directMessagesPromise={directMessagesPromise}
					roomsPromise={roomsPromise}
					userProfilePromise={userProfilePromise}
				/>
			</div>
		</>
	)
}

export function FooterWrapper({
	userPromise,
}: {
	userPromise: Promise<{ data: { user: User | null } }>
}) {
	const {
		data: { user },
	} = use(userPromise)
	if (!user) return null
	return (
		<div className="border-gray-200 border-t bg-white py-4 md:pl-64">
			<Footer />
		</div>
	)
}
