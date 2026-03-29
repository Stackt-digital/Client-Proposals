import React, { useEffect, useRef } from "react"
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

const CS_CSS = `
  .fp-cs {
    background: var(--charcoal);
    padding: 130px 80px 120px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    position: relative;
  }

  /* ── Header ── */
  .fp-cs-header {
    margin-bottom: 64px;
  }

  .fp-cs-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--sky);
    display: block;
    margin-bottom: 28px;
  }

  .fp-cs-client-row {
    display: flex;
    align-items: center;
    gap: 32px;
  }

  .fp-cs-client-name {
    font-size: clamp(36px, 5vw, 72px);
    font-weight: 700;
    letter-spacing: -0.035em;
    line-height: 1;
    color: #ffffff;
    white-space: nowrap;
    margin: 0;
  }

  .fp-cs-client-rule {
    height: 1px;
    flex: 1;
    background: var(--mid);
  }

  /* ── Three column body ── */
  .fp-cs-body {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 56px;
    margin-bottom: 80px;
  }

  /* Left col */
  .fp-cs-quote-mark {
    font-size: 80px;
    line-height: 0.6;
    color: var(--sky);
    opacity: 0.3;
    font-family: Georgia, serif;
    margin-bottom: 20px;
    display: block;
  }

  .fp-cs-quote {
    font-size: 17px;
    font-weight: 300;
    line-height: 1.75;
    color: var(--secondary);
    font-style: italic;
    margin: 0 0 28px;
  }

  .fp-cs-attribution {
    font-size: 14px;
    font-weight: 700;
    color: var(--primary);
    line-height: 1.5;
    margin: 0;
  }

  /* Middle col */
  .fp-cs-body-text {
    font-size: 16px;
    font-weight: 300;
    line-height: 1.75;
    color: var(--secondary);
    margin: 0 0 24px;
  }

  .fp-cs-body-text:last-of-type {
    margin-bottom: 0;
  }

  /* Right col */
  .fp-cs-result-text {
    font-size: 16px;
    font-weight: 300;
    line-height: 1.75;
    color: var(--secondary);
    margin: 0 0 24px;
  }

  .fp-cs-footer-note {
    font-size: 13px;
    font-weight: 600;
    color: var(--primary);
    line-height: 1.55;
    margin: 0;
    margin-top: auto;
  }

  .fp-cs-right-col {
    display: flex;
    flex-direction: column;
  }

  /* ── Metrics strip ── */
  .fp-cs-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 2px;
    background: var(--mid);
    border-radius: 20px;
    overflow: hidden;
  }

  .fp-cs-metric-card {
    background: #1e1e1e;
    padding: 44px 36px 48px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    overflow: hidden;
  }

  .fp-cs-metric-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(to right, var(--sky), transparent);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .fp-cs-metric-card:hover::before {
    opacity: 1;
  }

  .fp-cs-metric-number-wrap {
    display: flex;
    align-items: baseline;
    gap: 2px;
    margin-bottom: 16px;
    line-height: 1;
  }

  .fp-cs-metric-prefix,
  .fp-cs-metric-suffix {
    font-size: clamp(24px, 3vw, 36px);
    font-weight: 300;
    color: var(--sky);
    letter-spacing: -0.02em;
  }

  .fp-cs-metric-value {
    font-size: clamp(52px, 7vw, 88px);
    font-weight: 700;
    letter-spacing: -0.04em;
    color: #ffffff;
    line-height: 1;
    display: inline-block;
    min-width: 2ch;
  }

  .fp-cs-metric-bar-wrap {
    width: 100%;
    height: 2px;
    background: rgba(255,255,255,0.06);
    border-radius: 2px;
    margin-bottom: 16px;
    overflow: hidden;
  }

  .fp-cs-metric-bar {
    height: 100%;
    background: linear-gradient(to right, var(--sky), rgba(187,234,249,0.3));
    border-radius: 2px;
    width: 0%;
    transition: width 2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .fp-cs-metric-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--tertiary);
    line-height: 1.5;
  }

  /* Section footer */
  .fp-cs-section-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    margin-top: 72px;
    border-top: 1px solid var(--mid);
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--tertiary);
  }

  @media (max-width: 960px) {
    .fp-cs { padding: 80px 40px; }
    .fp-cs-body { grid-template-columns: 1fr; gap: 40px; }
    .fp-cs-metrics { grid-template-columns: 1fr 1fr; }
  }
`

