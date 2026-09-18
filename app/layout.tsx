import type { Metadata } from "next"
import { Noto_Sans_JP } from "next/font/google"
import "./globals.css"

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
})

const SITE_URL = "https://designartemis.space"
const DESCRIPTION = "写真・映像制作とNotion導入支援。二本柱で、制作とオペレーションを動かす。"

export const metadata: Metadata = {
  // SNSやメッセージに貼ったときのカード画像を絶対URLで解決するために必要
  metadataBase: new URL(SITE_URL),
  title: "Artemis — Visual / Systems",
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: "Artemis",
    title: "Artemis — Visual / Systems",
    description: DESCRIPTION,
    images: [{ url: "/og/artemis.jpg", width: 1200, height: 630, alt: "Artemisが撮影した住宅の室内" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Artemis — Visual / Systems",
    description: DESCRIPTION,
    images: ["/og/artemis.jpg"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <head>
        {/* JSが動かない環境でフェードイン待ちのまま消えないようにする */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  )
}
