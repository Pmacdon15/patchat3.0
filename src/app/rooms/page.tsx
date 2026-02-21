// RoomsPage.tsx

import { Suspense } from 'react'
import RoomsHeader from '@/components/headers/rooms-header'
import Rooms from '@/components/rooms'
import { createClient } from '@/utils/supabase/server'

export default function RoomsPage() {
	const supabasePromise = createClient()

	const roomsPromise = supabasePromise.then((supabase) =>
		supabase
			.from('rooms')
			.select('*, profiles(username, display_name)')
			.order('created_at', { ascending: false })
			.then((result) => result.data || []),
	)

	return (
		<div className="mx-auto w-full max-w-4xl p-6">
			<RoomsHeader />

			<Suspense fallback={<div>Loading the lobby...</div>}>
				<Rooms roomsPromise={roomsPromise} />
			</Suspense>
		</div>
	)
}
