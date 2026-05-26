import React, { useEffect } from "react"
import { addPropertyControls, ControlType } from "framer"

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

// ─── Styles ──────────────────────────────────────────────────────────────────

const BASE_CSS = `
  :root {
    --charcoal: #262626; --stone: #FAFAFA; --powder: #EBFCFF;
    --sky: #BBEAF9; --mid: #414149; --tertiary: #84848f;
    --secondary: #a9a9b1; --primary: #f0f0f2;
  }
`

const GRID_CSS = `
  .fp-cg {
    background: var(--charcoal);
    padding: 80px 80px 60px;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .fp-cg-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 12px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--tertiary);
    margin-bottom: 40px;
    display: block;
  }

  .fp-cg-heading {
    font-size: clamp(40px, 6vw, 88px);
    font-weight: 300;
    line-height: 0.97;
    letter-spacing: -0.035em;
    color: var(--primary);
    margin: 0 0 72px;
    max-width: 780px;
  }
  .fp-cg-heading strong {
    font-weight: 700;
  }

  /* Hairline grid: gap + matching background creates 1px dividers */
  .fp-cg-grid {
    display: grid;
    gap: 1px;
    background: var(--mid);
    border: 1px solid var(--mid);
    border-radius: 4px;
    overflow: hidden;
  }
  .fp-cg-grid--2 { grid-template-columns: repeat(2, 1fr); }
  .fp-cg-grid--3 { grid-template-columns: repeat(3, 1fr); }

  .fp-cg-card {
    background: var(--charcoal);
    padding: 36px 36px 40px;
    display: flex;
    flex-direction: column;
    gap: 0;
    transition: background 0.25s ease;
  }
  .fp-cg-card:hover {
    background: #2e2e2e;
  }

  /* Icon container */
  .fp-cg-icon-wrap {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    border: 1px solid var(--mid);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 28px;
    flex-shrink: 0;
    color: var(--secondary);
    transition: border-color 0.25s ease, color 0.25s ease;
  }
  .fp-cg-card:hover .fp-cg-icon-wrap {
    border-color: rgba(187,234,249,0.4);
    color: var(--sky);
  }

  .fp-cg-name {
    font-size: 17px;
    font-weight: 600;
    color: var(--primary);
    margin: 0 0 8px;
    line-height: 1.3;
  }

  .fp-cg-category {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--tertiary);
    margin: 0 0 18px;
  }

  .fp-cg-desc {
    font-size: 14px;
    font-weight: 300;
    line-height: 1.7;
    color: var(--secondary);
    margin: 0;
  }

  .fp-cg-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    margin-top: 56px;
    border-top: 1px solid var(--mid);
  }
  .fp-cg-footer-left,
  .fp-cg-footer-right {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--tertiary);
  }
`

// ─── Icon suite ───────────────────────────────────────────────────────────────
// 20 selectable icons covering common agency/marketing service types.
// All use stroke="currentColor", viewBox="0 0 24 24", strokeWidth="1.6"

const ICON_PATHS = {
  analytics:   <><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></>,
  social:      <><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><line x1="8.5" y1="13.4" x2="15.5" y2="17.6"/><line x1="15.5" y1="6.4" x2="8.5" y2="10.6"/></>,
  email:       <><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 8 10 6 10-6"/></>,
  calendar:    <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
  content:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/></>,
  ai:          <><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></>,
  project:     <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="m9 12 2 2 4-4"/></>,
  paid:        <><circle cx="12" cy="12" r="9"/><path d="M14.5 9.5a3.5 3.5 0 1 0 0 5M12 7v2M12 15v2"/></>,
  seo:         <><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></>,
  ecommerce:   <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></>,
  automation:  <><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></>,
  users:       <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
  globe:       <><circle cx="12" cy="12" r="9"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
  funnel:      <><polygon points="22 3 2 3 10 12.5 10 19 14 21 14 12.5 22 3"/></>,
  trending:    <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>,
  megaphone:   <><path d="m3 11 19-9-9 19-2-8-8-2z"/></>,
  video:       <><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></>,
  strategy:    <><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></>,
  reporting:   <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></>,
  crm:         <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></>,
}

const ICON_KEYS   = Object.keys(ICON_PATHS)
const ICON_LABELS = {
  analytics:  "Analytics",
  social:     "Social Media",
  email:      "Email / CRM",
  calendar:   "Calendar",
  content:    "Content",
  ai:         "AI / Spark",
  project:    "Project Mgmt",
  paid:       "Paid Media",
  seo:        "SEO / Search",
  ecommerce:  "Ecommerce",
  automation: "Automation",
  users:      "Team / Users",
  globe:      "Website / Globe",
  funnel:     "Funnel",
  trending:   "Trending / Growth",
  megaphone:  "Advertising",
  video:      "Video",
  strategy:   "Strategy",
  reporting:  "Reporting",
  crm:        "CRM / Database",
}

