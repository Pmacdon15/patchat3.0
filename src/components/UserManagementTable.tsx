'use client'

import { use } from 'react'
import { updateMaxRooms } from '@/actions/admin'
import type { Profile, UserSettings } from '@/types'

type ProfileWithSettings = Profile & {
	user_settings: UserSettings[] | null
}

export default function UserManagementTable({
	usersPromise,
}: {
	usersPromise: Promise<ProfileWithSettings[]>
}) {
	const users = use(usersPromise)

	return (
		<div className="overflow-x-auto">
			<table className="w-full text-left">
				<thead>
					<tr className="border-gray-100 border-b">
						<th className="pb-3 font-semibold text-gray-600">
							User
						</th>
						<th className="pb-3 font-semibold text-gray-600">
							Permissions
						</th>
						<th className="pb-3 font-semibold text-gray-600">
							Max Rooms
						</th>
						<th className="pb-3 text-right font-semibold text-gray-600">
							Actions
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-50">
					{users?.map((profile) => (
						<tr
							className="transition hover:bg-gray-50/50"
							key={profile.id}
						>
							<td className="py-4">
								<p className="font-medium">
									{profile.display_name || profile.username}
								</p>
								<p className="text-gray-500 text-xs">
									@{profile.username}
								</p>
							</td>
							<td className="py-4">
								{profile.user_settings?.[0]?.is_admin ? (
									<span className="rounded bg-blue-100 px-2 py-0.5 text-blue-700 text-xs">
										Admin
									</span>
								) : (
									<span className="rounded bg-gray-100 px-2 py-0.5 text-gray-600 text-xs">
										User
									</span>
								)}
							</td>
							<td className="py-4">
								<span className="font-mono">
									{
										profile.user_settings?.[0]
											?.max_rooms_allowed
									}
								</span>
							</td>
							<td className="py-4 text-right">
								<form
									action={async (formData) => {
										const count = parseInt(
											formData.get('max_rooms') as string,
											10,
										)
										if (!Number.isNaN(count)) {
											await updateMaxRooms(
												profile.id,
												count,
											)
										}
									}}
									className="flex items-center justify-end gap-2"
								>
									<input
										className="w-16 rounded border px-2 py-1 text-sm"
										defaultValue={
											profile.user_settings?.[0]
												?.max_rooms_allowed
										}
										max="100"
										min="1"
										name="max_rooms"
										type="number"
									/>
									<button
										className="rounded-md bg-blue-600 px-4 py-1 font-medium text-white text-xs hover:opacity-90"
										type="submit"
									>
										Update
									</button>
								</form>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
