import Image from "next/image"
import { listImages } from "@/lib/siteImages"
import styles from "./CredentialBadge.module.css"

/** ファイル名から読み上げ用の名称を起こす */
const LABELS: Record<string, string> = {
  "notion-certified-admin": "Notion Certified Admin",
  "notion-consulting-partner": "Notion Consulting Partner",
}

function labelOf(src: string) {
  const key = src.split("/").pop()?.replace(/\.\w+$/, "") ?? ""
  return LABELS[key] ?? key.replace(/-/g, " ")
}

/**
 * 認定バッジ。`public/badges/` に置いた画像をファイル名順に並べる。
 * 増えたら画像を足すだけでよく、コードは触らなくてよい。
 */
export function CredentialBadge() {
  const badges = listImages("badges")
  if (badges.length === 0) return null

  return (
    <div className={styles.badges}>
      {badges.map((src) => (
        <div key={src} className={styles.badge}>
          <Image src={src} alt={labelOf(src)} fill sizes="112px" className={styles.badgeImage} />
        </div>
      ))}
    </div>
  )
}
