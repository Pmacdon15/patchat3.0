import Link from 'next/link'
import { login, signup, signInWithGoogle } from '@/actions/auth'

export default function LoginPage() {
	return (
		<div className="mx-auto flex min-h-screen w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
			<div className="rounded-lg border border-gray-200 bg-white p-8 shadow-xl dark:border-neutral-800">
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
							className="w-full rounded-md border border-gray-300 bg-transparent p-2"
							id="email"
							name="email"
							placeholder="you@example.com"
							required
						/>
					</div>
					<div>
						<label
							className="mb-1 block font-medium text-sm"
							htmlFor="full_name"
						>
							Full Name
						</label>
						<input
							className="w-full rounded-md border border-gray-300 bg-transparent p-2"
							id="full_name"
							name="full_name"
							placeholder="John Doe"
							// required
						/>
					</div>
					<div>
						<label
							className="mb-1 block font-medium text-sm"
							htmlFor="username"
						>
							Username (@)
						</label>
						<div className="relative">
							<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
								@
							</span>
							<input
								className="w-full rounded-md border border-gray-300 bg-transparent p-2 pl-7"
								id="username"
								name="username"
								placeholder="username"
								// required
							/>
						</div>
					</div>
					<div>
						<label
							className="mb-1 block font-medium text-sm"
							htmlFor="password"
						>
							Password
						</label>
						<input
							className="mb-2 w-full rounded-md border border-gray-300 bg-transparent p-2"
							id="password"
							name="password"
							placeholder="••••••••"
							required
							type="password"
						/>
					</div>
					<button
						className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:opacity-90"
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

					<div className="relative my-4">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="bg-white px-2 text-gray-500">Or continue with</span>
						</div>
					</div>

					<button
						className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
						formAction={signInWithGoogle}
						type="submit"
					>
						<svg className="h-5 w-5" viewBox="0 0 24 24">
							<path
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								fill="#4285F4"
							/>
							<path
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								fill="#34A853"
							/>
							<path
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								fill="#FBBC05"
							/>
							<path
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
								fill="#EA4335"
							/>
						</svg>
						Sign in with Google
					</button>

					<Link
						className="text-center text-primary-600 text-sm hover:underline"
						href="/forgot-password"
					>
						Forgot password?
					</Link>

					{/* {searchParams?.message && (
						<p className="mt-4 rounded bg-primary-50 p-4 text-center text-primary-800 text-sm">
							{searchParams.message}
						</p>
					)} */}
				</form>
			</div>
		</div>
	)
}
