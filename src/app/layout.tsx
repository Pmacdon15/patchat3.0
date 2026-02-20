import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import Footer from '@/components/Footer'
import { NavWrapper, SidebarWrapper } from '@/components/LayoutWrappers'
import Providers from '@/components/providers/providers'
import type { Profile } from '@/types'
import { createClient } from '@/utils/supabase/server'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'PatChat 3.0',
	description: 'Real-time chat application',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const supabasePromise = createClient()
	const userPromise = supabasePromise.then((s) => s.auth.getUser())

	const roomsPromise = supabasePromise
		.then((s) =>
			s
				.from('rooms')
				.select('*')
				.order('created_at', { ascending: true }),
		)
		.then(({ data }) => data || [])

	const userProfilePromise = Promise.all([supabasePromise, userPromise]).then(
		([
			s,
			{
				data: { user },
			},
		]) => {
			if (!user) return null
			return s
				.from('profiles')
				.select('*')
				.eq('id', user.id)
				.single()
				.then(({ data }: { data: Profile | null }) => data)
		},
	)

	const directMessagesPromise = Promise.all([
		supabasePromise,
		userPromise,
	]).then(
		([
			s,
			{
				data: { user },
			},
		]) => {
			if (!user) return []
			return s
				.from('private_messages')
				.select('sender_id, receiver_id')
				.or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
				.then(
					({
						data: pmData,
					}: {
						data:
							| { sender_id: string; receiver_id: string }[]
							| null
					}) => {
						if (!pmData) return []
						const userSentToSelf = pmData.some(
							(pm) =>
								pm.sender_id === user.id &&
								pm.receiver_id === user.id,
						)

						const otherUserIds = Array.from(
							new Set(
								pmData
									.flatMap(
										(pm: {
											sender_id: string
											receiver_id: string
										}) => [pm.sender_id, pm.receiver_id],
									)
									.filter((id) => id !== user.id),
							),
						)

						if (userSentToSelf) {
							otherUserIds.push(user.id)
						}

						if (otherUserIds.length === 0) return []

						return s
							.from('profiles')
							.select('*')
							.in('id', otherUserIds)
							.then(
								({ data }: { data: Profile[] | null }) =>
									data || [],
							)
					},
				)
		},
	)

	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-background text-foreground antialiased`}
			>
				<Suspense>
					<NavWrapper userPromise={userPromise} />
				</Suspense>
				<div className="flex flex-1 overflow-hidden">
					<Suspense>
						<SidebarWrapper
							directMessagesPromise={directMessagesPromise}
							roomsPromise={roomsPromise}
							userProfilePromise={userProfilePromise}
							userPromise={userPromise}
						/>
					</Suspense>
					<main className="flex w-full flex-1 flex-col items-center overflow-hidden pt-4">
						<div className="flex w-full flex-1 flex-col px-10">
							<div className="flex flex-1 flex-col">
								<Providers>{children}</Providers>
							</div>
							<Footer />
						</div>
					</main>
				</div>
			</body>
		</html>
	)
}
