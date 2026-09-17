"use client"

import { useEffect, useRef, useState } from "react"
import type { ImageFolder } from "@/lib/siteImages"
import { PropertyBlock } from "./PropertyBlock"
import styles from "./PropertyGallery.module.css"

/** 背景が沈んだ色かどうか。文字や枠の明暗を切り替える判定に使う */
function isDark(hex: string) {
  const value = hex.replace("#", "")
  if (value.length !== 6) return false
  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.6
}

type PropertyGalleryProps = {
  properties: ImageFolder[]
  /** フォルダ名 → 背景色 */
  backgrounds: Record<string, string>
  fallbackBackground: string
}

/**
 * 物件ブロックをまとめ、画面の中央にきた物件の色へ地の色をゆっくり移す。
 * 色の変わり目そのものが、物件の切れ目になる。
 */
export function PropertyGallery({ properties, backgrounds, fallbackBackground }: PropertyGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container || typeof IntersectionObserver === "undefined") return

    const blocks = Array.from(container.querySelectorAll<HTMLElement>("[data-block-index]"))
    if (blocks.length === 0) return

    // 画面の中央に引いた線と重なっているブロックを「いま見ている物件」とみなす
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const index = Number(entry.target.getAttribute("data-block-index"))
          if (!Number.isNaN(index)) setActiveIndex(index)
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    )

    blocks.forEach((block) => observer.observe(block))
    return () => observer.disconnect()
  }, [properties.length])

  const activeName = properties[activeIndex]?.name
  const background = (activeName && backgrounds[activeName]) || fallbackBackground

  return (
    <div ref={containerRef} className={styles.gallery} style={{ backgroundColor: background }}>
      {properties.map((property, index) => (
        <div key={property.name} data-block-index={index}>
          <PropertyBlock
            images={property.images}
            // 濃い背景では、サムネイルの枠や濃淡を明るい側に反転させる
            dark={isDark(backgrounds[property.name] ?? fallbackBackground)}
          />
        </div>
      ))}
    </div>
  )
}
