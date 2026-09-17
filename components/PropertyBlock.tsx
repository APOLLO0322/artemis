"use client"

import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import type { SizedImage } from "@/lib/siteImages"
import { Reveal } from "./Reveal"
import styles from "./PropertyBlock.module.css"

/** サムネイル1枚の上限幅。枚数が少ないときに間延びさせない */
const THUMB_MAX = 124
const THUMB_GAP = 10

type PropertyBlockProps = {
  images: SizedImage[]
  /** 背景が沈んだ色のとき、サムネイルの枠と濃淡を明るい側へ反転させる */
  dark?: boolean
  /** ギャラリー内での通し番号（1始まり）と総数 */
  index?: number
  total?: number
}

export function PropertyBlock({ images, dark = false, index, total }: PropertyBlockProps) {
  // いま大きく出している写真
  const [active, setActive] = useState(0)
  // DOMに載せた写真。一度載せたものは外さないので、選び直しても読み込みが起きない
  const [mounted, setMounted] = useState<number[]>([0])
  // 読み込みが終わった写真。終わる前に切り替えると一瞬白く抜けるため、待ってから差し替える
  const [ready, setReady] = useState<number[]>([])
  // クリックされたが、まだ読み込み中の写真
  const [pending, setPending] = useState<number | null>(null)

  const mount = useCallback((index: number) => {
    setMounted((current) => (current.includes(index) ? current : [...current, index]))
  }, [])

  const markReady = useCallback((index: number) => {
    setReady((current) => (current.includes(index) ? current : [...current, index]))
  }, [])

  // 待たせていた写真の読み込みが終わったら、そこで初めて差し替える
  useEffect(() => {
    if (pending === null) return

    if (ready.includes(pending)) {
      setActive(pending)
      setPending(null)
      return
    }

    // 読み込み完了が通知されない場合でも、押したまま反応しない状態にはしない
    const timer = setTimeout(() => {
      setActive(pending)
      setPending(null)
    }, 2500)
    return () => clearTimeout(timer)
  }, [pending, ready])

  const show = useCallback(
    (index: number) => {
      mount(index)
      if (ready.includes(index)) {
        setPending(null)
        setActive(index)
      } else {
        // 読み込めるまでは今の写真を出したままにする
        setPending(index)
      }
    },
    [mount, ready],
  )

  return (
    <section className={dark ? `${styles.block} ${styles.blockDark}` : styles.block}>
      <div className={styles.inner}>
        <Reveal>
          <div className={styles.stage}>
            {images.map((image, i) =>
              mounted.includes(i) ? (
                <Image
                  key={image.src}
                  src={image.src}
                  alt={i === active ? "物件写真" : ""}
                  width={image.width}
                  height={image.height}
                  sizes="(max-width: 1180px) 100vw, 1180px"
                  quality={88}
                  priority={i === 0}
                  // 必要になった写真だけを載せているので、遅延させず即座に取りに行く
                  loading={i === 0 ? undefined : "eager"}
                  onLoad={() => markReady(i)}
                  // キャッシュ済みだと onLoad が発火しないことがあるため、その場で確かめる
                  ref={(el) => {
                    if (el?.complete && el.naturalWidth > 0) markReady(i)
                  }}
                  aria-hidden={i === active ? undefined : true}
                  className={i === active ? styles.stageImage : `${styles.stageImage} ${styles.stageImageHidden}`}
                />
              ) : null,
            )}
          </div>
        </Reveal>

        {/* Reveal 自身は動かさず、中のサムネイルを40msずつずらして順に出す */}
        {images.length > 1 && (
          <Reveal plain>
            <div className={styles.meta}>
              <span>
                {index !== undefined && total !== undefined
                  ? `Archive ${String(index).padStart(2, "0")} / ${String(total).padStart(2, "0")}`
                  : "Archive"}
              </span>
              <span className={styles.counter}>
                {String(active + 1).padStart(2, "0")}
                <span className={styles.counterTotal}>
                  {" / "}
                  {String(images.length).padStart(2, "0")}
                </span>
              </span>
            </div>

            <div
              className={styles.thumbs}
              // 枚数が少ないときにサムネイルが大きくなりすぎないよう頭を抑える
              style={{ maxWidth: images.length * THUMB_MAX + (images.length - 1) * THUMB_GAP }}
            >
              {images.map((image, i) => (
                <span
                  key={image.src}
                  className={styles.thumbReveal}
                  style={{ transitionDelay: `${180 + i * 40}ms` }}
                >
                  <button
                    type="button"
                    onClick={() => show(i)}
                    // カーソルが乗った時点で読み込んでおき、クリック時には待たせない
                    onMouseEnter={() => mount(i)}
                    onFocus={() => mount(i)}
                    aria-label={`物件写真 ${i + 1} を大きく表示`}
                    aria-current={i === active ? "true" : undefined}
                    className={i === active ? `${styles.thumb} ${styles.thumbActive}` : styles.thumb}
                  >
                    <Image src={image.src} alt="" fill sizes="220px" quality={70} className={styles.thumbImage} />
                  </button>
                </span>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
