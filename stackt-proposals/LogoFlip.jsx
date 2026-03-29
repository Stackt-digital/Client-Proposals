import React, { useEffect, useRef, useState, useCallback } from "react"
import { addPropertyControls, ControlType } from "framer"

function injectFonts() {
  if (document.getElementById("fw-fonts")) return
  const l = document.createElement("link")
  l.id = "fw-fonts"
  l.rel = "stylesheet"
  l.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700&family=JetBrains+Mono:wght@200;400&display=swap"
  document.head.appendChild(l)
}

function injectStyles(id, css) {
  if (document.getElementById(id)) return
  const s = document.createElement("style")
  s.id = id
  s.textContent = css
  document.head.appendChild(s)
}

const BASE_CSS = `
  :root {
    --charcoal: #262626;
    --stone: #FAFAFA;
    --powder: #EBFCFF;
    --sky: #BBEAF9;
    --mid: #414149;
    --tertiary: #84848f;
    --secondary: #a9a9b1;
    --primary: #f0f0f2;
  }
`

const FLIP_CSS = `
  /* ── Section shell ── */
  .fp-lf {
    background: var(--charcoal);
    padding: 80px 80px 100px;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .fp-lf-label-row {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 64px;
  }

  .fp-lf-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--tertiary);
    white-space: nowrap;
  }

  .fp-lf-rule {
    height: 1px;
    flex: 1;
    background: var(--mid);
  }

  /* ── Flip display ── */
  .fp-lf-stage {
    display: flex;
    justify-content: center;
    align-items: center;
    perspective: 800px;
  }

  /* The card: fixed size, holds the two halves */
  .fp-lf-card {
    position: relative;
    width: 640px;
    height: 240px;
    cursor: default;
  }

  /* Both halves share these base styles */
  .fp-lf-half {
    position: absolute;
    left: 0;
    right: 0;
    height: 50%;
    overflow: hidden;
    background: #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fp-lf-half-top {
    top: 0;
    border-radius: 16px 16px 0 0;
    border-bottom: 1px solid #111;
    /* Image content wrapper shows top half of the logo */
    align-items: flex-end;
  }

  .fp-lf-half-bottom-static,
  .fp-lf-half-bottom-out,
  .fp-lf-half-bottom-in {
    bottom: 0;
    border-radius: 0 0 16px 16px;
    /* Image content wrapper shows bottom half of the logo */
    align-items: flex-start;
    transform-origin: center top;
  }

  /* The seam / shadow line between halves */
  .fp-lf-seam {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 2px;
    background: #0d0d0d;
    box-shadow: 0 1px 6px rgba(0,0,0,0.8);
    z-index: 20;
    pointer-events: none;
  }

  /* Image wrapper — doubles the half height so the logo appears
     centred across the full card (top wrapper anchored top:0,
     bottom wrapper anchored bottom:0) */
  .fp-lf-img-wrap-top {
    position: absolute;
    inset: 0;
    bottom: -100%;          /* extends to full card height downward */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fp-lf-img-wrap-bottom {
    position: absolute;
    inset: 0;
    top: -100%;             /* extends to full card height upward */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fp-lf-logo {
    max-width: 220px;
    max-height: 90px;
    object-fit: contain;
    filter: brightness(0) invert(1);
    opacity: 0.75;
    display: block;
    user-select: none;
    -webkit-user-drag: none;
  }

  .fp-lf-placeholder {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.18);
    text-align: center;
  }

  /* ── Flip animations ── */

  /* Bottom half flips DOWN (away) */
  .fp-lf-half-bottom-out {
    animation: fp-lf-out 0.28s cubic-bezier(0.4, 0, 1, 1) forwards;
    z-index: 10;
  }

  /* Bottom half flips UP (in) — starts from behind, pivots to flat */
  .fp-lf-half-bottom-in {
    animation: fp-lf-in 0.28s cubic-bezier(0, 0, 0.6, 1) forwards;
    animation-delay: 0.28s;
    opacity: 0;
    z-index: 9;
  }

  @keyframes fp-lf-out {
    0%   { transform: rotateX(0deg);  box-shadow: none; }
    100% { transform: rotateX(-90deg); box-shadow: 0 -8px 20px rgba(0,0,0,0.6); }
  }

  @keyframes fp-lf-in {
    0%   { opacity: 1; transform: rotateX(90deg); }
    100% { opacity: 1; transform: rotateX(0deg); }
  }

  /* ── Dot indicators ── */
  .fp-lf-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 32px;
  }

  .fp-lf-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--mid);
    cursor: pointer;
    transition: background 0.3s ease, transform 0.3s ease;
  }

  .fp-lf-dot--active {
    background: var(--sky);
    transform: scale(1.3);
  }
`

