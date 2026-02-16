import Link from 'next/link'
import { login, signup } from '@/actions/auth'

export default async function LoginPage(props: {
	searchParams: Promise<{ message: string }>
}) {
	const searchParams = await props.searchParams
	return (
		<div className="mx-auto flex min-h-screen w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
			<div className="card bg-white p-8 shadow-xl">
				<h1 className="mb-8 text-center font-bold text-2xl text-primary-900">
					Welcome to PatChat
				</h1>
				<form className="flex w-full animate-in flex-col justify-center gap-4 text-foreground">
					<div>
						<label
							className="mb-1 block font-medium text-sm"
							htmlFor="email"
						>
							Email Address
						</label>
						<input
							className="input-field"
							id="email"
							name="email"
							placeholder="you@example.com"
							required
						/>
					</div>
					<div>
						<label
							className="mb-1 block font-medium text-sm"
							htmlFor="username"
						>
							Username (for signup)
						</label>
						<input
							className="input-field"
							id="username"
							name="username"
							placeholder="your_username"
						/>
					</div>
					<div>
						<label
							className="mb-1 block font-medium text-sm"
							htmlFor="password"
						>
							Password
						</label>
						<input
							className="input-field mb-2"
							id="password"
							name="password"
							placeholder="••••••••"
							required
							type="password"
						/>
					</div>
					<button
						className="btn-primary"
						formAction={login}
						type="submit"
					>
						Sign In
					</button>
					<button
						className="mb-2 rounded-md border border-primary-200 px-4 py-2 text-primary-700 transition hover:bg-primary-50"
						formAction={signup}
						type="submit"
					>
						Create Account
					</button>
					<Link
						className="text-center text-primary-600 text-sm hover:underline"
						href="/forgot-password"
					>
						Forgot password?
					</Link>

					{searchParams?.message && (
						<p className="mt-4 rounded bg-primary-50 p-4 text-center text-primary-800 text-sm">
							{searchParams.message}
						</p>
					)}
				</form>
			</div>
		</div>
	)
}
