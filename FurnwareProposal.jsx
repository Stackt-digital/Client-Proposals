import React, { useEffect, useRef } from "react"

export default function FurnwareProposal({
  clientName = "Furnware",
  contactEmail = "lauren@stackt.digital",
  selectedTier = "Amplify",
}) {
  const rootRef = useRef(null)

  // ── Fonts + CSS variables + component styles ────────────────────────────
  useEffect(() => {
    const fontLink = document.createElement("link")
    fontLink.rel = "stylesheet"
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700&family=JetBrains+Mono:wght@200;400&display=swap"
    document.head.appendChild(fontLink)

    const style = document.createElement("style")
    style.textContent = `
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

      .reveal {
        opacity: 0;
        transform: translateY(24px);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }

      .reveal.visible {
        opacity: 1;
        transform: translateY(0);
      }

      /* ── Scroll progress bar ── */
      .fp-progress-bar {
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 2px;
        background: var(--sky);
        z-index: 9999;
        transition: width 0.1s linear;
      }

      /* ── Cover ── */
      .fp-cover {
        position: relative;
        width: 100%;
        height: 100vh;
        min-height: 600px;
        background: var(--charcoal);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
        font-family: 'Plus Jakarta Sans', sans-serif;
      }

      .fp-cover-photo {
        position: absolute;
        inset: 0;
        right: 0;
        left: 40%;
        background-image: url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80');
        background-size: cover;
        background-position: center;
        filter: grayscale(100%) brightness(0.45);
        -webkit-mask-image: linear-gradient(to right, transparent 0%, black 30%);
        mask-image: linear-gradient(to right, transparent 0%, black 30%);
      }

      .fp-cover-body {
        position: relative;
        z-index: 1;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 0 64px 48px;
      }

      .fp-cover-eyebrow {
        font-family: 'JetBrains Mono', monospace;
        font-weight: 200;
        font-size: 11px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--tertiary);
        margin-bottom: 20px;
      }

      .fp-cover-headline {
        font-size: clamp(48px, 7vw, 88px);
        font-weight: 700;
        line-height: 1.0;
        letter-spacing: -0.03em;
        color: var(--primary);
        margin: 0 0 28px;
      }

      .fp-cover-headline-accent {
        color: var(--sky);
      }

      .fp-cover-sub {
        font-size: 17px;
        font-weight: 300;
        color: var(--secondary);
        max-width: 480px;
        line-height: 1.75;
      }

      /* ── Cover footer bar ── */
      .fp-cover-footer {
        position: relative;
        z-index: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 64px;
        border-top: 1px solid rgba(240, 240, 242, 0.1);
      }

      .fp-cover-footer-left,
      .fp-cover-footer-right {
        font-family: 'JetBrains Mono', monospace;
        font-weight: 200;
        font-size: 11px;
        letter-spacing: 0.1em;
        color: var(--tertiary);
      }

      /* ── Scroll indicator ── */
      .fp-scroll-indicator {
        position: absolute;
        bottom: 28px;
        right: 64px;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }

      .fp-scroll-label {
        font-family: 'JetBrains Mono', monospace;
        font-weight: 200;
        font-size: 10px;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: var(--tertiary);
        writing-mode: vertical-rl;
      }

      .fp-scroll-line {
        width: 1px;
        height: 48px;
        background: rgba(240, 240, 242, 0.12);
        position: relative;
        overflow: hidden;
      }

      .fp-scroll-line::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--sky);
        animation: fp-scroll-travel 1.8s ease-in-out infinite;
      }

      @keyframes fp-scroll-travel {
        0%   { transform: translateY(-100%); }
        50%  { transform: translateY(0%); }
        100% { transform: translateY(100%); }
      }

      /* ── Slogan ── */
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

      /* ── About ── */
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

      /* ── Problem ── */
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

      /* ── HowWeWork ── */
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
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(fontLink)
      document.head.removeChild(style)
    }
  }, [])

  // ── Scroll reveal ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!rootRef.current) return

    const elements = rootRef.current.querySelectorAll(".reveal")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  // ── Scroll progress bar ──────────────────────────────────────────────────
  useEffect(() => {
    const bar = document.getElementById("fp-progress-bar")
    if (!bar) return

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      bar.style.width = `${progress}%`
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // ── Sections ─────────────────────────────────────────────────────────────

  const Cover = () => (
    <section className="fp-cover">
      <div className="fp-cover-photo" />

      <div className="fp-cover-body">
        <p className="fp-cover-eyebrow reveal">
          Your value stack — {clientName} x Stackt — 2025
        </p>
        <h1 className="fp-cover-headline reveal">
          Built for{" "}
          <span className="fp-cover-headline-accent">{clientName}.</span>
        </h1>
        <p className="fp-cover-sub reveal">
          A tailored marketing stack designed to close the gap between where
          your team is today and where the business needs to go.
        </p>
      </div>

      <footer className="fp-cover-footer">
        <span className="fp-cover-footer-left reveal">Stackt — Confidential</span>
        <span className="fp-cover-footer-right reveal">01</span>
      </footer>

      <div className="fp-scroll-indicator">
        <span className="fp-scroll-label">Scroll to explore</span>
        <div className="fp-scroll-line" />
      </div>
    </section>
  )

  const Slogan = () => (
    <section className="fp-slogan">
      <div className="fp-slogan-body">
        <h2 className="fp-slogan-text reveal">
          <span className="fp-slogan-bold">The value stack</span>
          <span className="fp-slogan-light">concept.</span>
        </h2>
      </div>

      <footer className="fp-slogan-footer">
        <span className="fp-slogan-footer-left">Stackt</span>
        <span className="fp-slogan-footer-right">02</span>
      </footer>
    </section>
  )

  const About = () => (
    <section className="fp-about">
      <div className="fp-about-label-row">
        <span className="fp-about-label">About Stackt</span>
        <span className="fp-about-label-line" />
      </div>

      <h2 className="fp-about-headline reveal">
        <strong>Bottlenecks hate to see us coming.</strong> We have been doing
        this for over a decade and one thing we have learnt is that marketing
        teams are expected to do everything. Most do not have the people to do
        it.
      </h2>

      <div className="fp-about-grid">
        <div className="fp-about-col reveal">
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

        <div className="fp-about-col reveal">
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

      <div className="fp-about-photos reveal">
        <img className="fp-about-photo" src="" alt="" />
        <img className="fp-about-photo" src="" alt="" />
      </div>

      <footer className="fp-about-footer">
        <span className="fp-about-footer-left">Stackt</span>
        <span className="fp-about-footer-right">03</span>
      </footer>
    </section>
  )

  const Problem = () => (
    <section className="fp-problem">
      <div className="fp-problem-left">
        <span className="fp-problem-label">The problem</span>
        <p className="fp-problem-left-text reveal">
          Your value stack is our method of bridging the{" "}
          <strong>skill and resource gaps</strong> within your team to deliver
          results at pace.
        </p>
      </div>

      <div className="fp-problem-right">
        <img className="fp-problem-right-bg" src="" alt="" />
        <div className="fp-problem-right-content">
          <p className="fp-problem-right-text reveal">
            You did not sign up to wear this many hats.
            <br />
            <br />
            <strong>So take a few off. We have got it from here.</strong>
          </p>
        </div>
      </div>
    </section>
  )

  const HowWeWork = () => (
    <section className="fp-how">
      <span className="fp-how-label">How we work</span>

      <h2 className="fp-how-heading reveal">
        We only do the work that{" "}
        <strong>actually moves the needle.</strong>
      </h2>

      <div className="fp-how-grid">
        <div className="fp-how-card reveal">
          <span className="fp-how-card-num">01</span>
          <span className="fp-how-card-title">We get under the hood</span>
          <p className="fp-how-card-body">
            No work starts without strategy. We learn your business, your tone,
            your team and what keeps you up at night. The better we know you,
            the better the work gets. And we are always paying attention.
          </p>
        </div>

        <div className="fp-how-card reveal">
          <span className="fp-how-card-num">02</span>
          <span className="fp-how-card-title">We build to compound</span>
          <p className="fp-how-card-body">
            Every system, every process, every workflow we create is designed to
            do more over time with less effort. We bake efficiency in from day
            one because we think your budget should go toward results, not admin.
          </p>
        </div>

        <div className="fp-how-card reveal">
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

        <div className="fp-how-card reveal">
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

      <div className="fp-how-rhythm reveal">
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

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div ref={rootRef}>
      <div id="fp-progress-bar" className="fp-progress-bar" />
      <Cover />
      <Slogan />
      <About />
      <Problem />
      <HowWeWork />
    </div>
  )
}
