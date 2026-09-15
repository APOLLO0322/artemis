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

type Plan = {
  name: string
  price: string
  note?: string
  items: string[]
}

/**
 * 料金プラン。ここに項目を足すとカードが並び、空のままなら
 * 「お見積り」の案内文だけが表示される。
 *
 * 例:
 * { name: "半日プラン", price: "¥50,000", note: "税別・交通費別",
 *   items: ["撮影 4時間", "納品 30カット", "データ納品"] }
 */
const plans: Plan[] = []

export default function ArchitecturePage() {
  const gallery = listImages("architecture")

  return (
    <div className={styles.container}>
      <Nav variant="logo" />

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

      <section id="pricing" className={styles.pricing}>
        <div className={`card-kicker dot kicker-i ${styles.kicker}`}>Pricing</div>
        <h2 className={styles.pricingTitle}>料金プラン</h2>

        {plans.length > 0 ? (
          <div className={styles.planGrid}>
            {plans.map((plan) => (
              <div key={plan.name} className={`card ${styles.planCard}`}>
                <div className="card-title">{plan.name}</div>
                <p className={styles.planPrice}>{plan.price}</p>
                {plan.note && <p className={styles.planNote}>{plan.note}</p>}
                <ul className={styles.planItems}>
                  {plan.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.pricingLead}>
            料金は物件の規模・撮影点数・納品形式に応じてお見積りします。まずはお気軽にご相談ください。
          </p>
        )}

        <div className={styles.pricingCta}>
          <Link href="/#contact" className="btn btn-primary">
            お見積りを依頼する
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
