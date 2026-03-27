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

const PRICING_CSS = `
  .fp-pricing {
    background: var(--charcoal);
    padding: 130px 80px 100px;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .fp-pricing-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 12px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--tertiary);
    margin-bottom: 56px;
    display: block;
  }

  .fp-pricing-heading {
    font-size: clamp(32px, 4vw, 56px);
    font-weight: 300;
    line-height: 1.2;
    letter-spacing: -0.03em;
    color: var(--primary);
    max-width: 840px;
    margin: 0 0 72px;
  }

  .fp-pricing-heading strong {
    font-weight: 700;
    color: #ffffff;
  }

  .fp-pricing-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    align-items: end;
    margin-bottom: 56px;
  }

  .fp-tier {
    border-radius: 20px;
    padding: 44px 40px 48px;
    transition: transform 0.25s ease;
  }

  .fp-tier:hover {
    transform: translateY(-4px);
  }

  .fp-tier-1 {
    background: var(--stone);
    color: var(--charcoal);
    margin-bottom: 0;
  }

  .fp-tier-2 {
    background: var(--charcoal);
    border: 1px solid var(--mid);
    margin-bottom: 32px;
  }

  .fp-tier-3 {
    background: rgba(0, 0, 0, 0.45);
    border: 1px solid rgba(187, 234, 249, 0.25);
    margin-bottom: 64px;
  }

  .fp-tier-selected {
    outline: 2px solid var(--sky);
    outline-offset: 2px;
    box-shadow: 0 0 0 4px rgba(187, 234, 249, 0.1);
  }

  .fp-tier-name {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    margin-bottom: 24px;
    display: block;
  }

  .fp-tier-1 .fp-tier-name { color: rgba(38, 38, 38, 0.38); }
  .fp-tier-2 .fp-tier-name { color: var(--tertiary); }
  .fp-tier-3 .fp-tier-name { color: var(--sky); }

  .fp-tier-price {
    font-size: clamp(44px, 5vw, 68px);
    font-weight: 300;
    letter-spacing: -0.04em;
    line-height: 1;
    margin-bottom: 6px;
    display: block;
  }

  .fp-tier-1 .fp-tier-price { color: var(--charcoal); }
  .fp-tier-2 .fp-tier-price { color: #ffffff; }
  .fp-tier-3 .fp-tier-price { color: #ffffff; }

  .fp-tier-billing {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.1em;
    margin-bottom: 32px;
    display: block;
  }

  .fp-tier-1 .fp-tier-billing { color: rgba(38, 38, 38, 0.38); }
  .fp-tier-2 .fp-tier-billing { color: var(--tertiary); }
  .fp-tier-3 .fp-tier-billing { color: var(--tertiary); }

  .fp-tier-desc {
    font-size: 17px;
    font-weight: 300;
    line-height: 1.6;
    margin-bottom: 32px;
    padding-bottom: 32px;
  }

  .fp-tier-1 .fp-tier-desc {
    color: rgba(38, 38, 38, 0.65);
    border-bottom: 1px solid rgba(38, 38, 38, 0.1);
  }

  .fp-tier-2 .fp-tier-desc {
    color: var(--secondary);
    border-bottom: 1px solid var(--mid);
  }

  .fp-tier-3 .fp-tier-desc {
    color: var(--secondary);
    border-bottom: 1px solid rgba(187, 234, 249, 0.15);
  }

  .fp-tier-includes {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-bottom: 18px;
    display: block;
  }

  .fp-tier-1 .fp-tier-includes { color: rgba(38, 38, 38, 0.32); }
  .fp-tier-2 .fp-tier-includes { color: var(--tertiary); }
  .fp-tier-3 .fp-tier-includes { color: var(--tertiary); }

  .fp-tier-features {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 11px;
  }

  .fp-tier-feature {
    font-size: 14px;
    font-weight: 300;
    padding-left: 18px;
    position: relative;
    line-height: 1.5;
  }

  .fp-tier-feature::before {
    content: '';
    position: absolute;
    left: 0;
    top: 8px;
    width: 7px;
    height: 1px;
  }

  .fp-tier-1 .fp-tier-feature { color: rgba(38, 38, 38, 0.7); }
  .fp-tier-1 .fp-tier-feature::before { background: rgba(38, 38, 38, 0.3); }

  .fp-tier-2 .fp-tier-feature { color: var(--secondary); }
  .fp-tier-2 .fp-tier-feature::before { background: var(--tertiary); }

  .fp-tier-3 .fp-tier-feature { color: var(--secondary); }
  .fp-tier-3 .fp-tier-feature::before { background: var(--sky); }

  .fp-pricing-note {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 12px;
    letter-spacing: 0.1em;
    color: var(--tertiary);
    text-align: center;
    border-top: 1px solid var(--mid);
    padding-top: 36px;
    line-height: 1.7;
  }

  .fp-pricing-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    margin-top: 64px;
    border-top: 1px solid var(--mid);
  }

  .fp-pricing-footer-left,
  .fp-pricing-footer-right {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--tertiary);
  }
`

