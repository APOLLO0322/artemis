import Link from "next/link"
import { Nav } from "@/components/Nav"
import { Footer } from "@/components/Footer"
import { ImageSlot } from "@/components/ImageSlot"
import { listImages } from "@/lib/siteImages"
import styles from "./page.module.css"

export const metadata = {
  title: "Visual — Artemis",
  description: "現場の空気をそのまま画に。撮影から編集まで、記録を作品にする。",
}

export default function VisualPage() {
  const gallery = listImages("visual")

  return (
    <div className={styles.container}>
      <Nav />

      <section className={styles.hero}>
        <p className={styles.archiveLabel}>Archive</p>
        <div>
          <h1 className={styles.heroTitle}>
            VI-
            <br />
            SUAL
          </h1>
          <p className={styles.heroLead}>現場の空気をそのまま画に。撮影から編集まで、記録を作品にする。</p>
        </div>
      </section>

      <div className={styles.gallery}>
        {(gallery.length > 0 ? gallery : Array.from({ length: 6 }, () => undefined)).map((src, i) => (
          <ImageSlot
            key={src ?? i}
            label={`撮影写真 ${i + 1}`}
            src={src}
            aspectRatio="3/2"
            priority={i < 3}
          />
        ))}
      </div>

      <hr className={`rule-short ${styles.divider}`} />

      <section className={styles.credits}>
        <p className={styles.creditsKicker}>
          <span className={styles.creditsDot} />
          実績・制作クレジット
        </p>
        <div className={styles.creditsItem}>
          <div className={styles.creditsTitle}>映像制作会社 ブランド撮影・ディレクション</div>
          <p className={styles.creditsBody}>
            撮影・映像ディレクションを担当。ブランドイメージの構築からアウトプットの色彩設計まで。
          </p>
          <div className={styles.creditsTags}>
            <span className="tag tag-outline">Photography</span>
            <span className="tag tag-outline">Direction</span>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <p className={styles.ctaLead}>撮影・映像制作のご依頼はこちらから</p>
        <Link href="/#contact" className="btn btn-primary">
          撮影を相談する
        </Link>
      </section>

      <Footer />
    </div>
  )
}