// ── Count-up animation ────────────────────────────────────────────────────────
function animateCount(el, barEl, target, decimals, maxVal, duration = 2200) {
  const start = performance.now()
  const run = (now) => {
    const elapsed = now - start
    const raw = Math.min(elapsed / duration, 1)
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - raw, 3)
    const current = eased * target
    el.textContent = decimals > 0
      ? current.toFixed(decimals)
      : Math.round(current).toString()
    if (barEl) {
      const pct = Math.min((current / maxVal) * 100, 100)
      barEl.style.width = `${pct}%`
    }
    if (raw < 1) requestAnimationFrame(run)
    else {
      el.textContent = decimals > 0 ? target.toFixed(decimals) : target.toString()
      if (barEl) barEl.style.width = `${Math.min((target / maxVal) * 100, 100)}%`
    }
  }
  requestAnimationFrame(run)
}

// ── Defaults ──────────────────────────────────────────────────────────────────
const DEFAULT_METRICS = [
  { prefix: "", value: "43", suffix: "%", label: "lift in total transaction volume", barMax: "100" },
  { prefix: "+", value: "107", suffix: "%", label: "revenue growth in 12 months", barMax: "200" },
  { prefix: "", value: "4.5", suffix: "★", label: "Trust Pilot brand rating", barMax: "5" },
]

export default function CaseStudy({
  label = "Case Study",
  sectionNumber = "—",
  clientName = "Mode Rentals",
  quote = "They were the first agency to give us a strategy that genuinely delivered. We saw results from day one, and twelve months later our performance is still improving month after month.",
  attribution = "Hannah Thorp, Marketing Manager, Mode Rentals",
  bodyText1 = "When we came on board, previous agencies had delivered incomplete strategies resulting in an investment in content that wasn't delivering results.",
  bodyText2 = "Over the past 12 months, the business has achieved significant growth across every major marketing metric.",
  resultText1 = "These results reflect the impact of a refined full-funnel strategy spanning paid media, search, social and customer nurture.",
  resultText2 = "The result is a business now operating with greater scale, efficiency and commercial momentum — and a clear plan to drive consistent growth.",
  footerNote = "*Presented performance metrics are current as of the date of this proposal.",
  metrics = DEFAULT_METRICS,
}) {
  const rootRef = useRef(null)

  useEffect(() => {
    injectFonts()
    injectStyles("fw-base", BASE_CSS)
    injectStyles("fw-cs", CS_CSS)
  }, [])

  // Trigger count-up when metric cards scroll into view
  useEffect(() => {
    if (!rootRef.current) return
    const cards = rootRef.current.querySelectorAll("[data-cs-metric]")
    if (!cards.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target.querySelector("[data-cs-count]")
          const barEl = entry.target.querySelector("[data-cs-bar]")
          if (!el) return
          const target = parseFloat(el.dataset.csCount)
          const decimals = el.dataset.csDecimals ? parseInt(el.dataset.csDecimals) : 0
          const maxVal = barEl ? parseFloat(barEl.dataset.csBarMax || target) : target
          animateCount(el, barEl, target, decimals, maxVal)
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.4 }
    )

    cards.forEach((c) => observer.observe(c))
    return () => observer.disconnect()
  }, [metrics])

  return (
    <section className="fp-cs" style={{ width: "100%" }} ref={rootRef}>

      {/* Header */}
      <div className="fp-cs-header">
        <span className="fp-cs-label">{label}</span>
        <div className="fp-cs-client-row">
          <h2 className="fp-cs-client-name">{clientName}</h2>
          <div className="fp-cs-client-rule" />
        </div>
      </div>

      {/* Three column body */}
      <div className="fp-cs-body">

        {/* Left — quote */}
        <div>
          <span className="fp-cs-quote-mark">&ldquo;</span>
          <p className="fp-cs-quote">{quote}</p>
          <p className="fp-cs-attribution">{attribution}</p>
        </div>

        {/* Middle — context */}
        <div>
          <p className="fp-cs-body-text">{bodyText1}</p>
          <p className="fp-cs-body-text">{bodyText2}</p>
        </div>

        {/* Right — results */}
        <div className="fp-cs-right-col">
          <p className="fp-cs-result-text">{resultText1}</p>
          <p className="fp-cs-result-text">{resultText2}</p>
          <p className="fp-cs-footer-note">{footerNote}</p>
        </div>

      </div>

      {/* Animated metric cards */}
      <div className="fp-cs-metrics">
        {metrics.map((m, i) => {
          const numVal = parseFloat(m.value || "0")
          const decimals = (m.value || "").includes(".")
            ? (m.value.split(".")[1] || "").length
            : 0
          const maxVal = parseFloat(m.barMax || numVal)

          return (
            <div key={i} className="fp-cs-metric-card" data-cs-metric>
              <div className="fp-cs-metric-number-wrap">
                {m.prefix && <span className="fp-cs-metric-prefix">{m.prefix}</span>}
                <span
                  className="fp-cs-metric-value"
                  data-cs-count={numVal}
                  data-cs-decimals={decimals}
                >
                  0
                </span>
                {m.suffix && <span className="fp-cs-metric-suffix">{m.suffix}</span>}
              </div>
              <div className="fp-cs-metric-bar-wrap">
                <div
                  className="fp-cs-metric-bar"
                  data-cs-bar
                  data-cs-bar-max={maxVal}
                />
              </div>
              <span className="fp-cs-metric-label">{m.label}</span>
            </div>
          )
        })}
      </div>

      {/* Section footer */}
      <div className="fp-cs-section-footer">
        <span>Stackt</span>
        <span>{sectionNumber}</span>
      </div>

    </section>
  )
}

