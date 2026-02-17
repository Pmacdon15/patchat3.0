'use client'

import type { User } from '@supabase/supabase-js'
import { use } from 'react'
import type { Profile, Room } from '@/types'
import Footer from './Footer'
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
	if (!user) return null
	return (
		<Sidebar
			directMessagesPromise={directMessagesPromise}
			roomsPromise={roomsPromise}
			userProfilePromise={userProfilePromise}
		/>
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
		<div className="footer-container">
			<Footer />
		</div>
	)
}
