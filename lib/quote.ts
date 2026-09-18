import fs from "node:fs"
import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"

/**
 * 見積書・請求書のPDFを組み立てる。
 * 発行元の情報と描画を分けてあるので、Artemis以外の屋号でも使い回せる。
 */

export type DocumentIssuer = {
  /** ロゴ画像のバイト列。読み込み方は呼び出し側に任せる */
  logo?: Uint8Array
  tel: string
  email: string
  /** 適格請求書発行事業者の登録番号 */
  registrationNumber: string
}

export type DocumentLine = {
  name: string
  /** 「一式」など。空欄なら内訳行として扱う */
  quantity?: string
  unitPrice?: number
  /** 金額欄。内訳行では空にする */
  amount?: number
  /** 内訳として字下げするか */
  indent?: boolean
}

export type QuoteInput = {
  /** 見積番号 */
  number: string
  issuedAt: Date
  expiresAt: Date
  /** 宛名。「御中」は自動で付く */
  clientName: string
  subject: string
  lines: DocumentLine[]
  taxRate: number
  /** 仮見積として発行するか */
  provisional?: boolean
  /** 表題下に添える注記 */
  notes?: string[]
}

// 固定パスで読む。動的だとビルド時にプロジェクト全体が同梱されてしまう
const FONT_PATH = "./assets/fonts/NotoSerifJP-Doc.ttf"
const LOGO_PATH = "./public/logo/artemis-lockup.png"

const ARTEMIS: DocumentIssuer = {
  logo: fs.readFileSync(LOGO_PATH),
  tel: "080-5684-7627",
  email: "tomomi@designartemis.space",
  registrationNumber: "T7810320387739",
}

const A4 = { width: 595.28, height: 841.89 }
const MARGIN = 56

const BLACK = rgb(0, 0, 0)
const WHITE = rgb(1, 1, 1)
const ROW_TINT = rgb(0.937, 0.937, 0.937)
const RULE = rgb(0.45, 0.45, 0.45)

const yen = (value: number) => value.toLocaleString("ja-JP")

