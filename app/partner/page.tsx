import Link from "next/link"
import { Nav } from "@/components/Nav"
import { Footer } from "@/components/Footer"
import styles from "./page.module.css"

export const metadata = {
  title: "Partner — Artemis",
  description: "Notion Solution Partner審査用ページ。Notion導入設計とバックオフィス構築を実務として。",
}

const services = [
  { title: "Notion導入設計", body: "業務フローの棚卸しからDB設計・構築まで。" },
  { title: "会計自動化", body: "請求・領収書・入出金管理の自動化。" },
  { title: "ワークフロー構築", body: "案件進行・タスク・クライアント対応の一元化。" },
]

const caseSteps = [
  { label: "課題", body: "案件・請求・実績が散在し状況把握に時間がかかっていた。" },
  { label: "設計", body: "案件DBを中心に請求・稼働・実績を連携。" },
  { label: "成果", body: "月次集計を大幅に削減。" },
]

export default function PartnerPage() {
  return (
    <div className={styles.container}>
      <Nav variant="minimal" />

      <section className={styles.hero}>
        <p className={styles.kicker}>Notion Solution Partner</p>
        <h1 className={styles.title}>Notion導入設計とバックオフィス構築を、実務として。</h1>
        <p className={styles.lead}>
          Notion Certified
          Adminとして、導入設計・ワークフロー構築・会計自動化を専門に手がけています。自らクライアント業務を運営してきた経験から、現場で機能するNotion運用を設計します。
        </p>
      </section>

      <hr className="rule-short" />

      <section className={styles.section}>
        <div className={`card-kicker dot kicker-i ${styles.sectionKicker}`}>Services</div>
        <div className={styles.servicesGrid}>
          {services.map((service) => (
            <div key={service.title} className="card">
              <div className="card-title">{service.title}</div>
              <p className="card-body">{service.body}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="rule-short" />

      <section className={styles.section}>
        <div className={`card-kicker dot kicker-i ${styles.sectionKicker}`}>Case Study</div>
        <div className="card elev-sm">
          <div className="card-title">フリーランス向け統合ダッシュボード</div>
          <div className={styles.caseGrid}>
            {caseSteps.map((step) => (
              <div key={step.label}>
                <div className={styles.caseLabel}>{step.label}</div>
                <p className="card-body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
        <p className={styles.caseLink}>
          <Link href="/systems">他のCase Studiesを見る →</Link>
        </p>
      </section>

      <hr className="rule-short" />

      <section className={styles.section}>
        <div className={`card-kicker dot kicker-i ${styles.sectionKicker}`}>Credentials</div>
        <div className={styles.tagRow}>
          <span className="tag tag-accent">Notion Certified Admin</span>
          <span className="tag tag-outline">巡回監査士補 取得予定</span>
        </div>
      </section>

      <hr className="rule-short" />

      <section className={`${styles.section} ${styles.ctaSection}`}>
        <Link href="/#contact" className="btn btn-primary">
          初回相談を予約する
        </Link>
      </section>

      <Footer variant="minimal" />
    </div>
  )
}
