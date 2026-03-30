import React, { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function injectFonts() {
  if (document.getElementById("fw-fonts")) return
  const l = document.createElement("link")
  l.id = "fw-fonts"; l.rel = "stylesheet"
  l.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700&family=JetBrains+Mono:wght@200;400&display=swap"
  document.head.appendChild(l)
}

function injectStyles(id, css) {
  if (document.getElementById(id)) return
  const s = document.createElement("style")
  s.id = id; s.textContent = css
  document.head.appendChild(s)
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const BASE_CSS = `
  :root {
    --charcoal: #262626; --stone: #FAFAFA; --powder: #EBFCFF;
    --sky: #BBEAF9; --mid: #414149; --tertiary: #84848f;
    --secondary: #a9a9b1; --primary: #f0f0f2;
  }
`

const HOLD_CSS = `
  .fp-hold {
    display: flex;
    width: 100%;
    min-height: 100vh;
    background: var(--charcoal);
    font-family: 'Plus Jakarta Sans', sans-serif;
    overflow: hidden;
  }

  /* ── Left: game panel ── */
  .fp-hold-game {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding: 60px 40px 60px 64px;
    position: relative;
  }
  .fp-hold-game-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 9px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--mid);
    margin-top: 18px;
    text-align: center;
  }

  /* ── Vertical divider ── */
  .fp-hold-divider {
    width: 1px;
    background: linear-gradient(to bottom, transparent, var(--mid) 20%, var(--mid) 80%, transparent);
    align-self: stretch;
    margin: 60px 0;
    flex-shrink: 0;
  }

  /* ── Right: content panel ── */
  .fp-hold-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 80px 60px 56px;
    opacity: 0;
    transform: translateX(12px);
    transition: opacity 0.9s ease, transform 0.9s ease;
  }
  .fp-hold-content--show {
    opacity: 1;
    transform: translateX(0);
  }

  .fp-hold-logo { margin-bottom: 44px; }

  .fp-hold-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 10px;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: var(--sky);
    margin: 0 0 20px;
    display: block;
  }

  .fp-hold-heading {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
    font-size: clamp(28px, 3.8vw, 54px);
    color: var(--primary);
    line-height: 1.08;
    letter-spacing: -0.025em;
    margin: 0 0 18px;
  }
  .fp-hold-heading em {
    font-style: normal;
    color: var(--sky);
  }

  .fp-hold-sub {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 12px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--tertiary);
    margin: 0 0 48px;
    line-height: 1.9;
    max-width: 400px;
  }

  /* ── Form ── */
  .fp-hold-form {
    display: flex;
    gap: 10px;
    max-width: 440px;
    margin-bottom: 16px;
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
    padding: 0 22px;
    background: var(--sky);
    border: none;
    border-radius: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
    font-size: 13px;
    color: var(--charcoal);
    white-space: nowrap;
    transition: opacity 0.2s ease, transform 0.15s ease;
    cursor: pointer;
  }
  .fp-hold-btn:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
  .fp-hold-btn:disabled { opacity: 0.45; }

  .fp-hold-status {
    min-height: 20px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    margin-bottom: 40px;
  }
  .fp-hold-status--success { color: var(--sky); }
  .fp-hold-status--error   { color: #ff7070; }

  .fp-hold-footer {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.14);
    margin-top: auto;
    padding-top: 40px;
  }
`

// ─── Tetris constants ─────────────────────────────────────────────────────────

const COLS    = 8
const ROWS    = 20
const CELL    = 28
const TICK_MS = 540

const PIECES = [
  { shape: [[1,1,1,1]],         color: "#BBEAF9" },
  { shape: [[1,1],[1,1]],       color: "#EBFCFF" },
  { shape: [[0,1,0],[1,1,1]],   color: "rgba(187,234,249,0.8)" },
  { shape: [[0,1,1],[1,1,0]],   color: "#a8e4f6" },
  { shape: [[1,1,0],[0,1,1]],   color: "rgba(235,252,255,0.7)" },
  { shape: [[1,0],[1,0],[1,1]], color: "rgba(187,234,249,0.6)" },
  { shape: [[0,1],[0,1],[1,1]], color: "#cdf1fb" },
]

const FLASH_COLOR = "rgba(240,240,242,0.9)"

// ─── Game logic ───────────────────────────────────────────────────────────────

function emptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null))
}

function randomPiece() {
  const p = PIECES[Math.floor(Math.random() * PIECES.length)]
  return { shape: p.shape, color: p.color, x: Math.floor((COLS - p.shape[0].length) / 2), y: 0 }
}

function fits(board, piece, dx = 0, dy = 0) {
  return piece.shape.every((row, r) =>
    row.every((cell, c) => {
      if (!cell) return true
      const nx = piece.x + c + dx
      const ny = piece.y + r + dy
      return nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS && !board[ny][nx]
    })
  )
}

