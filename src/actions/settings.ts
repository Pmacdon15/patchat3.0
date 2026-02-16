'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function updatePMSettings(enabled: boolean) {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) return

	await supabase
		.from('user_settings')
		.update({ allow_private_messages: enabled })
		.eq('user_id', user.id)

	revalidatePath('/settings')
}

export async function unblockUser(blockedId: string) {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) return

	await supabase
		.from('blocks')
		.delete()
		.eq('blocker_id', user.id)
		.eq('blocked_id', blockedId)

	revalidatePath('/settings')
}

export async function blockUser(blockedId: string) {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) return

	await supabase
		.from('blocks')
		.insert({ blocker_id: user.id, blocked_id: blockedId })

	revalidatePath('/settings')
}
