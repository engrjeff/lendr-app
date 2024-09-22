export function DynamicHeading({ username }: { username: string }) {
  if (!username) return null

  return (
    <div>
      <h1 className="font-semibold">Hi, {username}!</h1>
    </div>
  )
}
