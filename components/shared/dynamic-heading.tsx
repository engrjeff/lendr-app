export function DynamicHeading({ username }: { username: string }) {
  if (!username) return null

  return (
    <div className="ml-8 hidden md:block lg:ml-0">
      <h1 className="font-semibold">Hi, {username}!</h1>
    </div>
  )
}