export default function Pricing({ selectedTier = "Amplify" }) {
  useEffect(() => {
    injectFonts()
    injectStyles("fw-base", BASE_CSS)
    injectStyles("fw-pricing", PRICING_CSS)
  }, [])

  const tiers = [
    {
      cls: "fp-tier-1",
      name: "Ignite",
      price: "$4,000",
      desc: "The entry stack. Show up consistently, communicate well and start building smarter systems from the ground up.",
      delay: "0.1s",
      features: [
        "Performance marketing Google and Meta AU and NZ",
        "Up to 2 EDMs per month",
        "Basic Dynamics automation setup",
        "GA4 and GTM ownership",
        "Organic social management",
        "Monthly performance reporting",
        "Quarterly 90-day review",
      ],
    },
    {
      cls: "fp-tier-2",
      name: "Amplify",
      price: "$6,800",
      desc: "The full growth stack. More channels, more automation, and the AI systems that keep compounding value over time.",
      delay: "0.2s",
      features: [
        "Everything in Ignite plus",
        "Google and Meta across AU NZ and ROW",
        "Furnware and Mindfull ad accounts",
        "Up to 3 EDMs per month",
        "Dynamics workflow automation",
        "AI enablement and content systems",
        "Digital design support",
        "Bi-weekly performance review",
        "Partner activation as scoped",
      ],
    },
    {
      cls: "fp-tier-3",
      name: "Surge",
      price: "$8,000",
      desc: "The complete stack. Every channel, every system, every specialist. Built for businesses that are ready to move fast and compound hard.",
      delay: "0.3s",
      features: [
        "Everything in Amplify plus",
        "Full AI workflow and automation suite",
        "Creator management and UGC",
        "Stackt Partners on-demand",
        "Senior strategy sessions monthly",
        "Custom reporting dashboard",
        "Priority response SLA",
        "Flexible scope for seasonal peaks",
        "Full team and channel coverage",
      ],
    },
  ]

  return (
    <section className="fp-pricing" style={{ width: "100%", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <span className="fp-pricing-label">Your stack, your choice</span>

      <h2 className="fp-pricing-heading">
        Three tiers. One direction.
        <br />
        <strong>All compounding from day one.</strong>
      </h2>

      <div className="fp-pricing-grid">
        {tiers.map(({ cls, name, price, desc, delay, features }) => (
          <div
            key={name}
            className={`fp-tier ${cls}${name === selectedTier ? " fp-tier-selected" : ""}`}
            style={{ transitionDelay: delay }}
          >
            <span className="fp-tier-name">{name}</span>
            <span className="fp-tier-price">{price}</span>
            <span className="fp-tier-billing">per month + GST</span>
            <p className="fp-tier-desc">{desc}</p>
            <span className="fp-tier-includes">What is included</span>
            <ul className="fp-tier-features">
              {features.map((f) => (
                <li key={f} className="fp-tier-feature">{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="fp-pricing-note">
        All tiers include account management, quarterly 90-day review, and
        ClickUp project visibility. Pricing is ex-GST. Ad spend is billed
        separately.
      </p>

      <footer className="fp-pricing-footer">
        <span className="fp-pricing-footer-left">Stackt</span>
        <span className="fp-pricing-footer-right">09</span>
      </footer>
    </section>
  )
}

addPropertyControls(Pricing, {
  selectedTier: {
    type: ControlType.Enum,
    title: "Selected Tier",
    options: ["Ignite", "Amplify", "Surge"],
    defaultValue: "Amplify",
  },
})
