'use client'

import { Send } from 'lucide-react'
import { use, useEffect, useRef, useState } from 'react'
import type { Message, Profile } from '@/types'
import { createClient } from '@/utils/supabase/client'
import Avatar from './Avatar'

type MessageWithProfile = Message & {
	profiles: Pick<Profile, 'username' | 'display_name' | 'avatar_url'> | null
}

export default function ChatRoom({
	roomIdPromise,
	userIdPromise,
}: {
	roomIdPromise: Promise<string>
	userIdPromise: Promise<string>
}) {
	const [messages, setMessages] = useState<MessageWithProfile[]>([])
	const [content, setContent] = useState('')
	const supabase = createClient()
	const messagesEndRef = useRef<HTMLDivElement>(null)

	const userId = use(userIdPromise)
	const roomId = use(roomIdPromise)
	useEffect(() => {
		const fetchMessages = async () => {
			const { data } = await supabase
				.from('messages')
				.select('*, profiles(username, display_name, avatar_url)')
				.eq('room_id', roomId)
				.order('created_at', { ascending: true })

			if (data) setMessages(data)
		}

		fetchMessages()

		const channel = supabase
			.channel(`room:${roomId}`)
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'messages',
					filter: `room_id=eq.${roomId}`,
				},
				async (payload: { new: { id: string } }) => {
					// Fetch the full message with profile data
					const { data } = await supabase
						.from('messages')
						.select(
							'*, profiles(username, display_name, avatar_url)',
						)
						.eq('id', payload.new.id)
						.single()

					if (data) {
						setMessages((prev) => [...prev, data])
					}
				},
			)
			.subscribe()

		return () => {
			supabase.removeChannel(channel)
		}
	}, [roomId, supabase])

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [])

	const sendMessage = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!content.trim()) return

		const { error } = await supabase.from('messages').insert({
			room_id: roomId,
			user_id: userId,
			content: content.trim(),
		})

		if (error) {
			console.error('Error sending message:', error)
		} else {
			setContent('')
		}
	}

	return (
		<div className="card flex h-full flex-1 flex-col overflow-hidden p-0">
			<div className="flex-1 space-y-4 overflow-y-auto p-4">
				{messages.map((message) => (
					<div
						className={`flex ${message.user_id === userId ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}
						key={message.id}
					>
						<Avatar
							name={
								message.profiles?.display_name ||
								message.profiles?.username
							}
							size="sm"
							url={message.profiles?.avatar_url}
						/>
						<div
							className={`max-w-[70%] rounded-2xl px-4 py-2 ${
								message.user_id === userId
									? 'rounded-br-none bg-primary-600 text-white'
									: 'rounded-bl-none bg-primary-100 text-primary-900'
							}`}
						>
							<div className="mb-1 font-bold text-[10px] uppercase tracking-wider opacity-75">
								{message.profiles?.display_name ||
									message.profiles?.username}
							</div>
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
					id="chat-message"
					name="content"
					onChange={(e) => setContent(e.target.value)}
					placeholder="Type your message..."
					type="text"
					value={content}
				/>
				<button
					className="btn-primary flex items-center gap-2"
					type="submit"
				>
					<Send size={18} />
					<span>Send</span>
				</button>
			</form>
		</div>
	)
}
