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

const TEAM_CSS = `
  .fp-team {
    background: var(--charcoal);
    padding: 130px 80px 100px;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .fp-team-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 12px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--tertiary);
    margin-bottom: 56px;
    display: block;
  }

  .fp-team-heading {
    font-size: clamp(32px, 4vw, 56px);
    font-weight: 300;
    line-height: 1.2;
    letter-spacing: -0.03em;
    color: var(--primary);
    max-width: 820px;
    margin: 0;
  }

  .fp-team-heading strong {
    font-weight: 700;
    color: #ffffff;
  }

  .fp-team-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    margin-top: 72px;
    align-items: start;
  }

  .fp-team-cards {
    display: flex;
    flex-direction: column;
    gap: 2px;
    background: var(--mid);
    border-radius: 14px;
    overflow: hidden;
  }

  .fp-team-card {
    background: #242424;
    padding: 36px 40px;
    border-left: 2px solid transparent;
    transition: border-color 0.2s ease, background 0.2s ease;
  }

  .fp-team-card:hover {
    border-color: var(--sky);
    background: #282828;
  }

  .fp-team-card-name {
    font-size: 19px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--primary);
    margin-bottom: 6px;
    display: block;
  }

  .fp-team-card-role {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--sky);
    margin-bottom: 16px;
    display: block;
  }

  .fp-team-card-desc {
    font-size: 15px;
    font-weight: 300;
    line-height: 1.6;
    color: var(--secondary);
    margin: 0;
  }

  .fp-team-photo-col {
    border-radius: 12px;
    overflow: hidden;
    position: relative;
  }

  .fp-team-photo {
    width: 100%;
    min-height: 480px;
    object-fit: cover;
    filter: grayscale(100%);
    opacity: 0.8;
    display: block;
    background: var(--mid);
  }

  .fp-team-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    margin-top: 80px;
    border-top: 1px solid var(--mid);
  }

  .fp-team-footer-left,
  .fp-team-footer-right {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--tertiary);
  }
`

const DEFAULT_TEAM_PHOTO =
  "https://framer.com/projects/Memorable-Storm--m9CMVzGcopmMMNHdF48l-24aQI?node=SLPHgrtfA"

const DEFAULT_MEMBERS = [
  { name: "Ash", role: "Strategy", desc: "Your strategic lead. Ash brings over a decade of agency experience and is accountable for the direction, quality and output of your stack." },
  { name: "Lauren", role: "Business Director and AI Enablement Lead — Primary Contact", desc: "Senior oversight across all client accounts. Lauren ensures consistency, quality control and that every deliverable is held to the standard it should be." },
  { name: "Paige", role: "Growth Partner", desc: "Driving performance and commercial growth across paid channels. Paige keeps a close eye on where every dollar is going and how every campaign is tracking." },
  { name: "Tracey", role: "Nurture Lead", desc: "Owning your email and lifecycle strategy. Tracey builds the automations, writes the sequences and ensures your nurture engine keeps running." },
]

export default function Team({
  label = "Your team",
  headingRegular = "Proven people.",
  headingBold = "Senior oversight. No juniors learning on your budget.",
  members = DEFAULT_MEMBERS,
  teamPhoto,
}) {
  useEffect(() => {
    injectFonts()
    injectStyles("fw-base", BASE_CSS)
    injectStyles("fw-team", TEAM_CSS)
  }, [])

  return (
    <section className="fp-team" style={{ width: "100%", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <span className="fp-team-label">{label}</span>

      <h2 className="fp-team-heading">
        {headingRegular}{" "}
        <strong>{headingBold}</strong>
      </h2>

      <div className="fp-team-grid">
        <div className="fp-team-cards">
          {members.map((member, i) => (
            <div key={i} className="fp-team-card">
              <span className="fp-team-card-name">{member.name}</span>
              <span className="fp-team-card-role">{member.role}</span>
              <p className="fp-team-card-desc">{member.desc}</p>
            </div>
          ))}
        </div>

        <div className="fp-team-photo-col">
          <img
            className="fp-team-photo"
            src={teamPhoto || DEFAULT_TEAM_PHOTO}
            alt=""
          />
        </div>
      </div>

      <footer className="fp-team-footer">
        <span className="fp-team-footer-left">Stackt</span>
        <span className="fp-team-footer-right">07</span>
      </footer>
    </section>
  )
}

addPropertyControls(Team, {
  label: {
    type: ControlType.String,
    title: "Label",
    defaultValue: "Your team",
  },
  headingRegular: {
    type: ControlType.String,
    title: "Heading Regular",
    defaultValue: "Proven people.",
  },
  headingBold: {
    type: ControlType.String,
    title: "Heading Bold",
    defaultValue: "Senior oversight. No juniors learning on your budget.",
  },
  members: {
    type: ControlType.Array,
    title: "Members",
    control: {
      type: ControlType.Object,
      controls: {
        name: { type: ControlType.String, title: "Name", defaultValue: "Name" },
        role: { type: ControlType.String, title: "Role", defaultValue: "Role" },
        desc: { type: ControlType.String, title: "Description", defaultValue: "Description." },
      },
    },
    defaultValue: DEFAULT_MEMBERS,
  },
  teamPhoto: {
    type: ControlType.Image,
    title: "Team Photo",
  },
})
