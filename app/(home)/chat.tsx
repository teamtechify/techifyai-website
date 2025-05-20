import { VanishInput } from "@/components/inputs/vanishinput";
import Image from "next/image";
import { useEffect, useRef } from "react";
import './chat.css';

interface ChatSectionProps {
  active: boolean;
  setActive: (active: boolean) => void;
  services: Array<string>;
  setServices: (services: Array<string>) => void;
  className?: string; // Add className as an optional prop
}

export const ChatSection = ({ active, setActive, services, setServices, className }: ChatSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // REINSTATE: Prevent body scroll when chat UI is active (modal-like behavior)
  useEffect(() => {
    if (active) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('chat-active');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('chat-active');
    }
    return () => {
      document.body.style.overflow = ''; // Cleanup on unmount
      document.body.classList.remove('chat-active');
    };
  }, [active]);


  return (
    <section
      ref={sectionRef}
      id="nova-chat-section" 
      className={`w-full relative transition-all duration-500 ease-in-out parent ${active
        // When active: flex column, z-index. Takes natural height within NovaSections scroll.
        ? 'flex flex-col z-30' 
        : 'min-h-[240px]' // Normal height when inactive
        } ${className || ''}`}
    >
      <div className={`blue-glow pointer-events-none ${active ? 'opacity-50' : ''}`} />
      {/* This container takes natural height based on VanishInput, or h-full if inactive for placeholder */}
      <div className={`relative ${active ? 'flex flex-col flex-1 min-h-0' : 'h-full flex flex-col'}`}> 
        {/* Nova Glow - adjust position/opacity for active state if needed */}
        <div className={`absolute left-1/2 -translate-x-1/2 pointer-events-none ${active ? 'top-0' : ''}`}>
          <Image
            src='/images/NOVA_GLOW.png'
            width={400}
            height={200}
            alt="glow"
            className={`brightness-50 ${active ? 'opacity-10' : 'opacity-20'}`} />
        </div>
        <VanishInput
          placeholder="Hi I'm Nova...How can I help you?"
          type="text"
          active={active}
          setActive={setActive}
          services={services}
          setServices={setServices}
        />
      </div>
    </section>
  )
};
