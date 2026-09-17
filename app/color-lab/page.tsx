import Image from "next/image"
import { listImageFolders } from "@/lib/siteImages"
import styles from "./page.module.css"

export const metadata = {
  title: "背景色の検討 — Artemis",
  // 検討用の内部ページなので検索には出さない
  robots: { index: false, follow: false },
}

/** 全物件で共通の候補。暖色⇔寒色、淡い⇔濃いで方向を振ってある */
const COMMON = [
  { key: "A", label: "暖色・淡", hex: "#F0EBE4" },
  { key: "B", label: "暖色・中", hex: "#E7DFD3" },
  { key: "C", label: "暖色・濃", hex: "#D8CCBC" },
  { key: "D", label: "寒色・中", hex: "#E0E4E7" },
  { key: "E", label: "ニュートラル", hex: "#E2E1DE" },
  { key: "F", label: "グレージュ・濃", hex: "#CFCAC4" },
]

/** 物件ごとに、その写真の副次的な色みから起こした案 */
const DERIVED: Record<string, { hex: string; note: string }> = {
  "01_2026": { hex: "#DAE0D7", note: "緑（96°）" },
  "02_2025": { hex: "#DBE0D7", note: "緑（93°）" },
  "03_2025": { hex: "#D7DCE0", note: "青（204°）" },
  "04_2025": { hex: "#D7DFE0", note: "青緑（185°）" },
  "05_2026": { hex: "#D7DEE0", note: "青（194°）" },
  "06_2025": { hex: "#D7DDE0", note: "青（195°）" },
  "07_2026": { hex: "#D7DEE0", note: "青（192°）" },
  "08_2025": { hex: "#D7D8E0", note: "青紫（234°）" },
  "09_2026": { hex: "#D7DEE0", note: "青（195°）" },
  "010_2025": { hex: "#DBD7E0", note: "紫（270°）" },
}

/** いま実際に使っている色 */
const CURRENT: Record<string, string> = {
  "01_2026": "#F3F1EE",
  "02_2025": "#EEE5DE",
  "03_2025": "#EDF0F1",
  "04_2025": "#DDDDDB",
  "05_2026": "#EDEAE5",
  "06_2025": "#ECE3D9",
  "07_2026": "#F4F2ED",
  "08_2025": "#EDEFF2",
  "09_2026": "#EAE8E6",
  "010_2025": "#E2E5E9",
}

export default function ColorLabPage() {
  const properties = listImageFolders("architecture")

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>背景色の検討</h1>
        <p className={styles.lead}>
          各物件の主役写真を、候補の背景色に置いたものです。写真が一番よく見える案を、物件ごとに記号で選んでください。
          「1番はC、2番はG」のように伝えていただければ反映します。
        </p>
        <p className={styles.legend}>
          <span className={styles.legendItem}>現：いま使っている色</span>
          <span className={styles.legendItem}>A〜F：全物件共通の候補</span>
          <span className={styles.legendItem}>G：その写真の色みから起こした案</span>
        </p>
      </header>

      {properties.map((property, index) => {
        const hero = property.images[0]
        const derived = DERIVED[property.name]
        const current = CURRENT[property.name]
        const swatches = [
          ...(current ? [{ key: "現", label: "現在", hex: current }] : []),
          ...COMMON,
          ...(derived ? [{ key: "G", label: derived.note, hex: derived.hex }] : []),
        ]

        return (
          <section key={property.name} className={styles.property}>
            <h2 className={styles.propertyName}>
              <span className={styles.propertyNumber}>{index + 1}</span>
              {property.name}
            </h2>

            <div className={styles.grid}>
              {swatches.map((swatch) => (
                <figure key={swatch.key} className={styles.panel} style={{ background: swatch.hex }}>
                  <div className={styles.photo}>
                    <Image
                      src={hero.src}
                      alt=""
                      width={hero.width}
                      height={hero.height}
                      sizes="320px"
                      quality={78}
                      className={styles.photoImage}
                    />
                  </div>
                  <figcaption className={styles.caption}>
                    <span className={styles.key}>{swatch.key}</span>
                    <span className={styles.label}>{swatch.label}</span>
                    <span className={styles.hex}>{swatch.hex}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
