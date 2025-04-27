import { VanishInput } from "@/components/inputs/vanishinput";
import Image from "next/image";
import { useEffect, useRef } from "react";
import './chat.css';



export const ChatSection = ({ active, setActive, services, setServices }: { active: boolean, setActive: (active: boolean) => void, services: Array<string>, setServices: (services: Array<string>) => void }) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll into view when activated
  useEffect(() => {
    if (active && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Prevent body scroll when chat is active (full screen)
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when chat is inactive
      document.body.style.overflow = '';
    }
    // Cleanup function to restore scroll on component unmount or state change
    return () => {
      document.body.style.overflow = '';
    };
  }, [active]);

  return (
    <section
      ref={sectionRef}
      className={`w-full bg-black border-t-[2px] border-white/20 relative transition-all duration-500 ease-in-out parent ${active
          ? 'fixed inset-0 z-40 overflow-y-auto' // Full screen when active
          : 'min-h-[240px]' // Normal height when inactive
        }`}
      // Add scroll-margin-top if you have a fixed header
      style={{ scrollMarginTop: active ? '0px' : '80px' /* Adjust if needed */ }}
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
