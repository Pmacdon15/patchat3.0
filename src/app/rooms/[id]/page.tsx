import { notFound } from 'next/navigation'
import ChatRoom from '@/components/ChatRoom'
import { createClient } from '@/utils/supabase/server'

export default async function RoomPage(props: {
	params: Promise<{ id: string }>
}) {
	const params = await props.params
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	const { data: room } = await supabase
		.from('rooms')
		.select('*')
		.eq('id', params.id)
		.single()

	if (!room) {
		return notFound()
	}

	return (
		<div className="flex h-full flex-col">
			<header className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="font-bold text-2xl text-primary-900">
						{room.name}
					</h1>
					<p className="text-gray-500">Public Chat Room</p>
				</div>
			</header>

			<ChatRoom roomId={room.id} userId={user?.id || ''} />
		</div>
	)
}
