import React, { useState, useEffect, useRef } from "react"

let addPropertyControls, ControlType
try {
  const framer = require("framer")
  addPropertyControls = framer.addPropertyControls
  ControlType = framer.ControlType
} catch {
  addPropertyControls = () => {}
  ControlType = {}
}

// ── Inject fonts + CSS ──────────────────────────────────────────────────────

function injectAssets() {
  if (!document.getElementById("pf-fonts")) {
    const link = document.createElement("link")
    link.id = "pf-fonts"
    link.rel = "stylesheet"
    link.href =
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700&family=JetBrains+Mono:wght@200;400&display=swap"
    document.head.appendChild(link)
  }

  if (!document.getElementById("pf-styles")) {
    const style = document.createElement("style")
    style.id = "pf-styles"
    style.textContent = CSS
    document.head.appendChild(style)
  }
}

const CSS = `
  :root {
    --pf-charcoal: #262626;
    --pf-stone: #FAFAFA;
    --pf-powder: #EBFCFF;
    --pf-sky: #BBEAF9;
    --pf-mid: #414149;
    --pf-tertiary: #84848f;
    --pf-secondary: #a9a9b1;
    --pf-primary: #f0f0f2;
  }

  .pf-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--pf-charcoal);
    min-height: 100vh;
    width: 100%;
    position: relative;
    overflow: hidden;
  }

  /* ── Step transition wrapper ── */
  .pf-step {
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    animation: pf-fadein 0.55s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes pf-fadein {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Progress dots ── */
  .pf-progress {
    position: fixed;
    top: 28px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    z-index: 100;
  }

  .pf-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--pf-mid);
    transition: background 0.3s ease, transform 0.3s ease;
  }

  .pf-dot.active {
    background: var(--pf-sky);
    transform: scale(1.4);
  }

  .pf-dot.done {
    background: rgba(187,234,249,0.35);
  }

  /* ── Shared nav bar ── */
  .pf-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 28px 64px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    position: relative;
    z-index: 10;
  }

  .pf-nav-logo {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 400;
    font-size: 13px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--pf-primary);
  }

  .pf-nav-meta {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.12em;
    color: var(--pf-tertiary);
  }

  /* ── ─────────────────────────── ── */
  /* ── STEP 1 — WELCOME            ── */
  /* ── ─────────────────────────── ── */

  .pf-welcome {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 80px 64px 100px;
    position: relative;
  }

  .pf-welcome-orb {
    position: absolute;
    top: -20%;
    right: -15%;
    width: 72vw;
    height: 72vw;
    border-radius: 50%;
    background: radial-gradient(circle at 50% 50%, rgba(187,234,249,0.055) 0%, transparent 65%);
    pointer-events: none;
  }

  .pf-welcome-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--pf-sky);
    margin-bottom: 32px;
    display: block;
  }

  .pf-welcome-heading {
    font-size: clamp(42px, 6vw, 96px);
    font-weight: 300;
    line-height: 1.05;
    letter-spacing: -0.035em;
    color: var(--pf-primary);
    margin: 0 0 32px;
    max-width: 820px;
  }

  .pf-welcome-heading strong {
    font-weight: 700;
    color: #ffffff;
  }

  .pf-welcome-sub {
    font-size: clamp(17px, 2vw, 22px);
    font-weight: 300;
    line-height: 1.65;
    color: var(--pf-secondary);
    max-width: 560px;
    margin: 0 0 60px;
  }

  .pf-welcome-cta {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .pf-btn-primary {
    background: var(--pf-sky);
    color: var(--pf-charcoal);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
    font-size: 14px;
    padding: 18px 36px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    letter-spacing: -0.01em;
  }

  .pf-btn-primary:hover {
    background: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(187,234,249,0.18);
  }

  .pf-btn-ghost {
    background: transparent;
    color: var(--pf-tertiary);
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    transition: color 0.2s ease;
    padding: 18px 0;
  }

  .pf-btn-ghost:hover {
    color: var(--pf-primary);
  }

  .pf-welcome-footer {
    position: absolute;
    bottom: 32px;
    right: 64px;
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .pf-welcome-scroll-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--pf-tertiary);
    writing-mode: vertical-rl;
  }

  .pf-welcome-scroll-line {
    width: 1px;
    height: 56px;
    background: rgba(255,255,255,0.08);
    position: relative;
    overflow: hidden;
  }

  .pf-welcome-scroll-line::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--pf-sky);
    animation: pf-travel 1.9s ease-in-out infinite;
  }

  @keyframes pf-travel {
    0%   { transform: translateY(-100%); }
    50%  { transform: translateY(0%); }
    100% { transform: translateY(100%); }
  }

  /* ── ─────────────────────────── ── */
  /* ── STEP 2 — PACKAGE SELECTION  ── */
  /* ── ─────────────────────────── ── */

  .pf-packages-body {
    flex: 1;
    padding: 56px 64px 80px;
    display: flex;
    flex-direction: column;
  }

  .pf-packages-header {
    margin-bottom: 48px;
  }

  .pf-packages-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--pf-tertiary);
    margin-bottom: 16px;
    display: block;
  }

  .pf-packages-heading {
    font-size: clamp(28px, 3.5vw, 48px);
    font-weight: 300;
    letter-spacing: -0.03em;
    color: var(--pf-primary);
    margin: 0;
  }

  .pf-packages-heading strong {
    font-weight: 700;
    color: #ffffff;
  }

  .pf-packages-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    flex: 1;
    align-items: stretch;
  }

  .pf-package-card {
    border-radius: 20px;
    padding: 40px 36px 44px;
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
    position: relative;
    display: flex;
    flex-direction: column;
    border: 2px solid transparent;
  }

  .pf-package-card:hover {
    transform: translateY(-4px);
  }

  .pf-package-card.style-light {
    background: var(--pf-stone);
    color: var(--pf-charcoal);
  }

  .pf-package-card.style-mid {
    background: #1e1e1e;
    border-color: var(--pf-mid);
  }

  .pf-package-card.style-dark {
    background: rgba(0,0,0,0.5);
    border-color: rgba(187,234,249,0.2);
  }

  .pf-package-card.selected.style-light {
    border-color: var(--pf-charcoal);
    box-shadow: 0 0 0 2px var(--pf-charcoal);
  }

  .pf-package-card.selected.style-mid {
    border-color: var(--pf-sky);
    box-shadow: 0 0 0 1px var(--pf-sky), 0 16px 48px rgba(187,234,249,0.1);
  }

  .pf-package-card.selected.style-dark {
    border-color: var(--pf-sky);
    box-shadow: 0 0 0 1px var(--pf-sky), 0 16px 48px rgba(187,234,249,0.1);
  }

  .pf-package-select-ring {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 1.5px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease;
  }

  .style-light .pf-package-select-ring {
    border-color: rgba(38,38,38,0.2);
  }

  .style-mid .pf-package-select-ring,
  .style-dark .pf-package-select-ring {
    border-color: var(--pf-mid);
  }

  .pf-package-card.selected .pf-package-select-ring {
    background: var(--pf-sky);
    border-color: var(--pf-sky);
  }

  .pf-package-card.selected.style-light .pf-package-select-ring {
    background: var(--pf-charcoal);
    border-color: var(--pf-charcoal);
  }

  .pf-package-select-check {
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .pf-package-card.selected .pf-package-select-check {
    opacity: 1;
  }

  .pf-package-badge {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 10px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    margin-bottom: 20px;
    display: block;
  }

  .style-light .pf-package-badge { color: rgba(38,38,38,0.38); }
  .style-mid  .pf-package-badge { color: var(--pf-tertiary); }
  .style-dark .pf-package-badge { color: var(--pf-sky); }

  .pf-package-price {
    font-size: clamp(40px, 4.5vw, 60px);
    font-weight: 300;
    letter-spacing: -0.04em;
    line-height: 1;
    margin-bottom: 4px;
    display: block;
  }

  .style-light .pf-package-price { color: var(--pf-charcoal); }
  .style-mid  .pf-package-price { color: #ffffff; }
  .style-dark .pf-package-price { color: #ffffff; }

  .pf-package-billing {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 10px;
    letter-spacing: 0.1em;
    margin-bottom: 28px;
    display: block;
  }

  .style-light .pf-package-billing { color: rgba(38,38,38,0.38); }
  .style-mid  .pf-package-billing { color: var(--pf-tertiary); }
  .style-dark .pf-package-billing { color: var(--pf-tertiary); }

  .pf-package-name {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.01em;
    margin-bottom: 10px;
    display: block;
  }

  .style-light .pf-package-name { color: var(--pf-charcoal); }
  .style-mid  .pf-package-name { color: #ffffff; }
  .style-dark .pf-package-name { color: #ffffff; }

  .pf-package-desc {
    font-size: 15px;
    font-weight: 300;
    line-height: 1.6;
    margin: 0 0 28px;
    padding-bottom: 28px;
    flex: 1;
  }

  .style-light .pf-package-desc {
    color: rgba(38,38,38,0.6);
    border-bottom: 1px solid rgba(38,38,38,0.1);
  }

  .style-mid .pf-package-desc {
    color: var(--pf-secondary);
    border-bottom: 1px solid var(--pf-mid);
  }

  .style-dark .pf-package-desc {
    color: var(--pf-secondary);
    border-bottom: 1px solid rgba(187,234,249,0.12);
  }

  .pf-package-features-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-bottom: 14px;
    display: block;
  }

  .style-light .pf-package-features-label { color: rgba(38,38,38,0.32); }
  .style-mid  .pf-package-features-label { color: var(--pf-tertiary); }
  .style-dark .pf-package-features-label { color: var(--pf-tertiary); }

  .pf-package-features {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 9px;
  }

  .pf-package-feature {
    font-size: 13px;
    font-weight: 300;
    line-height: 1.45;
    padding-left: 16px;
    position: relative;
  }

  .pf-package-feature::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.6em;
    width: 6px;
    height: 1px;
  }

  .style-light .pf-package-feature { color: rgba(38,38,38,0.65); }
  .style-light .pf-package-feature::before { background: rgba(38,38,38,0.28); }

  .style-mid  .pf-package-feature { color: var(--pf-secondary); }
  .style-mid  .pf-package-feature::before { background: var(--pf-tertiary); }

  .style-dark .pf-package-feature { color: var(--pf-secondary); }
  .style-dark .pf-package-feature::before { background: var(--pf-sky); }

  /* ── Package footer bar ── */
  .pf-packages-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 28px 64px;
    border-top: 1px solid var(--pf-mid);
    background: rgba(38,38,38,0.9);
    backdrop-filter: blur(12px);
    position: sticky;
    bottom: 0;
    z-index: 20;
    gap: 20px;
  }

  .pf-packages-footer-note {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--pf-tertiary);
    flex: 1;
  }

  .pf-packages-footer-selected {
    font-size: 14px;
    font-weight: 600;
    color: var(--pf-sky);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pf-packages-footer-selected span {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--pf-tertiary);
  }

  /* ── ─────────────────────────── ── */
  /* ── STEP 3 — SERVICE AGREEMENT  ── */
  /* ── ─────────────────────────── ── */

  .pf-agreement-body {
    flex: 1;
    padding: 56px 64px 100px;
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 64px;
    align-items: start;
  }

  .pf-agreement-left {}

  .pf-agreement-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--pf-tertiary);
    margin-bottom: 16px;
    display: block;
  }

  .pf-agreement-heading {
    font-size: clamp(28px, 3.2vw, 44px);
    font-weight: 300;
    letter-spacing: -0.03em;
    color: var(--pf-primary);
    margin: 0 0 40px;
  }

  .pf-agreement-heading strong {
    font-weight: 700;
    color: #ffffff;
  }

  .pf-agreement-doc {
    background: #1a1a1a;
    border: 1px solid var(--pf-mid);
    border-radius: 16px;
    padding: 48px 48px;
    max-height: 520px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--pf-mid) transparent;
  }

  .pf-agreement-doc::-webkit-scrollbar { width: 4px; }
  .pf-agreement-doc::-webkit-scrollbar-thumb { background: var(--pf-mid); border-radius: 2px; }

  .pf-agreement-doc-title {
    font-size: 18px;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 28px;
    letter-spacing: -0.01em;
  }

  .pf-agreement-clause {
    margin-bottom: 28px;
  }

  .pf-agreement-clause-heading {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 400;
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--pf-sky);
    margin-bottom: 10px;
    display: block;
  }

  .pf-agreement-clause p {
    font-size: 14px;
    font-weight: 300;
    line-height: 1.7;
    color: var(--pf-secondary);
    margin: 0;
  }

  .pf-agreement-clause p + p {
    margin-top: 10px;
  }

  /* ── Right sidebar ── */
  .pf-agreement-right {
    position: sticky;
    top: 32px;
  }

  .pf-agreement-summary {
    background: #1a1a1a;
    border: 1px solid var(--pf-mid);
    border-radius: 16px;
    padding: 36px 32px;
    margin-bottom: 20px;
  }

  .pf-agreement-summary-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 10px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--pf-tertiary);
    margin-bottom: 20px;
    display: block;
  }

  .pf-agreement-summary-tier {
    font-size: 22px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.02em;
    margin-bottom: 4px;
    display: block;
  }

  .pf-agreement-summary-price {
    font-size: 36px;
    font-weight: 300;
    color: var(--pf-sky);
    letter-spacing: -0.04em;
    line-height: 1;
    display: block;
    margin-bottom: 6px;
  }

  .pf-agreement-summary-billing {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 10px;
    letter-spacing: 0.1em;
    color: var(--pf-tertiary);
    margin-bottom: 24px;
    display: block;
  }

  .pf-agreement-summary-divider {
    height: 1px;
    background: var(--pf-mid);
    margin-bottom: 20px;
  }

  .pf-agreement-summary-includes {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--pf-tertiary);
    margin-bottom: 12px;
    display: block;
  }

  .pf-agreement-summary-features {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .pf-agreement-summary-feature {
    font-size: 13px;
    font-weight: 300;
    color: var(--pf-secondary);
    padding-left: 14px;
    position: relative;
    line-height: 1.45;
  }

  .pf-agreement-summary-feature::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.6em;
    width: 5px;
    height: 1px;
    background: var(--pf-sky);
  }

  /* ── Sign block ── */
  .pf-sign-block {
    background: rgba(187,234,249,0.05);
    border: 1px solid rgba(187,234,249,0.15);
    border-radius: 16px;
    padding: 32px 32px;
  }

  .pf-sign-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 10px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--pf-tertiary);
    margin-bottom: 16px;
    display: block;
  }

  .pf-sign-name-input {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--pf-mid);
    border-radius: 8px;
    padding: 14px 16px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: var(--pf-primary);
    outline: none;
    transition: border-color 0.2s ease;
    box-sizing: border-box;
    margin-bottom: 12px;
  }

  .pf-sign-name-input::placeholder {
    color: var(--pf-tertiary);
  }

  .pf-sign-name-input:focus {
    border-color: var(--pf-sky);
  }

  .pf-sign-checkbox-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 20px;
  }

  .pf-sign-checkbox {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 1.5px solid var(--pf-mid);
    flex-shrink: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1px;
    transition: background 0.2s ease, border-color 0.2s ease;
  }

  .pf-sign-checkbox.checked {
    background: var(--pf-sky);
    border-color: var(--pf-sky);
  }

  .pf-sign-checkbox-label {
    font-size: 13px;
    font-weight: 300;
    color: var(--pf-secondary);
    line-height: 1.55;
    cursor: pointer;
  }

  .pf-sign-checkbox-label strong {
    color: var(--pf-primary);
    font-weight: 600;
  }

  .pf-btn-accept {
    width: 100%;
    background: var(--pf-sky);
    color: var(--pf-charcoal);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 700;
    font-size: 14px;
    padding: 18px 24px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease, opacity 0.2s ease;
    letter-spacing: -0.01em;
    box-sizing: border-box;
  }

  .pf-btn-accept:hover:not(:disabled) {
    background: #ffffff;
    transform: translateY(-1px);
  }

  .pf-btn-accept:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  /* ── Accepted state ── */
  .pf-accepted {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 64px;
    text-align: center;
  }

  .pf-accepted-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: rgba(187,234,249,0.1);
    border: 1px solid rgba(187,234,249,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 36px;
  }

  .pf-accepted-heading {
    font-size: clamp(36px, 5vw, 72px);
    font-weight: 300;
    letter-spacing: -0.035em;
    color: var(--pf-primary);
    margin: 0 0 20px;
  }

  .pf-accepted-heading strong {
    font-weight: 700;
    color: #ffffff;
  }

  .pf-accepted-sub {
    font-size: 18px;
    font-weight: 300;
    line-height: 1.65;
    color: var(--pf-secondary);
    max-width: 480px;
    margin: 0 0 48px;
  }

  .pf-accepted-meta {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--pf-sky);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pf-accepted-meta::before {
    content: '';
    display: inline-block;
    width: 24px;
    height: 1px;
    background: var(--pf-sky);
  }

  /* ── Back button ── */
  .pf-back-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--pf-tertiary);
    padding: 0;
    transition: color 0.2s ease;
  }

  .pf-back-btn:hover {
    color: var(--pf-primary);
  }

  /* Responsive */
  @media (max-width: 900px) {
    .pf-packages-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .pf-agreement-body {
      grid-template-columns: 1fr;
    }

    .pf-agreement-right {
      position: static;
    }

    .pf-nav,
    .pf-welcome,
    .pf-packages-body,
    .pf-agreement-body {
      padding-left: 28px;
      padding-right: 28px;
    }

    .pf-packages-footer {
      padding-left: 28px;
      padding-right: 28px;
    }
  }
`

