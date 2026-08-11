import Image from "next/image"
import type { CSSProperties } from "react"
import styles from "./ImageSlot.module.css"

type ImageSlotProps = {
  label: string
  src?: string
  alt?: string
  aspectRatio?: string
  height?: string
  className?: string
  priority?: boolean
}

/**
 * Placeholder that stands in for a real photo. Pass `src` once an actual
 * image is ready — it swaps to next/image automatically, no markup changes
 * needed elsewhere.
 */
export function ImageSlot({ label, src, alt, aspectRatio, height, className, priority }: ImageSlotProps) {
  const style: CSSProperties = {}
  if (aspectRatio) style.aspectRatio = aspectRatio
  if (height) style.height = height

  return (
    <div className={[styles.slot, className].filter(Boolean).join(" ")} style={style}>
      {src ? (
        <Image src={src} alt={alt ?? label} fill sizes="100vw" style={{ objectFit: "cover" }} priority={priority} />
      ) : (
        <span className={styles.label}>{label}</span>
      )}
    </div>
  )
}
