import { Github, Mail } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
	return (
		<footer className="border-gray-200 border-t bg-white py-4">
			<div className="w-full border-gray-100 border-t bg-gray-50 px-4 py-4">
				<div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
					<div className="text-gray-500 text-sm">
						©2026 PatChat 3.0. All rights reserved.
					</div>
					<div className="flex items-center gap-8">
						<Link
							className="flex items-center gap-2 font-medium text-gray-600 text-sm transition hover:text-primary-600"
							href="mailto:patrick@patmac.ca"
						>
							<Mail size={18} />
							<span>patrick@patmac.ca</span>
						</Link>
						<Link
							className="flex items-center gap-2 font-medium text-gray-600 text-sm transition hover:text-primary-600"
							href="https://github.com/pmacdon"
							rel="noopener noreferrer"
							target="_blank"
						>
							<Github size={18} />
							<span>pmacdon</span>
						</Link>
					</div>
				</div>
			</div>
		</footer>
	)
}
