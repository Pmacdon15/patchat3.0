import Link from 'next/link'
import { Suspense } from 'react'
import { requestPasswordReset } from '@/actions/auth'
import Message from '@/components/messages/message'

export default async function ForgotPasswordPage(
	props: PageProps<'/forgot-password'>,
) {
	const messagePromise = props.searchParams.then((params) => params.message)
	return (
		<div className="mx-auto flex min-h-screen w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
			<form className="flex w-full flex-1 animate-in flex-col justify-center gap-2 text-foreground">
				<h1 className="mb-6 font-bold text-2xl">Forgot Password</h1>
				<label className="text-md" htmlFor="email">
					Email Address
				</label>
				<input
					className="mb-6 w-full rounded-md border border-gray-300 bg-transparent p-2"
					name="email"
					placeholder="you@example.com"
					required
				/>
				<button
					className="mb-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:opacity-90"
					formAction={requestPasswordReset}
					type="button"
				>
					Send Reset Link
				</button>
				<Link
					className="text-center text-primary-600 text-sm hover:underline"
					href="/login"
				>
					Back to Sign In
				</Link>
				<Suspense>
					<Message messagePromise={messagePromise} />
				</Suspense>
			</form>
		</div>
	)
}
