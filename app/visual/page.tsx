import Link from "next/link"
import { Nav } from "@/components/Nav"
import { Footer } from "@/components/Footer"
import { ImageSlot } from "@/components/ImageSlot"
import styles from "./page.module.css"

export const metadata = {
  title: "Visual — Artemis",
  description: "現場の空気をそのまま画に。撮影から編集まで、記録を作品にする。",
}

export default function VisualPage() {
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
        <div className={styles.fullBleed}>
          <ImageSlot label="撮影写真 1" height="min(82vh, 780px)" />
        </div>

        <div className={styles.pairGrid}>
          <figure className="plate">
            <ImageSlot label="撮影写真 2" aspectRatio="3/4" />
          </figure>
          <figure className={styles.blackMat}>
            <ImageSlot label="撮影写真 3" aspectRatio="3/4" />
          </figure>
        </div>

        <div className={styles.fullBleed}>
          <ImageSlot label="撮影写真 4" height="min(70vh, 640px)" />
        </div>

        <div className={styles.pairGrid}>
          <figure className="plate">
            <ImageSlot label="撮影写真 5" aspectRatio="4/5" />
          </figure>
          <figure className={`plate ${styles.plateOffset}`}>
            <ImageSlot label="撮影写真 6" aspectRatio="4/5" />
          </figure>
        </div>
      </div>

      <hr className={`rule-short ${styles.divider}`} />

      <section className={styles.credits}>
        <p className={styles.creditsKicker}>
          <span className={styles.creditsDot} />
          実績・制作クレジット
        </p>
        <div className={styles.creditsItem}>
          <div className={styles.creditsTitle}>APOLLO</div>
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