// ── Default data ────────────────────────────────────────────────────────────

const DEFAULT_PACKAGES = [
  {
    name: "Ignite",
    price: "$4,000",
    desc: "The entry stack. Show up consistently, communicate well and start building smarter systems from the ground up.",
    features:
      "Performance marketing Google and Meta AU and NZ,Up to 2 EDMs per month,Basic Dynamics automation setup,GA4 and GTM ownership,Organic social management,Monthly performance reporting,Quarterly 90-day review",
    style: "light",
  },
  {
    name: "Amplify",
    price: "$6,800",
    desc: "The full growth stack. More channels, more automation, and the AI systems that keep compounding value over time.",
    features:
      "Everything in Ignite plus,Google and Meta across AU NZ and ROW,Furnware and Mindfull ad accounts,Up to 3 EDMs per month,Dynamics workflow automation,AI enablement and content systems,Digital design support,Bi-weekly performance review,Partner activation as scoped",
    style: "mid",
  },
  {
    name: "Surge",
    price: "$8,000",
    desc: "The complete stack. Every channel, every system, every specialist. Built for businesses ready to move fast and compound hard.",
    features:
      "Everything in Amplify plus,Full AI workflow and automation suite,Creator management and UGC,Stackt Partners on-demand,Senior strategy sessions monthly,Custom reporting dashboard,Priority response SLA,Flexible scope for seasonal peaks,Full team and channel coverage",
    style: "dark",
  },
]

