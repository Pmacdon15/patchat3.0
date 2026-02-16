'use client'

import { useState } from 'react'
import { updatePMSettings } from '@/actions/settings'

export default function PMSettingsToggle({
	initialEnabled,
}: {
	initialEnabled: boolean
}) {
	const [enabled, setEnabled] = useState(initialEnabled)

	const handleToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const newVal = e.target.checked
		setEnabled(newVal)
		await updatePMSettings(newVal)
	}

	return (
		<form>
			<input
				checked={enabled}
				className="relative h-5 w-10 cursor-pointer appearance-none rounded-full bg-gray-200 transition before:absolute before:top-0.5 before:left-0.5 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-all before:content-[''] checked:bg-primary-600 checked:before:left-5.5"
				name="pm_enabled"
				onChange={handleToggle}
				type="checkbox"
			/>
		</form>
	)
}
