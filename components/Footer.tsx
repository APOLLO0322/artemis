import styles from "./Footer.module.css"

export function Footer({ variant = "full" }: { variant?: "full" | "minimal" }) {
  if (variant === "minimal") {
    return <footer className={styles.footerMinimal}>© Artemis</footer>
  }

  return (
    <footer className={styles.footer}>
      <span>© Artemis</span>
      <a href="#">
        note「感情には、色がある<span className="kuten">。</span>」
      </a>
    </footer>
  )
}
