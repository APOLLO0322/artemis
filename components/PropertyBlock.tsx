"use client"

import Image from "next/image"
import { useState } from "react"
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
  const hero = images[active] ?? images[0]

  return (
    <section className={styles.block} style={{ background }}>
      <div className={styles.inner}>
        <Reveal>
          <div className={styles.stage}>
            {/* key を変えて差し替えるたびに、ふわっと現れる */}
            <Image
              key={hero.src}
              src={hero.src}
              alt="物件写真"
              width={hero.width}
              height={hero.height}
              sizes="(max-width: 1180px) 100vw, 1180px"
              quality={88}
              className={styles.stageImage}
            />
          </div>
        </Reveal>

        {images.length > 1 && (
          <Reveal delay={120}>
            <div className={styles.thumbs}>
              {images.map((image, i) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => setActive(i)}
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
