import { renderQuotePdf, type DocumentLine } from "./quote"

const BASE_PRICE = 20000
const TAX_RATE = 0.1
const VALID_DAYS = 30

/** 見積番号。同じ日に複数来ても衝突しないよう時刻を混ぜる */
function quoteNumber(now: Date) {
  const pad = (n: number, len = 2) => String(n).padStart(len, "0")
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}`
}

export type PhotoQuoteInput = {
  clientName: string
  location: string
  roomTour?: string
  addOns: string[]
  /** 特殊編集はカット数未定のため、金額を伏せて別途扱いにする */
  hasRetouch: boolean
}

/** 物件撮影の依頼内容から、仮見積書のPDFを作る */
export async function renderPhotoQuote(input: PhotoQuoteInput, now = new Date()) {
  const lines: DocumentLine[] = [
    { name: "物件撮影 基本プラン", quantity: "一式", unitPrice: BASE_PRICE, amount: BASE_PRICE },
    { name: "20カット・横画角／撮影日から3日で納品", indent: true },
  ]

  if (input.roomTour?.includes("撮影のみ")) {
    lines.push({ name: "ルームツアー動画（撮影のみ）", quantity: "1本", unitPrice: 10000, amount: 10000 })
  } else if (input.roomTour?.includes("テロップ")) {
    lines.push({ name: "ルームツアー動画（テロップ編集込み）", quantity: "1本", unitPrice: 30000, amount: 30000 })
  }

  if (input.addOns.some((item) => item.includes("SNS"))) {
    lines.push({ name: "SNS用 縦画角写真", quantity: "10カット", unitPrice: 8000, amount: 8000 })
  }
  if (input.addOns.some((item) => item.includes("翌日納品"))) {
    lines.push({ name: "翌日納品", quantity: "一式", unitPrice: 5000, amount: 5000 })
  }
  if (input.hasRetouch) {
    lines.push({ name: "特殊編集（映り込み削除など）", quantity: "別途", unitPrice: 500 })
    lines.push({ name: "カット数確定後にお見積りいたします", indent: true })
  }

  const expiresAt = new Date(now)
  expiresAt.setDate(expiresAt.getDate() + VALID_DAYS)

  return renderQuotePdf({
    number: quoteNumber(now),
    issuedAt: now,
    expiresAt,
    clientName: input.clientName,
    subject: `物件撮影（${input.location}）`,
    lines,
    taxRate: TAX_RATE,
    provisional: true,
    notes: [
      "※ 本書はご依頼内容にもとづく仮のお見積りです。正式なお見積りは別途ご連絡いたします。",
      "※ 撮影場所までの交通費は含まれておりません。",
    ],
  })
}
