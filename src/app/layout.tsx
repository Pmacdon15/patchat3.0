import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
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

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	let rooms: { id: string; name: string }[] = []
	let userProfile: {
		id: string
		username: string
		display_name: string | null
		avatar_url: string | null
	} | null = null
	let privateConversations: {
		id: string
		username: string
		display_name: string | null
		avatar_url: string | null
	}[] = []
	if (user) {
		const [{ data: roomsData }, { data: profileData }, { data: pmData }] =
			await Promise.all([
				supabase
					.from('rooms')
					.select('*')
					.order('created_at', { ascending: true }),
				supabase
					.from('profiles')
					.select('*')
					.eq('id', user.id)
					.single(),
				supabase
					.from('private_messages')
					.select('sender_id, receiver_id')
					.or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`),
			])
		rooms = roomsData || []
		userProfile = profileData

		if (pmData) {
			const otherUserIds = Array.from(
				new Set(
					pmData
						.flatMap(
							(pm: {
								sender_id: string
								receiver_id: string
							}) => [pm.sender_id, pm.receiver_id],
						)
						.filter((id: string) => id !== user.id),
				),
			)

			if (otherUserIds.length > 0) {
				const { data: convos } = await supabase
					.from('profiles')
					.select('*')
					.in('id', otherUserIds)
				privateConversations = convos || []
			}
		}
	}

	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-background text-foreground antialiased`}
			>
				{!user && <Navbar />}
				<div className={`flex flex-1 ${!user ? 'pt-16' : ''}`}>
					{user ? (
						<div className="flex w-full">
							<Sidebar
								directMessages={privateConversations}
								rooms={rooms}
								userProfile={userProfile}
							/>
							<main className="ml-64 flex flex-1 flex-col items-center p-8">
								<div className="w-full max-w-6xl">
									{children}
								</div>
							</main>
						</div>
					) : (
						<main className="flex w-full flex-1 flex-col items-center">
							<div className="w-full max-w-7xl px-4 py-8">
								{children}
							</div>
						</main>
					)}
				</div>
				{!user && <Footer />}
				{user && (
					<div className="ml-64">
						<Footer />
					</div>
				)}
			</body>
		</html>
	)
}
