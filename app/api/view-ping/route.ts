import { NextResponse } from "next/server"

/** ページ名を日本語にして読みやすくする */
const PAGE_NAMES: Record<string, string> = {
  "/": "トップ",
  "/architecture": "物件撮影",
  "/visual": "Visual",
  "/systems": "Systems",
  "/about": "About",
  "/partner": "Partner",
}

/** どこから来たかを、URLではなく言葉で示す */
function describeReferrer(referrer: string) {
  if (!referrer) return "直接アクセス（URLを直接開いた／メールやSNSのリンク）"
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "")
    if (host.includes("designartemis.space")) return "サイト内"

    // メール系は検索より先に判定する。mail.google.com を検索と取り違えないため
    if (/^mail\.|^outlook\.|webmail/.test(host)) return `メール（${host}）`

    if (host.includes("google")) return "Google検索"
    if (host.includes("yahoo")) return "Yahoo!検索"
    if (host.includes("bing")) return "Bing検索"

    const social: Record<string, string> = {
      "t.co": "X（Twitter）",
      "x.com": "X（Twitter）",
      "instagram.com": "Instagram",
      "facebook.com": "Facebook",
      "line.me": "LINE",
      "lm.facebook.com": "Facebook",
      "note.com": "note",
    }
    for (const [key, label] of Object.entries(social)) {
      if (host === key || host.endsWith(`.${key}`)) return label
    }
    return host
  } catch {
    return "不明"
  }
}

export async function POST(request: Request) {
  const webhook = process.env.SLACK_WEBHOOK_URL
  // 未設定でも閲覧の邪魔はしない
  if (!webhook) return NextResponse.json({ ok: true })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: true })
  }

  const text = (key: string, limit = 200) => {
    const value = body[key]
    return typeof value === "string" ? value.trim().slice(0, limit) : ""
  }

  const path = text("path", 120) || "/"
  const ref = text("ref", 60)
  const device = text("device", 10) || "不明"
  const referrer = describeReferrer(text("referrer", 300))

  const now = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const lines = [
    `👀 *サイトが閲覧されました*`,
    `ページ：${PAGE_NAMES[path] ?? path}`,
    ref ? `送付先：*${ref}*` : "",
    `流入：${referrer}`,
    `端末：${device}　${now}`,
  ].filter(Boolean)

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: lines.join("\n") }),
    })
  } catch (err) {
    console.error("Slack notify failed", err)
  }

  return NextResponse.json({ ok: true })
}
