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

const WE_CSS = `
  .fp-we {
    background: var(--charcoal);
    padding: 100px 80px 80px;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  /* ── Header ── */
  .fp-we-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 12px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--tertiary);
    margin-bottom: 40px;
    display: block;
  }

  .fp-we-heading {
    font-size: clamp(38px, 5.5vw, 72px);
    font-weight: 300;
    line-height: 0.97;
    letter-spacing: -0.035em;
    color: var(--primary);
    margin: 0 0 80px;
    max-width: 720px;
  }
  .fp-we-heading strong { font-weight: 700; }

  /* ── Phones row ── */
  .fp-we-phones {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 32px;
    margin-bottom: 80px;
  }

  .fp-we-phone-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }
  /* Raise the centre phone for visual rhythm */
  .fp-we-phone-col--mid {
    transform: translateY(-32px);
  }

  .fp-we-phone-frame-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--tertiary);
    margin-bottom: 16px;
    text-align: center;
  }

  /* iPhone frame */
  .fp-we-phone-frame {
    position: relative;
    width: 260px;
    height: 563px;
    background: #1a1a1a;
    border-radius: 44px;
    padding: 16px 12px 14px;
    box-shadow:
      inset 0 0 0 1.5px rgba(255,255,255,0.09),
      0 0 0 1px #0a0a0a,
      0 32px 80px rgba(0,0,0,0.7),
      0 8px 24px rgba(0,0,0,0.4);
    flex-shrink: 0;
  }

  /* Side buttons — volume */
  .fp-we-phone-frame::before {
    content: '';
    position: absolute;
    left: -4px;
    top: 88px;
    width: 4px;
    height: 30px;
    background: #2c2c2c;
    border-radius: 3px 0 0 3px;
    box-shadow: 0 44px 0 #2c2c2c, 0 82px 0 #2c2c2c;
  }
  /* Side buttons — power */
  .fp-we-phone-frame::after {
    content: '';
    position: absolute;
    right: -4px;
    top: 130px;
    width: 4px;
    height: 60px;
    background: #2c2c2c;
    border-radius: 0 3px 3px 0;
  }

  /* Screen area */
  .fp-we-phone-screen {
    width: 100%;
    height: 100%;
    background: #000;
    border-radius: 32px;
    overflow: hidden;
    position: relative;
  }

  /* Dynamic island */
  .fp-we-phone-island {
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 24px;
    background: #000;
    border-radius: 12px;
    z-index: 10;
    pointer-events: none;
  }

  /* Home indicator */
  .fp-we-phone-indicator {
    position: absolute;
    bottom: 9px;
    left: 50%;
    transform: translateX(-50%);
    width: 90px;
    height: 5px;
    background: rgba(255,255,255,0.28);
    border-radius: 3px;
    z-index: 10;
    pointer-events: none;
  }

  /* Video / iframe inside screen */
  .fp-we-phone-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
    display: block;
    object-fit: cover;
  }

  /* Placeholder when no URL */
  .fp-we-phone-placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: #111;
    color: rgba(255,255,255,0.18);
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    text-align: center;
    padding: 20px;
  }

  .fp-we-phone-caption {
    font-size: 13px;
    font-weight: 300;
    color: var(--tertiary);
    text-align: center;
    margin-top: 24px;
    max-width: 220px;
    line-height: 1.6;
  }

  /* ── Divider between phones and metrics ── */
  .fp-we-divider {
    height: 1px;
    background: var(--mid);
    margin-bottom: 72px;
  }

  /* ── Metrics section ── */
  .fp-we-metrics-header {
    display: flex;
    align-items: baseline;
    gap: 24px;
    margin-bottom: 40px;
  }

  .fp-we-metrics-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--tertiary);
    flex-shrink: 0;
  }

  .fp-we-metrics-heading {
    font-size: clamp(22px, 2.8vw, 38px);
    font-weight: 300;
    line-height: 1.05;
    letter-spacing: -0.025em;
    color: var(--primary);
    margin: 0;
  }
  .fp-we-metrics-heading strong { font-weight: 700; }

  /* Screenshot grid */
  .fp-we-grid {
    display: grid;
    gap: 20px;
  }
  .fp-we-grid--2 { grid-template-columns: repeat(2, 1fr); }
  .fp-we-grid--3 { grid-template-columns: repeat(3, 1fr); }

  .fp-we-shot {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    background: #1e1e1e;
    border: 1px solid var(--mid);
    transition: border-color 0.25s ease;
  }
  .fp-we-shot:hover { border-color: rgba(187,234,249,0.3); }

  .fp-we-shot-img {
    width: 100%;
    aspect-ratio: 16 / 10;
    object-fit: cover;
    display: block;
  }

  /* Placeholder for empty screenshot slot */
  .fp-we-shot-placeholder {
    width: 100%;
    aspect-ratio: 16 / 10;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.12);
    background: #1e1e1e;
  }

  .fp-we-shot-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 18px;
  }

  .fp-we-shot-caption {
    font-size: 13px;
    font-weight: 300;
    color: var(--secondary);
    line-height: 1.5;
  }

  /* Metric badge */
  .fp-we-shot-metric {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 400;
    font-size: 12px;
    letter-spacing: 0.06em;
    color: var(--charcoal);
    background: var(--sky);
    padding: 4px 10px;
    border-radius: 20px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* ── Footer ── */
  .fp-we-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    margin-top: 64px;
    border-top: 1px solid var(--mid);
  }
  .fp-we-footer-left,
  .fp-we-footer-right {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 200;
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--tertiary);
  }
`

