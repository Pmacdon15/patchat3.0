import { notFound } from 'next/navigation'
import PrivateChat from '@/components/PrivateChat'
import { createClient } from '@/utils/supabase/server'

export default async function PrivateMessagePage(props: {
	params: Promise<{ userId: string }>
}) {
	const params = await props.params
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (user?.id === params.userId) {
		return (
			<div className="card p-12 text-center">
				<p className="text-gray-500">
					You cannot start a private message with yourself.
				</p>
			</div>
		)
	}

	const { data: otherUser } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', params.userId)
		.single()

	if (!otherUser) {
		return notFound()
	}

	return (
		<div className="mx-auto max-w-4xl">
			<h1 className="mb-6 font-bold text-2xl text-primary-900">
				Private Message
			</h1>
			<PrivateChat
				currentUserId={user?.id || ''}
				otherUser={otherUser}
				otherUserId={otherUser.id}
			/>
		</div>
	)
}