function formatDate(date: Date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

/** 文字間を空けて描く（表題の「見 積 書」など） */
function drawSpaced(page: PDFPage, text: string, options: { x: number; y: number; size: number; font: PDFFont; gap: number }) {
  const { x, y, size, font, gap } = options
  let cursor = x
  for (const char of text) {
    page.drawText(char, { x: cursor, y, size, font, color: BLACK })
    cursor += font.widthOfTextAtSize(char, size) + gap
  }
  return cursor - gap
}

function spacedWidth(text: string, font: PDFFont, size: number, gap: number) {
  let total = 0
  for (const char of text) total += font.widthOfTextAtSize(char, size) + gap
  return total - gap
}

export async function renderQuotePdf(input: QuoteInput, issuer: DocumentIssuer = ARTEMIS): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  pdf.registerFontkit(fontkit)

  const fontBytes = fs.readFileSync(FONT_PATH)
  const font = await pdf.embedFont(fontBytes, { subset: false })

  const page = pdf.addPage([A4.width, A4.height])
  const right = A4.width - MARGIN
  let y = A4.height - 70

  // ---- 表題 ----
  const title = input.provisional ? "仮見積書" : "見積書"
  const titleSize = 26
  const titleGap = 10
  const titleWidth = spacedWidth(title, font, titleSize, titleGap)
  drawSpaced(page, title, { x: (A4.width - titleWidth) / 2 - 40, y, size: titleSize, font, gap: titleGap })

  // ---- 右上：作成日・番号 ----
  page.drawText(`作成日：${formatDate(input.issuedAt)}`, { x: right - 150, y: y + 12, size: 9, font, color: BLACK })
  page.drawText(`番号：${input.number}`, { x: right - 150, y: y - 4, size: 9, font, color: BLACK })

  // ---- 宛名 ----
  y -= 70
  const client = `${input.clientName}　御中`
  page.drawText(client, { x: MARGIN, y, size: 18, font, color: BLACK })
  const clientWidth = font.widthOfTextAtSize(client, 18)
  page.drawLine({
    start: { x: MARGIN, y: y - 6 },
    end: { x: MARGIN + clientWidth, y: y - 6 },
    thickness: 1,
    color: BLACK,
  })

  // ---- 件名・リード ----
  y -= 34
  page.drawText(`件名：${input.subject}`, { x: MARGIN, y, size: 10, font, color: BLACK })
  y -= 16
  page.drawText("下記の通り御見積申し上げます。", { x: MARGIN, y, size: 10, font, color: BLACK })

  // ---- 発行者情報（右側） ----
  let issuerY = y + 46
  if (issuer.logo) {
    try {
      const logo = await pdf.embedPng(issuer.logo)
      const logoWidth = 132
      const logoHeight = (logo.height / logo.width) * logoWidth
      page.drawImage(logo, { x: right - logoWidth, y: issuerY, width: logoWidth, height: logoHeight })
      issuerY -= 14
    } catch {
      // ロゴが無くても本文は出す
    }
  }
  for (const line of [issuer.tel, issuer.email, `登録番号：${issuer.registrationNumber}`]) {
    page.drawText(line, { x: right - 170, y: issuerY, size: 8.5, font, color: BLACK })
    issuerY -= 13
  }

  // ---- 合計金額 ----
  const subtotal = input.lines.reduce((sum, line) => sum + (line.amount ?? 0), 0)
  const total = Math.round(subtotal * (1 + input.taxRate))

  y -= 40
  page.drawText("合計金額", { x: MARGIN, y, size: 11, font, color: BLACK })
  page.drawText(`${yen(total)}円 (税込)`, { x: MARGIN + 76, y, size: 15, font, color: BLACK })
  page.drawLine({
    start: { x: MARGIN, y: y - 10 },
    end: { x: MARGIN + 290, y: y - 10 },
    thickness: 0.8,
    color: BLACK,
  })

  // ---- 注記（仮見積の断り書きなど） ----
  y -= 30
  for (const note of input.notes ?? []) {
    page.drawText(note, { x: MARGIN, y, size: 8.5, font, color: rgb(0.25, 0.25, 0.25) })
    y -= 13
  }

  // ---- 明細表 ----
  y -= 22
  const cols = { name: MARGIN, qty: 300, unit: 375, amount: 465 }
  const tableRight = right
  const rowHeight = 26
  const headerHeight = 24

  page.drawRectangle({
    x: MARGIN,
    y: y - headerHeight,
    width: tableRight - MARGIN,
    height: headerHeight,
    color: BLACK,
  })
  const headers: [string, number, number][] = [
    ["項目", cols.name, cols.qty - cols.name],
    ["数量", cols.qty, cols.unit - cols.qty],
    ["単価", cols.unit, cols.amount - cols.unit],
    ["金額", cols.amount, tableRight - cols.amount],
  ]
  for (const [label, x, width] of headers) {
    const w = font.widthOfTextAtSize(label, 10)
    page.drawText(label, { x: x + (width - w) / 2, y: y - headerHeight + 8, size: 10, font, color: WHITE })
  }
  y -= headerHeight

  // 実データが少なくても表の体裁が崩れないよう空行で埋める
  const rows: (DocumentLine | null)[] = [...input.lines]
  while (rows.length < 8) rows.push(null)

  rows.forEach((line, i) => {
    const top = y - i * rowHeight
    if (i % 2 === 1) {
      page.drawRectangle({
        x: MARGIN,
        y: top - rowHeight,
        width: tableRight - MARGIN,
        height: rowHeight,
        color: ROW_TINT,
      })
    }
    if (!line) return

    const baseline = top - rowHeight + 9
    const size = line.indent ? 9 : 10
    page.drawText(line.name, { x: cols.name + (line.indent ? 22 : 8), y: baseline, size, font, color: BLACK })

    if (line.quantity) {
      const w = font.widthOfTextAtSize(line.quantity, size)
      page.drawText(line.quantity, { x: cols.qty + (cols.unit - cols.qty - w) / 2, y: baseline, size, font, color: BLACK })
    }
    if (line.unitPrice !== undefined) {
      const text = yen(line.unitPrice)
      const w = font.widthOfTextAtSize(text, size)
      page.drawText(text, { x: cols.amount - 14 - w, y: baseline, size, font, color: BLACK })
    }
    if (line.amount !== undefined) {
      const text = yen(line.amount)
      const w = font.widthOfTextAtSize(text, size)
      page.drawText(text, { x: tableRight - 14 - w, y: baseline, size, font, color: BLACK })
    }
  })

  y -= rows.length * rowHeight
  page.drawLine({ start: { x: MARGIN, y }, end: { x: tableRight, y }, thickness: 0.8, color: BLACK })

  // ---- 合計欄 ----
  const totals: [string, number][] = [
    ["合計", subtotal],
    [`税込（${Math.round(input.taxRate * 100)}%）`, total],
  ]
  let totalsY = y - 24
  for (const [label, value] of totals) {
    page.drawText(label, { x: cols.unit + 10, y: totalsY, size: 10, font, color: BLACK })
    const text = yen(value)
    const w = font.widthOfTextAtSize(text, 10)
    page.drawText(text, { x: tableRight - 14 - w, y: totalsY, size: 10, font, color: BLACK })
    page.drawLine({
      start: { x: cols.unit, y: totalsY - 9 },
      end: { x: tableRight, y: totalsY - 9 },
      thickness: 0.5,
      color: RULE,
    })
    totalsY -= 30
  }

  // ---- 有効期限 ----
  const expiry = `有効期限：${formatDate(input.expiresAt)}`
  page.drawText(expiry, { x: MARGIN, y: totalsY - 40, size: 9, font, color: BLACK })
  page.drawLine({
    start: { x: MARGIN, y: totalsY - 46 },
    end: { x: MARGIN + font.widthOfTextAtSize(expiry, 9), y: totalsY - 46 },
    thickness: 0.6,
    color: BLACK,
  })

  return pdf.save()
}
