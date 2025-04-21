'use client'

import { useEffect, useState } from "react"
import './dream.css'

const dreamLines = [
  "INCREASE YOUR CONVERSION RATES",
  "SAVE YOU TENS OF THOUSANDS OF DOLLARS",
  "MAKE YOU A TOP PLAYER IN YOUR NICHE",
  "MANAGE YOUR PROJECTS",
  "SCALE FASTER",
  "CUT DOWN YOUR PAYROLL BY UP TO 50%",
  "SKYROCKET YOUR SALES",
  "MAKE YOUR BUSINESS MATCH THE DREAM YOU HAD FOR IT WHEN YOU FIRST STARTED IT.",
  "BUILD THE BUSINESS YOU PICTURED ON DAY ONE.",
  "COMPLETE THE VISION YOU STARTED WITH.",
  "TALK TO NOVA..."
]

export const DreamSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  const isLastReached = currentIndex === dreamLines.length - 1

  useEffect(() => {
    const isLast = currentIndex === dreamLines.length - 1
    if (isLast) return

    const delay = isLast ? 6000 : 2500

    const timer = setTimeout(() => {
      setFadeOut(true)

      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1)
        setFadeOut(false)
      }, 300) // flip-out duration
    }, delay)

    return () => clearTimeout(timer)
  }, [currentIndex])

  return (
    <section className="max-w-7xl mx-auto px-4 text-white pt-20 pb-2">
      {!isLastReached && (
        <h3 className="uppercase text-white text-center pb-2">
          AI ambassador will tell you how Techify AI can
        </h3>
      )}
      <div className="h-[3rem] flex justify-center items-center overflow-hidden">
        <h4
          className={`text-center text-2xl py-2 font-semibold transition-all duration-500 
            ${fadeOut ? 'animate-flip-out' : 'animate-flip-in'}`}
        >
          {dreamLines[currentIndex]}
        </h4>
      </div>
    </section>
  )
}
