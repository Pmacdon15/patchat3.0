import type { Profile } from '@/types'

export default async function PrivateChatHeader({
	otherUserPromise,
}: {
	otherUserPromise: Promise<Profile>
}) {
	const otherUser = await otherUserPromise
	return (
		<header className="mb-6 flex items-center justify-between">
			<div>
				<h1 className="font-bold text-2xl text-primary-900">
					{otherUser.display_name || otherUser.username}
				</h1>
				<p className="text-gray-500">Private Message</p>
			</div>
		</header>
	)
}
