import Link from "next/link"
import { Nav } from "@/components/Nav"
import { Footer } from "@/components/Footer"
import { HeroSlideshow } from "@/components/HeroSlideshow"
import { ContactForm } from "@/components/ContactForm"
import { listImages } from "@/lib/siteImages"
import styles from "./page.module.css"

export default function HomePage() {
  const heroImages = listImages("hero")

  return (
    <div className={styles.container}>
      <Nav />

      <div className={styles.heroWrap}>
        <HeroSlideshow images={heroImages} height="min(94vh, 880px)" />
        <p className={styles.heroLabel}>Artemis — Visual / Systems</p>
        <span className={styles.heroSquare} />
      </div>

      <section className={styles.intro}>
        <div className={styles.introHead}>
          <p className={styles.introHeadLabel}>Photography — Systems</p>
          <p className={styles.introHeadYear}>2026</p>
        </div>
        <div className={styles.introBody}>
          <p className={styles.introText}>
            写真・映像を撮り、同時にその裏側のシステムを組む。制作とオペレーション、二つの実務を一つの手で動かしています。
          </p>
          <div className={styles.introArrow}>↓</div>
        </div>
      </section>

      <section className={styles.pillars}>
        <div className={styles.pillarsGrid}>
          <Link href="/visual" className={styles.pillar}>
            <span className={styles.pillarMarker} />
            <p className={styles.pillarNum}>01</p>
            <div className={styles.pillarTitle}>
              VI-
              <br />
              SUAL →
            </div>
            <p className={styles.pillarDesc}>
              APOLLOをはじめとする現場での撮影・制作。感情に寄り添う色彩と構成で、記録を作品に変える。
            </p>
          </Link>
          <Link href="/systems" className={`${styles.pillar} ${styles.pillarDark}`}>
            <p className={styles.pillarNumDark}>02</p>
            <div className={styles.pillarTitle}>
              SYS-
              <br />
              TEMS →
            </div>
            <p className={styles.pillarDescDark}>
              導入設計からワークフロー構築、会計自動化まで。制作の裏側を整える実務。
            </p>
          </Link>
        </div>
      </section>

      <section id="contact" className={styles.contact}>
        <p className={styles.contactKicker}>Contact</p>
        <h2 className={styles.contactTitle}>相談してみる</h2>
        <p className={styles.contactLead}>撮影・映像制作、Notion導入・業務設計のご相談はこちらから。</p>
        <ContactForm />
      </section>

      <Footer />
    </div>
  )
}
