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

const VALUE_CSS = `
  .fp-value {
    background: var(--stone);
    color: var(--charcoal);
    padding: 130px 80px 100px;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .fp-value-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 12px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(38, 38, 38, 0.38);
    margin-bottom: 56px;
    display: block;
  }

  .fp-value-heading {
    font-size: clamp(32px, 3.8vw, 56px);
    font-weight: 300;
    line-height: 1.2;
    letter-spacing: -0.03em;
    color: var(--charcoal);
    max-width: 880px;
    margin: 0 0 72px;
  }

  .fp-value-heading strong {
    font-weight: 700;
  }

  .fp-value-sa-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
    background: rgba(38, 38, 38, 0.1);
    border-radius: 14px;
    overflow: hidden;
  }

  .fp-value-sa-card {
    background: #ffffff;
    padding: 36px 32px 44px;
  }

  .fp-value-sa-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 10px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(38, 38, 38, 0.35);
    margin-bottom: 16px;
    display: block;
  }

  .fp-value-sa-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--charcoal);
    margin-bottom: 22px;
    display: block;
  }

  .fp-value-sa-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 9px;
  }

  .fp-value-sa-item {
    font-size: 14px;
    font-weight: 300;
    color: rgba(38, 38, 38, 0.65);
    padding-left: 14px;
    position: relative;
    line-height: 1.45;
  }

  .fp-value-sa-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.6em;
    width: 5px;
    height: 1px;
    background: rgba(38, 38, 38, 0.35);
  }

  .fp-value-divider {
    height: 1px;
    background: rgba(38, 38, 38, 0.1);
    margin: 64px 0;
  }

  .fp-value-partners-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(38, 38, 38, 0.35);
    margin-bottom: 24px;
    display: block;
  }

  .fp-value-partner-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
    background: rgba(38, 38, 38, 0.1);
    border-radius: 14px;
    overflow: hidden;
  }

  .fp-value-partner-card {
    background: var(--stone);
    padding: 32px 32px 36px;
    border-bottom: 2px solid transparent;
    transition: border-color 0.2s ease;
  }

  .fp-value-partner-card:hover {
    border-color: var(--sky);
  }

  .fp-value-partner-logo-wrap {
    height: 36px;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .fp-value-partner-logo {
    max-height: 28px;
    max-width: 120px;
    object-fit: contain;
    filter: brightness(0);
    opacity: 0.55;
  }

  .fp-value-partner-network {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 400;
    font-size: 13px;
    letter-spacing: 0.08em;
    color: rgba(38, 38, 38, 0.55);
  }

  .fp-value-partner-tag {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(38, 38, 38, 0.3);
    margin-bottom: 8px;
    display: block;
  }

  .fp-value-partner-desc {
    font-size: 14px;
    font-weight: 300;
    line-height: 1.55;
    color: rgba(38, 38, 38, 0.55);
    margin: 0;
  }

  .fp-value-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    margin-top: 64px;
    border-top: 1px solid rgba(38, 38, 38, 0.1);
  }

  .fp-value-footer-left,
  .fp-value-footer-right {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: rgba(38, 38, 38, 0.35);
  }
`

const DEFAULT_SERVICE_AREAS = [
  { title: "Performance", items: "Google Ads (AU, NZ, ROW),Meta Ads (Furnware + Mindfull),Campaign strategy and builds,Audience segmentation,Budget pacing and optimisation,GA4 and GTM ownership" },
  { title: "Customer Nurture", items: "EDM strategy and copy,Up to 3 EDMs per month,Dynamics automation setup,Lifecycle flows and triggers,Segmentation and personalisation" },
  { title: "AI Enablement", items: "Workflow automation,Content scaling systems,Reporting infrastructure,Tool stack configuration,Team upskilling support" },
  { title: "Organic Social and Design", items: "Content calendar management,Copywriting and scheduling,Digital design and assets,Creator management,Short-form content" },
]

