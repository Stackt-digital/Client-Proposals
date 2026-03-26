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

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div ref={rootRef}>
      <div id="fp-progress-bar" className="fp-progress-bar" />
      <Cover />
      <Slogan />
    </div>
  )
}