const DEFAULT_LOGOS = Array(5).fill("")

// ── Logo content helper ──────────────────────────────────────────────────────
function HalfContent({ src, index, wrapClass }) {
  return (
    <div className={wrapClass}>
      {src
        ? <img src={src} alt={`Partner ${index + 1}`} className="fp-lf-logo" />
        : <span className="fp-lf-placeholder">Partner {index + 1}</span>
      }
    </div>
  )
}

// ── Component ────────────────────────────────────────────────────────────────
export default function LogoFlip({
  label = "Trusted by",
  logos = DEFAULT_LOGOS,
}) {
  // `idx`     — logo fully shown right now
  // `nextIdx` — logo about to flip in
  // `phase`   — "idle" | "flip"
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState("idle")
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef(null)
  const phaseTimerRef = useRef(null)

  useEffect(() => {
    injectFonts()
    injectStyles("fw-base", BASE_CSS)
    injectStyles("fw-logoflip", FLIP_CSS)
  }, [])

  const n = Math.max(logos.length, 1)
  const nextIdx = (idx + 1) % n

  const doFlip = useCallback(() => {
    if (n <= 1) return
    setPhase("flip")
    // After both animations complete (0.28s out + 0.28s in = 0.56s),
    // advance idx and return to idle
    phaseTimerRef.current = setTimeout(() => {
      setIdx(i => (i + 1) % n)
      setPhase("idle")
    }, 620)
  }, [n])

  useEffect(() => {
    if (paused) {
      clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(doFlip, 3400)
    return () => clearInterval(intervalRef.current)
  }, [paused, doFlip])

  // Cleanup timers on unmount
  useEffect(() => () => {
    clearInterval(intervalRef.current)
    clearTimeout(phaseTimerRef.current)
  }, [])

  const currentSrc = logos[idx] || ""
  const incomingSrc = logos[nextIdx] || ""
  const isFlipping = phase === "flip"

  return (
    <section
      className="fp-lf"
      style={{ width: "100%" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Label */}
      <div className="fp-lf-label-row">
        <span className="fp-lf-rule" />
        <span className="fp-lf-label">{label}</span>
        <span className="fp-lf-rule" />
      </div>

      {/* Flip display */}
      <div className="fp-lf-stage">
        <div className="fp-lf-card">

          {/* ── Top half ── always shows the incoming logo during a flip,
              current logo otherwise. This is the key split-flap trick:
              the top snaps to the new value instantly while the bottom
              plays catch-up. */}
          <div className="fp-lf-half fp-lf-half-top">
            <HalfContent
              src={isFlipping ? incomingSrc : currentSrc}
              index={isFlipping ? nextIdx : idx}
              wrapClass="fp-lf-img-wrap-top"
            />
          </div>

          {/* ── Bottom half (static / idle) ── visible only when not flipping */}
          {!isFlipping && (
            <div className="fp-lf-half fp-lf-half-bottom-static">
              <HalfContent src={currentSrc} index={idx} wrapClass="fp-lf-img-wrap-bottom" />
            </div>
          )}

          {/* ── Bottom half OUT ── plays the flip-down animation */}
          {isFlipping && (
            <div className="fp-lf-half fp-lf-half-bottom-out">
              <HalfContent src={currentSrc} index={idx} wrapClass="fp-lf-img-wrap-bottom" />
            </div>
          )}

          {/* ── Bottom half IN ── plays the flip-up animation (delayed) */}
          {isFlipping && (
            <div className="fp-lf-half fp-lf-half-bottom-in">
              <HalfContent src={incomingSrc} index={nextIdx} wrapClass="fp-lf-img-wrap-bottom" />
            </div>
          )}

          {/* Seam line between halves */}
          <div className="fp-lf-seam" />
        </div>
      </div>

      {/* Dot indicators */}
      {n > 1 && (
        <div className="fp-lf-dots">
          {Array.from({ length: n }, (_, i) => (
            <span
              key={i}
              className={`fp-lf-dot${i === idx ? " fp-lf-dot--active" : ""}`}
              onClick={() => {
                clearInterval(intervalRef.current)
                clearTimeout(phaseTimerRef.current)
                setIdx(i)
                setPhase("idle")
              }}
            />
          ))}
        </div>
      )}
    </section>
  )
}

addPropertyControls(LogoFlip, {
  label: {
    type: ControlType.String,
    title: "Label",
    defaultValue: "Trusted by",
  },
  logos: {
    type: ControlType.Array,
    title: "Logos",
    maxCount: 20,
    control: { type: ControlType.Image },
  },
})
