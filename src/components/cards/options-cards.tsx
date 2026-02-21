import Link from 'next/link'
import UserSearch from '../UserSearch'

export default async function OptionsCard({
	typeOfMessage = 'public',
	userIdPromise,
}: {
	typeOfMessage?: 'public' | 'private'
	userIdPromise?: Promise<string>
}) {
	const userId = await userIdPromise
	if (userId !== '')
		return (
			<div className="min-w-96 max-w-96 rounded-lg border border-gray-200 bg-white p-6 dark:border-neutral-800">
				<h2 className="mb-4 flex items-center gap-2 font-semibold text-xl">
					{/* <span className="h-6 w-6 rounded-full bg-primary-400"></span> */}
					{typeOfMessage === 'public'
						? 'Public Rooms'
						: 'Private Messages'}
				</h2>

				{typeOfMessage === 'public' ? (
					<p className="mb-4 text-gray-600">
						Join current conversations or create your own room to
						discuss topics with everyone.
					</p>
				) : (
					<p className="mb-4 text-gray-600">
						Connect one-on-one with other users. Your privacy is
						protected by your settings.
					</p>
				)}
				{typeOfMessage === 'public' ? (
					<Link href={'/rooms'}>
						<button
							className="mb-4 w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:opacity-90"
							type="button"
						>
							Browse All Rooms
						</button>
					</Link>
				) : (
					<UserSearch />
				)}
			</div>
		)
}
