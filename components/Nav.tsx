"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "./Nav.module.css"

const navItems = [
  { href: "/visual", label: "Visual" },
  { href: "/systems", label: "Systems" },
  { href: "/about", label: "About" },
  { href: "/#contact", label: "Contact" },
]

export function Nav({ variant = "full" }: { variant?: "full" | "minimal" }) {
  const pathname = usePathname()

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        <Image src="/logo/artemis-lockup.png" alt="Artemis" width={84} height={28} priority />
      </Link>

      {variant === "full" ? (
        <div className={styles.links}>
          {navItems.map((item) => {
            const isActive = item.href !== "/#contact" && pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={isActive ? `${styles.link} ${styles.linkActive}` : styles.link}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      ) : (
        <Link href="/#contact" className="btn btn-primary">
          初回相談を予約する
        </Link>
      )}
    </nav>
  )
}
