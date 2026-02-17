'use client'

import { Search } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import type { Profile } from '@/types'
import { createClient } from '@/utils/supabase/client'
import Avatar from './Avatar'

export default function UserSearch() {
	const [query, setQuery] = useState('')
	const [results, setResults] = useState<Profile[]>([])
	const [loading, setLoading] = useState(false)
	const supabase = createClient()

	const handleSearch = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!query.trim()) return

		setLoading(true)
		const { data } = await supabase
			.from('profiles')
			.select('*')
			.ilike('username', `%${query}%`)
			.limit(5)

		setResults(data || [])
		setLoading(false)
	}

	return (
		<div className="w-full">
			<form className="relative mb-4" onSubmit={handleSearch}>
				<input
					className="input-field pr-10"
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search users by username..."
					type="text"
					value={query}
				/>
				<button
					className="absolute top-2.5 right-3 text-gray-400"
					type="submit"
				>
					<Search size={18} />
				</button>
			</form>

			{loading && (
				<p className="text-center text-gray-500 text-sm">
					Searching...
				</p>
			)}

			<div className="space-y-2">
				{results.map((user) => (
					<Link
						className="group flex items-center gap-3 rounded-lg border border-gray-100 p-3 transition hover:border-primary-200 hover:bg-primary-50"
						href={`/messages/${user.id}`}
						key={user.id}
					>
						<Avatar
							name={user.display_name || user.username}
							url={user.avatar_url}
						/>
						<div>
							<p className="font-medium group-hover:text-primary-900">
								{user.display_name || user.username}
							</p>
							<p className="text-gray-500 text-xs">
								@{user.username}
							</p>
						</div>
					</Link>
				))}
				{query && results.length === 0 && !loading && (
					<p className="text-center text-gray-500 text-sm">
						No users found.
					</p>
				)}
			</div>
		</div>
	)
}
