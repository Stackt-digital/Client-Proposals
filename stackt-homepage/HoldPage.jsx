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

// Layout is designed for a 1440px wide Framer frame.
// Content occupies the centre ~560px; canvases fill immediately either side.
const HOLD_CSS = `
  .fp-hold {
    position: relative;
    width: 1440px;
    height: 100vh;
    overflow: hidden;
    background: var(--charcoal);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  /* Canvases pinned to bottom, placed right beside the centre content */
  .fp-hold-canvas {
    position: absolute;
    bottom: 0;
    z-index: 1;
    display: block;
  }
  /* Right edge of left canvas = centre − 290px */
  .fp-hold-canvas-left  { right: calc(50% + 290px); }
  /* Left edge of right canvas = centre + 290px */
  .fp-hold-canvas-right { left:  calc(50% + 290px); }

  /* Tight dark oval behind the text so blocks show clearly at the edges */
  .fp-hold-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse 42% 72% at 50% 50%,
      rgba(38,38,38,0.96) 28%,
      rgba(38,38,38,0.60) 52%,
      rgba(38,38,38,0.08) 72%,
      transparent 100%
    );
    z-index: 2;
    pointer-events: none;
  }

  /* Centred content */
  .fp-hold-content {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    z-index: 3;
    padding: 40px 24px;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 1s ease, transform 1s ease;
  }
  .fp-hold-content--show {
    opacity: 1;
    transform: translateY(0);
  }

  .fp-hold-logo { margin-bottom: 32px; }

  .fp-hold-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 10px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--sky);
    margin: 0 0 18px;
    display: block;
  }

  .fp-hold-heading {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
    font-size: clamp(28px, 3.6vw, 52px);
    color: var(--primary);
    line-height: 1.08;
    letter-spacing: -0.025em;
    margin: 0 0 14px;
    max-width: 560px;
  }
  .fp-hold-heading em { font-style: normal; color: var(--sky); }

  .fp-hold-sub {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--tertiary);
    margin: 0 0 40px;
    line-height: 1.9;
    max-width: 380px;
  }

  .fp-hold-form {
    display: flex;
    gap: 10px;
    width: 100%;
    max-width: 420px;
    margin-bottom: 14px;
  }
  .fp-hold-input {
    flex: 1;
    height: 48px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(65,65,73,0.9);
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
    border-color: rgba(187,234,249,0.5);
    background: rgba(255,255,255,0.07);
  }
  .fp-hold-btn {
    height: 48px;
    padding: 0 22px;
    background: var(--sky);
    border: none;
    border-radius: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
    font-size: 13px;
    color: var(--charcoal);
    white-space: nowrap;
    cursor: pointer;
    transition: opacity 0.2s ease, transform 0.15s ease;
  }
  .fp-hold-btn:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
  .fp-hold-btn:disabled { opacity: 0.45; }

  .fp-hold-status {
    min-height: 18px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
  }
  .fp-hold-status--success { color: var(--sky); }
  .fp-hold-status--error   { color: #ff7070; }
`

// ─── Tetris constants ─────────────────────────────────────────────────────────

// Each side canvas is 14 cols × 30px = 420px wide, filling the space between
// the centred text (~580px) and the 1440px frame edges.
const COLS   = 14
const CELL   = 30
const TICK_L = 160   // fast — left side
const TICK_R = 190   // slightly offset so sides feel independent

const PIECES = [
  { shape: [[1,1,1,1]],         color: "#BBEAF9" },
  { shape: [[1,1],[1,1]],       color: "#EBFCFF" },
  { shape: [[0,1,0],[1,1,1]],   color: "rgba(187,234,249,0.78)" },
  { shape: [[0,1,1],[1,1,0]],   color: "#a8e4f6" },
  { shape: [[1,1,0],[0,1,1]],   color: "rgba(235,252,255,0.65)" },
  { shape: [[1,0],[1,0],[1,1]], color: "rgba(187,234,249,0.55)" },
  { shape: [[0,1],[0,1],[1,1]], color: "#cdf1fb" },
]

const FLASH_COLOR = "rgba(240,240,242,0.95)"

// ─── Game logic ───────────────────────────────────────────────────────────────

function emptyBoard(rows) {
  return Array.from({ length: rows }, () => Array(COLS).fill(null))
}

function randomPiece() {
  const p = PIECES[Math.floor(Math.random() * PIECES.length)]
  return { shape: p.shape, color: p.color, x: Math.floor((COLS - p.shape[0].length) / 2), y: 0 }
}

function fits(board, piece, dx = 0, dy = 0) {
  const ROWS = board.length
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
  if (ctx.roundRect) { ctx.roundRect(x, y, w, h, 4) } else { ctx.rect(x, y, w, h) }
  ctx.fill()
  // Top-edge highlight
  ctx.fillStyle = "rgba(255,255,255,0.18)"
  ctx.fillRect(x + 2, y + 2, w - 4, 3)
  ctx.shadowBlur = 0
}

