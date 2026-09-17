import Image from "next/image"
import { listImageFolders } from "@/lib/siteImages"
import styles from "./page.module.css"

export const metadata = {
  title: "背景色の検討 — Artemis",
  // 検討用の内部ページなので検索には出さない
  robots: { index: false, follow: false },
}

type Swatch = { key: string; label: string; hex: string; note?: string }

/**
 * 明るい室内写真を「光る窓」に見せるため、沈んだ色を中心に振ってある。
 * 淡い案は比較の基準として1つだけ残した。
 */
const SWATCHES: Swatch[] = [
  { key: "A", label: "紺", hex: "#1C2A3F", note: "木の温かみが最も立つ" },
  { key: "B", label: "墨", hex: "#1E1D1A", note: "サイトの文字色。最大の対比" },
  { key: "C", label: "深緑", hex: "#22302A", note: "落ち着いた自然味" },
  { key: "D", label: "鶯・濃", hex: "#3A422A", note: "Artemisのアクセント色" },
  { key: "E", label: "焦茶", hex: "#3A2E26", note: "木と同系。穏やか" },
  { key: "F", label: "藍鼠", hex: "#55606E", note: "紺より軽い中間調" },
  { key: "G", label: "灰緑", hex: "#6E7468", note: "抑えた中間調" },
  { key: "H", label: "生成り", hex: "#EDE6DA", note: "淡い案（比較用）" },
]

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

/** 背景が暗いときは説明文を明るくする */
function isDark(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.6
}

export default function ColorLabPage() {
  const properties = listImageFolders("architecture")

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>背景色の検討</h1>
        <p className={styles.lead}>
          明るい室内写真は、背景を沈ませるほど輪郭が立ちます。濃い色を中心に方向を振りました。
          写真が一番よく見える案を物件ごとに選んで、「1番はA、2番はD」のように伝えてください。
        </p>
        <p className={styles.lead}>
          全物件を同じ色で揃えても、物件ごとに変えても構いません。変える場合も、明るさの幅を揃えると
          ページ全体がまとまります。
        </p>
      </header>

      {properties.map((property, index) => {
        const hero = property.images[0]
        const current = CURRENT[property.name]
        const swatches: Swatch[] = [
          ...(current ? [{ key: "現", label: "現在", hex: current, note: "いま使っている色" }] : []),
          ...SWATCHES,
        ]

        return (
          <section key={property.name} className={styles.property}>
            <h2 className={styles.propertyName}>
              <span className={styles.propertyNumber}>{index + 1}</span>
              {property.name}
            </h2>

            <div className={styles.grid}>
              {swatches.map((swatch) => (
                <figure
                  key={swatch.key}
                  className={isDark(swatch.hex) ? `${styles.panel} ${styles.panelDark}` : styles.panel}
                  style={{ background: swatch.hex }}
                >
                  <div className={styles.photo}>
                    <Image
                      src={hero.src}
                      alt=""
                      width={hero.width}
                      height={hero.height}
                      sizes="400px"
                      quality={80}
                      className={styles.photoImage}
                    />
                  </div>
                  <figcaption className={styles.caption}>
                    <span className={styles.key}>{swatch.key}</span>
                    <span className={styles.label}>{swatch.label}</span>
                    <span className={styles.hex}>{swatch.hex}</span>
                    {swatch.note && <span className={styles.note}>{swatch.note}</span>}
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
