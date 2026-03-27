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

const PROBLEM_CSS = `
  .fp-problem {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 100vh;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .fp-problem-left {
    background: var(--charcoal);
    padding: 130px 80px;
    display: flex;
    flex-direction: column;
  }

  .fp-problem-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 12px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--tertiary);
    margin-bottom: 56px;
    display: block;
  }

  .fp-problem-left-text {
    font-size: clamp(28px, 3.5vw, 52px);
    font-weight: 300;
    line-height: 1.25;
    letter-spacing: -0.025em;
    color: var(--primary);
    margin: 0;
  }

  .fp-problem-left-text strong {
    font-weight: 700;
    color: #ffffff;
  }

  .fp-problem-right {
    background: var(--powder);
    padding: 130px 80px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: flex-start;
  }

  .fp-problem-right-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%);
    opacity: 0.12;
  }

  .fp-problem-right-content {
    position: relative;
    z-index: 2;
  }

  .fp-problem-right-text {
    font-size: clamp(26px, 3vw, 44px);
    font-weight: 300;
    line-height: 1.3;
    letter-spacing: -0.02em;
    color: var(--charcoal);
    margin: 0;
  }

  .fp-problem-right-text strong {
    font-weight: 700;
  }
`

const DEFAULT_BG =
  "https://framer.com/projects/Memorable-Storm--m9CMVzGcopmMMNHdF48l-24aQI?node=FaMDM0atv"

export default function Problem({
  label = "The problem",
  leftRegular = "Your value stack is our method of bridging the",
  leftBold = "skill and resource gaps",
  leftSuffix = "within your team to deliver results at pace.",
  rightRegular = "You did not sign up to wear this many hats.",
  rightBold = "So take a few off. We have got it from here.",
  backgroundImage,
}) {
  useEffect(() => {
    injectFonts()
    injectStyles("fw-base", BASE_CSS)
    injectStyles("fw-problem", PROBLEM_CSS)
  }, [])

  return (
    <section className="fp-problem" style={{ width: "100%", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="fp-problem-left">
        <span className="fp-problem-label">{label}</span>
        <p className="fp-problem-left-text">
          {leftRegular}{" "}
          <strong>{leftBold}</strong> {leftSuffix}
        </p>
      </div>

      <div className="fp-problem-right">
        <img
          className="fp-problem-right-bg"
          src={backgroundImage || DEFAULT_BG}
          alt=""
        />
        <div className="fp-problem-right-content">
          <p className="fp-problem-right-text">
            {rightRegular}
            <br />
            <br />
            <strong>{rightBold}</strong>
          </p>
        </div>
      </div>
    </section>
  )
}

addPropertyControls(Problem, {
  label: {
    type: ControlType.String,
    title: "Label",
    defaultValue: "The problem",
  },
  leftRegular: {
    type: ControlType.String,
    title: "Left Regular",
    defaultValue: "Your value stack is our method of bridging the",
  },
  leftBold: {
    type: ControlType.String,
    title: "Left Bold",
    defaultValue: "skill and resource gaps",
  },
  leftSuffix: {
    type: ControlType.String,
    title: "Left Suffix",
    defaultValue: "within your team to deliver results at pace.",
  },
  rightRegular: {
    type: ControlType.String,
    title: "Right Regular",
    defaultValue: "You did not sign up to wear this many hats.",
  },
  rightBold: {
    type: ControlType.String,
    title: "Right Bold",
    defaultValue: "So take a few off. We have got it from here.",
  },
  backgroundImage: {
    type: ControlType.Image,
    title: "Background Image",
  },
})