function Icon({ name }) {
  const paths = ICON_PATHS[name] || ICON_PATHS.analytics
  return (
    <svg
      width="20" height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths}
    </svg>
  )
}

// ─── Default cards ────────────────────────────────────────────────────────────

const DEFAULT_CARDS = [
  { icon: "analytics",  name: "Pinterest Ads",                    category: "Paid Search",                       description: "Campaign architecture, audience segmentation, and budget pacing across platforms your audience persona are searching for inspiration." },
  { icon: "social",     name: "Meta Ads",                         category: "Paid Social",                       description: "Full-funnel campaign management across Facebook and Instagram." },
  { icon: "email",      name: "Customer Nurture + CRM Management",category: "Email and CRM",                     description: "Automation setup, lifecycle flows, and segmentation. Your nurture engine, built to run on its own." },
  { icon: "reporting",  name: "GA4 and GTM",                      category: "Analytics and Tracking",            description: "Full ownership of your analytics setup. Clean data, accurate attribution, and reporting you can act on." },
  { icon: "ai",         name: "Claude and AI Tools",              category: "AI Enablement",                     description: "Workflow automation, content scaling, and reporting infrastructure. We configure the tools and train your team." },
  { icon: "project",    name: "Click Up",                         category: "Project Management + Communication", description: "ClickUp is your live window into the work. Full visibility on every task, no chasing for updates." },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function ContentGrid({
  label          = "Your Tech Stack",
  headingRegular = "The infrastructure that makes the whole thing run",
  headingBold    = "faster, smarter, and more visible.",
  columns        = "3",
  cards          = DEFAULT_CARDS,
  footerLeft     = "Stackt — Confidential",
  pageNumber     = "08",
}) {
  useEffect(() => {
    injectFonts()
    injectStyles("fw-base", BASE_CSS)
    injectStyles("fw-cg", GRID_CSS)
  }, [])

  const cols = columns === "2" ? 2 : 3

  return (
    <section className="fp-cg" style={{ width: "100%" }}>
      <span className="fp-cg-label">{label}</span>

      <h2 className="fp-cg-heading">
        {headingRegular} <strong>{headingBold}</strong>
      </h2>

      <div className={`fp-cg-grid fp-cg-grid--${cols}`}>
        {cards.map((card, i) => (
          <div key={i} className="fp-cg-card">
            <div className="fp-cg-icon-wrap">
              <Icon name={card.icon || "analytics"} />
            </div>
            <p className="fp-cg-name">{card.name || "Service Name"}</p>
            <p className="fp-cg-category">{card.category || "Category"}</p>
            <p className="fp-cg-desc">{card.description || "Add a description."}</p>
          </div>
        ))}
      </div>

      <footer className="fp-cg-footer">
        <span className="fp-cg-footer-left">{footerLeft}</span>
        <span className="fp-cg-footer-right">{pageNumber}</span>
      </footer>
    </section>
  )
}

// ─── Framer controls ─────────────────────────────────────────────────────────

addPropertyControls(ContentGrid, {
  label: {
    type: ControlType.String,
    title: "Label",
    defaultValue: "Your Tech Stack",
  },
  headingRegular: {
    type: ControlType.String,
    title: "Heading (light)",
    defaultValue: "The infrastructure that makes the whole thing run",
  },
  headingBold: {
    type: ControlType.String,
    title: "Heading (bold)",
    defaultValue: "faster, smarter, and more visible.",
  },
  columns: {
    type: ControlType.Enum,
    title: "Columns",
    options: ["2", "3"],
    optionTitles: ["2 columns", "3 columns"],
    defaultValue: "3",
  },
  cards: {
    type: ControlType.Array,
    title: "Cards",
    maxCount: 9,
    control: {
      type: ControlType.Object,
      controls: {
        icon: {
          type: ControlType.Enum,
          title: "Icon",
          options: ICON_KEYS,
          optionTitles: ICON_KEYS.map(k => ICON_LABELS[k]),
          defaultValue: "analytics",
        },
        name: {
          type: ControlType.String,
          title: "Name",
          defaultValue: "Service Name",
        },
        category: {
          type: ControlType.String,
          title: "Category",
          defaultValue: "Category Label",
        },
        description: {
          type: ControlType.String,
          title: "Description",
          defaultValue: "Short description of this service or tool.",
        },
      },
    },
  },
  footerLeft: {
    type: ControlType.String,
    title: "Footer Text",
    defaultValue: "Stackt — Confidential",
  },
  pageNumber: {
    type: ControlType.String,
    title: "Page Number",
    defaultValue: "08",
  },
})
