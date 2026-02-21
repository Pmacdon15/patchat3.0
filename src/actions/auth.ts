'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
	const supabase = await createClient()

	const email = formData.get('email') as string
	const password = formData.get('password') as string

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	})

	if (error) {
		return redirect(`/login?message=${encodeURIComponent(error.message)}`)
	}

	return redirect('/')
}

export async function signInWithGoogle() {
	const supabase = await createClient()

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'google',
		// options: {
		// 	redirectTo:
		// 		'https://lsovuldxbdzrevyzwztg.supabase.co/auth/v1/callback',
		// },
	})

	if (error) {
		return redirect(`/login?message=${encodeURIComponent(error.message)}`)
	}

	if (data.url) {
		return redirect(data.url)
	}

	return redirect('/')
}

export async function signup(formData: FormData) {
	const supabase = await createClient()

	const email = formData.get('email') as string
	const password = formData.get('password') as string
	const username = formData.get('username') as string
	const full_name = formData.get('full_name') as string

	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: {
				username,
				full_name,
			},
		},
	})

	if (error) {
		return redirect(`/login?message=${encodeURIComponent(error.message)}`)
	}

	return redirect('/login?message=Check your email to confirm your account.')
}

export async function signOut() {
	const supabase = await createClient()
	await supabase.auth.signOut()
	return redirect('/login')
}

export async function requestPasswordReset(formData: FormData) {
	const supabase = await createClient()
	const email = formData.get('email') as string

	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`,
	})

	if (error) {
		return redirect(
			`/forgot-password?message=${encodeURIComponent(error.message)}`,
		)
	}

	return redirect(
		'/forgot-password?message=Check your email for the password reset link.',
	)
}

export async function updatePassword(formData: FormData) {
	const supabase = await createClient()
	const password = formData.get('password') as string

	const { error } = await supabase.auth.updateUser({
		password: password,
	})

	if (error) {
		return redirect(
			`/auth/reset-password?message=${encodeURIComponent(error.message)}`,
		)
	}

	return redirect(
		'/login?message=Password updated successfully. You can now sign in.',
	)
}
