import React, { useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"

function injectFonts() {
  if (document.getElementById("fw-fonts")) return
  const link = document.createElement("link")
  link.id = "fw-fonts"
  link.rel = "stylesheet"
  link.href =
    "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700&family=JetBrains+Mono:wght@200;400&display=swap"
  document.head.appendChild(link)
}

function injectStyles(id, css) {
  if (document.getElementById(id)) return
  const style = document.createElement("style")
  style.id = id
  style.textContent = css
  document.head.appendChild(style)
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

const COVER_CSS = `
  .fp-cover {
    position: relative;
    width: 100%;
    height: 100vh;
    min-height: 600px;
    background: var(--charcoal);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .fp-cover-photo {
    position: absolute;
    inset: 0;
    right: 0;
    left: 40%;
    background-size: cover;
    background-position: center;
    filter: grayscale(100%) brightness(0.45);
    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 30%);
    mask-image: linear-gradient(to right, transparent 0%, black 30%);
  }

  .fp-cover-body {
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0 64px 48px;
  }

  .fp-cover-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--tertiary);
    margin-bottom: 20px;
  }

  .fp-cover-headline {
    font-size: clamp(48px, 7vw, 88px);
    font-weight: 700;
    line-height: 1.0;
    letter-spacing: -0.03em;
    color: var(--primary);
    margin: 0 0 28px;
  }

  .fp-cover-headline-accent {
    color: var(--sky);
  }

  .fp-cover-sub {
    font-size: 17px;
    font-weight: 300;
    color: var(--secondary);
    max-width: 480px;
    line-height: 1.75;
  }

  .fp-cover-footer {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 64px;
    border-top: 1px solid rgba(240, 240, 242, 0.1);
  }

  .fp-cover-footer-left,
  .fp-cover-footer-right {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--tertiary);
  }

  .fp-scroll-indicator {
    position: absolute;
    bottom: 28px;
    right: 64px;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .fp-scroll-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--tertiary);
    writing-mode: vertical-rl;
  }

  .fp-scroll-line {
    width: 1px;
    height: 48px;
    background: rgba(240, 240, 242, 0.12);
    position: relative;
    overflow: hidden;
  }

  .fp-scroll-line::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--sky);
    animation: fp-scroll-travel 1.8s ease-in-out infinite;
  }

  @keyframes fp-scroll-travel {
    0%   { transform: translateY(-100%); }
    50%  { transform: translateY(0%); }
    100% { transform: translateY(100%); }
  }
`

export default function Cover({
  eyebrow = "Your value stack — Furnware x Stackt — 2025",
  clientName = "Furnware",
  subText = "A tailored marketing stack designed to close the gap between where your team is today and where the business needs to go.",
  backgroundImage,
}) {
  useEffect(() => {
    injectFonts()
    injectStyles("fw-base", BASE_CSS)
    injectStyles("fw-cover", COVER_CSS)
  }, [])

  const defaultBg =
    "url('https://framer.com/projects/Memorable-Storm--m9CMVzGcopmMMNHdF48l-24aQI?node=lMJGJg4EQ')"
  const bgStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})` }
    : { backgroundImage: defaultBg }

  return (
    <section className="fp-cover" style={{ width: "100%", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="fp-cover-photo" style={bgStyle} />

      <div className="fp-cover-body">
        <p className="fp-cover-eyebrow">
          {eyebrow}
        </p>
        <h1 className="fp-cover-headline">
          Built for{" "}
          <span className="fp-cover-headline-accent">{clientName}.</span>
        </h1>
        <p className="fp-cover-sub">
          {subText}
        </p>
      </div>

      <footer className="fp-cover-footer">
        <span className="fp-cover-footer-left">Stackt — Confidential</span>
        <span className="fp-cover-footer-right">01</span>
      </footer>

      <div className="fp-scroll-indicator">
        <span className="fp-scroll-label">Scroll to explore</span>
        <div className="fp-scroll-line" />
      </div>
    </section>
  )
}

addPropertyControls(Cover, {
  eyebrow: {
    type: ControlType.String,
    title: "Eyebrow",
    defaultValue: "Your value stack — Furnware x Stackt — 2025",
  },
  clientName: {
    type: ControlType.String,
    title: "Client Name",
    defaultValue: "Furnware",
  },
  subText: {
    type: ControlType.String,
    title: "Sub Text",
    defaultValue: "A tailored marketing stack designed to close the gap between where your team is today and where the business needs to go.",
  },
  backgroundImage: {
    type: ControlType.Image,
    title: "Background Image",
  },
})
