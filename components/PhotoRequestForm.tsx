"use client"

import { useMemo, useState, type FormEvent } from "react"
import styles from "./PhotoRequestForm.module.css"

const BASE_PRICE = 20000

const PROPERTY_TYPES = ["住宅", "店舗", "オフィス", "その他"]

const ROOM_TOUR = [
  { value: "なし", amount: 0 },
  { value: "撮影のみ（1本）", amount: 10000 },
  { value: "テロップ入れの編集まで（1本）", amount: 30000 },
]

const ADD_ONS = [
  { id: "sns", label: "SNS用 縦画角写真（10カット）", amount: 8000 },
  { id: "rush", label: "翌日納品", amount: 5000 },
  { id: "retouch", label: "特殊編集（映り込み削除など）", amount: 0, note: "カット数に応じて別途お見積り" },
]

type Status = "idle" | "submitting" | "success" | "error"

const yen = (value: number) => `¥${value.toLocaleString("ja-JP")}`

export function PhotoRequestForm() {
  const [status, setStatus] = useState<Status>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [roomTour, setRoomTour] = useState(ROOM_TOUR[0].value)
  const [addOns, setAddOns] = useState<string[]>([])

  const estimate = useMemo(() => {
    const tour = ROOM_TOUR.find((item) => item.value === roomTour)?.amount ?? 0
    const extras = ADD_ONS.filter((item) => addOns.includes(item.id)).reduce((sum, item) => sum + item.amount, 0)
    return BASE_PRICE + tour + extras
  }, [roomTour, addOns])

  const hasQuoteOnly = addOns.includes("retouch")

  function toggleAddOn(id: string) {
    setAddOns((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("submitting")
    setErrorMessage("")

    const form = event.currentTarget
    const data = new FormData(form)
    const payload = {
      name: String(data.get("name") ?? ""),
      company: String(data.get("company") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      location: String(data.get("location") ?? ""),
      propertyType: String(data.get("propertyType") ?? ""),
      preferredDate: String(data.get("preferredDate") ?? ""),
      deliveryDate: String(data.get("deliveryDate") ?? ""),
      roomTour,
      addOns: ADD_ONS.filter((item) => addOns.includes(item.id)).map((item) => item.label),
      estimate,
      message: String(data.get("message") ?? ""),
    }

    try {
      const response = await fetch("/api/photo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error ?? "送信に失敗しました。時間をおいて再度お試しください。")
      }
      setStatus("success")
      form.reset()
      setAddOns([])
      setRoomTour(ROOM_TOUR[0].value)
    } catch (err) {
      setStatus("error")
      setErrorMessage(err instanceof Error ? err.message : "送信に失敗しました。")
    }
  }

  if (status === "success") {
    return (
      <p className={styles.success}>
        ありがとうございます。内容を確認のうえ、正式なお見積りと撮影可能な日程を2営業日以内にご返信します。
      </p>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.grid}>
        <div className="field">
          <label htmlFor="req-company">会社名・屋号</label>
          <input className="input" id="req-company" name="company" maxLength={200} placeholder="○○建築設計事務所" />
        </div>
        <div className="field">
          <label htmlFor="req-name">ご担当者名</label>
          <input className="input" id="req-name" name="name" maxLength={200} required placeholder="山田 太郎" />
        </div>
        <div className="field">
          <label htmlFor="req-email">メールアドレス</label>
          <input
            className="input"
            id="req-email"
            name="email"
            type="email"
            maxLength={320}
            required
            placeholder="you@example.com"
          />
        </div>
        <div className="field">
          <label htmlFor="req-phone">お電話番号（任意）</label>
          <input className="input" id="req-phone" name="phone" maxLength={40} placeholder="090-0000-0000" />
        </div>
        <div className="field">
          <label htmlFor="req-type">物件の種別</label>
          <select className="input" id="req-type" name="propertyType" defaultValue="" required>
            <option value="" disabled>
              選択してください
            </option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="req-location">物件の所在地</label>
          <input
            className="input"
            id="req-location"
            name="location"
            maxLength={200}
            required
            placeholder="愛媛県松山市"
          />
        </div>
        <div className="field">
          <label htmlFor="req-preferred">撮影希望日・時期</label>
          <input
            className="input"
            id="req-preferred"
            name="preferredDate"
            maxLength={200}
            required
            placeholder="10月上旬／10月15日 午前 など"
          />
        </div>
        <div className="field">
          <label htmlFor="req-delivery">納品希望日（任意）</label>
          <input className="input" id="req-delivery" name="deliveryDate" maxLength={200} placeholder="10月20日まで" />
        </div>
      </div>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>ご依頼内容</legend>

        <p className={styles.baseRow}>
          <span>基本プラン（20カット・横画角）</span>
          <span className={styles.baseAmount}>{yen(BASE_PRICE)}</span>
        </p>

        <div className="field">
          <label htmlFor="req-tour">ルームツアー動画</label>
          <select
            className="input"
            id="req-tour"
            name="roomTour"
            value={roomTour}
            onChange={(event) => setRoomTour(event.target.value)}
          >
            {ROOM_TOUR.map((item) => (
              <option key={item.value} value={item.value}>
                {item.value}
                {item.amount > 0 ? `　+${yen(item.amount)}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.checks}>
          {ADD_ONS.map((item) => (
            <label key={item.id} className={styles.check}>
              <input type="checkbox" checked={addOns.includes(item.id)} onChange={() => toggleAddOn(item.id)} />
              <span>
                {item.label}
                <span className={styles.checkAmount}>{item.amount > 0 ? `+${yen(item.amount)}` : "別途お見積り"}</span>
              </span>
            </label>
          ))}
        </div>

        <div className={styles.estimate}>
          <span className={styles.estimateLabel}>概算</span>
          <span className={styles.estimateValue}>
            {yen(estimate)}
            {hasQuoteOnly && <span className={styles.estimatePlus}>＋特殊編集分</span>}
          </span>
          <span className={styles.estimateNote}>税別・交通費別。正式なお見積りは折り返しご連絡します。</span>
        </div>
      </fieldset>

      <div className="field">
        <label htmlFor="req-message">ご要望・補足（任意）</label>
        <textarea
          className="input"
          id="req-message"
          name="message"
          rows={4}
          maxLength={4000}
          placeholder="撮りたいカットのイメージ、図面や竣工写真の用途、カット数の追加希望など"
        />
      </div>

      {status === "error" && <p className={styles.error}>{errorMessage}</p>}

      <button type="submit" className="btn btn-primary" disabled={status === "submitting"}>
        {status === "submitting" ? "送信中…" : "この内容で見積りを依頼する"}
      </button>
    </form>
  )
}
