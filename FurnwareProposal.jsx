import React, { useEffect, useRef } from "react"
import { addPropertyControls, ControlType } from "framer"

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

      /* ── ValueStack ── */
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

      /* ── Team ── */
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

      /* ── Tech ── */
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

      /* ── Pricing ── */
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

      /* ── Tier cards shared ── */
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

      /* ── CTA ── */
      .fp-cta {
        background: var(--charcoal);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        overflow: hidden;
        padding: 130px 80px;
        font-family: 'Plus Jakarta Sans', sans-serif;
      }

      .fp-cta-orb {
        position: absolute;
        bottom: -30%;
        left: -10%;
        width: 80vw;
        height: 80vw;
        border-radius: 50%;
        background: radial-gradient(circle at 50% 50%, rgba(235, 252, 255, 0.05) 0%, transparent 65%);
        pointer-events: none;
        z-index: 1;
      }

      .fp-cta-bg-photo {
        position: absolute;
        right: 0;
        top: 0;
        width: 42%;
        height: 100%;
        object-fit: cover;
        filter: grayscale(100%);
        opacity: 0.15;
        -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,0.8) 0%, transparent 100%);
        mask-image: linear-gradient(to left, rgba(0,0,0,0.8) 0%, transparent 100%);
        z-index: 1;
        display: block;
        background: var(--mid);
      }

      .fp-cta-content {
        position: relative;
        z-index: 2;
      }

      .fp-cta-label {
        font-family: 'JetBrains Mono', monospace;
        font-weight: 200;
        font-size: 12px;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: var(--tertiary);
        margin-bottom: 56px;
        display: block;
      }

      .fp-cta-headline {
        font-size: clamp(52px, 8vw, 120px);
        font-weight: 300;
        line-height: 0.97;
        letter-spacing: -0.04em;
        color: var(--primary);
        margin: 0 0 52px;
      }

      .fp-cta-headline-accent {
        font-style: normal;
        color: var(--sky);
      }

      .fp-cta-body {
        font-size: 21px;
        font-weight: 300;
        line-height: 1.65;
        color: var(--secondary);
        max-width: 560px;
        margin: 0 0 52px;
      }

      .fp-cta-buttons {
        display: flex;
        gap: 16px;
        align-items: center;
      }

      .fp-cta-btn-primary {
        background: var(--sky);
        color: var(--charcoal);
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: 700;
        font-size: 14px;
        padding: 17px 32px;
        border-radius: 6px;
        text-decoration: none;
        transition: background 0.2s ease, transform 0.2s ease;
        display: inline-block;
      }

      .fp-cta-btn-primary:hover {
        background: #ffffff;
        transform: translateY(-1px);
      }

      .fp-cta-btn-secondary {
        background: transparent;
        color: var(--secondary);
        font-family: 'JetBrains Mono', monospace;
        font-weight: 200;
        font-size: 11px;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        padding: 17px 0;
        text-decoration: none;
        transition: color 0.2s ease;
        display: inline-block;
      }

      .fp-cta-btn-secondary:hover {
        color: var(--primary);
      }

      .fp-cta-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 0;
        margin-top: 80px;
        border-top: 1px solid var(--mid);
      }

      .fp-cta-footer-left,
      .fp-cta-footer-right {
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

  const ValueStack = () => (
    <section className="fp-value">
      <span className="fp-value-label">Your value stack</span>

      <h2 className="fp-value-heading reveal">
        We stay in our lane, working across{" "}
        <strong>four core areas</strong> and our Stackt Partners deliver on the
        rest.
      </h2>

      <div className="fp-value-sa-grid reveal">
        <div className="fp-value-sa-card">
          <span className="fp-value-sa-label">In-house</span>
          <span className="fp-value-sa-title">Performance</span>
          <ul className="fp-value-sa-list">
            {[
              "Google Ads (AU, NZ, ROW)",
              "Meta Ads (Furnware + Mindfull)",
              "Campaign strategy and builds",
              "Audience segmentation",
              "Budget pacing and optimisation",
              "GA4 and GTM ownership",
            ].map((item) => (
              <li key={item} className="fp-value-sa-item">{item}</li>
            ))}
          </ul>
        </div>

        <div className="fp-value-sa-card">
          <span className="fp-value-sa-label">In-house</span>
          <span className="fp-value-sa-title">Customer Nurture</span>
          <ul className="fp-value-sa-list">
            {[
              "EDM strategy and copy",
              "Up to 3 EDMs per month",
              "Dynamics automation setup",
              "Lifecycle flows and triggers",
              "Segmentation and personalisation",
            ].map((item) => (
              <li key={item} className="fp-value-sa-item">{item}</li>
            ))}
          </ul>
        </div>

        <div className="fp-value-sa-card">
          <span className="fp-value-sa-label">In-house</span>
          <span className="fp-value-sa-title">AI Enablement</span>
          <ul className="fp-value-sa-list">
            {[
              "Workflow automation",
              "Content scaling systems",
              "Reporting infrastructure",
              "Tool stack configuration",
              "Team upskilling support",
            ].map((item) => (
              <li key={item} className="fp-value-sa-item">{item}</li>
            ))}
          </ul>
        </div>

        <div className="fp-value-sa-card">
          <span className="fp-value-sa-label">In-house</span>
          <span className="fp-value-sa-title">Organic Social and Design</span>
          <ul className="fp-value-sa-list">
            {[
              "Content calendar management",
              "Copywriting and scheduling",
              "Digital design and assets",
              "Creator management",
              "Short-form content",
            ].map((item) => (
              <li key={item} className="fp-value-sa-item">{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="fp-value-divider" />

      <span className="fp-value-partners-label">Stackt Partners</span>

      <div className="fp-value-partner-grid reveal">
        <div className="fp-value-partner-card">
          <div className="fp-value-partner-logo-wrap">
            <img className="fp-value-partner-logo" src="" alt="" />
          </div>
          <span className="fp-value-partner-tag">Branding and Design</span>
          <p className="fp-value-partner-desc">
            Brand strategy, identity systems, and design work that goes beyond
            what in-house can sustain.
          </p>
        </div>

        <div className="fp-value-partner-card">
          <div className="fp-value-partner-logo-wrap">
            <img className="fp-value-partner-logo" src="" alt="" />
          </div>
          <span className="fp-value-partner-tag">Web Development</span>
          <p className="fp-value-partner-desc">
            Builds and CRO-focused development. We brief them, manage them, and
            ensure the work lands on time.
          </p>
        </div>

        <div className="fp-value-partner-card">
          <div className="fp-value-partner-logo-wrap">
            <span className="fp-value-partner-network">Creator Network</span>
          </div>
          <span className="fp-value-partner-tag">Creator Content</span>
          <p className="fp-value-partner-desc">
            Short-form video and UGC at scale. Talent selection, briefing, and
            content delivery managed by us.
          </p>
        </div>

        <div className="fp-value-partner-card">
          <div className="fp-value-partner-logo-wrap">
            <img className="fp-value-partner-logo" src="" alt="" />
          </div>
          <span className="fp-value-partner-tag">SEO and GEO</span>
          <p className="fp-value-partner-desc">
            Search and generative engine optimisation from specialists who live
            and breathe organic growth.
          </p>
        </div>
      </div>

      <footer className="fp-value-footer">
        <span className="fp-value-footer-left">Stackt</span>
        <span className="fp-value-footer-right">06</span>
      </footer>
    </section>
  )

  const Team = () => (
    <section className="fp-team">
      <span className="fp-team-label">Your team</span>

      <h2 className="fp-team-heading reveal">
        Proven people.{" "}
        <strong>Senior oversight. No juniors learning on your budget.</strong>
      </h2>

      <div className="fp-team-grid">
        <div className="fp-team-cards reveal">
          {[
            {
              name: "Ash",
              role: "Strategy",
              desc: "Your strategic lead. Ash brings over a decade of agency experience and is accountable for the direction, quality and output of your stack.",
            },
            {
              name: "Lauren",
              role: "Business Director and AI Enablement Lead — Primary Contact",
              desc: "Senior oversight across all client accounts. Lauren ensures consistency, quality control and that every deliverable is held to the standard it should be.",
            },
            {
              name: "Paige",
              role: "Growth Partner",
              desc: "Driving performance and commercial growth across paid channels. Paige keeps a close eye on where every dollar is going and how every campaign is tracking.",
            },
            {
              name: "Tracey",
              role: "Nurture Lead",
              desc: "Owning your email and lifecycle strategy. Tracey builds the automations, writes the sequences and ensures your nurture engine keeps running.",
            },
          ].map(({ name, role, desc }) => (
            <div key={name} className="fp-team-card">
              <span className="fp-team-card-name">{name}</span>
              <span className="fp-team-card-role">{role}</span>
              <p className="fp-team-card-desc">{desc}</p>
            </div>
          ))}
        </div>

        <div className="fp-team-photo-col reveal">
          <img className="fp-team-photo" src="" alt="" />
        </div>
      </div>

      <footer className="fp-team-footer">
        <span className="fp-team-footer-left">Stackt</span>
        <span className="fp-team-footer-right">07</span>
      </footer>
    </section>
  )

  const Tech = () => {
    const tools = [
      {
        name: "Google Ads",
        purpose: "Paid Search",
        desc: "Campaign architecture, audience segmentation, and budget pacing across AU, NZ, and ROW markets.",
        duration: "2.8s",
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--sky)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 13V9M6 13V6M10 13V8M14 13V3" />
          </svg>
        ),
      },
      {
        name: "Meta Ads",
        purpose: "Paid Social",
        desc: "Full-funnel campaign management across Facebook and Instagram for Furnware and Mindfull.",
        duration: "3.4s",
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--sky)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="3" cy="8" r="1.5" />
            <circle cx="13" cy="3.5" r="1.5" />
            <circle cx="13" cy="12.5" r="1.5" />
            <path d="M4.4 7.3L11.6 4.2M4.4 8.7L11.6 11.8" />
          </svg>
        ),
      },
      {
        name: "Microsoft Dynamics",
        purpose: "Email and CRM",
        desc: "Automation setup, lifecycle flows, and segmentation. Your nurture engine, built to run on its own.",
        duration: "3.0s",
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--sky)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="12" height="9" rx="1.5" />
            <path d="M2 6L8 10L14 6" />
          </svg>
        ),
      },
      {
        name: "GA4 and GTM",
        purpose: "Analytics and Tracking",
        desc: "Full ownership of your analytics setup. Clean data, accurate attribution, and reporting you can act on.",
        duration: "2.6s",
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--sky)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="2,12 5,7.5 8.5,9.5 13,3" />
            <path d="M2 12H14" />
          </svg>
        ),
      },
      {
        name: "Claude and AI Tools",
        purpose: "AI Enablement",
        desc: "Workflow automation, content scaling, and reporting infrastructure. We configure the tools and train your team.",
        duration: "3.6s",
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--sky)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2L9.5 6.5L14 8L9.5 9.5L8 14L6.5 9.5L2 8L6.5 6.5Z" />
          </svg>
        ),
      },
      {
        name: "Framer",
        purpose: "Web and Landing Pages",
        desc: "Fast, conversion-focused landing pages and campaign assets built and iterated without waiting on a dev queue.",
        duration: "3.2s",
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--sky)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="2" width="10" height="5" rx="1" />
            <rect x="3" y="9" width="6" height="5" rx="1" />
          </svg>
        ),
      },
    ]

    return (
      <section className="fp-tech">
        <span className="fp-tech-label">Your tech stack</span>

        <h2 className="fp-tech-heading reveal">
          The infrastructure that makes the whole thing run{" "}
          <strong>faster, smarter, and more visible.</strong>
        </h2>

        <div className="fp-tech-grid reveal">
          {tools.map(({ name, purpose, desc, duration, icon }) => (
            <div key={name} className="fp-tech-card">
              <div className="fp-tech-icon" style={{ animationDuration: duration }}>
                {icon}
              </div>
              <span className="fp-tech-name">{name}</span>
              <span className="fp-tech-purpose">{purpose}</span>
              <p className="fp-tech-desc">{desc}</p>
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

  const Pricing = () => {
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
      <section className="fp-pricing">
        <span className="fp-pricing-label">Your stack, your choice</span>

        <h2 className="fp-pricing-heading reveal">
          Three tiers. One direction.
          <br />
          <strong>All compounding from day one.</strong>
        </h2>

        <div className="fp-pricing-grid">
          {tiers.map(({ cls, name, price, desc, delay, features }) => (
            <div
              key={name}
              className={`fp-tier ${cls} reveal`}
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

        <p className="fp-pricing-note reveal">
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

  const CTA = () => (
    <section className="fp-cta">
      <div className="fp-cta-orb" />
      <img className="fp-cta-bg-photo" src="" alt="" />

      <div className="fp-cta-content">
        <span className="fp-cta-label reveal">Next steps</span>

        <h2
          className="fp-cta-headline reveal"
          style={{ transitionDelay: "0.1s" }}
        >
          90 days from
          <br />
          now, something
          <br />
          will exist that
          <br />
          <span className="fp-cta-headline-accent">did not today.</span>
        </h2>

        <p
          className="fp-cta-body reveal"
          style={{ transitionDelay: "0.2s" }}
        >
          Let us get the right tier locked in, confirm the scope and kick off
          your first 90-day block. The sooner we start, the sooner it compounds.
        </p>

        <div
          className="fp-cta-buttons reveal"
          style={{ transitionDelay: "0.3s" }}
        >
          <a
            href={`mailto:${contactEmail}`}
            className="fp-cta-btn-primary"
          >
            Let us get started
          </a>
          <a
            href={`mailto:${contactEmail}`}
            className="fp-cta-btn-secondary"
          >
            Ask a question
          </a>
        </div>

        <footer className="fp-cta-footer">
          <span className="fp-cta-footer-left">Stackt — Confidential</span>
          <span className="fp-cta-footer-right">10</span>
        </footer>
      </div>
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
      <ValueStack />
      <Team />
      <Tech />
      <Pricing />
      <CTA />
    </div>
  )
}

addPropertyControls(FurnwareProposal, {
  clientName: {
    type: ControlType.String,
    title: "Client Name",
    defaultValue: "Furnware",
  },
  contactEmail: {
    type: ControlType.String,
    title: "Contact Email",
    defaultValue: "lauren@stackt.digital",
  },
  selectedTier: {
    type: ControlType.Enum,
    title: "Selected Tier",
    options: ["Ignite", "Amplify", "Surge"],
    defaultValue: "Amplify",
  },
})
