import { Hash, Users } from 'lucide-react'
import Link from 'next/link'
import type { Room } from '@/types'

interface RoomWithProfile extends Room {
	profiles: {
		display_name: string
		username: string
	}
}

export default async function Rooms({
	roomsPromise,
}: {
	roomsPromise: Promise<RoomWithProfile[]>
}) {
	const rooms = await roomsPromise
	// console.log(rooms)
	return (
		<div className="grid gap-4 sm:grid-cols-2">
			{rooms?.map((room) => (
				<Link
					className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-primary-400 hover:shadow-md"
					href={`/rooms/${room.id}`}
					key={room.id}
				>
					<div className="mb-3 flex items-start justify-between">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
							<Hash size={24} />
						</div>
						<span className="font-bold text-[10px] text-gray-400 uppercase tracking-wider">
							{
								new Date(room.created_at)
									.toISOString()
									.split('T')[0]
							}
						</span>
					</div>

					<h3 className="mb-1 font-bold text-gray-900 text-xl transition-colors group-hover:text-primary-700">
						{room.name}
					</h3>

					<div className="mt-auto flex items-center gap-2 text-gray-500 text-sm">
						<div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 font-bold text-[10px]">
							{room.profiles?.display_name?.[0] ||
								room.profiles?.username?.[0] ||
								'U'}
						</div>
						<span>
							Created by{' '}
							<span className="font-semibold">
								@{room.profiles?.username || 'unknown'}
							</span>
						</span>
					</div>
				</Link>
			))}

			{(!rooms || rooms.length === 0) && (
				<div className="col-span-full rounded-xl border-2 border-gray-200 border-dashed bg-gray-50 py-12 text-center">
					<Users className="mx-auto mb-4 text-gray-300" size={48} />
					<h3 className="font-medium text-gray-900 text-lg">
						No rooms found
					</h3>
					<p className="text-gray-500">
						Be the first to create a room in the sidebar!
					</p>
				</div>
			)}
		</div>
	)
}
