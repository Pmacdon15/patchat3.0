'use client'

import { useDebouncedValue } from '@tanstack/react-pacer'
import Link from 'next/link'
import { useState } from 'react'
import { useFetchUsers } from '@/hooks/hooks'
import Avatar from './Avatar'

export default function UserSearch() {
	const [query, setQuery] = useState('')

	const [debouncedQuery] = useDebouncedValue(query, {
		wait: 500,
	})

	const { data: results, isLoading } = useFetchUsers(debouncedQuery)

	const handleTyping = (query: string) => {
		setQuery(query)
	}

	const displayResults = query ? results : []

	return (
		<div className="w-full">
			<div className="relative mb-4">
				<input
					className="pr-10 rounded-md p-2"
					onChange={(e) => {
						handleTyping(e.target.value)
					}}
					placeholder="Search users by username..."
					type="text"
					value={query}
				/>
			</div>

			{isLoading && query && (
				<p className="text-center text-gray-500 text-sm">
					Searching...
				</p>
			)}

			<div className="space-y-2">
				{displayResults?.map((user) => (
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
				{query && results?.length === 0 && !isLoading && (
					<p className="text-center text-gray-500 text-sm">
						No users found.
					</p>
				)}
			</div>
		</div>
	)
}
