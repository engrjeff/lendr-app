export function FormError({ error }: { error?: string }) {
  if (!error) return

  return (
    <div className="text-sm text-destructive">
      <em className="not-italic">{error}</em>
    </div>
  )
}
