import React, { useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"

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

const BASE_CSS = `
  :root {
    --charcoal: #262626; --stone: #FAFAFA; --powder: #EBFCFF;
    --sky: #BBEAF9; --mid: #414149; --tertiary: #84848f;
    --secondary: #a9a9b1; --primary: #f0f0f2;
  }
`

const CL_CSS = `
  .fp-cl {
    background: var(--charcoal);
    padding: 100px 80px 90px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    overflow: hidden;
  }

  /* ── Header ── */
  .fp-cl-header {
    margin-bottom: 72px;
  }

  .fp-cl-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 12px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--tertiary);
    margin-bottom: 24px;
    display: block;
  }

  .fp-cl-heading {
    font-size: clamp(32px, 4.5vw, 64px);
    font-weight: 300;
    line-height: 1.0;
    letter-spacing: -0.03em;
    color: var(--primary);
    margin: 0;
    max-width: 640px;
  }
  .fp-cl-heading strong { font-weight: 700; }

  /* ── Marquee track ── */
  .fp-cl-track-wrap {
    position: relative;
    /* Edge fade */
    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
    mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
  }

  .fp-cl-track {
    display: flex;
    align-items: center;
    gap: 0;
    /* Width wide enough to loop seamlessly — set by JS on resize */
    width: max-content;
    animation: fp-cl-scroll 28s linear infinite;
  }

  .fp-cl-track:hover {
    animation-play-state: paused;
  }

  @keyframes fp-cl-scroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  /* Each logo tile */
  .fp-cl-tile {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 56px;
    height: 88px;
    flex-shrink: 0;
    border-right: 1px solid var(--mid);
    transition: opacity 0.3s ease;
  }
  .fp-cl-tile:first-child { border-left: 1px solid var(--mid); }

  .fp-cl-tile:hover {
    opacity: 1 !important;
  }

  .fp-cl-logo {
    max-width: 120px;
    max-height: 40px;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
    /* Force white, match brand charcoal-on-dark treatment */
    filter: brightness(0) invert(1);
    opacity: 0.4;
    transition: opacity 0.3s ease;
    user-select: none;
    -webkit-user-drag: none;
  }

  .fp-cl-tile:hover .fp-cl-logo {
    opacity: 0.85;
  }

  /* Placeholder when no logo uploaded */
  .fp-cl-placeholder {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.12);
    text-align: center;
    white-space: nowrap;
  }

  /* ── Footer ── */
  .fp-cl-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    margin-top: 72px;
    border-top: 1px solid var(--mid);
  }
  .fp-cl-footer-left,
  .fp-cl-footer-right {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--tertiary);
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .fp-cl { padding: 72px 48px 64px; }
    .fp-cl-header { margin-bottom: 56px; }
    .fp-cl-tile { padding: 0 40px; height: 76px; }
    .fp-cl-logo { max-width: 100px; max-height: 34px; }
  }

  @media (max-width: 600px) {
    .fp-cl { padding: 56px 0 48px; }
    .fp-cl-header { padding: 0 24px; margin-bottom: 44px; }
    .fp-cl-footer { margin: 48px 24px 0; }
    .fp-cl-tile { padding: 0 32px; height: 68px; }
    .fp-cl-logo { max-width: 88px; max-height: 30px; }
  }
`

const DEFAULT_LOGOS = Array(6).fill("")

export default function ClientLogos({
  label          = "Trusted by",
  headingRegular = "Teams who trust us with",
  headingBold    = "their business.",
  logos          = DEFAULT_LOGOS,
  speed          = "normal",
  footerLeft     = "Stackt — Confidential",
  pageNumber     = "03",
}) {
  useEffect(() => {
    injectFonts()
    injectStyles("fw-base", BASE_CSS)
    injectStyles("fw-cl", CL_CSS)
  }, [])

  // Map speed prop → animation duration
  const duration = speed === "slow" ? "40s" : speed === "fast" ? "16s" : "28s"

  // Duplicate logos so the marquee loops seamlessly
  const items = logos.length ? logos : DEFAULT_LOGOS
  const doubled = [...items, ...items]

  return (
    <section className="fp-cl" style={{ width: "100%" }}>

      <div className="fp-cl-header">
        <span className="fp-cl-label">{label}</span>
        <h2 className="fp-cl-heading">
          {headingRegular} <strong>{headingBold}</strong>
        </h2>
      </div>

      <div className="fp-cl-track-wrap">
        <div
          className="fp-cl-track"
          style={{ animationDuration: duration }}
        >
          {doubled.map((src, i) => (
            <div key={i} className="fp-cl-tile">
              {src
                ? <img src={src} alt={`Client ${(i % items.length) + 1}`} className="fp-cl-logo" />
                : <span className="fp-cl-placeholder">Client {(i % items.length) + 1}</span>
              }
            </div>
          ))}
        </div>
      </div>

      <footer className="fp-cl-footer">
        <span className="fp-cl-footer-left">{footerLeft}</span>
        <span className="fp-cl-footer-right">{pageNumber}</span>
      </footer>
    </section>
  )
}

addPropertyControls(ClientLogos, {
  label: {
    type: ControlType.String,
    title: "Label",
    defaultValue: "Trusted by",
  },
  headingRegular: {
    type: ControlType.String,
    title: "Heading (light)",
    defaultValue: "Teams who trust us with",
  },
  headingBold: {
    type: ControlType.String,
    title: "Heading (bold)",
    defaultValue: "their business.",
  },
  logos: {
    type: ControlType.Array,
    title: "Logos",
    maxCount: 20,
    control: { type: ControlType.Image },
  },
  speed: {
    type: ControlType.Enum,
    title: "Scroll Speed",
    options: ["slow", "normal", "fast"],
    optionTitles: ["Slow", "Normal", "Fast"],
    defaultValue: "normal",
  },
  footerLeft: {
    type: ControlType.String,
    title: "Footer Text",
    defaultValue: "Stackt — Confidential",
  },
  pageNumber: {
    type: ControlType.String,
    title: "Page Number",
    defaultValue: "03",
  },
})
