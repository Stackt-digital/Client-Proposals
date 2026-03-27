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

const TECH_CSS = `
  .fp-tech {
    background: #1e1e1e;
    padding: 130px 80px 100px;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .fp-tech-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 12px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--tertiary);
    margin-bottom: 56px;
    display: block;
  }

  .fp-tech-heading {
    font-size: clamp(32px, 4vw, 52px);
    font-weight: 300;
    line-height: 1.2;
    letter-spacing: -0.025em;
    color: var(--primary);
    max-width: 780px;
    margin: 0 0 64px;
  }

  .fp-tech-heading strong {
    font-weight: 700;
    color: #ffffff;
  }

  .fp-tech-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
    background: #2a2a2a;
    border-radius: 14px;
    overflow: hidden;
  }

  .fp-tech-card {
    background: #1e1e1e;
    padding: 40px 36px;
  }

  .fp-tech-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(187, 234, 249, 0.12);
    border: 1px solid rgba(187, 234, 249, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    animation: fp-icon-pulse linear infinite;
  }

  @keyframes fp-icon-pulse {
    0%, 100% { opacity: 0.7; transform: scale(1); }
    50%       { opacity: 1;   transform: scale(1.05); }
  }

  .fp-tech-name {
    font-size: 17px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--primary);
    margin-bottom: 8px;
    display: block;
  }

  .fp-tech-purpose {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--sky);
    margin-bottom: 14px;
    display: block;
  }

  .fp-tech-desc {
    font-size: 14px;
    font-weight: 300;
    line-height: 1.6;
    color: var(--secondary);
    margin: 0;
  }

  .fp-tech-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    margin-top: 80px;
    border-top: 1px solid rgba(240, 240, 242, 0.08);
  }

  .fp-tech-footer-left,
  .fp-tech-footer-right {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--tertiary);
  }
`

const ICONS = [
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--sky)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 13V9M6 13V6M10 13V8M14 13V3" />
  </svg>,
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--sky)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="3" cy="8" r="1.5" />
    <circle cx="13" cy="3.5" r="1.5" />
    <circle cx="13" cy="12.5" r="1.5" />
    <path d="M4.4 7.3L11.6 4.2M4.4 8.7L11.6 11.8" />
  </svg>,
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--sky)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="12" height="9" rx="1.5" />
    <path d="M2 6L8 10L14 6" />
  </svg>,
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--sky)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2,12 5,7.5 8.5,9.5 13,3" />
    <path d="M2 12H14" />
  </svg>,
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--sky)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2L9.5 6.5L14 8L9.5 9.5L8 14L6.5 9.5L2 8L6.5 6.5Z" />
  </svg>,
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--sky)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="2" width="10" height="5" rx="1" />
    <rect x="3" y="9" width="6" height="5" rx="1" />
  </svg>,
]

const DURATIONS = ["2.8s", "3.4s", "3.0s", "2.6s", "3.6s", "3.2s"]

const DEFAULT_TOOLS = [
  { name: "Google Ads", purpose: "Paid Search", desc: "Campaign architecture, audience segmentation, and budget pacing across AU, NZ, and ROW markets." },
  { name: "Meta Ads", purpose: "Paid Social", desc: "Full-funnel campaign management across Facebook and Instagram for Furnware and Mindfull." },
  { name: "Microsoft Dynamics", purpose: "Email and CRM", desc: "Automation setup, lifecycle flows, and segmentation. Your nurture engine, built to run on its own." },
  { name: "GA4 and GTM", purpose: "Analytics and Tracking", desc: "Full ownership of your analytics setup. Clean data, accurate attribution, and reporting you can act on." },
  { name: "Claude and AI Tools", purpose: "AI Enablement", desc: "Workflow automation, content scaling, and reporting infrastructure. We configure the tools and train your team." },
  { name: "Framer", purpose: "Web and Landing Pages", desc: "Fast, conversion-focused landing pages and campaign assets built and iterated without waiting on a dev queue." },
]

export default function Tech({
  label = "Your tech stack",
  headingRegular = "The infrastructure that makes the whole thing run",
  headingBold = "faster, smarter, and more visible.",
  tools = DEFAULT_TOOLS,
}) {
  useEffect(() => {
    injectFonts()
    injectStyles("fw-base", BASE_CSS)
    injectStyles("fw-tech", TECH_CSS)
  }, [])

  return (
    <section className="fp-tech" style={{ width: "100%", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <span className="fp-tech-label">{label}</span>

      <h2 className="fp-tech-heading">
        {headingRegular}{" "}
        <strong>{headingBold}</strong>
      </h2>

      <div className="fp-tech-grid">
        {tools.map((tool, i) => (
          <div key={i} className="fp-tech-card">
            <div className="fp-tech-icon" style={{ animationDuration: DURATIONS[i] || "3.0s" }}>
              {ICONS[i] || ICONS[0]}
            </div>
            <span className="fp-tech-name">{tool.name}</span>
            <span className="fp-tech-purpose">{tool.purpose}</span>
            <p className="fp-tech-desc">{tool.desc}</p>
          </div>
        ))}
      </div>

      <footer className="fp-tech-footer">
        <span className="fp-tech-footer-left">Stackt</span>
        <span className="fp-tech-footer-right">08</span>
      </footer>
    </section>
  )
}

addPropertyControls(Tech, {
  label: {
    type: ControlType.String,
    title: "Label",
    defaultValue: "Your tech stack",
  },
  headingRegular: {
    type: ControlType.String,
    title: "Heading Regular",
    defaultValue: "The infrastructure that makes the whole thing run",
  },
  headingBold: {
    type: ControlType.String,
    title: "Heading Bold",
    defaultValue: "faster, smarter, and more visible.",
  },
  tools: {
    type: ControlType.Array,
    title: "Tools",
    control: {
      type: ControlType.Object,
      controls: {
        name: { type: ControlType.String, title: "Name", defaultValue: "Tool Name" },
        purpose: { type: ControlType.String, title: "Purpose", defaultValue: "Purpose" },
        desc: { type: ControlType.String, title: "Description", defaultValue: "Tool description." },
      },
    },
    defaultValue: DEFAULT_TOOLS,
  },
})
