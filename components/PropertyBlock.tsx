"use client"

import Image from "next/image"
import { useState } from "react"
import styles from "./PropertyBlock.module.css"

type PropertyBlockProps = {
  images: string[]
  /** ブロックの背景色。物件の写真に合わせて指定する */
  background: string
}

export function PropertyBlock({ images, background }: PropertyBlockProps) {
  const [active, setActive] = useState(0)
  const hero = images[active] ?? images[0]

  return (
    <section className={styles.block} style={{ background }}>
      <div className={styles.inner}>
        <div className={styles.stage}>
          <Image
            key={hero}
            src={hero}
            alt="物件写真"
            fill
            sizes="(max-width: 1180px) 100vw, 1180px"
            quality={85}
            className={styles.stageImage}
          />
        </div>

        {images.length > 1 && (
          <div className={styles.thumbs}>
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`物件写真 ${i + 1} を大きく表示`}
                aria-current={i === active ? "true" : undefined}
                className={i === active ? `${styles.thumb} ${styles.thumbActive}` : styles.thumb}
              >
                <Image src={src} alt="" fill sizes="180px" quality={70} className={styles.thumbImage} />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
