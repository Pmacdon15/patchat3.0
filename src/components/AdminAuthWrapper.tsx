'use client'

import { ShieldAlert } from 'lucide-react'
import { use } from 'react'

export default function AdminAuthWrapper({
	adminCheckPromise,
	children,
}: {
	adminCheckPromise: Promise<boolean>
	children: React.ReactNode
}) {
	const isAdmin = use(adminCheckPromise)

	if (!isAdmin) {
		return (
			<div className="mx-auto mt-20 max-w-xl rounded-lg border border-gray-200 border-red-200 bg-red-50 bg-white p-8 text-center dark:border-neutral-800">
				<ShieldAlert className="mx-auto mb-4 text-red-500" size={48} />
				<h1 className="mb-2 font-bold text-2xl text-red-900">
					Access Denied
				</h1>
				<p className="text-red-700">
					You do not have administrator privileges to access this
					page.
				</p>
			</div>
		)
	}

	return <>{children}</>
}
