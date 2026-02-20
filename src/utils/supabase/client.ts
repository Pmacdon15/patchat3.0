import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
	return createBrowserClient(
		String(process.env.NEXT_PUBLIC_SUPABASE_URL),
		String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
	)
}
