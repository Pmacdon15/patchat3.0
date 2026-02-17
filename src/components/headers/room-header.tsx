export default async function RoomHeader({
	roomNamePromise,
}: {
	roomNamePromise: Promise<string>
}) {
	const roomName = await roomNamePromise
	return (
		<header className="mb-6 flex items-center justify-between">
			<div>
				<h1 className="font-bold text-2xl text-primary-900">
					{roomName}
				</h1>
				<p className="text-gray-500">Public Chat Room</p>
			</div>
		</header>
	)
}
