import { VanishInput } from "@/components/inputs/vanishinput";
import Image from "next/image";
import './chat.css'



export const ChatSection = ({active, setActive, services, setServices}:{active: boolean, setActive: Function, services: Array<string>, setServices: Function}) => {
  return (
    <section className={`w-full bg-text-secondary/10 border-t-[2px] border-white/20 relative ${
      active ? 'min-h-screen' : 'min-h-[240px]'
    } transition-all duration-500 ease-in-out parent`}>
        <div className="blue-glow pointer-events-none" />
        <div className="max-w-7xl relative mx-auto ">
            <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none">
                <Image
                src='/images/NOVA_GLOW.png'
                width={400}
                height={200}
                alt="glow"
                className="brightness-50 opacity-20"
                style={{ width: 'auto', height: 'auto' }}/>
            </div>
            <VanishInput placeholder="Hi I'm Nova...How can I help you?" type="text" active={active} setActive={setActive} services={services} setServices={setServices} />
        </div>
    </section>
  )
};