const DEFAULT_AGREEMENT_CLAUSES = [
  {
    heading: "1. Scope of services",
    text: "Stackt Digital Limited (Stackt) agrees to provide the services outlined in the selected package tier as detailed in this proposal. Services commence from the agreed start date and are delivered on a monthly retainer basis. Any scope changes outside the agreed tier must be mutually agreed in writing prior to commencement.",
  },
  {
    heading: "2. Term and renewal",
    text: "This agreement operates on an initial three-month term, aligning with the 90-day review rhythm. Following the initial term, the agreement rolls monthly with 30 days written notice required from either party to terminate. Stackt will provide a 90-day review at the end of each quarter.",
  },
  {
    heading: "3. Fees and payment",
    text: "The monthly retainer fee is as specified in the selected package, exclusive of GST. Invoices are issued on the first business day of each month and are payable within 14 days. Ad spend is billed separately and directly to the client. Late payment may result in suspension of services.",
  },
  {
    heading: "4. Intellectual property",
    text: "All creative assets, reports, and deliverables produced by Stackt remain the property of the client upon receipt of full payment for the relevant period. Stackt retains the right to reference the engagement as a case study, subject to client approval.",
  },
  {
    heading: "5. Confidentiality",
    text: "Both parties agree to keep the terms of this agreement and any shared business information confidential. This obligation survives termination of the agreement. Neither party will disclose confidential information to any third party without prior written consent.",
  },
  {
    heading: "6. Performance and liability",
    text: "Stackt will use commercially reasonable efforts to deliver agreed services. Marketing outcomes depend on numerous factors outside Stackt's control. Stackt's liability is limited to the fees paid in the preceding calendar month. Stackt is not liable for indirect, consequential, or incidental damages.",
  },
  {
    heading: "7. Amendments",
    text: "This agreement may be amended by mutual written consent. Either party may request a scope review at any 90-day checkpoint. Any amendments take effect from the next billing cycle unless otherwise agreed.",
  },
]

