import React, { useEffect } from "react"
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

const SLIDER_CSS = `
  .fp-logos {
    background: var(--charcoal);
    padding: 80px 0 100px;
    overflow: hidden;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .fp-logos-label-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    margin-bottom: 64px;
    padding: 0 80px;
  }

  .fp-logos-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--tertiary);
    white-space: nowrap;
  }

  .fp-logos-rule {
    height: 1px;
    flex: 1;
    background: var(--mid);
  }

  /* 3D perspective stage */
  .fp-logos-stage {
    position: relative;
    perspective: 1200px;
  }

  .fp-logos-tilt {
    transform: rotateX(8deg) scale(0.97);
    transform-origin: center bottom;
    transform-style: preserve-3d;
  }

  /* Edge fade masks */
  .fp-logos-fade {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 240px;
    z-index: 2;
    pointer-events: none;
  }

  .fp-logos-fade-l {
    left: 0;
    background: linear-gradient(to right, var(--charcoal) 0%, transparent 100%);
  }

  .fp-logos-fade-r {
    right: 0;
    background: linear-gradient(to left, var(--charcoal) 0%, transparent 100%);
  }

  /* Rows */
  .fp-logos-row {
    display: flex;
    gap: 14px;
    margin-bottom: 14px;
    width: max-content;
    will-change: transform;
  }

  .fp-logos-row:last-child {
    margin-bottom: 0;
  }

  .fp-logos-row-a { animation: fp-logo-left  44s linear infinite; }
  .fp-logos-row-b { animation: fp-logo-right 56s linear infinite; }
  .fp-logos-row-c { animation: fp-logo-left  36s linear infinite; }

  /* Pause on hover */
  .fp-logos-stage:hover .fp-logos-row {
    animation-play-state: paused;
  }

  @keyframes fp-logo-left {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  @keyframes fp-logo-right {
    0%   { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }

  /* Logo tiles */
  .fp-logo-tile {
    flex-shrink: 0;
    width: 176px;
    height: 76px;
    background: rgba(255, 255, 255, 0.025);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.35s ease, background 0.35s ease, box-shadow 0.35s ease;
    overflow: hidden;
    cursor: default;
  }

  .fp-logo-tile:hover {
    border-color: rgba(187, 234, 249, 0.28);
    background: rgba(187, 234, 249, 0.04);
    box-shadow: 0 0 24px rgba(187, 234, 249, 0.06);
  }

  .fp-logo-tile img {
    max-width: 116px;
    max-height: 44px;
    object-fit: contain;
    filter: brightness(0) invert(1);
    opacity: 0.45;
    transition: opacity 0.35s ease;
  }

  .fp-logo-tile:hover img {
    opacity: 0.85;
  }

  .fp-logo-placeholder {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.12);
    text-align: center;
    padding: 0 12px;
    line-height: 1.5;
  }
`

const DEFAULT_LOGOS = Array(5).fill("")

function LogoTile({ src, index }) {
  return (
    <div className="fp-logo-tile">
      {src ? (
        <img src={src} alt={`Partner ${index + 1}`} />
      ) : (
        <span className="fp-logo-placeholder">Partner<br />Logo</span>
      )}
    </div>
  )
}

export default function LogoSlider({
  label = "Proud partners of",
  logos = DEFAULT_LOGOS,
}) {
  useEffect(() => {
    injectFonts()
    injectStyles("fw-base", BASE_CSS)
    injectStyles("fw-logos", SLIDER_CSS)
  }, [])

  // Always pad to 12 slots so rows never run dry, then split into 3 rows of 4
  const PAD = Array(12).fill("")
  const padded = [...logos, ...PAD].slice(0, 12)
  const rows = [
    padded.slice(0, 4),
    padded.slice(4, 8),
    padded.slice(8, 12),
  ]

  // Duplicate each row 4× for a seamless loop on any viewport width
  const loop = (arr) => [...arr, ...arr, ...arr, ...arr]

  const rowClasses = ["fp-logos-row fp-logos-row-a", "fp-logos-row fp-logos-row-b", "fp-logos-row fp-logos-row-c"]

  return (
    <section className="fp-logos" style={{ width: "100%" }}>
      <div className="fp-logos-label-row">
        <span className="fp-logos-rule" />
        <span className="fp-logos-label">{label}</span>
        <span className="fp-logos-rule" />
      </div>

      <div className="fp-logos-stage">
        <div className="fp-logos-fade fp-logos-fade-l" />
        <div className="fp-logos-fade fp-logos-fade-r" />

        <div className="fp-logos-tilt">
          {rows.map((row, ri) => (
            <div key={ri} className={rowClasses[ri]}>
              {loop(row).map((src, i) => (
                <LogoTile key={i} src={src} index={logos.indexOf(src)} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

addPropertyControls(LogoSlider, {
  label: {
    type: ControlType.String,
    title: "Label",
    defaultValue: "Proud partners of",
  },
  logos: {
    type: ControlType.Array,
    title: "Logos",
    maxCount: 20,
    control: { type: ControlType.Image },
  },
})
