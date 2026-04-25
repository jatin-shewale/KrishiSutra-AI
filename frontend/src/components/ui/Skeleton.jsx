import { motion } from 'framer-motion'

export default function Skeleton({ className = '', count = 1 }) {
  return (
    <>
      {Array(count).fill(0).map((_, i) => (
        <motion.div
          key={i}
          className={`animate-pulse bg-white/5 rounded-xl ${className}`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      ))}
    </>
  )
}

export function CardSkeleton() {
  return (
    <div className="glass p-6 rounded-2xl space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}
