'use client'

import { Home, LogOut, Plus, Settings, Shield, Users, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { signOut } from '@/actions/auth'
import { createRoom } from '@/actions/rooms'
import Avatar from './Avatar'

export default function Sidebar({
	rooms,
	userProfile,
	directMessages = [],
}: {
	rooms: { id: string; name: string }[]
	userProfile: {
		username: string
		display_name: string | null
		avatar_url: string | null
	} | null
	directMessages?: {
		id: string
		username: string
		display_name: string | null
		avatar_url: string | null
	}[]
}) {
	const pathname = usePathname()
	const [isCreatingRoom, setIsCreatingRoom] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleCreateRoom = async (formData: FormData) => {
		try {
			setError(null)
			await createRoom(formData)
			setIsCreatingRoom(false)
		} catch (e: any) {
			setError(e.message)
		}
	}

	return (
		<div className="fixed top-0 left-0 z-40 flex h-screen w-64 flex-col border-primary-700 border-r bg-primary-800 text-white">
			<div className="border-primary-700 border-b p-6">
				<div className="mb-4 flex items-center gap-3">
					<Avatar
						name={
							userProfile?.display_name || userProfile?.username
						}
						url={userProfile?.avatar_url}
					/>
					<div className="overflow-hidden">
						<p className="truncate font-bold text-sm">
							{userProfile?.display_name || userProfile?.username}
						</p>
						<p className="truncate text-[10px] text-primary-300">
							@{userProfile?.username}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2 font-bold text-xl">
					<Users className="text-primary-300" />
					PatChat 3.0
				</div>
			</div>

			<nav className="flex-1 space-y-2 overflow-y-auto p-4">
				<Link
					className={`flex items-center space-x-3 rounded p-2 transition ${pathname === '/' ? 'bg-primary-700 shadow-inner' : 'hover:bg-primary-700/50'}`}
					href="/"
				>
					<Home size={20} />
					<span>Home</span>
				</Link>

				<div className="group flex items-center justify-between pt-4 pb-2 font-semibold text-primary-300 text-xs uppercase tracking-wider">
					<span>Chat Rooms</span>
					<button
						className="rounded p-1 transition hover:bg-primary-700 hover:text-white"
						onClick={() => setIsCreatingRoom(true)}
						title="Create Room"
						type="button"
					>
						<Plus size={16} />
					</button>
				</div>

				{isCreatingRoom && (
					<form
						action={handleCreateRoom}
						className="fade-in slide-in-from-top-1 mb-2 animate-in rounded-md bg-primary-700/50 p-2"
					>
						<div className="mb-2 flex items-center justify-between">
							<span className="font-bold text-[10px] uppercase">
								New Room
							</span>
							<button
								onClick={() => setIsCreatingRoom(false)}
								type="button"
							>
								<X size={12} />
							</button>
						</div>
						<input
							className="w-full rounded border border-primary-600 bg-primary-900/50 px-2 py-1 text-xs focus:border-primary-400 focus:outline-none"
							id="room-name"
							name="name"
							placeholder="Room name..."
							required
						/>
						{error && (
							<p className="mt-1 text-[10px] text-red-300">
								{error}
							</p>
						)}
						<button
							className="mt-2 w-full rounded bg-primary-600 py-1 font-bold text-xs shadow-md transition hover:bg-primary-500"
							type="submit"
						>
							Create
						</button>
					</form>
				)}

				{rooms.map((room) => (
					<Link
						className={`flex items-center space-x-3 rounded p-2 transition ${pathname === `/rooms/${room.id}` ? 'bg-primary-700 shadow-inner' : 'hover:bg-primary-700/50'}`}
						href={`/rooms/${room.id}`}
						key={room.id}
					>
						<Users size={18} />
						<span className="truncate">{room.name}</span>
					</Link>
				))}

				<div className="group flex items-center justify-between pt-4 pb-2 font-semibold text-primary-300 text-xs uppercase tracking-wider">
					<span>Direct Messages</span>
				</div>

				{directMessages.map((profile) => (
					<Link
						className={`flex items-center space-x-3 rounded p-2 transition ${pathname === `/messages/${profile.id}` ? 'bg-primary-700 shadow-inner' : 'hover:bg-primary-700/50'}`}
						href={`/messages/${profile.id}`}
						key={profile.id}
					>
						<Avatar
							name={profile.display_name || profile.username}
							size="xs"
							url={profile.avatar_url}
						/>
						<span className="truncate">
							{profile.display_name || profile.username}
						</span>
					</Link>
				))}

				<div className="pt-4 pb-2 font-semibold text-primary-300 text-xs uppercase tracking-wider">
					Account
				</div>
				<Link
					className={`flex items-center space-x-3 rounded p-2 transition ${pathname === '/settings' ? 'bg-primary-700 shadow-inner' : 'hover:bg-primary-700/50'}`}
					href="/settings"
				>
					<Settings size={20} />
					<span>Settings</span>
				</Link>
				<Link
					className={`flex items-center space-x-3 rounded p-2 transition ${pathname === '/admin' ? 'bg-primary-700 shadow-inner' : 'hover:bg-primary-700/50'}`}
					href="/admin"
				>
					<Shield size={20} />
					<span>Admin</span>
				</Link>
			</nav>

			<div className="border-primary-700 border-t p-4">
				<button
					className="flex w-full items-center space-x-3 rounded p-2 text-red-300 transition hover:bg-primary-700/50"
					onClick={() => signOut()}
					type="button"
				>
					<LogOut size={20} />
					<span>Sign Out</span>
				</button>
			</div>
		</div>
	)
}
