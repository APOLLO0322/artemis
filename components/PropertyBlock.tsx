"use client"

import Image from "next/image"
import { useCallback, useState } from "react"
import type { SizedImage } from "@/lib/siteImages"
import { Reveal } from "./Reveal"
import styles from "./PropertyBlock.module.css"

type PropertyBlockProps = {
  images: SizedImage[]
  /** ブロックの背景色。物件の写真に合わせて指定する */
  background: string
}

export function PropertyBlock({ images, background }: PropertyBlockProps) {
  const [active, setActive] = useState(0)
  // 一度表示した写真はDOMに残す。再度選んだときに読み込みが起きず、すぐ入れ替わる
  const [loaded, setLoaded] = useState<number[]>([0])

  const preload = useCallback((index: number) => {
    setLoaded((current) => (current.includes(index) ? current : [...current, index]))
  }, [])

  const show = useCallback(
    (index: number) => {
      preload(index)
      setActive(index)
    },
    [preload],
  )

  return (
    <section className={styles.block} style={{ background }}>
      <div className={styles.inner}>
        <Reveal>
          <div className={styles.stage}>
            {images.map((image, i) =>
              loaded.includes(i) ? (
                <Image
                  key={image.src}
                  src={image.src}
                  alt={i === active ? "物件写真" : ""}
                  width={image.width}
                  height={image.height}
                  sizes="(max-width: 1180px) 100vw, 1180px"
                  quality={88}
                  priority={i === 0}
                  aria-hidden={i === active ? undefined : true}
                  className={i === active ? styles.stageImage : `${styles.stageImage} ${styles.stageImageHidden}`}
                />
              ) : null,
            )}
          </div>
        </Reveal>

        {images.length > 1 && (
          <Reveal delay={120}>
            <div className={styles.thumbs}>
              {images.map((image, i) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => show(i)}
                  // カーソルが乗った時点で読み込んでおき、クリック時には待たせない
                  onMouseEnter={() => preload(i)}
                  onFocus={() => preload(i)}
                  aria-label={`物件写真 ${i + 1} を大きく表示`}
                  aria-current={i === active ? "true" : undefined}
                  className={i === active ? `${styles.thumb} ${styles.thumbActive}` : styles.thumb}
                >
                  <Image src={image.src} alt="" fill sizes="220px" quality={70} className={styles.thumbImage} />
                </button>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
