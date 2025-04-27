import { VanishInput } from "@/components/inputs/vanishinput";
import Image from "next/image";
import { useEffect, useRef } from "react";
import './chat.css';



export const ChatSection = ({ active, setActive, services, setServices }: { active: boolean, setActive: (active: boolean) => void, services: Array<string>, setServices: (services: Array<string>) => void }) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Enhanced scroll behavior
  useEffect(() => {
    if (active && sectionRef.current) {
      // No longer need to prevent body scroll
      document.body.style.overflow = '';

      // Scroll to this section with offset
      const yOffset = -50; // Adjust based on testing
      const element = sectionRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [active]);


  return (
    <section
      ref={sectionRef}
      id="nova-chat-section" // Add ID for precise scrolling
      className={`w-full bg-black border-t-[2px] border-white/20 relative transition-all duration-500 ease-in-out parent ${active
        ? 'min-h-[90vh] z-30 overflow-y-auto' // Tall height instead of fixed positioning
        : 'min-h-[240px]' // Normal height when inactive
        }`}
    // Remove scroll-margin-top as we'll handle scrolling differently
    >
      <div className={`blue-glow pointer-events-none ${active ? 'opacity-50' : ''}`} />
      <div className={`max-w-7xl relative mx-auto ${active ? 'h-full flex flex-col' : ''}`}>
        {/* Nova Glow - adjust position/opacity for active state if needed */}
        <div className={`absolute left-1/2 -translate-x-1/2 pointer-events-none ${active ? 'top-0' : ''}`}>
          <Image
            src='/images/NOVA_GLOW.png'
            width={400}
            height={200}
            alt="glow"
            className={`brightness-50 ${active ? 'opacity-10' : 'opacity-20'}`} />
        </div>
        {/* VanishInput takes full height in active state */}
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
