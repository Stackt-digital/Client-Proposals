import React, { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function injectFonts() {
  if (document.getElementById("fw-fonts")) return
  const l = document.createElement("link")
  l.id = "fw-fonts"
  l.rel = "stylesheet"
  l.href =
    "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700&family=JetBrains+Mono:wght@200;400&display=swap"
  document.head.appendChild(l)
}

function injectStyles(id, css) {
  if (document.getElementById(id)) return
  const s = document.createElement("style")
  s.id = id
  s.textContent = css
  document.head.appendChild(s)
}

// ─── Stackt cursor SVG ───────────────────────────────────────────────────────

const CURSOR_URI = (() => {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="28" viewBox="0 0 104 92">` +
    `<path d="M52 4 L100 22 L52 40 L4 22 Z" fill="none" stroke="#f0f0f2" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>` +
    `<path d="M52 30 L100 48 L52 66 L4 48 Z" fill="none" stroke="#f0f0f2" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>` +
    `<path d="M52 56 L100 74 L52 92 L4 74 Z" fill="none" stroke="#f0f0f2" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>` +
    `</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
})()

// ─── Styles ──────────────────────────────────────────────────────────────────

const BASE_CSS = `
  :root {
    --charcoal: #262626;
    --stone:    #FAFAFA;
    --powder:   #EBFCFF;
    --sky:      #BBEAF9;
    --mid:      #414149;
    --tertiary: #84848f;
    --secondary:#a9a9b1;
    --primary:  #f0f0f2;
  }
`

const HOLD_CSS = `
  /* Custom cursor across entire page */
  .fp-hold,
  .fp-hold * {
    cursor: url("${CURSOR_URI}") 15 13, auto !important;
  }

  /* ── Shell ── */
  .fp-hold {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: var(--charcoal);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  /* ── Canvas static overlay ── */
  .fp-hold-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 20;
    pointer-events: none;
    transition: opacity 0.9s ease;
  }

  /* ── Content ── */
  .fp-hold-content {
    position: relative;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 60px 40px;
    max-width: 680px;
    width: 100%;
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.9s ease, transform 0.9s ease;
  }
  .fp-hold-content--show {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Logo ── */
  .fp-hold-logo {
    margin-bottom: 52px;
    opacity: 0.9;
  }

  /* ── Eyebrow ── */
  .fp-hold-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 10px;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: var(--sky);
    margin: 0 0 24px;
  }

  /* ── Heading ── */
  .fp-hold-heading {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
    font-size: clamp(28px, 4.5vw, 58px);
    color: var(--primary);
    line-height: 1.08;
    letter-spacing: -0.025em;
    margin: 0 0 18px;
  }
  .fp-hold-heading em {
    font-style: normal;
    color: var(--sky);
  }

  /* ── Sub ── */
  .fp-hold-sub {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 12px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--tertiary);
    margin: 0 0 52px;
    line-height: 1.8;
  }

  /* ── Building block loader ── */
  .fp-hold-blocks {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 52px;
  }
  .fp-hold-block {
    width: 14px;
    height: 9px;
    border-radius: 3px;
    background: rgba(255,255,255,0.07);
    transition: background 0.12s ease, box-shadow 0.12s ease;
  }
  .fp-hold-block--on {
    background: var(--sky);
    box-shadow: 0 0 8px rgba(187,234,249,0.45);
  }

  /* ── Form ── */
  .fp-hold-form {
    display: flex;
    gap: 10px;
    width: 100%;
    max-width: 460px;
    margin-bottom: 20px;
  }
  .fp-hold-input {
    flex: 1;
    height: 50px;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--mid);
    border-radius: 10px;
    padding: 0 18px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    color: var(--primary);
    outline: none;
    transition: border-color 0.2s ease, background 0.2s ease;
  }
  .fp-hold-input::placeholder { color: var(--tertiary); }
  .fp-hold-input:focus {
    border-color: rgba(187,234,249,0.55);
    background: rgba(255,255,255,0.06);
  }
  .fp-hold-btn {
    height: 50px;
    padding: 0 24px;
    background: var(--sky);
    border: none;
    border-radius: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 600;
    font-size: 14px;
    color: var(--charcoal);
    white-space: nowrap;
    transition: opacity 0.2s ease, transform 0.15s ease;
  }
  .fp-hold-btn:hover:not(:disabled) {
    opacity: 0.85;
    transform: translateY(-1px);
  }
  .fp-hold-btn:disabled { opacity: 0.45; }

  /* ── Status ── */
  .fp-hold-status {
    min-height: 20px;
    margin-bottom: 32px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.1em;
  }
  .fp-hold-status--success { color: var(--sky); }
  .fp-hold-status--error   { color: #ff7070; }

  /* ── Footer ── */
  .fp-hold-footer {
    position: absolute;
    bottom: 36px;
    left: 0; right: 0;
    text-align: center;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.14);
    z-index: 5;
  }

  /* ── Scan-line overlay ── */
  .fp-hold-scan {
    position: absolute;
    inset: 0;
    z-index: 3;
    pointer-events: none;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.06) 2px,
      rgba(0,0,0,0.06) 4px
    );
  }
`

// ─── Constants ───────────────────────────────────────────────────────────────

const BLOCK_COUNT    = 22
const BLOCK_STEP_MS  = 95   // ms per block fill
const BLOCK_PAUSE_MS = 600  // pause when fully filled before reset
const STATIC_HOLD_MS = 1600 // how long static plays before fading
const REVEAL_MS      = 500  // delay after static fades before content appears

// ─── Stackt logo SVG (inline, for page branding) ─────────────────────────────

function StacktLogo({ size = 42 }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 0.885)}
      viewBox="0 0 104 92"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M52 4 L100 22 L52 40 L4 22 Z"
        fill="none"
        stroke="#f0f0f2"
        strokeWidth="7"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M52 30 L100 48 L52 66 L4 48 Z"
        fill="none"
        stroke="#f0f0f2"
        strokeWidth="7"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M52 56 L100 74 L52 92 L4 74 Z"
        fill="none"
        stroke="#f0f0f2"
        strokeWidth="7"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ─── ClickUp submission ───────────────────────────────────────────────────────

