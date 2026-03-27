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

const HOW_CSS = `
  .fp-how {
    background: var(--charcoal);
    padding: 130px 80px 160px;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .fp-how-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 12px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--tertiary);
    margin-bottom: 56px;
    display: block;
  }

  .fp-how-heading {
    font-size: clamp(32px, 4vw, 56px);
    font-weight: 300;
    line-height: 1.2;
    letter-spacing: -0.03em;
    color: var(--primary);
    max-width: 860px;
    margin: 0;
  }

  .fp-how-heading strong {
    font-weight: 700;
    color: #ffffff;
  }

  .fp-how-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
    background: var(--mid);
    border-radius: 16px;
    overflow: hidden;
    margin-top: 72px;
  }

  .fp-how-card {
    background: var(--charcoal);
    padding: 48px 44px 56px;
    transition: background 0.2s ease;
  }

  .fp-how-card:hover {
    background: #2b2b2b;
  }

  .fp-how-card-num {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 12px;
    letter-spacing: 0.15em;
    color: var(--sky);
    margin-bottom: 24px;
    display: block;
  }

  .fp-how-card-title {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 400;
    font-size: 12px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--primary);
    margin-bottom: 20px;
    display: block;
  }

  .fp-how-card-body {
    font-size: 19px;
    font-weight: 300;
    line-height: 1.65;
    color: var(--secondary);
    margin: 0;
  }

  .fp-how-rhythm {
    background: rgba(187, 234, 249, 0.07);
    border: 1px solid rgba(187, 234, 249, 0.18);
    border-radius: 16px;
    padding: 52px 64px;
    margin-top: 72px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 80px;
    align-items: center;
  }

  .fp-how-rhythm-left {
    text-align: left;
  }

  .fp-how-rhythm-num {
    font-size: clamp(80px, 9vw, 112px);
    font-weight: 300;
    letter-spacing: -0.04em;
    color: var(--sky);
    line-height: 1;
    display: block;
  }

  .fp-how-rhythm-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 12px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--tertiary);
    margin-top: 10px;
    display: block;
  }

  .fp-how-rhythm-body {
    font-size: 21px;
    font-weight: 300;
    line-height: 1.65;
    color: var(--secondary);
    margin: 0;
  }

  .fp-how-rhythm-body strong {
    font-weight: 600;
    color: var(--primary);
  }

  .fp-how-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    margin-top: 80px;
    border-top: 1px solid var(--mid);
  }

  .fp-how-footer-left,
  .fp-how-footer-right {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--tertiary);
  }
`

export default function HowWeWork() {
  useEffect(() => {
    injectFonts()
    injectStyles("fw-base", BASE_CSS)
    injectStyles("fw-how", HOW_CSS)
  }, [])

  return (
    <section className="fp-how" style={{ width: "100%", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <span className="fp-how-label">How we work</span>

      <h2 className="fp-how-heading">
        We only do the work that{" "}
        <strong>actually moves the needle.</strong>
      </h2>

      <div className="fp-how-grid">
        <div className="fp-how-card">
          <span className="fp-how-card-num">01</span>
          <span className="fp-how-card-title">We get under the hood</span>
          <p className="fp-how-card-body">
            No work starts without strategy. We learn your business, your tone,
            your team and what keeps you up at night. The better we know you,
            the better the work gets. And we are always paying attention.
          </p>
        </div>

        <div className="fp-how-card">
          <span className="fp-how-card-num">02</span>
          <span className="fp-how-card-title">We build to compound</span>
          <p className="fp-how-card-body">
            Every system, every process, every workflow we create is designed to
            do more over time with less effort. We bake efficiency in from day
            one because we think your budget should go toward results, not admin.
          </p>
        </div>

        <div className="fp-how-card">
          <span className="fp-how-card-num">03</span>
          <span className="fp-how-card-title">We bring in the right people</span>
          <p className="fp-how-card-body">
            Some work needs a specialist. When that moment comes we do not
            improvise. We bring in our Stackt Partners, verified experts who
            know their craft inside out, briefed and managed entirely by us. You
            get the best person for the job without another relationship to
            manage.
          </p>
        </div>

        <div className="fp-how-card">
          <span className="fp-how-card-num">04</span>
          <span className="fp-how-card-title">We reset and back ourselves</span>
          <p className="fp-how-card-body">
            Every quarter we sit down together, call it like it is and set the
            targets for the next block. Then we chase them down. No cruising. No
            set and forget. Just an honest partnership that keeps raising the
            bar.
          </p>
        </div>
      </div>

      <div className="fp-how-rhythm">
        <div className="fp-how-rhythm-left">
          <span className="fp-how-rhythm-num">90</span>
          <span className="fp-how-rhythm-label">Day rhythm</span>
        </div>
        <p className="fp-how-rhythm-body">
          Every 90 days we reset. We review what landed, what did not and where
          the opportunity is. We set stretch targets for the next quarter and we
          go after them together.{" "}
          <strong>
            This is not a set and forget retainer. It is a partnership that
            raises the bar every single quarter.
          </strong>{" "}
          No complacency. No coast mode. Just compound growth, built on honest
          results.
        </p>
      </div>

      <footer className="fp-how-footer">
        <span className="fp-how-footer-left">Stackt</span>
        <span className="fp-how-footer-right">05</span>
      </footer>
    </section>
  )
}

addPropertyControls(HowWeWork, {})