function lockPiece(board, piece) {
  const b = board.map(r => [...r])
  piece.shape.forEach((row, r) =>
    row.forEach((cell, c) => { if (cell) b[piece.y + r][piece.x + c] = piece.color })
  )
  return b
}

function getCompleteRows(board) {
  return board.reduce((acc, row, i) => (row.every(Boolean) ? [...acc, i] : acc), [])
}

function removeRows(board, indices) {
  const kept  = board.filter((_, i) => !indices.includes(i))
  const empty = Array.from({ length: indices.length }, () => Array(COLS).fill(null))
  return [...empty, ...kept]
}

// ─── Canvas rendering ─────────────────────────────────────────────────────────

function drawCell(ctx, col, row, color, glow = false) {
  const x = col * CELL + 2
  const y = row * CELL + 2
  const w = CELL - 4
  const h = CELL - 4

  if (glow) { ctx.shadowColor = "#BBEAF9"; ctx.shadowBlur = 14 }
  ctx.fillStyle = color
  ctx.beginPath()
  if (ctx.roundRect) { ctx.roundRect(x, y, w, h, 3) } else { ctx.rect(x, y, w, h) }
  ctx.fill()
  // Top-edge highlight
  ctx.fillStyle = "rgba(255,255,255,0.18)"
  ctx.fillRect(x + 2, y + 2, w - 4, 2)
  ctx.shadowBlur = 0
}

function renderCanvas(ctx, board, cur) {
  const W = COLS * CELL
  const H = ROWS * CELL

  ctx.fillStyle = "#1b1b1b"
  ctx.fillRect(0, 0, W, H)

  // Subtle grid
  ctx.strokeStyle = "rgba(255,255,255,0.03)"
  ctx.lineWidth = 1
  for (let c = 0; c <= COLS; c++) {
    ctx.beginPath(); ctx.moveTo(c * CELL, 0); ctx.lineTo(c * CELL, H); ctx.stroke()
  }
  for (let r = 0; r <= ROWS; r++) {
    ctx.beginPath(); ctx.moveTo(0, r * CELL); ctx.lineTo(W, r * CELL); ctx.stroke()
  }

  board.forEach((row, r) =>
    row.forEach((color, c) => { if (color) drawCell(ctx, c, r, color) })
  )

  if (cur) {
    cur.shape.forEach((row, r) =>
      row.forEach((cell, c) => { if (cell) drawCell(ctx, cur.x + c, cur.y + r, cur.color, true) })
    )
  }

  // Subtle bottom fade
  const grad = ctx.createLinearGradient(0, H - CELL * 2, 0, H)
  grad.addColorStop(0, "transparent")
  grad.addColorStop(1, "rgba(27,27,27,0.5)")
  ctx.fillStyle = grad
  ctx.fillRect(0, H - CELL * 2, W, CELL * 2)
}

// ─── Stackt logo ─────────────────────────────────────────────────────────────

