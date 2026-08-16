import Image from "next/image"
import { imageIfExists } from "@/lib/siteImages"
import styles from "./CredentialBadge.module.css"

const BADGE_PATH = "badges/notion-certified-admin.png"

/**
 * Notion Certified Admin badge. Renders nothing until the image file is
 * added, so the Credentials section stays tidy in the meantime.
 */
export function CredentialBadge() {
  const src = imageIfExists(BADGE_PATH)
  if (!src) return null

  return (
    <div className={styles.badge}>
      <Image src={src} alt="Notion Certified Admin" fill sizes="112px" className={styles.badgeImage} />
    </div>
  )
}
