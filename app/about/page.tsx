import { Nav } from "@/components/Nav"
import { Footer } from "@/components/Footer"
import { ImageSlot } from "@/components/ImageSlot"
import { firstImage } from "@/lib/siteImages"
import styles from "./page.module.css"

export const metadata = {
  title: "About — Artemis",
  description: "写真から始まり、システムに広がった。Artemisのプロフィール。",
}

const profile = [
  { label: "出身", value: "埼玉県" },
  { label: "学歴", value: "上智大学 心理学科 卒業" },
  { label: "経歴", value: "エンタメ業界で演劇プロデューサー → 愛媛へ移住 → 映像制作会社 共同代表 → 個人事業「Artemis」" },
  { label: "現在", value: "写真・映像制作／Notion導入・バックオフィス構築／Web制作" },
  { label: "資格", value: "Notion Certified Admin" },
  { label: "好きなもの", value: "ダンス、パン、チョコ、クッキー、チーズ、さつまいも" },
]

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <Nav />

      <section className={styles.hero}>
        <p className={styles.profileLabel}>Profile</p>
        <div>
          <p className={styles.kicker}>About</p>
          <h1 className={styles.title}>写真から始まり、システムに広がった。</h1>
          <p className={styles.lead}>
            埼玉県出身。上智大学心理学科を卒業後、エンタメ業界で演劇プロデューサーとして働く。舞台という、たくさんの人の手がひとつの本番に集まる現場で、つくることと、それを回すことの両方に向き合ってきた。
          </p>
          <p className={styles.lead}>
            その後、愛媛へ移住。パートナーとの共同代表で映像制作会社を立ち上げ、並行して個人事業「Artemis」を始める。カメラマンとして写真も映像も撮り、編集まで手がけている。
          </p>
          <p className={styles.lead}>
            Notionを使った業務設計に取り組み始め、Notion Certified
            Adminを取得。今は、写真・映像の制作と、Notion・バックオフィスの構築を、二本柱として並行して手がけている。
          </p>
        </div>
        <figure className="plate">
          <ImageSlot label="ポートレート" src={firstImage("about")} aspectRatio="4/5" />
        </figure>
      </section>

      <hr className="rule-short" />

      <section className={styles.section}>
        <div className={`card-kicker dot kicker-i ${styles.sectionKicker}`}>Profile</div>
        <dl className={styles.profileList}>
          {profile.map((item) => (
            <div key={item.label} className={styles.profileRow}>
              <dt className={styles.profileLabelCell}>{item.label}</dt>
              <dd className={styles.profileValue}>{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <hr className="rule-short" />

      <section className={styles.section}>
        <div className={`card-kicker dot kicker-i ${styles.sectionKicker}`}>大切にしていること</div>
        <p className={styles.credo}>
          自分の言葉を持つ<span className="kuten">。</span>
          <br />
          大切な人を支える力を持つ<span className="kuten">。</span>
          <br />
          できるまでやる<span className="kuten">。</span>
        </p>
      </section>

      <hr className="rule-short" />

      <Footer />
    </div>
  )
}
