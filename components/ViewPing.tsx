"use client"

import { useEffect } from "react"

const SESSION_KEY = "artemis-view-pinged"

/**
 * 訪問をSlackへ知らせる。
 * ブラウザ上で動くので、JSを実行しないクローラーは自然に除かれる。
 * 同じ滞在中は一度だけ送るため、1人が何ページ見ても通知は1通で済む。
 */
export function ViewPing() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return
      sessionStorage.setItem(SESSION_KEY, "1")
    } catch {
      // プライベートモードなどで使えない場合は、都度送る側に倒す
    }

    const payload = {
      path: window.location.pathname,
      ref: new URLSearchParams(window.location.search).get("ref") ?? "",
      referrer: document.referrer,
      device: window.matchMedia("(max-width: 720px)").matches ? "スマホ" : "PC",
    }

    // 離脱間際でも届くよう、可能なら sendBeacon を使う
    const body = JSON.stringify(payload)
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/view-ping", new Blob([body], { type: "application/json" }))
      return
    }
    fetch("/api/view-ping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      // 通知が飛ばなくても閲覧体験には影響させない
    })
  }, [])

  return null
}
