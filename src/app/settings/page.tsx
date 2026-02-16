import BlockListManager from '@/components/BlockListManager'
import PMSettingsToggle from '@/components/PMSettingsToggle'
import { createClient } from '@/utils/supabase/server'

export default async function SettingsPage() {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) return null

	const { data: settings } = await supabase
		.from('user_settings')
		.select('*')
		.eq('user_id', user.id)
		.single()

	const { data: blocks } = await supabase
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
								Allow Private Messages
							</p>
							<p className="text-gray-500 text-sm">
								Enable or disable one-on-one direct messages
								from others.
							</p>
						</div>
						<PMSettingsToggle
							initialEnabled={
								settings?.allow_private_messages ?? true
							}
						/>
					</div>
				</section>

				<section className="card">
					<h2 className="mb-4 font-semibold text-xl">Block List</h2>
					<BlockListManager blocks={blocks || []} />
				</section>
			</div>
		</div>
	)
}
