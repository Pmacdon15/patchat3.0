import { Suspense } from 'react'
import OptionsCard from '@/components/cards/options-cards'
import HomeHeader from '@/components/headers/home-header'
import { createClient } from '@/utils/supabase/server'

export default function HomePage() {
	const supabasePromise = createClient()

	const userIdPromise = supabasePromise
		.then((supabase) => supabase.auth.getUser())
		.then(({ data }) => data.user?.id || '')

	return (
		<div className="">
			<Suspense>
				<HomeHeader />
			</Suspense>

			<div className="flex flex-wrap justify-center gap-16 lg:gap-8">
				<OptionsCard />
				<Suspense>
					<OptionsCard
						typeOfMessage="private"
						userIdPromise={userIdPromise}
					/>
				</Suspense>
			</div>
		</div>
	)
}
