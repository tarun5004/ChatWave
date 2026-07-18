const AVATAR_COLORS = [
  "bg-emerald-600",
  "bg-sky-600",
  "bg-violet-600",
  "bg-rose-600",
  "bg-amber-600",
]

function getInitials(name = "User") {
  return name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U"
}

function getColor(name = "User") {
  const colorIndex = [...name].reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  ) % AVATAR_COLORS.length

  return AVATAR_COLORS[colorIndex]
}

export default function Avatar({ name, size = "md", online = false }) {
  const sizeClasses = {
    sm: "h-9 w-9 text-xs",
    md: "h-11 w-11 text-sm",
    lg: "h-14 w-14 text-base",
  }

  return (
    <span className="relative inline-flex shrink-0" aria-hidden="true">
      <span
        className={`inline-flex items-center justify-center rounded-full font-semibold text-white ${getColor(name)} ${sizeClasses[size]}`}
      >
        {getInitials(name)}
      </span>
      {online ? (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
      ) : null}
    </span>
  )
}
