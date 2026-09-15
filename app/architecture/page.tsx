import Link from "next/link"
import { Nav } from "@/components/Nav"
import { Footer } from "@/components/Footer"
import { ImageSlot } from "@/components/ImageSlot"
import { listImages } from "@/lib/siteImages"
import styles from "./page.module.css"

export const metadata = {
  title: "物件撮影 — Artemis",
  description:
    "住宅・店舗・オフィスの竣工写真、内観・外観・ディテール撮影。建築とデザインの意図が伝わる一枚に。",
}

export default function ArchitecturePage() {
  const gallery = listImages("architecture")

  return (
    <div className={styles.container}>
      <Nav />

      <section className={styles.hero}>
        <p className={styles.sideLabel}>Architecture</p>
        <div>
          <h1 className={styles.heroTitle}>
            物件
            <br />
            撮影
          </h1>
          <p className={styles.heroLead}>
            住宅・店舗・オフィスの竣工写真から、内観・外観・ディテールまで。設計とデザインの意図が、そのまま伝わる一枚に。
          </p>
        </div>
      </section>

      <div className={styles.gallery}>
        {(gallery.length > 0 ? gallery : Array.from({ length: 6 }, () => undefined)).map((src, i) => (
          <ImageSlot key={src ?? i} label={`物件写真 ${i + 1}`} src={src} aspectRatio="3/2" priority={i < 2} />
        ))}
      </div>

      <hr className={`rule-short ${styles.divider}`} />

      <section className={styles.cta}>
        <p className={styles.ctaLead}>物件撮影のご依頼・お見積りはこちらから</p>
        <Link href="/#contact" className="btn btn-primary">
          撮影を相談する
        </Link>
      </section>

      <Footer />
    </div>
  )
}
