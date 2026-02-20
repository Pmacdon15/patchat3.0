'use client'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'

export const fetchUsersDb = async (searchTerm: string) => {
	if (searchTerm === '') return []
	const supabase = await createClient()

	const { data, error } = await supabase
		.from('profiles')
		.select('*')
		.ilike('username', `%${searchTerm}%`)
		.limit(5)

	if (error) {
		console.error('Error fetching users:', error)
		return []
	}

	return data || []
}

export const useFetchUsers = (searchTerm: string) => {
	return useQuery({
		queryKey: ['users', searchTerm],
		queryFn: () => fetchUsersDb(searchTerm),
		enabled: !!searchTerm
	})
}
