'use client'
import { UserX } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use } from 'react'
import { unblockUser } from '@/actions/settings'

export default function BlockListManager({
	blocksPromise,
}: {
	blocksPromise: Promise<
		{
			blocked_id: string
			profiles: { username: string; display_name?: string }
		}[]
	>
}) {
	const blocks = use(blocksPromise)
	const router = useRouter()

	const handleUnblock = async (userId: string) => {
		await unblockUser(userId)
		router.refresh()
	}

	if (!blocks || blocks.length === 0) {
		return (
			<p className="italic text-gray-500 text-sm">
				You haven't blocked anyone yet.
			</p>
		)
	}

	return (
		<div className="divide-y divide-gray-100">
			{blocks.map((block) => (
				<div
					className="flex items-center justify-between py-3"
					key={block.blocked_id}
				>
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
							<UserX size={20} />
						</div>
						<div>
							<p className="font-medium">
								{block.profiles?.display_name ||
									block.profiles?.username}
							</p>
							<p className="text-gray-500 text-sm">
								@{block.profiles?.username}
							</p>
						</div>
					</div>
					<button
						className="font-medium text-red-600 text-sm hover:text-red-700"
						onClick={() => handleUnblock(block.blocked_id)}
						type="button"
					>
						Unblock
					</button>
				</div>
			))}
		</div>
	)
}
