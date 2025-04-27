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
    <div className={`bg-black w-full transition-all duration-700 ease-in-out ${isActive ? 'pb-[50vh]' : ''}`}>
      <FadeInComponent>
        {/* Conditionally render BannerSection only when NOT active */}
        {!isActive && (
          <BannerSection selectedServices={selectedServices} setSelectedServices={setSelectedServices} />
        )}

        {/* Always render ChatSection */}
        <ChatSection active={isActive} setActive={setIsActive} services={selectedServices} setServices={setSelectedServices} />

        {/* Close button when active */}
        {isActive && (
          <div
            className="fixed top-4 right-4 hover:scale-105 hover:text-blue-300 text-2xl text-white flex items-center gap-2 cursor-pointer transition-transform duration-300 z-50"
            onClick={() => setIsActive(false)}
          >
            <FaX />
          </div>
        )}
      </FadeInComponent>
    </div>
  )
}