const DEFAULT_PARTNERS = [
  { tag: "Branding and Design", desc: "Brand strategy, identity systems, and design work that goes beyond what in-house can sustain.", logo: "" },
  { tag: "Web Development", desc: "Builds and CRO-focused development. We brief them, manage them, and ensure the work lands on time.", logo: "" },
  { tag: "Creator Content", desc: "Short-form video and UGC at scale. Talent selection, briefing, and content delivery managed by us.", logo: "" },
  { tag: "SEO and GEO", desc: "Search and generative engine optimisation from specialists who live and breathe organic growth.", logo: "" },
]

export default function ValueStack({
  label = "Your value stack",
  headingRegular = "We stay in our lane, working across",
  headingBold = "four core areas",
  headingSuffix = "and our Stackt Partners deliver on the rest.",
  serviceAreas = DEFAULT_SERVICE_AREAS,
  partners = DEFAULT_PARTNERS,
}) {
  useEffect(() => {
    injectFonts()
    injectStyles("fw-base", BASE_CSS)
    injectStyles("fw-value", VALUE_CSS)
  }, [])

  return (
    <section className="fp-value" style={{ width: "100%", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <span className="fp-value-label">{label}</span>

      <h2 className="fp-value-heading">
        {headingRegular}{" "}
        <strong>{headingBold}</strong> {headingSuffix}
      </h2>

      <div className="fp-value-sa-grid">
        {serviceAreas.map((area, i) => (
          <div key={i} className="fp-value-sa-card">
            <span className="fp-value-sa-label">In-house</span>
            <span className="fp-value-sa-title">{area.title}</span>
            <ul className="fp-value-sa-list">
              {area.items.split(",").map((item, j) => (
                <li key={j} className="fp-value-sa-item">{item.trim()}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="fp-value-divider" />

      <span className="fp-value-partners-label">Stackt Partners</span>

      <div className="fp-value-partner-grid">
        {partners.map((partner, i) => (
          <div key={i} className="fp-value-partner-card">
            <div className="fp-value-partner-logo-wrap">
              {partner.logo
                ? <img className="fp-value-partner-logo" src={partner.logo} alt="" />
                : <span className="fp-value-partner-network">{partner.tag}</span>
              }
            </div>
            <span className="fp-value-partner-tag">{partner.tag}</span>
            <p className="fp-value-partner-desc">{partner.desc}</p>
          </div>
        ))}
      </div>

      <footer className="fp-value-footer">
        <span className="fp-value-footer-left">Stackt</span>
        <span className="fp-value-footer-right">06</span>
      </footer>
    </section>
  )
}

addPropertyControls(ValueStack, {
  label: {
    type: ControlType.String,
    title: "Label",
    defaultValue: "Your value stack",
  },
  headingRegular: {
    type: ControlType.String,
    title: "Heading Regular",
    defaultValue: "We stay in our lane, working across",
  },
  headingBold: {
    type: ControlType.String,
    title: "Heading Bold",
    defaultValue: "four core areas",
  },
  headingSuffix: {
    type: ControlType.String,
    title: "Heading Suffix",
    defaultValue: "and our Stackt Partners deliver on the rest.",
  },
  serviceAreas: {
    type: ControlType.Array,
    title: "Service Areas",
    control: {
      type: ControlType.Object,
      controls: {
        title: { type: ControlType.String, title: "Title", defaultValue: "Service Area" },
        items: { type: ControlType.String, title: "Items", description: "Comma separated list", defaultValue: "Item one,Item two" },
      },
    },
    defaultValue: DEFAULT_SERVICE_AREAS,
  },
  partners: {
    type: ControlType.Array,
    title: "Partners",
    control: {
      type: ControlType.Object,
      controls: {
        tag: { type: ControlType.String, title: "Tag", defaultValue: "Partner Tag" },
        desc: { type: ControlType.String, title: "Description", defaultValue: "Partner description." },
        logo: { type: ControlType.Image, title: "Logo" },
      },
    },
    defaultValue: DEFAULT_PARTNERS,
  },
})
