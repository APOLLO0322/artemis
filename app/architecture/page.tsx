import Link from "next/link"
import { Nav } from "@/components/Nav"
import { Footer } from "@/components/Footer"
import { ImageSlot } from "@/components/ImageSlot"
import { PropertyBlock } from "@/components/PropertyBlock"
import { listImageFolders } from "@/lib/siteImages"
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

/**
 * 物件ブロックの背景色。`public/architecture/` のフォルダ名がキー。
 * 初期値は各物件の主役写真の平均色から作った淡いトーン。
 * 好きな色に書き換えてよく、指定がない物件は既定色になる。
 */
const blockBackgrounds: Record<string, string> = {
  "01_2026-07-26": "#F3F1EE",
  "02_2026-02-04": "#F4F2ED",
  "03_2026-01-10": "#EDEAE6",
  "04_2025-12-14": "#ECEFF2",
  "05_2025-11-21_11-22": "#EBE8E4",
  "06_2025-10-26_10-27": "#EEE5DE",
  "07_2025-06-26": "#EAE7E6",
  "08_2025-05-24": "#ECE3D9",
  "09_2025-04-06": "#EDF0F1",
}

const DEFAULT_BACKGROUND = "#F2F1EE"

export default function ArchitecturePage() {
  const properties = listImageFolders("architecture")

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
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
      </div>

      {properties.length > 0 ? (
        <div className={styles.blocks}>
          {properties.map((property) => (
            <PropertyBlock
              key={property.name}
              images={property.images}
              background={blockBackgrounds[property.name] ?? DEFAULT_BACKGROUND}
            />
          ))}
        </div>
      ) : (
        <div className={styles.inner}>
          <div className={styles.gallery}>
            {Array.from({ length: 4 }, (_, i) => (
              <ImageSlot key={i} label={`物件写真 ${i + 1}`} aspectRatio="3/2" />
            ))}
          </div>
        </div>
      )}

      <div className={styles.inner}>
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
    </div>
  )
}
