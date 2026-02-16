'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createRoom(formData: FormData) {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) throw new Error('Unauthorized')

	const name = formData.get('name') as string
	if (!name || name.trim().length === 0)
		throw new Error('Room name is required')

	// Check user limit
	const { data: settings } = await supabase
		.from('user_settings')
		.select('max_rooms_allowed')
		.eq('user_id', user.id)
		.single()

	const { count } = await supabase
		.from('rooms')
		.select('*', { count: 'exact', head: true })
		.eq('created_by', user.id)

	if (count !== null && count >= (settings?.max_rooms_allowed || 3)) {
		throw new Error(
			`You have reached your limit of ${settings?.max_rooms_allowed} rooms.`,
		)
	}

	const { data: room, error } = await supabase
		.from('rooms')
		.insert({
			name: name.trim(),
			created_by: user.id,
		})
		.select()
		.single()

	if (error) throw error

	revalidatePath('/')
	return redirect(`/rooms/${room.id}`)
}
