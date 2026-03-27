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

const SLOGAN_CSS = `
  .fp-slogan {
    position: relative;
    width: 100%;
    min-height: 65vh;
    background: var(--charcoal);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .fp-slogan-body {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 120px 80px;
  }

  .fp-slogan-text {
    font-size: clamp(48px, 7vw, 108px);
    line-height: 1.05;
    letter-spacing: -0.04em;
    margin: 0;
  }

  .fp-slogan-text .fp-slogan-bold {
    display: block;
    font-weight: 700;
    color: #ffffff;
  }

  .fp-slogan-text .fp-slogan-light {
    display: block;
    font-weight: 300;
    color: var(--primary);
  }

  .fp-slogan-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 80px;
    border-top: 1px solid var(--mid);
  }

  .fp-slogan-footer-left,
  .fp-slogan-footer-right {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--tertiary);
  }
`

export default function Slogan({
  line1 = "The value stack",
  line2 = "concept.",
}) {
  useEffect(() => {
    injectFonts()
    injectStyles("fw-base", BASE_CSS)
    injectStyles("fw-slogan", SLOGAN_CSS)
  }, [])

  return (
    <section className="fp-slogan" style={{ width: "100%", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="fp-slogan-body">
        <h2 className="fp-slogan-text">
          <span className="fp-slogan-bold">{line1}</span>
          <span className="fp-slogan-light">{line2}</span>
        </h2>
      </div>

      <footer className="fp-slogan-footer">
        <span className="fp-slogan-footer-left">Stackt</span>
        <span className="fp-slogan-footer-right">02</span>
      </footer>
    </section>
  )
}

addPropertyControls(Slogan, {
  line1: {
    type: ControlType.String,
    title: "Line 1",
    defaultValue: "The value stack",
  },
  line2: {
    type: ControlType.String,
    title: "Line 2",
    defaultValue: "concept.",
  },
})
