import { Nav } from "@/components/Nav"
import { Footer } from "@/components/Footer"
import { ImageSlot } from "@/components/ImageSlot"
import { firstImage } from "@/lib/siteImages"
import styles from "./page.module.css"

export const metadata = {
  title: "About — Artemis",
  description: "写真から始まり、システムに広がった。",
}

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
            写真・映像制作を本業として、現場で撮る側にいながら、いつもその裏側の運営に手を出していた。請求、進行管理、クライアント対応——制作を続けるほど、仕組みの重要性に気づかされた。
          </p>
          <p className={styles.lead}>
            その延長で、Notionを使った業務設計に取り組み始め、Notion Certified
            Adminを取得。今は、写真・映像の制作と、Notion・バックオフィスの構築を、二本柱として並行して手がけている。
          </p>
        </div>
        <figure className="plate">
          <ImageSlot label="ポートレート" src={firstImage("about")} aspectRatio="4/5" />
        </figure>
      </section>

      <hr className="rule-short" />

      <section className={styles.story}>
        <div className={`card-kicker dot kicker-i ${styles.storyKicker}`}>二本柱が地続きである理由</div>
        <p className={styles.storyBody}>
          制作の現場を自分自身で運営してきたからこそ、Notionでの業務設計にも現場の視点が入る。逆に、システムを組む実務があるからこそ、写真・映像の制作にも無駄なく向き合える。二つは別の仕事ではなく、同じ姿勢の二つの現れだと考えている。
        </p>
      </section>

      <hr className="rule-short" />

      <Footer />
    </div>
  )
}
