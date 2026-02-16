'use client'

import { Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Avatar from './Avatar'

export default function PrivateChat({
	currentUserId,
	otherUserId,
	otherUser,
}: {
	currentUserId: string
	otherUserId: string
	otherUser: { username: string; display_name?: string; avatar_url?: string }
}) {
	const [messages, setMessages] = useState<
		{ id: string; sender_id: string; content: string; created_at: string }[]
	>([])
	const [content, setContent] = useState('')
	const [isBlocked, setIsBlocked] = useState(false)
	const [pmDisabled, setPmDisabled] = useState(false)
	const supabase = createClient()
	const messagesEndRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const checkStatus = async () => {
			// Check if blocked
			const { data: blockData } = await supabase
				.from('blocks')
				.select('*')
				.match({ blocker_id: otherUserId, blocked_id: currentUserId })
				.single()

			if (blockData) setIsBlocked(true)

			// Check if PMs enabled
			const { data: settings } = await supabase
				.from('user_settings')
				.select('allow_private_messages')
				.eq('user_id', otherUserId)
				.single()

			if (settings && !settings.allow_private_messages)
				setPmDisabled(true)
		}

		const fetchMessages = async () => {
			const { data } = await supabase
				.from('private_messages')
				.select('*')
				.or(
					`and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`,
				)
				.order('created_at', { ascending: true })

			if (data) setMessages(data)
		}

		checkStatus()
		fetchMessages()

		const channel = supabase
			.channel(`pm:${[currentUserId, otherUserId].sort().join('-')}`)
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'private_messages',
				},
				(payload) => {
					const newMsg = payload.new
					if (
						(newMsg.sender_id === currentUserId &&
							newMsg.receiver_id === otherUserId) ||
						(newMsg.sender_id === otherUserId &&
							newMsg.receiver_id === currentUserId)
					) {
						setMessages((prev) => [...prev, newMsg])
					}
				},
			)
			.subscribe()

		return () => {
			supabase.removeChannel(channel)
		}
	}, [currentUserId, otherUserId, supabase])

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [])

	const sendMessage = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!content.trim() || isBlocked || pmDisabled) return

		const { error } = await supabase.from('private_messages').insert({
			sender_id: currentUserId,
			receiver_id: otherUserId,
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
			<div className="card flex items-center justify-center bg-gray-50 p-12">
				<p className="text-gray-500 italic">
					You cannot message this user.
				</p>
			</div>
		)
	}

	if (pmDisabled) {
		return (
			<div className="card flex items-center justify-center bg-gray-50 p-12">
				<p className="text-gray-500 italic">
					This user has disabled private messages.
				</p>
			</div>
		)
	}

	return (
		<div className="card flex h-[calc(100vh-200px)] flex-col overflow-hidden p-0">
			<div className="flex items-center gap-3 border-primary-100 border-b p-4">
				<Avatar
					name={otherUser?.display_name || otherUser?.username}
					url={otherUser?.avatar_url}
				/>
				<div>
					<h2 className="font-semibold">
						{otherUser?.display_name || otherUser?.username}
					</h2>
					<p className="text-gray-500 text-xs">
						@{otherUser?.username}
					</p>
				</div>
			</div>

			<div className="flex-1 space-y-4 overflow-y-auto p-4">
				{messages.map((message) => (
					<div
						className={`flex ${message.sender_id === currentUserId ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}
						key={message.id}
					>
						{message.sender_id !== currentUserId && (
							<Avatar
								name={
									otherUser?.display_name ||
									otherUser?.username
								}
								size="sm"
								url={otherUser?.avatar_url}
							/>
						)}
						<div
							className={`max-w-[70%] rounded-2xl px-4 py-2 ${
								message.sender_id === currentUserId
									? 'rounded-br-none bg-primary-600 text-white'
									: 'rounded-bl-none bg-primary-100 text-primary-900'
							}`}
						>
							<p className="text-sm">{message.content}</p>
						</div>
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>

			<form
				className="flex gap-2 border-primary-100 border-t p-4"
				onSubmit={sendMessage}
			>
				<input
					className="input-field"
					disabled={isBlocked || pmDisabled}
					id="private-message"
					name="content"
					onChange={(e) => setContent(e.target.value)}
					placeholder="Send a private message..."
					type="text"
					value={content}
				/>
				<button
					className="btn-primary flex items-center gap-2 disabled:bg-gray-300"
					disabled={isBlocked || pmDisabled}
					type="submit"
				>
					<Send size={18} />
					<span>Send</span>
				</button>
			</form>
		</div>
	)
}
