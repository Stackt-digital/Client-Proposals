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

const CTA_CSS = `
  .fp-cta {
    background: var(--charcoal);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;
    padding: 130px 80px;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .fp-cta-orb {
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 80vw;
    height: 80vw;
    border-radius: 50%;
    background: radial-gradient(circle at 50% 50%, rgba(235, 252, 255, 0.05) 0%, transparent 65%);
    pointer-events: none;
    z-index: 1;
  }

  .fp-cta-bg-photo {
    position: absolute;
    right: 0;
    top: 0;
    width: 42%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%);
    opacity: 0.15;
    -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,0.8) 0%, transparent 100%);
    mask-image: linear-gradient(to left, rgba(0,0,0,0.8) 0%, transparent 100%);
    z-index: 1;
    display: block;
    background: var(--mid);
  }

  .fp-cta-content {
    position: relative;
    z-index: 2;
  }

  .fp-cta-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 12px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--tertiary);
    margin-bottom: 56px;
    display: block;
  }

  .fp-cta-headline {
    font-size: clamp(52px, 8vw, 120px);
    font-weight: 300;
    line-height: 0.97;
    letter-spacing: -0.04em;
    color: var(--primary);
    margin: 0 0 52px;
  }

  .fp-cta-headline-accent {
    font-style: normal;
    color: var(--sky);
  }

  .fp-cta-body {
    font-size: 21px;
    font-weight: 300;
    line-height: 1.65;
    color: var(--secondary);
    max-width: 560px;
    margin: 0 0 52px;
  }

  .fp-cta-buttons {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .fp-cta-btn-primary {
    background: var(--sky);
    color: var(--charcoal);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
    font-size: 14px;
    padding: 17px 32px;
    border-radius: 6px;
    text-decoration: none;
    transition: background 0.2s ease, transform 0.2s ease;
    display: inline-block;
  }

  .fp-cta-btn-primary:hover {
    background: #ffffff;
    transform: translateY(-1px);
  }

  .fp-cta-btn-secondary {
    background: transparent;
    color: var(--secondary);
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 17px 0;
    text-decoration: none;
    transition: color 0.2s ease;
    display: inline-block;
  }

  .fp-cta-btn-secondary:hover {
    color: var(--primary);
  }

  .fp-cta-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    margin-top: 80px;
    border-top: 1px solid var(--mid);
  }

  .fp-cta-footer-left,
  .fp-cta-footer-right {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--tertiary);
  }
`

const DEFAULT_BG_PHOTO =
  "https://framer.com/projects/Memorable-Storm--m9CMVzGcopmMMNHdF48l-24aQI?node=gLvhdB1UD"

export default function CTA({
  contactEmail = "lauren@stackt.digital",
  backgroundImage,
}) {
  useEffect(() => {
    injectFonts()
    injectStyles("fw-base", BASE_CSS)
    injectStyles("fw-cta", CTA_CSS)
  }, [])

  return (
    <section className="fp-cta" style={{ width: "100%", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="fp-cta-orb" />
      <img
        className="fp-cta-bg-photo"
        src={backgroundImage || DEFAULT_BG_PHOTO}
        alt=""
      />

      <div className="fp-cta-content">
        <span className="fp-cta-label">Next steps</span>

        <h2 className="fp-cta-headline">
          90 days from
          <br />
          now, something
          <br />
          will exist that
          <br />
          <span className="fp-cta-headline-accent">did not today.</span>
        </h2>

        <p className="fp-cta-body">
          Let us get the right tier locked in, confirm the scope and kick off
          your first 90-day block. The sooner we start, the sooner it compounds.
        </p>

        <div className="fp-cta-buttons">
          <a href={`mailto:${contactEmail}`} className="fp-cta-btn-primary">
            Let us get started
          </a>
          <a href={`mailto:${contactEmail}`} className="fp-cta-btn-secondary">
            Ask a question
          </a>
        </div>

        <footer className="fp-cta-footer">
          <span className="fp-cta-footer-left">Stackt — Confidential</span>
          <span className="fp-cta-footer-right">10</span>
        </footer>
      </div>
    </section>
  )
}

addPropertyControls(CTA, {
  contactEmail: {
    type: ControlType.String,
    title: "Contact Email",
    defaultValue: "lauren@stackt.digital",
  },
  backgroundImage: {
    type: ControlType.Image,
    title: "Background Image",
  },
})
