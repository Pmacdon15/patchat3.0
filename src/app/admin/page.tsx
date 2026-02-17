import { ShieldAlert, Users } from 'lucide-react'
import { Suspense } from 'react'
import AdminAuthWrapper from '@/components/AdminAuthWrapper'
import UserManagementTable from '@/components/UserManagementTable'
import type { Profile, UserSettings } from '@/types'
import { createClient } from '@/utils/supabase/server'

type ProfileWithSettings = Profile & {
	user_settings: UserSettings[] | null
}

export default function AdminPage() {
	const supabasePromise = createClient()
	const userPromise = supabasePromise.then((s) => s.auth.getUser())

	const adminCheckPromise = Promise.all([supabasePromise, userPromise]).then(
		([
			s,
			{
				data: { user },
			},
		]) => {
			if (!user) return false
			return s
				.from('user_settings')
				.select('is_admin')
				.eq('user_id', user.id)
				.single()
				.then(({ data }) => !!data?.is_admin)
		},
	)

	const usersPromise = supabasePromise.then((s) =>
		s
			.from('profiles')
			.select('*, user_settings(max_rooms_allowed, is_admin)')
			.then(({ data }) => (data as ProfileWithSettings[]) || []),
	)

	return (
		<Suspense
			fallback={
				<div className="p-8 text-center">Checking permissions...</div>
			}
		>
			<AdminAuthWrapper adminCheckPromise={adminCheckPromise}>
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

						<Suspense
							fallback={
								<div className="py-8 text-center">
									Loading users...
								</div>
							}
						>
							<UserManagementTable usersPromise={usersPromise} />
						</Suspense>
					</div>
				</div>
			</AdminAuthWrapper>
		</Suspense>
	)
}
