import { Nav } from "@/components/Nav"
import { Footer } from "@/components/Footer"
import { ImageSlot } from "@/components/ImageSlot"
import { firstImage } from "@/lib/siteImages"
import styles from "./page.module.css"

export const metadata = {
  title: "About — Artemis",
  description: "写真から始まり、システムに広がった。Artemisのプロフィール。",
}

const links = [
  { label: "Instagram", href: "https://www.instagram.com/i.tomomi2734/" },
  { label: "Threads", href: "https://www.threads.com/@i.tomomi2734" },
  { label: "note", href: "https://note.com/artemis2734" },
]

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <Nav />

      <section className={styles.hero}>
        <p className={styles.profileLabel}>Profile</p>
        <div>
          <h1 className={styles.kicker}>About</h1>
          <p className={styles.lead}>
            埼玉県出身。上智大学心理学科を卒業後、エンタメ業界で演劇プロデューサーとして働く。舞台という、たくさんの人の手がひとつの本番に集まる現場で、創ることと、それを円滑に進行することの両方に向き合ってきた。
          </p>
          <p className={styles.lead}>
            その後、愛媛へ移住。パートナーとの共同代表で映像制作会社を立ち上げる。現在は個人事業「Artemis」として写真と映像の撮影・編集まで手がけている。
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
        <div className={`card-kicker dot kicker-i ${styles.sectionKicker}`}>Links</div>
        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.label}>
              <a href={link.href} target="_blank" rel="noopener noreferrer" className={styles.link}>
                {link.label} →
              </a>
            </li>
          ))}
        </ul>
      </section>

      <hr className="rule-short" />

      <Footer />
    </div>
  )
}
