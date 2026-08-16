"use client"

import { useState, type FormEvent } from "react"
import styles from "./ContactForm.module.css"

type Status = "idle" | "submitting" | "success" | "error"

export const INQUIRY_TYPES = ["撮影・映像制作", "Notion導入・業務設計"] as const

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("submitting")
    setErrorMessage("")

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      inquiryType: String(formData.get("inquiryType") ?? ""),
      message: String(formData.get("message") ?? ""),
    }

    try {
      const response = await fetch("/api/contact", {
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
    } catch (err) {
      setStatus("error")
      setErrorMessage(err instanceof Error ? err.message : "送信に失敗しました。時間をおいて再度お試しください。")
    }
  }

  if (status === "success") {
    return (
      <p className={styles.success}>
        お問い合わせありがとうございます。内容を確認のうえ、折り返しご連絡いたします。
      </p>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="home-name">お名前</label>
        <input className="input" id="home-name" name="name" placeholder="山田 太郎" maxLength={200} required />
      </div>
      <div className="field">
        <label htmlFor="home-email">メールアドレス</label>
        <input
          className="input"
          id="home-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          maxLength={320}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="home-type">ご依頼内容</label>
        <select className="input" id="home-type" name="inquiryType" defaultValue="" required>
          <option value="" disabled>
            選択してください
          </option>
          {INQUIRY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="home-msg">ご相談内容</label>
        <textarea
          className="input"
          id="home-msg"
          name="message"
          rows={4}
          placeholder="撮影のご依頼／Notion導入のご相談など"
          maxLength={4000}
          required
        />
      </div>
      {status === "error" && <p className={styles.error}>{errorMessage}</p>}
      <button type="submit" className="btn btn-primary btn-block" disabled={status === "submitting"}>
        {status === "submitting" ? "送信中…" : "送信する"}
      </button>
    </form>
  )
}