function StacktLogo({ size = 38 }) {
  return (
    <svg width={size} height={Math.round(size * 0.885)} viewBox="0 0 104 92" fill="none">
      <path d="M52 4 L100 22 L52 40 L4 22 Z"  fill="none" stroke="#f0f0f2" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M52 30 L100 48 L52 66 L4 48 Z"  fill="none" stroke="#f0f0f2" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M52 56 L100 74 L52 92 L4 74 Z"  fill="none" stroke="#f0f0f2" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  )
}

// ─── ClickUp submission ───────────────────────────────────────────────────────

async function submitToClickUp(email, apiKey, listId) {
  if (!apiKey || !listId) {
    console.info("[HoldPage] ClickUp credentials not set — submission skipped.")
    return
  }
  const res = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
    method: "POST",
    headers: { Authorization: apiKey, "Content-Type": "application/json" },
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
  headingLine1   = "Your value stack is",
  headingAccent  = "launching soon.",
  subText        = "Every great stack starts with the right foundations.",
  eyebrow        = "Coming Soon",
  buttonText     = "Join the waitlist",
  successMessage = "You're on the list. We'll be in touch.",
  footerText     = "© 2026 Stackt Digital",
  clickupListId  = "901614241656",
  clickupApiKey  = "",
}) {
  const canvasRef = useRef(null)
  const boardRef  = useRef(emptyBoard())
  const curRef    = useRef(null)
  const tickRef   = useRef(null)
  const busyRef   = useRef(false)

  const [showContent, setShowContent] = useState(false)
  const [email,       setEmail]       = useState("")
  const [formStatus,  setFormStatus]  = useState("idle")

  // Inject styles + reveal content
  useEffect(() => {
    injectFonts()
    injectStyles("fw-base", BASE_CSS)
    injectStyles("fw-hold", HOLD_CSS)
    const t = setTimeout(() => setShowContent(true), 300)
    return () => clearTimeout(t)
  }, [])

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width  = COLS * CELL
    canvas.height = ROWS * CELL
    const ctx = canvas.getContext("2d")

    curRef.current = randomPiece()
    renderCanvas(ctx, boardRef.current, curRef.current)

    function spawnNext() {
      const next = randomPiece()
      if (!fits(boardRef.current, next)) {
        // Board full — sweep clear from bottom to top, then restart
        busyRef.current = true
        let r = ROWS - 1
        const sweep = setInterval(() => {
          if (r < 0) {
            clearInterval(sweep)
            boardRef.current = emptyBoard()
            curRef.current   = randomPiece()
            busyRef.current  = false
            renderCanvas(ctx, boardRef.current, curRef.current)
            return
          }
          boardRef.current = boardRef.current.map((row, i) =>
            i === r ? row.map(() => "rgba(187,234,249,0.18)") : row
          )
          renderCanvas(ctx, boardRef.current, null)
          r--
        }, 38)
      } else {
        curRef.current = next
        renderCanvas(ctx, boardRef.current, curRef.current)
      }
    }

    function tick() {
      if (busyRef.current) return
      const cur = curRef.current
      if (!cur) return

      if (fits(boardRef.current, cur, 0, 1)) {
        curRef.current = { ...cur, y: cur.y + 1 }
        renderCanvas(ctx, boardRef.current, curRef.current)
      } else {
        const locked   = lockPiece(boardRef.current, cur)
        const complete = getCompleteRows(locked)

        if (complete.length) {
          busyRef.current = true
          // Flash completed rows
          boardRef.current = locked.map((row, i) =>
            complete.includes(i) ? row.map(() => FLASH_COLOR) : row
          )
          renderCanvas(ctx, boardRef.current, null)
          setTimeout(() => {
            boardRef.current = removeRows(locked, complete)
            busyRef.current  = false
            spawnNext()
          }, 220)
        } else {
          boardRef.current = locked
          spawnNext()
        }
      }
    }

    tickRef.current = setInterval(tick, TICK_MS)
    return () => clearInterval(tickRef.current)
  }, [])

  // Form submit
  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim() || formStatus === "loading" || formStatus === "success") return
    setFormStatus("loading")
    try {
      await submitToClickUp(email.trim(), clickupApiKey, clickupListId)
      setFormStatus("success")
    } catch (err) {
      console.error("[HoldPage]", err)
      setFormStatus("error")
    }
  }

  return (
    <div className="fp-hold" style={{ width: "100%" }}>

      {/* Left: Tetris */}
      <div className="fp-hold-game">
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            borderRadius: 6,
            boxShadow: "0 0 60px rgba(187,234,249,0.07), inset 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        />
        <p className="fp-hold-game-label">Building your stack</p>
      </div>

      {/* Divider */}
      <div className="fp-hold-divider" />

      {/* Right: content */}
      <div className={`fp-hold-content${showContent ? " fp-hold-content--show" : ""}`}>

        <div className="fp-hold-logo">
          <StacktLogo size={38} />
        </div>

        <span className="fp-hold-eyebrow">{eyebrow}</span>

        <h1 className="fp-hold-heading">
          {headingLine1}&nbsp;<em>{headingAccent}</em>
        </h1>

        <p className="fp-hold-sub">{subText}</p>

        {formStatus !== "success" && (
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
            <button type="submit" className="fp-hold-btn" disabled={formStatus === "loading"}>
              {formStatus === "loading" ? "Adding…" : buttonText}
            </button>
          </form>
        )}

        <div className={`fp-hold-status fp-hold-status--${formStatus}`}>
          {formStatus === "success" && successMessage}
          {formStatus === "error"   && "Something went wrong — please try again."}
        </div>

        <p className="fp-hold-footer">{footerText}</p>
      </div>
    </div>
  )
}

// ─── Framer controls ─────────────────────────────────────────────────────────

addPropertyControls(HoldPage, {
  headingLine1:   { type: ControlType.String, title: "Heading",         defaultValue: "Your value stack is" },
  headingAccent:  { type: ControlType.String, title: "Heading Accent",  defaultValue: "launching soon." },
  subText:        { type: ControlType.String, title: "Sub Text",        defaultValue: "Every great stack starts with the right foundations." },
  eyebrow:        { type: ControlType.String, title: "Eyebrow",         defaultValue: "Coming Soon" },
  buttonText:     { type: ControlType.String, title: "Button Text",     defaultValue: "Join the waitlist" },
  successMessage: { type: ControlType.String, title: "Success Message", defaultValue: "You're on the list. We'll be in touch." },
  footerText:     { type: ControlType.String, title: "Footer",          defaultValue: "© 2026 Stackt Digital" },
  clickupListId:  { type: ControlType.String, title: "ClickUp List ID", defaultValue: "901614241656" },
  clickupApiKey:  { type: ControlType.String, title: "ClickUp API Key", defaultValue: "" },
})
