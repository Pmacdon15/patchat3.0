import { updatePassword } from '@/actions/auth'

export default async function ResetPasswordPage(props: {
	searchParams: Promise<{ message: string }>
}) {
	const searchParams = await props.searchParams
	return (
		<div className="mx-auto flex min-h-screen w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
			<form className="flex w-full flex-1 animate-in flex-col justify-center gap-2 text-foreground">
				<h1 className="mb-6 font-bold text-2xl">Reset Password</h1>
				<label className="text-md" htmlFor="password">
					New Password
				</label>
				<input
					className="input-field mb-6"
					name="password"
					placeholder="••••••••"
					required
					type="password"
				/>
				<button
					className="btn-primary mb-2"
					formAction={updatePassword}
				>
					Update Password
				</button>
				{searchParams?.message && (
					<p className="mt-4 bg-foreground/10 p-4 text-center text-foreground">
						{searchParams.message}
					</p>
				)}
			</form>
		</div>
	)
}
