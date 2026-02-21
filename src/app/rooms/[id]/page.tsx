import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import ChatRoom from '@/components/ChatRoom'
import RoomHeader from '@/components/headers/room-header'
import { createClient } from '@/utils/supabase/server'

export default function RoomPage(props: PageProps<'/rooms/[id]'>) {
	const supabasePromise = createClient()

	// 1. A promise that resolves strictly to the Room Name (for the Header)
	const roomNamePromise = Promise.all([supabasePromise, props.params])
		.then(([supabase, params]) =>
			supabase.from('rooms').select('name').eq('id', params.id).single(),
		)
		.then(({ data }) => {
			if (!data) notFound()
			return data.name
		})

	// 2. A promise that resolves strictly to the User ID
	const userIdPromise = supabasePromise
		.then((supabase) => supabase.auth.getUser())
		.then(({ data }) => data.user?.id || '')

	// 3. A promise that resolves strictly to the Room ID (from the params)
	const roomIdPromise = props.params.then((p) => p.id)

	return (
		<div className="flex h-full w-full flex-col justify-center">
			<Suspense
				fallback={<div className="h-14 animate-pulse bg-gray-100" />}
			>
				<RoomHeader roomNamePromise={roomNamePromise} />
			</Suspense>

			<Suspense
				fallback={<div className="flex-1 animate-pulse bg-gray-50" />}
			>
				<ChatRoom
					roomIdPromise={roomIdPromise}
					userIdPromise={userIdPromise}
				/>
			</Suspense>
		</div>
	)
}
