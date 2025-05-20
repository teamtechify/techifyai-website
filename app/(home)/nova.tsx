'use client'

import { FadeInComponent } from "@/components/animations"
import { useState } from "react"
import { FaX } from "react-icons/fa6"
import { BannerSection } from "./banner"
import { ChatSection } from "./chat"
import { cn } from "@/lib/utils"

export const NovaSections = () => {
  const [chatActive, setChatActive] = useState(false)
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  // Ensure this glow is behind the content that will be above it.
  // NovaSections itself is z-40. ChatSection is z-30 (but inside a new z-1 wrapper).
  // The fixed glow can be z-0 relative to NovaSections stacking context.
  const glowClasses = `blue-glow pointer-events-none transition-opacity duration-300 ${chatActive ? 'opacity-50 fixed bottom-0 left-0 right-0 h-[100px] z-0' : 'opacity-0'}`

  return (
    <>
      {/* Main container for chat and services, modal-like */}
      <div
        id="nova-sections-scroll-container" // Keep ID for potential direct manipulation/styling
        className={`w-full bg-black transition-opacity duration-500 ${chatActive
            ? 'opacity-100 fixed inset-0 z-40 overflow-y-auto' 
            : 'opacity-100 relative' // When inactive, it should be visible and part of normal flow, not hidden with -z-10 or h-0
        }`}
      >
        {/* Fixed blue glow at the very bottom of the viewport when chat is active */}
        {chatActive && <div className={glowClasses} />}

        {/* 
          Content Wrapper: 
          - When chat is active: Stretches to fill NovaSections (min-h-full), provides padding at bottom for input area + space above fixed glow.
          - When chat is NOT active: Takes natural height.
        */}
        <div 
          className={`relative flex flex-col ${chatActive ? 'min-h-full' : ''}`}
          style={chatActive ? { zIndex: 1 } : {}} // Ensures this content wrapper is above the fixed glow when chat is active
        >
          {/* Services Banner: Takes its natural height */}
          <BannerSection 
            selectedServices={selectedServices} 
            setSelectedServices={setSelectedServices} 
            isActive={chatActive} 
          />

          {/* Horizontal Line Separator - only when chat is active */}
          {chatActive && <hr className="border-t border-neutral-700 my-0" />}
          
          {/* 
            Chat Area Wrapper: 
            - When chat is active: Takes all remaining space (flex-1, min-h-0).
            - When chat is NOT active: ChatSection will determine its own (smaller) height.
          */}
          <div className={`relative ${chatActive ? 'flex-1 flex flex-col min-h-0' : ''}`}> 
             <ChatSection 
               active={chatActive} 
               setActive={setChatActive} 
               services={selectedServices} 
               setServices={setSelectedServices}
               className={chatActive ? "flex-1 flex flex-col min-h-0" : ""} 
             />
          </div>
        </div>
      </div>

      {/* Close button for chat - only when active */}
      {chatActive && (
        <div
          className="fixed top-6 right-6 hover:scale-110 hover:text-blue-300 text-3xl text-white cursor-pointer transition-all duration-300 z-50"
          onClick={() => setChatActive(false)}
          aria-label="Close chat"
        >
          <FaX />
        </div>
      )}
    </>
  )
}
