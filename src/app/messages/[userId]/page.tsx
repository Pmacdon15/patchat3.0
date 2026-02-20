import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import PrivateChat from '@/components/PrivateChat'
import PrivateChatHeader from '@/components/headers/private-chat-header'
import { createClient } from '@/utils/supabase/server'

export default function PrivateMessagePage(
	props: PageProps<'/messages/[userId]'>,
) {
	const supabasePromise = createClient()

	// 1. Get the current User ID
	const currentUserIdPromise = supabasePromise
		.then((supabase) => supabase.auth.getUser())
		.then(({ data }) => data.user?.id || '')

	// 2. Get the "Other User" profile
	const otherUserPromise = Promise.all([supabasePromise, props.params])
		.then(([supabase, params]) =>
			supabase
				.from('profiles')
				.select('*')
				.eq('id', params.userId)
				.single(),
		)
		.then(({ data }) => {
			if (!data) notFound()
			return data
		})

	return (
		<div className="flex h-full flex-col">
			<Suspense
				fallback={<div className="h-14 animate-pulse bg-gray-100" />}
			>
				<PrivateChatHeader otherUserPromise={otherUserPromise} />
			</Suspense>

			<Suspense
				fallback={<div className="flex-1 animate-pulse bg-gray-50" />}
			>
				<PrivateChat
					currentUserIdPromise={currentUserIdPromise}
					otherUserPromise={otherUserPromise}
				/>
			</Suspense>
		</div>
	)
}
