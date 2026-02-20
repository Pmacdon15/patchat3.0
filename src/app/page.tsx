import { Suspense } from 'react'
import OptionsCard from '@/components/cards/options-cards'
import HomeHeader from '@/components/headers/home-header'

export default function HomePage() {
	return (
		<div className="p-2">
			<Suspense>
				<HomeHeader />
			</Suspense>

			<div className="flex flex-wrap gap-16 px-16 lg:gap-8">
				<OptionsCard />

				<OptionsCard typeOfMessage="private" />
			</div>
		</div>
	)
}
