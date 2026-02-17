'use client'

import type { User } from '@supabase/supabase-js'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { use } from 'react'

export default function Navbar({
	userPromise,
}: {
	userPromise: Promise<{ data: { user: User | null } }>
}) {
	use(userPromise)
	return (
		<nav className="fixed top-0 z-50 w-full border-gray-100 border-b bg-white/80 backdrop-blur-md">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<Link
						className="flex items-center gap-2 font-bold text-primary-600 text-xl"
						href="/"
					>
						<MessageCircle size={28} />
						<span>PatChat 3.0</span>
					</Link>
					<div className="flex items-center gap-4">
						<Link
							className="font-medium text-gray-600 transition hover:text-primary-600"
							href="/login"
						>
							Log In
						</Link>
						<Link className="btn-primary" href="/login">
							Sign Up
						</Link>
					</div>
				</div>
			</div>
		</nav>
	)
}
