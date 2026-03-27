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

const ABOUT_CSS = `
  .fp-about {
    background: var(--charcoal);
    padding: 130px 80px 100px;
    display: flex;
    flex-direction: column;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .fp-about-label-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 40px;
  }

  .fp-about-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 12px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--tertiary);
    white-space: nowrap;
  }

  .fp-about-label-line {
    width: 40px;
    height: 1px;
    background: var(--mid);
    flex-shrink: 0;
  }

  .fp-about-headline {
    font-size: clamp(36px, 4.5vw, 64px);
    font-weight: 300;
    line-height: 1.15;
    letter-spacing: -0.03em;
    color: var(--primary);
    margin: 0 0 72px;
    max-width: 900px;
  }

  .fp-about-headline strong {
    font-weight: 700;
    color: #ffffff;
  }

  .fp-about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    margin-bottom: 0;
  }

  .fp-about-col p {
    font-size: 20px;
    font-weight: 300;
    line-height: 1.7;
    color: var(--secondary);
    margin: 0 0 28px;
  }

  .fp-about-col p:last-child {
    margin-bottom: 0;
  }

  .fp-about-col p strong {
    font-weight: 700;
    color: var(--primary);
  }

  .fp-about-photos {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 80px;
  }

  .fp-about-photo {
    width: 100%;
    height: 380px;
    object-fit: cover;
    filter: grayscale(100%);
    border-radius: 8px;
    opacity: 0.75;
    display: block;
    background: var(--mid);
  }

  .fp-about-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    margin-top: 80px;
    border-top: 1px solid var(--mid);
  }

  .fp-about-footer-left,
  .fp-about-footer-right {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--tertiary);
  }
`

const DEFAULT_PHOTO1 =
  "https://framer.com/projects/Memorable-Storm--m9CMVzGcopmMMNHdF48l-24aQI?node=euFziptGK"
const DEFAULT_PHOTO2 =
  "https://framer.com/projects/Memorable-Storm--m9CMVzGcopmMMNHdF48l-24aQI?node=eUf_GLumA"

export default function About({
  photo1,
  photo2,
}) {
  useEffect(() => {
    injectFonts()
    injectStyles("fw-base", BASE_CSS)
    injectStyles("fw-about", ABOUT_CSS)
  }, [])

  return (
    <section className="fp-about" style={{ width: "100%", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="fp-about-label-row">
        <span className="fp-about-label">About Stackt</span>
        <span className="fp-about-label-line" />
      </div>

      <h2 className="fp-about-headline">
        <strong>Bottlenecks hate to see us coming.</strong> We have been doing
        this for over a decade and one thing we have learnt is that marketing
        teams are expected to do everything. Most do not have the people to do
        it.
      </h2>

      <div className="fp-about-grid">
        <div className="fp-about-col">
          <p>
            The brief keeps growing. The budget stays the same. And somewhere
            between the campaign that needs to go out, the report that is
            overdue and the social content that needs approving, the strategic
            work gets pushed to tomorrow.
          </p>
          <p>
            Stackt was born because we kept seeing the same thing. Smart,
            capable internal teams stretched too thin to deliver on what they
            actually know how to do.
          </p>
        </div>

        <div className="fp-about-col">
          <p>
            We take on the high skill, high effort work and we build systems
            around it that{" "}
            <strong>get smarter over time.</strong>
          </p>
          <p>
            Every process we put in place has efficiency baked in from the
            start. We are always finding ways to automate, streamline and
            improve so that the value we deliver keeps growing without the
            manual effort growing with it.
          </p>
          <p>
            <strong>
              Less admin. Less double handling. More of your budget doing what
              it is supposed to do.
            </strong>
          </p>
        </div>
      </div>

      <div className="fp-about-photos">
        <img
          className="fp-about-photo"
          src={photo1 || DEFAULT_PHOTO1}
          alt=""
        />
        <img
          className="fp-about-photo"
          src={photo2 || DEFAULT_PHOTO2}
          alt=""
        />
      </div>

      <footer className="fp-about-footer">
        <span className="fp-about-footer-left">Stackt</span>
        <span className="fp-about-footer-right">03</span>
      </footer>
    </section>
  )
}

addPropertyControls(About, {
  photo1: {
    type: ControlType.Image,
    title: "Photo 1",
  },
  photo2: {
    type: ControlType.Image,
    title: "Photo 2",
  },
})