// ─── URL → embed URL ──────────────────────────────────────────────────────────

function toEmbedUrl(url) {
  if (!url || !url.trim()) return null
  const s = url.trim()

  // YouTube
  const yt = s.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/\s]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&mute=1&loop=1&playlist=${yt[1]}&controls=0&playsinline=1`

  // Vimeo
  const vm = s.match(/vimeo\.com\/(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1&loop=1&muted=1&background=1&title=0&byline=0`

  // Already an embed URL or direct file
  return s
}

function isVideoFile(url) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url || "")
}

// ─── Default data ─────────────────────────────────────────────────────────────

const DEFAULT_PHONES = [
  { frameLabel: "Organic Content", videoUrl: "", caption: "Caption for this example" },
  { frameLabel: "Paid Social",     videoUrl: "", caption: "Caption for this example" },
  { frameLabel: "Brand Campaign",  videoUrl: "", caption: "Caption for this example" },
]

const DEFAULT_SHOTS = [
  { image: null, caption: "Meta Ads — December 2025", metric: "+43% ROAS" },
  { image: null, caption: "Klaviyo Revenue — Q4 2025", metric: "2.4× RPR" },
  { image: null, caption: "GA4 Organic Growth", metric: "+61% Sessions" },
  { image: null, caption: "Google Ads Performance", metric: "-28% CPA" },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function WorkExamples({
  label            = "Our Work",
  headingRegular   = "Results we're",
  headingBold      = "proud to show.",
  phones           = DEFAULT_PHONES,
  showMetrics      = true,
  metricsLabel     = "Data + Metrics",
  metricsHeadingRegular = "Numbers that",
  metricsHeadingBold    = "speak for themselves.",
  screenshotColumns = "3",
  screenshots      = DEFAULT_SHOTS,
  footerLeft       = "Stackt — Confidential",
  pageNumber       = "09",
}) {
  useEffect(() => {
    injectFonts()
    injectStyles("fw-base", BASE_CSS)
    injectStyles("fw-we", WE_CSS)
  }, [])

  const shotCols = screenshotColumns === "2" ? 2 : 3

  return (
    <section className="fp-we" style={{ width: "100%" }}>

      {/* Header */}
      <span className="fp-we-label">{label}</span>
      <h2 className="fp-we-heading">
        {headingRegular} <strong>{headingBold}</strong>
      </h2>

      {/* ── iPhone frames ── */}
      <div className="fp-we-phones">
        {phones.slice(0, 3).map((phone, i) => {
          const embedUrl = toEmbedUrl(phone.videoUrl)
          const direct   = embedUrl && isVideoFile(phone.videoUrl)
          const isMid    = phones.length === 3 && i === 1

          return (
            <div key={i} className={`fp-we-phone-col${isMid ? " fp-we-phone-col--mid" : ""}`}>
              {/* Label above frame */}
              {phone.frameLabel
                ? <p className="fp-we-phone-frame-label">{phone.frameLabel}</p>
                : <p className="fp-we-phone-frame-label" style={{ opacity: 0 }}>—</p>
              }

              {/* iPhone frame */}
              <div className="fp-we-phone-frame">
                <div className="fp-we-phone-screen">

                  {/* Dynamic island */}
                  <div className="fp-we-phone-island" />

                  {/* Video content */}
                  {embedUrl && !direct && (
                    <iframe
                      className="fp-we-phone-video"
                      src={embedUrl}
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title={phone.frameLabel || `Phone ${i + 1}`}
                    />
                  )}
                  {embedUrl && direct && (
                    <video
                      className="fp-we-phone-video"
                      src={embedUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  )}
                  {!embedUrl && (
                    <div className="fp-we-phone-placeholder">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
                      </svg>
                      Paste video URL
                    </div>
                  )}

                  {/* Home indicator */}
                  <div className="fp-we-phone-indicator" />
                </div>
              </div>

              {/* Caption below frame */}
              {phone.caption && (
                <p className="fp-we-phone-caption">{phone.caption}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Metrics / screenshots ── */}
      {showMetrics && (
        <>
          <div className="fp-we-divider" />

          <div className="fp-we-metrics-header">
            <span className="fp-we-metrics-label">{metricsLabel}</span>
            <h3 className="fp-we-metrics-heading">
              {metricsHeadingRegular} <strong>{metricsHeadingBold}</strong>
            </h3>
          </div>

          <div className={`fp-we-grid fp-we-grid--${shotCols}`}>
            {screenshots.map((shot, i) => (
              <div key={i} className="fp-we-shot">
                {shot.image
                  ? <img src={shot.image} alt={shot.caption || ""} className="fp-we-shot-img" />
                  : (
                    <div className="fp-we-shot-placeholder">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                      </svg>
                    </div>
                  )
                }
                <div className="fp-we-shot-footer">
                  {shot.caption && (
                    <p className="fp-we-shot-caption">{shot.caption}</p>
                  )}
                  {shot.metric && (
                    <span className="fp-we-shot-metric">{shot.metric}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Footer */}
      <footer className="fp-we-footer">
        <span className="fp-we-footer-left">{footerLeft}</span>
        <span className="fp-we-footer-right">{pageNumber}</span>
      </footer>
    </section>
  )
}

// ─── Framer controls ─────────────────────────────────────────────────────────

addPropertyControls(WorkExamples, {
  label: {
    type: ControlType.String,
    title: "Label",
    defaultValue: "Our Work",
  },
  headingRegular: {
    type: ControlType.String,
    title: "Heading (light)",
    defaultValue: "Results we're",
  },
  headingBold: {
    type: ControlType.String,
    title: "Heading (bold)",
    defaultValue: "proud to show.",
  },

  // ── Phones ──
  phones: {
    type: ControlType.Array,
    title: "Phone Frames",
    maxCount: 3,
    control: {
      type: ControlType.Object,
      controls: {
        frameLabel: {
          type: ControlType.String,
          title: "Label",
          defaultValue: "Campaign Name",
        },
        videoUrl: {
          type: ControlType.String,
          title: "Video URL",
          defaultValue: "",
        },
        caption: {
          type: ControlType.String,
          title: "Caption",
          defaultValue: "",
        },
      },
    },
  },

  // ── Metrics ──
  showMetrics: {
    type: ControlType.Boolean,
    title: "Show Metrics",
    defaultValue: true,
  },
  metricsLabel: {
    type: ControlType.String,
    title: "Metrics Label",
    defaultValue: "Data + Metrics",
    hidden: (props) => !props.showMetrics,
  },
  metricsHeadingRegular: {
    type: ControlType.String,
    title: "Metrics Heading",
    defaultValue: "Numbers that",
    hidden: (props) => !props.showMetrics,
  },
  metricsHeadingBold: {
    type: ControlType.String,
    title: "Metrics Heading Bold",
    defaultValue: "speak for themselves.",
    hidden: (props) => !props.showMetrics,
  },
  screenshotColumns: {
    type: ControlType.Enum,
    title: "Screenshot Cols",
    options: ["2", "3"],
    optionTitles: ["2 columns", "3 columns"],
    defaultValue: "3",
    hidden: (props) => !props.showMetrics,
  },
  screenshots: {
    type: ControlType.Array,
    title: "Screenshots",
    maxCount: 6,
    hidden: (props) => !props.showMetrics,
    control: {
      type: ControlType.Object,
      controls: {
        image: {
          type: ControlType.Image,
          title: "Screenshot",
        },
        caption: {
          type: ControlType.String,
          title: "Caption",
          defaultValue: "Platform — Period",
        },
        metric: {
          type: ControlType.String,
          title: "Metric Badge",
          defaultValue: "+43% ROAS",
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
    defaultValue: "09",
  },
})
