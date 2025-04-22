'use client'

import { FadeInComponent } from "@/components/animations"
import { useState } from "react"
import { FaX } from "react-icons/fa6"
import { BannerSection } from "./banner"
import { ChatSection } from "./chat"

export const NovaSections = () => {
  const [isActive, setIsActive] = useState(false)
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  // console.log(selectedServices)

  return (
    <>
      {/* Original position placeholder */}
      {!isActive && (
        <div className="relative bg-black w-full transition-all duration-700 ease-in-out">
          <FadeInComponent>
            <BannerSection selectedServices={selectedServices} setSelectedServices={setSelectedServices} />
            <ChatSection active={isActive} setActive={setIsActive} services={selectedServices} setServices={setSelectedServices} />
          </FadeInComponent>
        </div>
      )}

      {/* Fixed-position animated container */}
      <div
        className={`fixed inset-0 bg-black z-[100] transition-transform duration-700 ease-in-out overflow-y-scroll ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
          }`}
      >
        {isActive && (
          <div
            className="absolute top-4 right-4 hover:scale-105 hover:text-blue-300 text-2xl text-white flex items-center gap-2 cursor-pointer transition-transform duration-300"
            onClick={() => setIsActive(false)}
          >
            <FaX />
          </div>
        )}

        <FadeInComponent>
          <BannerSection selectedServices={selectedServices} setSelectedServices={setSelectedServices} />
          <ChatSection active={isActive} setActive={setIsActive} services={selectedServices} setServices={setSelectedServices} />
        </FadeInComponent>
      </div>
    </>
  )
}
