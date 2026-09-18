import { Nav } from "@/components/Nav"
import { Footer } from "@/components/Footer"
import { ImageSlot } from "@/components/ImageSlot"
import { PropertyGallery } from "@/components/PropertyGallery"
import { PhotoRequestForm } from "@/components/PhotoRequestForm"
import { FloatingCta } from "@/components/FloatingCta"
import { Reveal } from "@/components/Reveal"
import { imageIfExists, listImageFolders } from "@/lib/siteImages"
import styles from "./page.module.css"

const TITLE = "物件撮影 — Artemis"
const DESCRIPTION =
  "住宅・店舗・オフィスの竣工写真、内観・外観・ディテール撮影。建築とデザインの意図が伝わる一枚に。"

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://designartemis.space/architecture",
    siteName: "Artemis",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og/artemis.jpg", width: 1200, height: 630, alt: "Artemisが撮影した住宅の室内" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og/artemis.jpg"],
  },
}

/** 基本プラン */
const basePlan = {
  unit: "20カット",
  price: "20,000",
  tax: "税別",
  items: ["横画角のみ（納品枚数の追加は応相談）", "撮影日から3日で納品"],
}

/** オプション。料金表と申し込みフォームで同じ内容を使う */
const options = [
  { name: "SNS用 縦画角写真", detail: "10カット", price: "8,000" },
  { name: "ルームツアー動画", detail: "1本", price: "10,000", note: "テロップ入れの編集まで行う場合は 30,000円" },
  { name: "特殊編集", detail: "映り込み削除など", price: "500", unit: "／カット〜", note: "内容により応相談" },
  { name: "翌日納品", detail: "", price: "5,000" },
]

/**
 * 物件ブロックの背景色。`public/architecture/` のフォルダ名がキー。
 * 明るい室内写真を際立たせるため、沈んだ色を主軸にしている。
 * 指定がない物件は既定色になる。
 */
const blockBackgrounds: Record<string, string> = {
  "01_2026": "#22302A",
  "02_2025": "#1C2A3F",
  "03_2025": "#55606E",
  "04_2025": "#EDE6DA",
  "05_2026": "#3A2E26",
  "06_2025": "#EDE6DA",
  "07_2026": "#22302A",
  "08_2025": "#1C2A3F",
  "09_2026": "#3A2E26",
  "010_2025": "#3A422A",
}

const DEFAULT_BACKGROUND = "#F2F1EE"

export default function ArchitecturePage() {
  const properties = listImageFolders("architecture")
  // 置かれたときだけ「特殊編集の例」が出る
  const retouchBefore = imageIfExists("retouch/before.jpg")
  const retouchAfter = imageIfExists("retouch/after.jpg")

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <Nav variant="logo" />

        <Reveal>
          <section className={`${styles.rule} ${styles.hero}`}>
            <p className={styles.sideLabel}>Architecture</p>
            <div>
              <h1 className={styles.heroTitle}>
                物件
                <br />
                撮影
              </h1>
            </div>
          </section>
        </Reveal>
      </div>

      {properties.length > 0 ? (
        <PropertyGallery
          properties={properties}
          backgrounds={blockBackgrounds}
          fallbackBackground={DEFAULT_BACKGROUND}
        />
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

        <Reveal>
          <section id="pricing" className={`${styles.rule} ${styles.pricing}`}>
            <div className={`card-kicker dot kicker-i ${styles.kicker}`}>Pricing</div>
            <h2 className={styles.pricingTitle}>料金プラン</h2>

            <div className={`${styles.rule} ${styles.base}`}>
              <div className={styles.baseHead}>
                <p className={styles.baseUnit}>{basePlan.unit}</p>
                <p className={styles.basePrice}>
                  <span className={styles.yen}>¥</span>
                  {basePlan.price}
                  <span className={styles.baseTax}>{basePlan.tax}</span>
                </p>
              </div>
              <ul className={styles.baseItems}>
                {basePlan.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className={styles.optionsHead}>Option</div>
            <dl className={styles.options}>
              {options.map((option) => (
                <div key={option.name} className={styles.optionRow}>
                  <dt className={styles.optionName}>
                    {option.name}
                    {option.detail && <span className={styles.optionDetail}>{option.detail}</span>}
                  </dt>
                  <dd className={styles.optionPrice}>
                    ¥{option.price}
                    {option.unit && <span className={styles.optionUnit}>{option.unit}</span>}
                  </dd>
                  {option.note && <dd className={styles.optionNote}>{option.note}</dd>}
                </div>
              ))}
            </dl>

            {retouchBefore && retouchAfter && (
              <div className={styles.retouch}>
                <p className={styles.retouchLabel}>特殊編集の例</p>
                <div className={styles.retouchPair}>
                  <figure className={styles.retouchItem}>
                    <ImageSlot label="Before" src={retouchBefore} aspectRatio="3/2" />
                    <figcaption className={styles.retouchCaption}>Before</figcaption>
                  </figure>
                  <figure className={styles.retouchItem}>
                    <ImageSlot label="After" src={retouchAfter} aspectRatio="3/2" />
                    <figcaption className={styles.retouchCaption}>After</figcaption>
                  </figure>
                </div>
              </div>
            )}

            <p className={styles.pricingNote}>
              表示はすべて税別です。撮影場所までの交通費は別途申し受けます。カット数の追加や記載のないご依頼もご相談ください。
            </p>
          </section>
        </Reveal>

        <Reveal>
          <section id="contact" className={`${styles.rule} ${styles.request}`}>
            <div className={`card-kicker dot kicker-i ${styles.kicker}`}>Request</div>
            <h2 className={styles.pricingTitle}>撮影のご依頼・お見積り</h2>
            <p className={styles.requestLead}>
              ご依頼は以下フォームからご連絡ください。フォーム受信後24時間以内に、折り返し正式なお見積もりと撮影日についてご連絡いたします。
            </p>
            <PhotoRequestForm />
          </section>
        </Reveal>

        <Footer />
      </div>

      <FloatingCta targetId="pricing" label="料金・お問合せ" hideNearIds={["contact"]} />
    </div>
  )
}