// ── Sub-components ──────────────────────────────────────────────────────────

function Nav({ step, onBack, clientName, contactEmail }) {
  return (
    <nav className="pf-nav">
      <span className="pf-nav-logo">Stackt</span>
      <span className="pf-nav-meta">
        {clientName} · {contactEmail}
      </span>
    </nav>
  )
}

function ProgressDots({ step, total = 3 }) {
  return (
    <div className="pf-progress">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`pf-dot${i === step ? " active" : i < step ? " done" : ""}`}
        />
      ))}
    </div>
  )
}

// ── Step 1: Welcome ─────────────────────────────────────────────────────────

function StepWelcome({ welcomeTitle, welcomeSubtitle, welcomeEyebrow, onNext }) {
  const lines = welcomeTitle.split("|").map((l) => l.trim())

  return (
    <div className="pf-step">
      <div className="pf-welcome">
        <div className="pf-welcome-orb" />

        <span className="pf-welcome-eyebrow">{welcomeEyebrow}</span>

        <h1 className="pf-welcome-heading">
          {lines.map((line, i) =>
            i === lines.length - 1 ? (
              <strong key={i}>{line}</strong>
            ) : (
              <span key={i}>
                {line}
                <br />
              </span>
            )
          )}
        </h1>

        <p className="pf-welcome-sub">{welcomeSubtitle}</p>

        <div className="pf-welcome-cta">
          <button className="pf-btn-primary" onClick={onNext}>
            View packages
          </button>
        </div>

        <div className="pf-welcome-footer">
          <span className="pf-welcome-scroll-label">Scroll</span>
          <div className="pf-welcome-scroll-line" />
        </div>
      </div>
    </div>
  )
}

