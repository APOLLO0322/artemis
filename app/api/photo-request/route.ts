import { NextResponse } from "next/server"
import { Resend } from "resend"
import { renderPhotoQuote } from "@/lib/photoQuote"

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

  const replyLines = [
    `${company ? `${company}\n` : ""}${name} 様`,
    "",
    "この度は物件撮影のご依頼をいただき、ありがとうございます。",
    "以下の内容で承りました。",
    "",
    "─────────────────",
    `所在地: ${location}`,
    `撮影希望日・時期: ${preferredDate}`,
    `納品希望日: ${deliveryDate || "（指定なし）"}`,
    "",
    "基本プラン: 20カット・横画角 ¥20,000",
    `ルームツアー動画: ${roomTour || "なし"}`,
    `オプション: ${addOns.length > 0 ? addOns.join(" / ") : "なし"}`,
    estimate !== undefined ? `概算: ¥${estimate.toLocaleString("ja-JP")}（税別・交通費別）` : "",
    "",
    "ご要望・補足:",
    message || "（未記入）",
    "─────────────────",
    "",
    "上記は概算です。24時間以内に、正式なお見積もりと撮影可能な日程をあらためてご連絡いたします。",
    "このメールに返信いただければ、そのまま担当者に届きます。",
    "",
    "Artemis",
    "info@designartemis.space",
    "https://designartemis.space",
  ].filter((line) => line !== "")

  // 見積書は両方のメールに付けるので先に作る。
  // 生成に失敗しても、依頼の通知だけは必ず届くようにする。
  let quote: string | undefined
  try {
    const pdf = await renderPhotoQuote({
      clientName: company || name,
      location,
      roomTour,
      addOns,
      hasRetouch: addOns.some((item) => item.includes("特殊編集")),
    })
    quote = Buffer.from(pdf).toString("base64")
  } catch (pdfErr) {
    console.error("Quote PDF failed", pdfErr)
  }

  /** ファイル名に使えない文字を落とす */
  const safe = (value: string) => value.replace(/[\\/:*?"<>|]/g, "").trim() || "お客様"

  try {
    const resend = new Resend(apiKey)

    // 依頼者への自動返信が失敗しても、こちらへの通知だけは必ず残るよう順に送る
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `【物件撮影 依頼】${company || name} 様／${location}`,
      text: lines.join("\n"),
      // 控えとして手元にも残す。後から探しやすいよう宛先名をファイル名にする
      attachments: quote
        ? [{ filename: `仮見積書_${safe(company || name)}.pdf`, content: quote }]
        : undefined,
    })

    if (error) {
      console.error("Resend error", error)
      return NextResponse.json({ error: "メール送信に失敗しました" }, { status: 502 })
    }

    try {
      const auto = await resend.emails.send({
        from: fromEmail,
        to: email,
        replyTo: toEmail,
        subject: "【Artemis】物件撮影のご依頼を承りました",
        text: replyLines.join("\n"),
        attachments: quote ? [{ filename: "仮見積書_Artemis.pdf", content: quote }] : undefined,
      })
      if (auto.error) console.error("Auto-reply failed", auto.error)
    } catch (autoErr) {
      // 自動返信の失敗で依頼そのものを失わせない
      console.error("Auto-reply threw", autoErr)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Photo request send failed", err)
    return NextResponse.json({ error: "メール送信に失敗しました" }, { status: 500 })
  }
}
