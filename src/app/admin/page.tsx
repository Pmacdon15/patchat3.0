import { ShieldAlert, Users } from 'lucide-react'
import { updateMaxRooms } from '@/actions/admin'
import type { Profile, UserSettings } from '@/types'
import { createClient } from '@/utils/supabase/server'

type ProfileWithSettings = Profile & {
	user_settings: UserSettings[] | null
}

export default async function AdminPage() {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) return null

	// Check if user is admin
	const { data: settings } = await supabase
		.from('user_settings')
		.select('is_admin')
		.eq('user_id', user.id)
		.single()

	if (!settings?.is_admin) {
		return (
			<div className="card mx-auto mt-20 max-w-xl border-red-200 bg-red-50 p-8 text-center">
				<ShieldAlert className="mx-auto mb-4 text-red-500" size={48} />
				<h1 className="mb-2 font-bold text-2xl text-red-900">
					Access Denied
				</h1>
				<p className="text-red-700">
					You do not have administrator privileges to access this
					page.
				</p>
			</div>
		)
	}

	const { data: users } = await supabase
		.from('profiles')
		.select('*, user_settings(max_rooms_allowed, is_admin)')

	return (
		<div className="mx-auto max-w-4xl">
			<div className="mb-8 flex items-center justify-between">
				<h1 className="font-bold text-3xl text-primary-900">
					Admin Dashboard
				</h1>
				<div className="flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 font-medium text-primary-700 text-sm">
					<ShieldAlert size={16} />
					Administrator
				</div>
			</div>

			<div className="card">
				<h2 className="mb-6 flex items-center gap-2 font-semibold text-xl">
					<Users className="text-primary-600" size={20} />
					User Management
				</h2>

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
							{(users as ProfileWithSettings[])?.map(
								(profile) => (
									<tr
										className="transition hover:bg-gray-50/50"
										key={profile.id}
									>
										<td className="py-4">
											<p className="font-medium">
												{profile.display_name ||
													profile.username}
											</p>
											<p className="text-gray-500 text-xs">
												@{profile.username}
											</p>
										</td>
										<td className="py-4">
											{profile.user_settings?.[0]
												?.is_admin ? (
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
													'use server'
													const count = parseInt(
														formData.get(
															'max_rooms',
														) as string,
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
														profile
															.user_settings?.[0]
															?.max_rooms_allowed
													}
													max="100"
													min="1"
													name="max_rooms"
													type="number"
												/>
												<button
													className="btn-primary py-1! text-xs"
													type="submit"
												>
													Update
												</button>
											</form>
										</td>
									</tr>
								),
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
