"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { ImageSlot } from "./ImageSlot"
import styles from "./HeroSlideshow.module.css"

const INTERVAL_MS = 5000

type HeroSlideshowProps = {
  images: string[]
  height: string
}

export function HeroSlideshow({ images, height }: HeroSlideshowProps) {
  const [index, setIndex] = useState(0)
  // Only the current slide and the one after it are in the DOM, so the first
  // paint waits on a single photo instead of the whole set.
  const [lastMounted, setLastMounted] = useState(1)

  useEffect(() => {
    if (images.length < 2) return
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % images.length)
    }, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [images.length])

  useEffect(() => {
    setLastMounted((current) => Math.max(current, Math.min(index + 1, images.length - 1)))
  }, [index, images.length])

  if (images.length === 0) {
    return <ImageSlot label="オープニング写真" height={height} />
  }

  return (
    <div className={styles.slideshow} style={{ height }}>
      {images.map((src, i) =>
        i <= lastMounted ? (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            sizes="100vw"
            quality={85}
            priority={i === 0}
            className={i === index ? `${styles.slide} ${styles.slideActive}` : styles.slide}
          />
        ) : null,
      )}
    </div>
  )
}
