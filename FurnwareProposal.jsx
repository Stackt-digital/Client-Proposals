import React, { useEffect, useRef } from "react"

export default function FurnwareProposal({
  clientName = "Furnware",
  contactEmail = "lauren@stackt.digital",
  selectedTier = "Amplify",
}) {
  const rootRef = useRef(null)

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
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(fontLink)
      document.head.removeChild(style)
    }
  }, [])

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

  return <div ref={rootRef} />
}
