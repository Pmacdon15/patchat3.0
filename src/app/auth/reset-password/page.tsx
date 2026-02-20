import { Suspense } from 'react'
import { updatePassword } from '@/actions/auth'
import Message from '@/components/messages/message'

export default async function ResetPasswordPage(
	props: PageProps<'/auth/reset-password'>,
) {
	const messagePromise = props.searchParams.then((params) => params.message)
	return (
		<div className="mx-auto flex min-h-screen w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
			<form className="flex w-full flex-1 animate-in flex-col justify-center gap-2 text-foreground">
				<h1 className="mb-6 font-bold text-2xl">Reset Password</h1>
				<label className="text-md" htmlFor="password">
					New Password
				</label>
				<input
					className="mb-6 w-full rounded-md border border-gray-300 bg-transparent p-2"
					name="password"
					placeholder="••••••••"
					required
					type="password"
				/>
				<button
					className="mb-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:opacity-90"
					formAction={updatePassword}
					type="button"
				>
					Update Password
				</button>
				<Suspense>
					<Message messagePromise={messagePromise} />
				</Suspense>
			</form>
		</div>
	)
}
