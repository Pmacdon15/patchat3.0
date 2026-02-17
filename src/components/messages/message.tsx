export default async function Message({
	messagePromise,
}: {
	messagePromise:Promise<string | string[] | undefined>
}) {
	const message = await messagePromise
	return (
		<p className="mt-4 bg-foreground/10 p-4 text-center text-foreground">
			{message}
		</p>
	)
}