addPropertyControls(CaseStudy, {
  label: {
    type: ControlType.String,
    title: "Section Label",
    defaultValue: "Case Study",
  },
  sectionNumber: {
    type: ControlType.String,
    title: "Section Number",
    defaultValue: "—",
  },
  clientName: {
    type: ControlType.String,
    title: "Client Name",
    defaultValue: "Mode Rentals",
  },
  quote: {
    type: ControlType.String,
    title: "Quote",
    defaultValue: "They were the first agency to give us a strategy that genuinely delivered. We saw results from day one, and twelve months later our performance is still improving month after month.",
  },
  attribution: {
    type: ControlType.String,
    title: "Attribution",
    defaultValue: "Hannah Thorp, Marketing Manager, Mode Rentals",
  },
  bodyText1: {
    type: ControlType.String,
    title: "Body Text 1",
    defaultValue: "When we came on board, previous agencies had delivered incomplete strategies resulting in an investment in content that wasn't delivering results.",
  },
  bodyText2: {
    type: ControlType.String,
    title: "Body Text 2",
    defaultValue: "Over the past 12 months, the business has achieved significant growth across every major marketing metric.",
  },
  resultText1: {
    type: ControlType.String,
    title: "Result Text 1",
    defaultValue: "These results reflect the impact of a refined full-funnel strategy spanning paid media, search, social and customer nurture.",
  },
  resultText2: {
    type: ControlType.String,
    title: "Result Text 2",
    defaultValue: "The result is a business now operating with greater scale, efficiency and commercial momentum — and a clear plan to drive consistent growth.",
  },
  footerNote: {
    type: ControlType.String,
    title: "Footer Note",
    defaultValue: "*Presented performance metrics are current as of the date of this proposal.",
  },
  metrics: {
    type: ControlType.Array,
    title: "Metrics",
    control: {
      type: ControlType.Object,
      controls: {
        prefix: {
          type: ControlType.String,
          title: "Prefix",
          defaultValue: "",
        },
        value: {
          type: ControlType.String,
          title: "Value",
          defaultValue: "43",
        },
        suffix: {
          type: ControlType.String,
          title: "Suffix",
          defaultValue: "%",
        },
        label: {
          type: ControlType.String,
          title: "Label",
          defaultValue: "lift in total transaction volume",
        },
        barMax: {
          type: ControlType.String,
          title: "Bar Max",
          defaultValue: "100",
        },
      },
    },
    defaultValue: DEFAULT_METRICS,
  },
})
