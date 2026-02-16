import { Suspense } from 'react'
import HomeHeader from '@/components/headers/home-header'
import UserSearch from '@/components/UserSearch'

export default function HomePage() {
	return (
		<div className="max-w-4xl">
			<Suspense>
				<HomeHeader />
			</Suspense>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div className="card">
					<h2 className="mb-4 flex items-center gap-2 font-semibold text-xl">
						<span className="h-6 w-2 rounded-full bg-primary-400"></span>
						Public Rooms
					</h2>
					<p className="mb-4 text-gray-600">
						Join current conversations or create your own room to
						discuss topics with everyone.
					</p>
					<button className="btn-primary w-full" type="button">
						Browse All Rooms
					</button>
				</div>

				<div className="card">
					<h2 className="mb-4 flex items-center gap-2 font-semibold text-xl">
						<span className="h-6 w-2 rounded-full bg-primary-400"></span>
						Private Messages
					</h2>
					<p className="mb-4 text-gray-600">
						Connect one-on-one with other users. Your privacy is
						protected by your settings.
					</p>
					<UserSearch />
				</div>
			</div>
		</div>
	)
}
