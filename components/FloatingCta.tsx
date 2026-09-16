"use client"

import { useEffect, useState } from "react"
import styles from "./FloatingCta.module.css"

type FloatingCtaProps = {
  /** 飛び先。ページ内の id */
  targetId: string
  label: string
  /** ここが画面に入っている間はボタンを引っ込める（重複を避ける） */
  hideNearIds?: string[]
}

/** 右下に追随し、料金・お問い合わせへ飛ばす。用が済む場所では静かに消える */
export function FloatingCta({ targetId, label, hideNearIds = [] }: FloatingCtaProps) {
  const [visible, setVisible] = useState(false)
  // 配列そのものを依存に置くと毎描画で張り直しになるので、中身を文字列にして比べる
  const hideNearKey = hideNearIds.join(",")

  useEffect(() => {
    const hideNear = hideNearKey ? hideNearKey.split(",") : []
    let pastHero = false
    let nearTarget = false
    const update = () => setVisible(pastHero && !nearTarget)

    const onScroll = () => {
      pastHero = window.scrollY > window.innerHeight * 0.5
      update()
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    let observer: IntersectionObserver | undefined
    const watched = [targetId, ...hideNear]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (watched.length > 0 && typeof IntersectionObserver !== "undefined") {
      const intersecting = new Set<Element>()
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) intersecting.add(entry.target)
            else intersecting.delete(entry.target)
          }
          nearTarget = intersecting.size > 0
          update()
        },
        { threshold: 0 },
      )
      watched.forEach((el) => observer?.observe(el))
    }

    return () => {
      window.removeEventListener("scroll", onScroll)
      observer?.disconnect()
    }
  }, [targetId, hideNearKey])

  return (
    <a
      href={`#${targetId}`}
      className={visible ? `${styles.cta} ${styles.ctaVisible}` : styles.cta}
      aria-hidden={visible ? undefined : true}
      tabIndex={visible ? undefined : -1}
    >
      {label}
      <span className={styles.arrow} aria-hidden="true">
        ↓
      </span>
    </a>
  )
}
