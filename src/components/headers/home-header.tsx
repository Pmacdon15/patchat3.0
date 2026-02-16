import { createClient } from '@/utils/supabase/server'
export default async function HomeHeader() {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	const { data: profile } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', user?.id)
		.single()

	return (
		<header className="mb-8">
			<h1 className="border-primary-500 border-l-4 pl-4 font-bold text-3xl text-primary-900">
				Welcome back,{' '}
				{profile?.display_name || profile?.username || 'User'}!
			</h1>
			<p className="mt-2 text-gray-600">
				Select a chat room from the sidebar or start a private message
				to get started.
			</p>
		</header>
	)
}
