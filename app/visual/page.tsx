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
