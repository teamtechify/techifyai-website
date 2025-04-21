'use client'

import { ButtonGhost, ButtonMain } from "@/components/buttons/buttons";
import { ContainerMain } from "@/components/containers/containerMain";
import { CoinCanvas } from "@/components/hero/coin";
import { ImageBoxComponent } from "@/components/imagebox/imagebox";

export const SERVICESARRAY = [
    {
        icon: <div className="text-black text-7xl group-hover:text-white transition-all duration-500 group-hover:bg-black rounded-full h-40 w-40 flex items-center justify-center">
            57%
        </div>,
        src: '/images/service_bg3.png', 
        title: 'Increase in conversion rates.', 
        description: `Techify AI's website creation boosted conversions and cut bounce rates by 30%.`, 
        href: '/'
    },
    {
        icon: <div className="text-black text-7xl group-hover:text-white transition-all duration-500 group-hover:bg-black rounded-full h-40 w-40 flex items-center justify-center">
            72%
        </div>,
        src: '/images/service_bg5.png', 
        title: 'Boost in customer engagement.', 
        description: `Techify AI's chat agents boosted engagement and lead qualification by 40%.`, 
        href: '/'
    },
    {
        icon: <div className="text-black text-7xl group-hover:text-white transition-all duration-500 group-hover:bg-black rounded-full h-40 w-40 flex items-center justify-center">
            84%
        </div>,
        src: '/images/service_bg4.png', 
        title: 'Increase in leads.', 
        description: `Techify AI's lead generation doubled quality leads and grew pipeline volume.`, 
        href: '/'
    }
]

export const HeroSection = () => {
    return (
        <section className="px-4 max-w-[1500px] w-full mx-auto">
            <div className="relative">
                <div className="relative w-full flex flex-col justify-center items-center z-0">
                    <h1 className="text-white absolute top-[45%] lg:left-[calc(50%-284px)]">TECHIFY AI</h1>
                    <div className="lg:hidden">
                        <CoinCanvas />
                    </div>
                    <div className="hidden lg:block">
                        <CoinCanvas />
                    </div>
                </div>
                <div className="absolute bottom-16 w-full left-0">
                    <section className="max-w-[1500px] mx-auto flex flex-col items-center gap-4">
                        <div className="relative backdrop-blur-[10px]">
                            <div className="flex flex-col items-center">
                                <h4 className="text-[30px] lg:text-[77px] text-white">
                                    $11,321,123.012
                                </h4>
                                <h5 className="text-dull-green text-[24px] uppercase">
                                    ...saved by techify ai ECOSYSTEM
                                </h5>
                                {/* <div className="flex items-center justify-center mt-8">
                                    <div className="flex items-center px-8 py-4 border-[1px] border-white/10 gap-2">
                                        <p className="text-text-secondary small">PRICE : </p>
                                        <p className="text-white small">$0.01119</p>
                                    </div>
                                    <div className="flex items-center px-8 py-4 border-[1px] border-white/10 gap-2">
                                        <p className="text-text-secondary small">OSOL.D : </p>
                                        <p className="text-white small">0.52%</p>
                                    </div>
                                    <div className="flex items-center px-8 py-4 border-[1px] border-white/10 gap-2">
                                        <p className="text-text-secondary small">HOLDERS  : </p>
                                        <p className="text-white small">51,768</p>
                                    </div>
                                </div> */}
                            </div>
                            
                            <div className="mx-auto w-[720px] h-[1px] bg-white/20 my-4" />
                            <h5 className="text-white text-center uppercase text-[13px]">Be the next one to start saving.</h5>
                            <div className="flex items-center justify-center mt-4 w-full">
                                <ButtonMain>Book a call to start saving with Techify AI Ecosystem</ButtonMain>
                            </div>
                            {/* <div className="p-5 border-[1px] border-white/10 flex flex-row justify-between gap-20 items-center mt-[48px]">
                                <div className="flex flex-col gap-1.5">
                                    <p className="text-text-secondary small">SOLANA CONTRACT ADDRESS</p>
                                    <p className="text-white small">2otVNpcHXn9MKeDk3Zby5uanF3s7tki4toaJ3PZcXaUd</p>
                                </div>
                                <div><ButtonGhost>copy address</ButtonGhost></div>
                            </div>
                            <p className="small text-text-secondary max-w-[1000px] text-center mt-4">Disclaimer: Cryptocurrencies are highly speculative and involve significant risks. The value of OSOL tokens may fluctuate rapidly, and
                                participants should be fully aware of the risks involved in cryptocurrency investments before participating. OSOL is not available to
                                U.S. persons or entities, as defined under U.S. securities laws and regulations. It is the responsibility of participants to ensure that
                                their jurisdiction allows participation before getting involved.
                            </p> */}
                        </div>
                    </section>
                </div>
            </div>
            <h2 className="title pt-20">Winning with AI</h2>
            <div className="flex flex-col lg:flex-row items-stretch gap-4">
                {SERVICESARRAY.map((service, servicekey) => (
                    <div key={`Home-Hero-Services-${servicekey}`} className="w-full h-full">
                    <ImageBoxComponent 
                        src={service.src}
                        icon={service.icon}
                        title={service.title}
                        description={service.description} 
                        href={service.href}
                    />
                    </div>
                ))}
            </div>

        </section>
    )
}