function renderCanvas(ctx, board, cur) {
  const ROWS = board.length
  const W = COLS * CELL
  const H = ROWS * CELL
  ctx.clearRect(0, 0, W, H)
  // Subtle grid
  ctx.strokeStyle = "rgba(255,255,255,0.025)"
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
}

// ─── Game instance ────────────────────────────────────────────────────────────

function startGame(canvas, tickMs) {
  const ROWS = Math.ceil(canvas.height / CELL)
  const ctx  = canvas.getContext("2d")
  let board  = emptyBoard(ROWS)
  let cur    = randomPiece()
  let busy   = false

  renderCanvas(ctx, board, cur)

  function spawnNext() {
    const next = randomPiece()
    if (!fits(board, next)) {
      // Board full — sweep top→bottom then restart
      busy = true
      let r = 0
      const sweep = setInterval(() => {
        if (r >= ROWS) {
          clearInterval(sweep)
          board = emptyBoard(ROWS)
          cur   = randomPiece()
          busy  = false
          renderCanvas(ctx, board, cur)
          return
        }
        board = board.map((row, i) =>
          i === r ? row.map(() => "rgba(187,234,249,0.12)") : row
        )
        renderCanvas(ctx, board, null)
        r++
      }, 28)
    } else {
      cur = next
      renderCanvas(ctx, board, cur)
    }
  }

  function tick() {
    if (busy) return
    if (fits(board, cur, 0, 1)) {
      cur = { ...cur, y: cur.y + 1 }
      renderCanvas(ctx, board, cur)
    } else {
      const locked   = lockPiece(board, cur)
      const complete = getCompleteRows(locked)
      if (complete.length) {
        busy = true
        board = locked.map((row, i) =>
          complete.includes(i) ? row.map(() => FLASH_COLOR) : row
        )
        renderCanvas(ctx, board, null)
        setTimeout(() => {
          board = removeRows(locked, complete)
          busy  = false
          spawnNext()
        }, 180)
      } else {
        board = locked
        spawnNext()
      }
    }
  }

  const interval = setInterval(tick, tickMs)
  return () => clearInterval(interval)
}

// ─── Stackt logo ─────────────────────────────────────────────────────────────

function StacktLogo({ size = 34 }) {
  return (
    <svg width={size} height={Math.round(size * 0.885)} viewBox="0 0 104 92" fill="none">
      <path d="M52 4 L100 22 L52 40 L4 22 Z"  fill="none" stroke="#f0f0f2" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M52 30 L100 48 L52 66 L4 48 Z"  fill="none" stroke="#f0f0f2" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M52 56 L100 74 L52 92 L4 74 Z"  fill="none" stroke="#f0f0f2" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  )
}

// ─── ClickUp ─────────────────────────────────────────────────────────────────

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
  clickupListId  = "901614241656",
  clickupApiKey  = "",
}) {
  const leftCanvasRef  = useRef(null)
  const rightCanvasRef = useRef(null)
  const containerRef   = useRef(null)

  const [showContent, setShowContent] = useState(false)
  const [email,       setEmail]       = useState("")
  const [formStatus,  setFormStatus]  = useState("idle")

  useEffect(() => {
    injectFonts()
    injectStyles("fw-base", BASE_CSS)
    injectStyles("fw-hold", HOLD_CSS)
    const t = setTimeout(() => setShowContent(true), 200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    const lCanvas   = leftCanvasRef.current
    const rCanvas   = rightCanvasRef.current
    if (!container || !lCanvas || !rCanvas) return

    const h = container.clientHeight || window.innerHeight
    const w = COLS * CELL   // 420px per side

    lCanvas.width  = w;  lCanvas.height = h
    rCanvas.width  = w;  rCanvas.height = h

    const stopLeft  = startGame(lCanvas, TICK_L)
    const stopRight = startGame(rCanvas, TICK_R)

    return () => { stopLeft(); stopRight() }
  }, [])

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
    <div className="fp-hold" ref={containerRef}>

      {/* Background Tetris — left and right, touching the content edges */}
      <canvas ref={leftCanvasRef}  className="fp-hold-canvas fp-hold-canvas-left" />
      <canvas ref={rightCanvasRef} className="fp-hold-canvas fp-hold-canvas-right" />

      {/* Tight dark oval over the text area */}
      <div className="fp-hold-overlay" />

      {/* Centred content */}
      <div className={`fp-hold-content${showContent ? " fp-hold-content--show" : ""}`}>
        <div className="fp-hold-logo"><StacktLogo size={34} /></div>

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
  clickupListId:  { type: ControlType.String, title: "ClickUp List ID", defaultValue: "901614241656" },
  clickupApiKey:  { type: ControlType.String, title: "ClickUp API Key", defaultValue: "" },
})
