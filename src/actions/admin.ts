'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function updateMaxRooms(userId: string, maxRooms: number) {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	// Verify requester is admin
	const { data: adminCheck } = await supabase
		.from('user_settings')
		.select('is_admin')
		.eq('user_id', user?.id)
		.single()

	if (!adminCheck?.is_admin) throw new Error('Unauthorized')

	await supabase
		.from('user_settings')
		.update({ max_rooms_allowed: maxRooms })
		.eq('user_id', userId)

	revalidatePath('/admin')
}
