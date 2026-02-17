import { Suspense } from 'react'
import BlockListManager from '@/components/BlockListManager'
import PMSettingsToggle from '@/components/PMSettingsToggle'
import { createClient } from '@/utils/supabase/server'

export default function SettingsPage() {
	const supabasePromise = createClient()
	const userPromise = supabasePromise.then((s) => s.auth.getUser())

	const settingsPromise = Promise.all([supabasePromise, userPromise]).then(
		([
			s,
			{
				data: { user },
			},
		]) => {
			if (!user) return null
			return s
				.from('user_settings')
				.select('*')
				.eq('user_id', user.id)
				.single()
				.then(({ data }) => data)
		},
	)

	const blocksPromise = Promise.all([supabasePromise, userPromise]).then(
		([
			s,
			{
				data: { user },
			},
		]) => {
			if (!user) return []
			return s
				.from('blocks')
				.select(
					'blocked_id, profiles!blocks_blocked_id_fkey(username, display_name)',
				)
				.eq('blocker_id', user.id)
				.returns<
					Array<{
						blocked_id: string
						profiles: { username: string; display_name?: string }
					}>
				>()
				.then(({ data }) => data || [])
		},
	)

	return (
		<div className="mx-auto max-w-2xl">
			<h1 className="mb-8 font-bold text-3xl text-primary-900">
				Settings
			</h1>

			<div className="space-y-8">
				<section className="card">
					<h2 className="mb-4 font-semibold text-xl">Privacy</h2>
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium">
								{' '}
								Allow Private Messages{' '}
							</p>
							<p className="text-gray-500 text-sm">
								Enable or disable one-on-one direct messages
								from others.
							</p>
						</div>
						<Suspense
							fallback={
								<div className="h-5 w-10 animate-pulse rounded-full bg-gray-200" />
							}
						>
							<PMSettingsToggle
								settingsPromise={settingsPromise}
							/>
						</Suspense>
					</div>
				</section>

				<section className="card">
					<h2 className="mb-4 font-semibold text-xl">Block List</h2>
					<Suspense
						fallback={
							<div className="py-4 text-center">
								Loading block list...
							</div>
						}
					>
						<BlockListManager blocksPromise={blocksPromise} />
					</Suspense>
				</section>
			</div>
		</div>
	)
}