// ── Step 2: Package Selection ───────────────────────────────────────────────

function StepPackages({ packages, selected, onSelect, onNext, onBack, footerNote }) {
  const pkg = packages.find((p) => p.name === selected)

  return (
    <div className="pf-step">
      <div className="pf-packages-body">
        <div className="pf-packages-header">
          <span className="pf-packages-eyebrow">Your stack, your choice</span>
          <h2 className="pf-packages-heading">
            Select the package that <strong>suits your needs.</strong>
          </h2>
        </div>

        <div className="pf-packages-grid">
          {packages.map((pkg) => {
            const styleClass =
              pkg.style === "light"
                ? "style-light"
                : pkg.style === "dark"
                ? "style-dark"
                : "style-mid"
            const isSelected = pkg.name === selected
            const features = pkg.features.split(",").map((f) => f.trim())

            return (
              <div
                key={pkg.name}
                className={`pf-package-card ${styleClass}${isSelected ? " selected" : ""}`}
                onClick={() => onSelect(pkg.name)}
              >
                <div className="pf-package-select-ring">
                  <svg
                    className="pf-package-select-check"
                    width="10"
                    height="8"
                    viewBox="0 0 10 8"
                    fill="none"
                  >
                    <path
                      d="M1 4L3.8 7L9 1"
                      stroke={pkg.style === "light" ? "#fff" : "#262626"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <span className="pf-package-badge">{pkg.name}</span>
                <span className="pf-package-price">{pkg.price}</span>
                <span className="pf-package-billing">per month + GST</span>
                <span className="pf-package-name">{pkg.name}</span>
                <p className="pf-package-desc">{pkg.desc}</p>
                <span className="pf-package-features-label">What's included</span>
                <ul className="pf-package-features">
                  {features.map((f, i) => (
                    <li key={i} className="pf-package-feature">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>

      <footer className="pf-packages-footer">
        <button className="pf-back-btn" onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M9 2L4 7L9 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>

        <span className="pf-packages-footer-note">{footerNote}</span>

        <div className="pf-packages-footer-selected">
          {selected ? (
            <>
              <span>Selected:</span> {selected}
            </>
          ) : (
            <span>Select a package to continue</span>
          )}
        </div>

        <button
          className="pf-btn-primary"
          onClick={onNext}
          disabled={!selected}
          style={{ opacity: selected ? 1 : 0.4, cursor: selected ? "pointer" : "not-allowed" }}
        >
          Continue
        </button>
      </footer>
    </div>
  )
}

// ── Step 3: Service Agreement ───────────────────────────────────────────────

function StepAgreement({
  packages,
  selected,
  clauses,
  onBack,
  accepted,
  onAccept,
  clientName,
  contactEmail,
  companyName,
}) {
  const [name, setName] = useState("")
  const [checked, setChecked] = useState(false)
  const pkg = packages.find((p) => p.name === selected) || packages[0]
  const features = pkg.features.split(",").map((f) => f.trim())
  const today = new Date().toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  if (accepted) {
    return (
      <div className="pf-step">
        <div className="pf-accepted">
          <div className="pf-accepted-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M5 14L11 20L23 8"
                stroke="var(--pf-sky)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h2 className="pf-accepted-heading">
            Proposal <strong>accepted.</strong>
          </h2>

          <p className="pf-accepted-sub">
            You're locked in on the <strong style={{ color: "var(--pf-primary)", fontWeight: 600 }}>{selected}</strong> package.
            The Stackt team will be in touch within one business day to get your first 90-day block underway.
          </p>

          <span className="pf-accepted-meta">
            {contactEmail}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="pf-step">
      <div className="pf-agreement-body">
        <div className="pf-agreement-left">
          <span className="pf-agreement-eyebrow">Service agreement</span>
          <h2 className="pf-agreement-heading">
            Review and <strong>accept the terms.</strong>
          </h2>

          <div className="pf-agreement-doc">
            <p className="pf-agreement-doc-title">
              Service Agreement — {companyName || clientName} × Stackt Digital
            </p>

            <div className="pf-agreement-clause">
              <span className="pf-agreement-clause-heading">Parties</span>
              <p>
                This agreement is between <strong style={{ color: "var(--pf-primary)" }}>{companyName || clientName}</strong> ("Client") and{" "}
                <strong style={{ color: "var(--pf-primary)" }}>Stackt Digital Limited</strong> ("Stackt"), effective from{" "}
                <strong style={{ color: "var(--pf-primary)" }}>{today}</strong>.
              </p>
              <p>
                The Client has selected the <strong style={{ color: "var(--pf-sky)" }}>{selected}</strong> package at{" "}
                <strong style={{ color: "var(--pf-sky)" }}>{pkg.price} per month + GST</strong>.
              </p>
            </div>

            {clauses.map((clause, i) => (
              <div key={i} className="pf-agreement-clause">
                <span className="pf-agreement-clause-heading">{clause.heading}</span>
                {clause.text.split("|").map((para, j) => (
                  <p key={j}>{para.trim()}</p>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="pf-agreement-right">
          <div className="pf-agreement-summary">
            <span className="pf-agreement-summary-label">Selected package</span>
            <span className="pf-agreement-summary-tier">{pkg.name}</span>
            <span className="pf-agreement-summary-price">{pkg.price}</span>
            <span className="pf-agreement-summary-billing">per month + GST</span>
            <div className="pf-agreement-summary-divider" />
            <span className="pf-agreement-summary-includes">What's included</span>
            <ul className="pf-agreement-summary-features">
              {features.slice(0, 6).map((f, i) => (
                <li key={i} className="pf-agreement-summary-feature">
                  {f}
                </li>
              ))}
              {features.length > 6 && (
                <li className="pf-agreement-summary-feature" style={{ color: "var(--pf-tertiary)", fontStyle: "italic" }}>
                  +{features.length - 6} more
                </li>
              )}
            </ul>
          </div>

          <div className="pf-sign-block">
            <span className="pf-sign-label">Sign to accept</span>

            <input
              className="pf-sign-name-input"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="pf-sign-checkbox-row" onClick={() => setChecked(!checked)}>
              <div className={`pf-sign-checkbox${checked ? " checked" : ""}`}>
                {checked && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4L3.8 7L9 1"
                      stroke="#262626"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span className="pf-sign-checkbox-label">
                I have read and agree to the{" "}
                <strong>terms and conditions</strong> of this service agreement.
              </span>
            </div>

            <button
              className="pf-btn-accept"
              disabled={!name.trim() || !checked}
              onClick={() => onAccept(name)}
            >
              Accept proposal
            </button>
          </div>

          <div style={{ marginTop: 16 }}>
            <button className="pf-back-btn" onClick={onBack}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M9 2L4 7L9 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to packages
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────

export default function ProposalFlow({
  clientName = "Furnware",
  companyName = "",
  contactEmail = "lauren@stackt.digital",
  welcomeEyebrow = "Confidential proposal",
  welcomeTitle = "Welcome to your|proposal.",
  welcomeSubtitle = "Please select the service package that suits your needs. Review the terms and accept to lock in your first 90-day block.",
  packages = DEFAULT_PACKAGES,
  footerNote = "All tiers include account management, quarterly 90-day review, and ClickUp project visibility. Pricing is ex-GST. Ad spend billed separately.",
  clauses = DEFAULT_AGREEMENT_CLAUSES,
  defaultSelectedPackage = "",
}) {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState(defaultSelectedPackage || "")
  const [accepted, setAccepted] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    injectAssets()
  }, [])

  useEffect(() => {
    if (rootRef.current) {
      rootRef.current.scrollTo({ top: 0, behavior: "smooth" })
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [step])

  function handleAccept(name) {
    setAccepted(true)
  }

  return (
    <div className="pf-root" ref={rootRef}>
      <ProgressDots step={accepted ? 3 : step} total={3} />
      <Nav step={step} clientName={clientName} contactEmail={contactEmail} />

      {step === 0 && (
        <StepWelcome
          welcomeTitle={welcomeTitle}
          welcomeSubtitle={welcomeSubtitle}
          welcomeEyebrow={welcomeEyebrow}
          onNext={() => setStep(1)}
        />
      )}

      {step === 1 && (
        <StepPackages
          packages={packages}
          selected={selected}
          onSelect={setSelected}
          onNext={() => setStep(2)}
          onBack={() => setStep(0)}
          footerNote={footerNote}
        />
      )}

      {step === 2 && (
        <StepAgreement
          packages={packages}
          selected={selected}
          clauses={clauses}
          onBack={() => setStep(1)}
          accepted={accepted}
          onAccept={handleAccept}
          clientName={clientName}
          companyName={companyName}
          contactEmail={contactEmail}
        />
      )}
    </div>
  )
}

addPropertyControls(ProposalFlow, {
  clientName: {
    type: ControlType.String,
    title: "Client Name",
    defaultValue: "Furnware",
  },
  companyName: {
    type: ControlType.String,
    title: "Company Name",
    description: "Full legal name for the agreement. Defaults to Client Name.",
    defaultValue: "",
  },
  contactEmail: {
    type: ControlType.String,
    title: "Contact Email",
    defaultValue: "lauren@stackt.digital",
  },
  welcomeEyebrow: {
    type: ControlType.String,
    title: "Welcome Eyebrow",
    defaultValue: "Confidential proposal",
  },
  welcomeTitle: {
    type: ControlType.String,
    title: "Welcome Title",
    description: "Use | to split into lines. Last line is rendered bold.",
    defaultValue: "Welcome to your|proposal.",
  },
  welcomeSubtitle: {
    type: ControlType.String,
    title: "Welcome Subtitle",
    defaultValue:
      "Please select the service package that suits your needs. Review the terms and accept to lock in your first 90-day block.",
  },
  defaultSelectedPackage: {
    type: ControlType.Enum,
    title: "Pre-selected Package",
    options: ["", "Ignite", "Amplify", "Surge"],
    optionTitles: ["None", "Ignite", "Amplify", "Surge"],
    defaultValue: "",
  },
  footerNote: {
    type: ControlType.String,
    title: "Packages Footer Note",
    defaultValue:
      "All tiers include account management, quarterly 90-day review, and ClickUp project visibility. Pricing is ex-GST. Ad spend billed separately.",
  },
  packages: {
    type: ControlType.Array,
    title: "Packages",
    control: {
      type: ControlType.Object,
      controls: {
        name: { type: ControlType.String, title: "Name", defaultValue: "Package" },
        price: { type: ControlType.String, title: "Price", defaultValue: "$0,000" },
        desc: { type: ControlType.String, title: "Description", defaultValue: "Package description." },
        features: {
          type: ControlType.String,
          title: "Features",
          description: "Comma separated",
          defaultValue: "Feature one,Feature two",
        },
        style: {
          type: ControlType.Enum,
          title: "Card Style",
          options: ["light", "mid", "dark"],
          defaultValue: "mid",
        },
      },
    },
    defaultValue: DEFAULT_PACKAGES,
  },
})
