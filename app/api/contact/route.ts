import { NextResponse } from "next/server"
import { Resend } from "resend"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const INQUIRY_TYPES = ["撮影・映像制作", "Notion導入・業務設計"]

export async function POST(request: Request) {
  let body: { name?: unknown; email?: unknown; inquiryType?: unknown; message?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 })
  }

  const name = typeof body.name === "string" ? body.name.trim() : ""
  const email = typeof body.email === "string" ? body.email.trim() : ""
  const inquiryType = typeof body.inquiryType === "string" ? body.inquiryType.trim() : ""
  const message = typeof body.message === "string" ? body.message.trim() : ""

  if (!name || !email || !inquiryType || !message) {
    return NextResponse.json({ error: "すべての項目を入力してください" }, { status: 400 })
  }

  if (!INQUIRY_TYPES.includes(inquiryType)) {
    return NextResponse.json({ error: "ご依頼内容を選択してください" }, { status: 400 })
  }

  if (name.length > 200 || email.length > 320 || message.length > 4000) {
    return NextResponse.json({ error: "入力内容が長すぎます" }, { status: 400 })
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "メールアドレスの形式が正しくありません" }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set")
    return NextResponse.json({ error: "メール送信の設定が完了していません" }, { status: 500 })
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || "info@designartemis.space"
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "Artemis Website <onboarding@resend.dev>"

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `【Artemis お問い合わせ／${inquiryType}】${name}様より`,
      text: `お名前: ${name}\nメールアドレス: ${email}\nご依頼内容: ${inquiryType}\n\nご相談内容:\n${message}`,
    })

    if (error) {
      console.error("Resend error", error)
      return NextResponse.json({ error: "メール送信に失敗しました" }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Contact form send failed", err)
    return NextResponse.json({ error: "メール送信に失敗しました" }, { status: 500 })
  }
}
