import React, { useEffect, useRef, useState } from "react"
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

  /* ── Row of tiles ── */
  .fp-lf-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    perspective: 800px;
  }

  /* ── Each tile ── */
  .fp-lf-tile {
    position: relative;
    width: 176px;
    height: 76px;
    flex-shrink: 0;
  }

  /* Both halves share base styles */
  .fp-lf-half {
    position: absolute;
    left: 0;
    right: 0;
    height: 50%;
    overflow: hidden;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.35s ease, background 0.35s ease;
  }

  .fp-lf-tile:hover .fp-lf-half {
    border-color: rgba(187, 234, 249, 0.28);
    background: rgba(187, 234, 249, 0.04);
  }

  .fp-lf-half-top {
    top: 0;
    border-radius: 12px 12px 0 0;
    border-bottom: none;
    align-items: flex-end;
  }

  .fp-lf-half-bottom {
    bottom: 0;
    border-radius: 0 0 12px 12px;
    border-top: none;
    align-items: flex-start;
    transform-origin: center top;
    transform: rotateX(-90deg);
  }

  /* When revealed, the bottom half flips in */
  .fp-lf-half-bottom--in {
    animation: fp-lf-flip-in 0.42s cubic-bezier(0, 0, 0.4, 1) forwards;
  }

  @keyframes fp-lf-flip-in {
    0%   { transform: rotateX(-90deg); box-shadow: 0 -6px 16px rgba(0,0,0,0.5); }
    100% { transform: rotateX(0deg);   box-shadow: none; }
  }

  /* Seam line between halves */
  .fp-lf-seam {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    background: #0d0d0d;
    z-index: 10;
    pointer-events: none;
  }

  /* Image wrappers — double the half height so logo appears
     centred across the full tile (top anchored top:0,
     bottom anchored bottom:0) */
  .fp-lf-img-wrap-top {
    position: absolute;
    inset: 0;
    bottom: -100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fp-lf-img-wrap-bottom {
    position: absolute;
    inset: 0;
    top: -100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fp-lf-logo {
    max-width: 116px;
    max-height: 44px;
    object-fit: contain;
    filter: brightness(0) invert(1);
    opacity: 0.45;
    display: block;
    user-select: none;
    -webkit-user-drag: none;
    transition: opacity 0.35s ease;
  }

  .fp-lf-tile:hover .fp-lf-logo {
    opacity: 0.85;
  }

  .fp-lf-placeholder {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.12);
    text-align: center;
    padding: 0 12px;
    line-height: 1.5;
  }
`

const DEFAULT_LOGOS = Array(5).fill("")

function HalfContent({ src, index, wrapClass }) {
  return (
    <div className={wrapClass}>
      {src
        ? <img src={src} alt={`Partner ${index + 1}`} className="fp-lf-logo" />
        : <span className="fp-lf-placeholder">Partner<br />{index + 1}</span>
      }
    </div>
  )
}

export default function LogoFlip({
  label = "Trusted by",
  logos = DEFAULT_LOGOS,
}) {
  const rowRef = useRef(null)
  const timersRef = useRef([])
  const [revealed, setRevealed] = useState([])

  useEffect(() => {
    injectFonts()
    injectStyles("fw-base", BASE_CSS)
    injectStyles("fw-logoflip", FLIP_CSS)
  }, [])

  // Stagger each tile's bottom-half flip when row scrolls into view
  useEffect(() => {
    if (!rowRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        logos.forEach((_, i) => {
          const t = setTimeout(() => {
            setRevealed(prev => [...prev, i])
          }, i * 130)
          timersRef.current.push(t)
        })
        observer.disconnect()
      },
      { threshold: 0.25 }
    )

    observer.observe(rowRef.current)
    return () => {
      observer.disconnect()
      timersRef.current.forEach(clearTimeout)
    }
  }, [logos])

  return (
    <section className="fp-lf" style={{ width: "100%" }}>
      {/* Label */}
      <div className="fp-lf-label-row">
        <span className="fp-lf-rule" />
        <span className="fp-lf-label">{label}</span>
        <span className="fp-lf-rule" />
      </div>

      {/* Tiles */}
      <div className="fp-lf-row" ref={rowRef}>
        {logos.map((src, i) => (
          <div key={i} className="fp-lf-tile">

            {/* Top half — instantly visible, shows top of logo */}
            <div className="fp-lf-half fp-lf-half-top">
              <HalfContent src={src} index={i} wrapClass="fp-lf-img-wrap-top" />
            </div>

            {/* Bottom half — flips in with staggered delay */}
            <div className={`fp-lf-half fp-lf-half-bottom${revealed.includes(i) ? " fp-lf-half-bottom--in" : ""}`}>
              <HalfContent src={src} index={i} wrapClass="fp-lf-img-wrap-bottom" />
            </div>

            {/* Seam */}
            <div className="fp-lf-seam" />
          </div>
        ))}
      </div>
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
