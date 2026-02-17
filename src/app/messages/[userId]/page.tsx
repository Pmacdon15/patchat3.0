import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import PrivateChat from '@/components/PrivateChat'
import { createClient } from '@/utils/supabase/server'

export default function PrivateMessagePage(props: PageProps<'/messages/[userId]'>) {
    const supabasePromise = createClient()

    // 1. Get the current User ID
    const currentUserIdPromise = supabasePromise
        .then((supabase) => supabase.auth.getUser())
        .then(({ data }) => data.user?.id || '')

    // 2. Get the "Other User" profile
    const otherUserPromise = Promise.all([supabasePromise, props.params])
        .then(([supabase, params]) => 
            supabase.from('profiles').select('*').eq('id', params.userId).single()
        )
        .then(({ data }) => {
            if (!data) notFound()
            return data
        })

    return (
        <div className="mx-auto max-w-4xl">
            <h1 className="mb-6 font-bold text-2xl text-primary-900">
                Private Message
            </h1>
            
            <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-gray-50" />}>
               <PrivateChat
                    currentUserIdPromise={currentUserIdPromise}
                    otherUserPromise={otherUserPromise}
                />
            </Suspense>
        </div>
    )
}