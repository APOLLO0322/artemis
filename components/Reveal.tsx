"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

type RevealProps = {
  children: ReactNode
  /** 連続して現れるときに少しずつ遅らせる（ミリ秒） */
  delay?: number
  /** 自身は動かず、出現の合図だけを子要素に渡す */
  plain?: boolean
  className?: string
}

/**
 * 画面に入ったところで一度だけふわっと現れる。
 * 動きを減らす設定の人には効かないよう CSS 側で無効化してある。
 */
export function Reveal({ children, delay = 0, plain = false, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.04 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      // 子要素はこの印を見て、自分のタイミングで動き出せる
      data-revealed={visible ? "true" : "false"}
      style={delay && !plain ? { transitionDelay: `${delay}ms` } : undefined}
      className={[plain ? "" : "reveal", !plain && visible ? "reveal-visible" : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  )
}
