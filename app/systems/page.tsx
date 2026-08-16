import Link from "next/link"
import { Nav } from "@/components/Nav"
import { Footer } from "@/components/Footer"
import { ImageSlot } from "@/components/ImageSlot"
import { CredentialBadge } from "@/components/CredentialBadge"
import { firstImage } from "@/lib/siteImages"
import styles from "./page.module.css"

export const metadata = {
  title: "Systems — Artemis",
  description: "Notion導入設計からワークフロー構築、会計自動化まで。",
}

const services = [
  {
    num: "01",
    title: "Notion導入設計",
    body: "業務フローの棚卸しから、DB設計・ワークスペース構築まで一括で設計。",
    offset: false,
  },
  {
    num: "02",
    title: "会計自動化",
    body: "請求・領収書・入出金管理をNotion／外部API連携で自動化。",
    offset: true,
  },
  {
    num: "03",
    title: "ワークフロー構築",
    body: "案件進行・タスク管理・クライアント対応までを一元化する運用基盤。",
    offset: false,
  },
]

const caseStudies = [
  {
    num: "Case 01",
    title: "フリーランス向け統合ダッシュボード",
    body: "案件・請求・実績が散在していた状態から、案件DBを軸に一元化。月次の集計作業を大幅に削減した。",
  },
  {
    num: "Case 02",
    title: "映像制作会社 納品ポータル",
    body: "分散していた納品データのやり取りを、Next.js製ポータルとNotion連携で一本化。確認負荷を軽減した。",
  },
  {
    num: "Case 03",
    title: "領収書自動化システム",
    body: "OCR連携とNotion DBで自動仕分け・記帳フローを構築。手入力作業をほぼゼロに削減した。",
  },
]

export default function SystemsPage() {
  return (
    <div className={styles.container}>
      <Nav />

      <section className={styles.hero}>
        <span className={styles.heroMarker} />
        <div>
          <p className={styles.heroKicker}>Systems</p>
          <h1 className={styles.heroTitle}>
            NOTION・
            <br />
            バックオフィス構築
          </h1>
          <p className={styles.heroLead}>
            導入設計からワークフロー構築、会計自動化まで。制作の現場を運営してきた実務者として、裏側のオペレーションを組む。
          </p>
        </div>
        <figure className="plate">
          <ImageSlot label="Notionワークスペースのスクリーンショット" src={firstImage("systems")} aspectRatio="4/3" />
        </figure>
      </section>

      <section className={styles.services}>
        <div className={`card-kicker dot kicker-i ${styles.kicker}`}>Services</div>
        <div className={styles.servicesGrid}>
          {services.map((service) => (
            <div
              key={service.num}
              className={service.offset ? `${styles.serviceCard} ${styles.serviceCardOffset}` : styles.serviceCard}
            >
              <p className={styles.serviceNum}>{service.num}</p>
              <div className="card-title">{service.title}</div>
              <p className="card-body">{service.body}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="rule-short" />

      <section className={styles.caseStudies}>
        <div className={`card-kicker dot kicker-i ${styles.kicker}`}>Case Studies</div>
        <div className={styles.caseGrid}>
          {caseStudies.map((item) => (
            <div key={item.num} className="card elev-sm">
              <p className={styles.caseNum}>{item.num}</p>
              <div className="card-title">{item.title}</div>
              <p className={`card-body ${styles.caseBody}`}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="rule-short" />

      <section className={styles.section}>
        <div className={`card-kicker dot kicker-i ${styles.kicker}`}>Credentials</div>
        <div className={styles.credentials}>
          <CredentialBadge />
          <div className={styles.tagRow}>
            <span className="tag tag-accent">Notion Certified Admin</span>
            <span className="tag tag-outline">巡回監査士補 取得予定</span>
          </div>
        </div>
      </section>

      <hr className="rule-short" />

      <section className={styles.section}>
        <div className={`card-kicker dot kicker-i ${styles.kicker}`}>Products</div>
        <div className={`card ${styles.productCard}`}>
          <span className={`tag tag-outline ${styles.productBadge}`}>Coming soon</span>
          <div className="card-title">会計アプリ・Notionテンプレート</div>
          <p className="card-body">実務から生まれた仕組みを、テンプレートとして今後公開予定。</p>
        </div>
      </section>

      <hr className="rule-short" />

      <section className={`${styles.section} ${styles.cta}`}>
        <p className={styles.ctaLead}>導入設計・自動化のご相談はこちらから</p>
        <Link href="/#contact" className="btn btn-primary">
          相談する
        </Link>
      </section>

      <Footer />
    </div>
  )
}
