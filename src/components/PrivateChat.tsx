'use client'

import { Send } from 'lucide-react'
import { use, useEffect, useRef, useState } from 'react'
import type { PrivateMessage, Profile } from '@/types'
import { createClient } from '@/utils/supabase/client'
import Avatar from './Avatar'

export default function PrivateChat({
	currentUserIdPromise,
	otherUserPromise,
}: {
	currentUserIdPromise: Promise<string>
	otherUserPromise: Promise<Profile>
}) {
	const [messages, setMessages] = useState<PrivateMessage[]>([])
	const [content, setContent] = useState('')
	const [isBlocked, setIsBlocked] = useState(false)
	const [pmDisabled, setPmDisabled] = useState(false)
	const supabase = createClient()
	const messagesEndRef = useRef<HTMLDivElement>(null)

	const currentUserId = use(currentUserIdPromise)
	const otherUser = use(otherUserPromise)

	useEffect(() => {
		const checkStatus = async () => {
			// Check if blocked
			const { data: blockData } = await supabase
				.from('blocks')
				.select('*')
				.match({ blocker_id: otherUser.id, blocked_id: currentUserId })
				.single()

			if (blockData) setIsBlocked(true)

			// Check if PMs enabled
			const { data: settings } = await supabase
				.from('user_settings')
				.select('allow_private_messages')
				.eq('user_id', otherUser.id)
				.single()

			if (settings && !settings.allow_private_messages)
				setPmDisabled(true)
		}

		const fetchMessages = async () => {
			const { data } = await supabase
				.from('private_messages')
				.select('*')
				.or(
					`and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUser.id}),and(sender_id.eq.${otherUser.id},receiver_id.eq.${currentUserId})`,
				)
				.order('created_at', { ascending: true })

			if (data) setMessages(data)
		}

		checkStatus()
		fetchMessages()

		const channel = supabase
			.channel(`pm:${[currentUserId, otherUser.id].sort().join('-')}`)
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'private_messages',
				},
				(payload) => {
					const newMsg = payload.new as PrivateMessage
					// Only add messages that belong to this conversation
					if (
						(newMsg.sender_id === currentUserId &&
							newMsg.receiver_id === otherUser.id) ||
						(newMsg.sender_id === otherUser.id &&
							newMsg.receiver_id === currentUserId)
					) {
						setMessages((prev) => {
							// Avoid duplicates
							if (prev.some((m) => m.id === newMsg.id))
								return prev
							return [...prev, newMsg]
						})
					}
				},
			)
			.subscribe()

		return () => {
			supabase.removeChannel(channel)
		}
	}, [currentUserId, otherUser.id, supabase])

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [])

	const sendMessage = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!content.trim() || isBlocked || pmDisabled) return

		const { error } = await supabase.from('private_messages').insert({
			sender_id: currentUserId,
			receiver_id: otherUser.id,
			content: content.trim(),
		})

		if (error) {
			console.error('Error sending PM:', error)
		} else {
			setContent('')
		}
	}

	if (isBlocked) {
		return (
			<div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-12 dark:border-neutral-800">
				<p className="text-gray-500 italic">
					You cannot message this user.
				</p>
			</div>
		)
	}

	if (pmDisabled) {
		return (
			<div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-12 dark:border-neutral-800">
				<p className="text-gray-500 italic">
					This user has disabled private messages.
				</p>
			</div>
		)
	}

	return (
		<div className="flex h-full flex-1 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-0 dark:border-neutral-800">
			<div className="flex-1 space-y-4 overflow-y-auto p-3 md:p-4">
				{messages.map((message) => (
					<div
						className={`flex ${message.sender_id === currentUserId ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}
						key={message.id}
					>
						<Avatar
							name={
								message.sender_id === currentUserId
									? 'You'
									: otherUser?.display_name ||
										otherUser?.username
							}
							size="xs"
							url={
								message.sender_id === currentUserId
									? null // We don't have current user's avatar url here easily, but we could pass it
									: otherUser?.avatar_url
							}
						/>
						<div
							className={`max-w-[85%] rounded-2xl px-3 py-1.5 md:max-w-[70%] md:px-4 md:py-2 ${
								message.sender_id === currentUserId
									? 'rounded-br-none bg-primary-600 text-white'
									: 'rounded-bl-none bg-primary-100 text-primary-900'
							}`}
						>
							<div className="mb-0.5 font-bold text-[9px] uppercase tracking-wider opacity-75 md:text-[10px]">
								{message.sender_id === currentUserId
									? 'You'
									: otherUser?.display_name ||
										otherUser?.username}
							</div>
							<p className="text-sm">{message.content}</p>
						</div>
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>

			<form
				className="flex gap-2 border-primary-100 border-t p-3 md:p-4"
				onSubmit={sendMessage}
			>
				<input
					className="w-full rounded-md border border-gray-300 bg-transparent px-2 py-1.5 text-sm md:py-2 md:text-base"
					disabled={isBlocked || pmDisabled}
					id="private-message"
					name="content"
					onChange={(e) => setContent(e.target.value)}
					placeholder="Message..."
					type="text"
					value={content}
				/>
				<button
					className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 font-medium text-white hover:opacity-90 disabled:bg-gray-300 md:px-4"
					disabled={isBlocked || pmDisabled}
					type="submit"
				>
					<Send className="md:h-[18px] md:w-[18px]" size={16} />
					<span className="hidden md:inline">Send</span>
				</button>
			</form>
		</div>
	)
}
