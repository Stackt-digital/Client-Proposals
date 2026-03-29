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

  /* Row of tiles */
  .fp-lf-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    perspective: 900px;
  }

  /* Each tile — starts folded away, flips in on reveal */
  .fp-lf-tile {
    width: 176px;
    height: 76px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    transform-origin: center bottom;
    transform: rotateX(90deg);
    opacity: 0;
    transition: border-color 0.3s ease, background 0.3s ease;
  }

  /* Tile after flip-in completes */
  .fp-lf-tile--in {
    animation: fp-lf-flip 0.48s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  @keyframes fp-lf-flip {
    0%   { transform: rotateX(90deg);  opacity: 0; }
    60%  { opacity: 1; }
    100% { transform: rotateX(0deg);   opacity: 1; }
  }

  .fp-lf-tile--in:hover {
    border-color: rgba(187, 234, 249, 0.28);
    background: rgba(187, 234, 249, 0.04);
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
    transition: opacity 0.3s ease;
  }

  .fp-lf-tile--in:hover .fp-lf-logo {
    opacity: 0.85;
  }

  .fp-lf-placeholder {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.14);
    text-align: center;
    line-height: 1.6;
  }
`

const DEFAULT_LOGOS = Array(5).fill("")

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
      <div className="fp-lf-label-row">
        <span className="fp-lf-rule" />
        <span className="fp-lf-label">{label}</span>
        <span className="fp-lf-rule" />
      </div>

      <div className="fp-lf-row" ref={rowRef}>
        {logos.map((src, i) => (
          <div
            key={i}
            className={`fp-lf-tile${revealed.includes(i) ? " fp-lf-tile--in" : ""}`}
          >
            {src
              ? <img src={src} alt={`Partner ${i + 1}`} className="fp-lf-logo" />
              : <span className="fp-lf-placeholder">Partner<br />{i + 1}</span>
            }
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
