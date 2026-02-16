'use client'

import { User } from 'lucide-react'
import Image from 'next/image'

interface AvatarProps {
	url?: string | null
	name?: string | null
	size?: 'xs' | 'sm' | 'md' | 'lg'
}

export default function Avatar({ url, name, size = 'md' }: AvatarProps) {
	const sizeClasses = {
		xs: 'w-6 h-6 text-[10px]',
		sm: 'w-8 h-8 text-xs',
		md: 'w-10 h-10 text-sm',
		lg: 'w-12 h-12 text-base',
	}

	const iconSizes = {
		xs: 12,
		sm: 16,
		md: 20,
		lg: 24,
	}

	if (url) {
		return (
			<div
				className={`${sizeClasses[size]} relative flex-shrink-0 overflow-hidden rounded-full border border-gray-100 bg-primary-100`}
			>
				<Image
					alt={name || 'User avatar'}
					className="object-cover"
					fill
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					src={url}
				/>
			</div>
		)
	}

	const initials = name
		? name
				.split(' ')
				.map((n) => n[0])
				.join('')
				.toUpperCase()
				.slice(0, 2)
		: ''

	return (
		<div
			className={`${sizeClasses[size]} flex flex-shrink-0 items-center justify-center rounded-full border border-primary-200 bg-primary-100 font-bold text-primary-700`}
		>
			{initials || <User size={iconSizes[size]} />}
		</div>
	)
}
