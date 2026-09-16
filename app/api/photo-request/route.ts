import { NextResponse } from "next/server"
import { Resend } from "resend"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** 物件撮影の依頼フォーム。サイト全体の問い合わせ（/api/contact）とは別系統 */
export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 })
  }

  const text = (key: string, limit = 200) => {
    const value = body[key]
    return typeof value === "string" ? value.trim().slice(0, limit) : ""
  }

  const name = text("name")
  const email = text("email", 320)
  const location = text("location")
  const preferredDate = text("preferredDate")

  if (!name || !email || !location || !preferredDate) {
    return NextResponse.json({ error: "必須項目が入力されていません" }, { status: 400 })
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "メールアドレスの形式が正しくありません" }, { status: 400 })
  }

  const company = text("company")
  const phone = text("phone", 40)
  const deliveryDate = text("deliveryDate")
  const roomTour = text("roomTour")
  const message = text("message", 4000)
  const addOns = Array.isArray(body.addOns)
    ? body.addOns.filter((item): item is string => typeof item === "string").slice(0, 10)
    : []
  const estimate = typeof body.estimate === "number" && Number.isFinite(body.estimate) ? body.estimate : undefined

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set")
    return NextResponse.json({ error: "メール送信の設定が完了していません" }, { status: 500 })
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || "info@designartemis.space"
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "Artemis Website <onboarding@resend.dev>"

  const lines = [
    `会社名・屋号: ${company || "（未記入）"}`,
    `ご担当者名: ${name}`,
    `メール: ${email}`,
    `電話: ${phone || "（未記入）"}`,
    "",
    `所在地: ${location}`,
    `撮影希望日・時期: ${preferredDate}`,
    `納品希望日: ${deliveryDate || "（指定なし）"}`,
    "",
    `基本プラン: 20カット・横画角 ¥20,000`,
    `ルームツアー動画: ${roomTour || "なし"}`,
    `オプション: ${addOns.length > 0 ? addOns.join(" / ") : "なし"}`,
    estimate !== undefined ? `概算: ¥${estimate.toLocaleString("ja-JP")}（税別・交通費別）` : "",
    "",
    "ご要望・補足:",
    message || "（未記入）",
  ].filter((line) => line !== "")

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `【物件撮影 依頼】${company || name} 様／${location}`,
      text: lines.join("\n"),
    })

    if (error) {
      console.error("Resend error", error)
      return NextResponse.json({ error: "メール送信に失敗しました" }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Photo request send failed", err)
    return NextResponse.json({ error: "メール送信に失敗しました" }, { status: 500 })
  }
}