async function submitToClickUp(email, apiKey, listId) {
  if (!apiKey || !listId) {
    // No credentials — log and resolve (for Framer preview testing)
    console.info("[HoldPage] ClickUp API key or List ID not set. Submission skipped.")
    return
  }
  const res = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `Waitlist: ${email}`,
      description: `Email: ${email}\nSubmitted: ${new Date().toLocaleString()}`,
      status: "to do",
    }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.err || `HTTP ${res.status}`)
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function HoldPage({
  headingLine1    = "Your value stack is",
  headingAccent   = "launching soon.",
  subText         = "Something extraordinary is being assembled.",
  eyebrow         = "Coming Soon",
  buttonText      = "Join the waitlist",
  successMessage  = "You're on the list. We'll be in touch.",
  footerText      = "© 2026 Stackt Digital",
  clickupListId   = "901614241656",
  clickupApiKey   = "",
}) {
  const canvasRef  = useRef(null)
  const rafRef     = useRef(null)
  const timersRef  = useRef([])
  const blockTimer = useRef(null)

  const [canvasOpacity, setCanvasOpacity] = useState(1)
  const [showContent,   setShowContent]   = useState(false)
  const [blocks,        setBlocks]        = useState(0)
  const [email,         setEmail]         = useState("")
  const [formStatus,    setFormStatus]    = useState("idle") // idle | loading | success | error

  // ── Inject styles ──
  useEffect(() => {
    injectFonts()
    injectStyles("fw-base", BASE_CSS)
    injectStyles("fw-hold", HOLD_CSS)
  }, [])

  // ── Canvas static noise ──
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const SCALE = 4 // draw at ¼ resolution — chunky static look
    const ctx   = canvas.getContext("2d")

    function resize() {
      canvas.width  = Math.ceil(canvas.offsetWidth  / SCALE)
      canvas.height = Math.ceil(canvas.offsetHeight / SCALE)
    }
    resize()

    let frame = 0
    function draw() {
      if (!canvas) return
      const w = canvas.width
      const h = canvas.height
      const imageData = ctx.createImageData(w, h)
      const d = imageData.data
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0
        d[i] = d[i + 1] = d[i + 2] = v
        d[i + 3] = 210
      }
      ctx.putImageData(imageData, 0, 0)
      frame++
      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    // After STATIC_HOLD_MS, fade canvas out
    const t1 = setTimeout(() => {
      cancelAnimationFrame(rafRef.current)
      setCanvasOpacity(0)

      // After fade, show content
      const t2 = setTimeout(() => setShowContent(true), REVEAL_MS)
      timersRef.current.push(t2)
    }, STATIC_HOLD_MS)

    timersRef.current.push(t1)

    return () => {
      cancelAnimationFrame(rafRef.current)
      timersRef.current.forEach(clearTimeout)
    }
  }, [])

  // ── Building block loader (starts when content reveals) ──
  useEffect(() => {
    if (!showContent) return

    let current = 0
    let pausing = false

    function tick() {
      if (pausing) return
      current++
      if (current > BLOCK_COUNT) {
        pausing = true
        setBlocks(BLOCK_COUNT)
        blockTimer.current = setTimeout(() => {
          current = 0
          pausing = false
          setBlocks(0)
          blockTimer.current = setTimeout(tick, BLOCK_STEP_MS)
        }, BLOCK_PAUSE_MS)
        return
      }
      setBlocks(current)
      blockTimer.current = setTimeout(tick, BLOCK_STEP_MS)
    }

    blockTimer.current = setTimeout(tick, BLOCK_STEP_MS)
    return () => clearTimeout(blockTimer.current)
  }, [showContent])

  // ── Form submit ──
  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim() || formStatus === "loading" || formStatus === "success") return
    setFormStatus("loading")
    try {
      await submitToClickUp(email.trim(), clickupApiKey, clickupListId)
      setFormStatus("success")
    } catch (err) {
      console.error("[HoldPage] ClickUp error:", err)
      setFormStatus("error")
    }
  }

  return (
    <div className="fp-hold" style={{ width: "100%" }}>
      {/* Scan-line texture */}
      <div className="fp-hold-scan" />

      {/* Static noise canvas */}
      <canvas
        ref={canvasRef}
        className="fp-hold-canvas"
        style={{ opacity: canvasOpacity, imageRendering: "pixelated" }}
      />

      {/* Main content */}
      <div className={`fp-hold-content${showContent ? " fp-hold-content--show" : ""}`}>

        {/* Logo */}
        <div className="fp-hold-logo">
          <StacktLogo size={44} />
        </div>

        {/* Eyebrow */}
        <p className="fp-hold-eyebrow">{eyebrow}</p>

        {/* Heading */}
        <h1 className="fp-hold-heading">
          {headingLine1} <em>{headingAccent}</em>
        </h1>

        {/* Sub */}
        <p className="fp-hold-sub">{subText}</p>

        {/* Building block loader */}
        <div className="fp-hold-blocks">
          {Array.from({ length: BLOCK_COUNT }).map((_, i) => (
            <div
              key={i}
              className={`fp-hold-block${i < blocks ? " fp-hold-block--on" : ""}`}
            />
          ))}
        </div>

        {/* Waitlist form */}
        {formStatus !== "success" ? (
          <form className="fp-hold-form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="fp-hold-input"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={formStatus === "loading"}
            />
            <button
              type="submit"
              className="fp-hold-btn"
              disabled={formStatus === "loading"}
            >
              {formStatus === "loading" ? "Adding…" : buttonText}
            </button>
          </form>
        ) : null}

        {/* Status messages */}
        <div className={`fp-hold-status fp-hold-status--${formStatus}`}>
          {formStatus === "success" && successMessage}
          {formStatus === "error"   && "Something went wrong — please try again."}
        </div>

      </div>

      {/* Footer */}
      <p className="fp-hold-footer">{footerText}</p>
    </div>
  )
}

// ─── Framer property controls ─────────────────────────────────────────────────

addPropertyControls(HoldPage, {
  headingLine1: {
    type: ControlType.String,
    title: "Heading",
    defaultValue: "Your value stack is",
  },
  headingAccent: {
    type: ControlType.String,
    title: "Heading Accent",
    defaultValue: "launching soon.",
  },
  subText: {
    type: ControlType.String,
    title: "Sub Text",
    defaultValue: "Something extraordinary is being assembled.",
  },
  eyebrow: {
    type: ControlType.String,
    title: "Eyebrow",
    defaultValue: "Coming Soon",
  },
  buttonText: {
    type: ControlType.String,
    title: "Button Text",
    defaultValue: "Join the waitlist",
  },
  successMessage: {
    type: ControlType.String,
    title: "Success Message",
    defaultValue: "You're on the list. We'll be in touch.",
  },
  footerText: {
    type: ControlType.String,
    title: "Footer Text",
    defaultValue: "© 2026 Stackt Digital",
  },
  clickupListId: {
    type: ControlType.String,
    title: "ClickUp List ID",
    defaultValue: "901614241656",
  },
  clickupApiKey: {
    type: ControlType.String,
    title: "ClickUp API Key",
    defaultValue: "",
  },
})
