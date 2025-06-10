'use client'

import Image from "next/image"
import { FadeInComponent } from "@/components/animations"
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState } from "react"
import { FaChevronLeft, FaChevronRight, FaClock, FaInfo } from "react-icons/fa6"
import './banner.css'
import { SERVICES } from "./banner_data"

export interface ServiceCardType {
    title: string,
    description: string,
    icon: string
}

export interface ServiceType {
    icon: string,
    title: string,
    hook: string,
    description: string,
    cards: Array<ServiceCardType>
}

export const BannerSection = ({ selectedServices, setSelectedServices }:
    { selectedServices: Array<string>, setSelectedServices: Function }) => {
    //service scroll functionality
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: 'start', // items align to the start
        dragFree: false, // enable snapping
    })

    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const [canScrollNext, setCanScrollNext] = useState(false)

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setCanScrollPrev(emblaApi.canScrollPrev())
        setCanScrollNext(emblaApi.canScrollNext())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on('select', onSelect)
        emblaApi.on('reInit', onSelect)
    }, [emblaApi, onSelect])

    //service select functionality 
    const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
    const [showService, setShowService] = useState(false)
    const [fast, setFast] = useState(6.2)
    const [tc, setTC] = useState(1212)

    function getRandomInt(min: number, max: number) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }

    function getRandomFloat(min: number, max: number): number {
        const result = Math.random() * (max - min) + min;
        return Math.round(result * 100) / 100; // rounds to 2 decimal places
      }

    const SelectService = ({ service }: { service: ServiceType }) => {
        const newSelectedServices = [
            ...selectedServices,
            JSON.stringify(service)
        ]
        setSelectedServices(newSelectedServices)
        setSelectedService(service)
    }

    useEffect(() => {
        if (selectedService) {
            setTimeout(() => {
                setShowService(true)
            }, 500)
        }
        setFast(getRandomFloat(5.9, 7.2))
        setTC(getRandomInt(1150, 1375))
    }, [selectedService])

    return (
        <FadeInComponent>
            <section className="lg:px-4 relative mt-12 lg:mt-16 mb-8">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-white uppercase font-bold text-2xl">
                        Our Services
                    </h2>
                </div>
                <div className="relative">
                    {/* Embla Viewport */}
                    <div className="overflow-hidden" ref={emblaRef}>
                        {/* Embla Container */}
                        <div className="flex gap-4 pl-4 lg:pl-20 py-8">
                            {SERVICES.map((service, servicekey) => (
                                <div
                                    className={`${service.title === selectedService?.title && 'shadow-[0px_0px_15px] shadow-white'} group flex-shrink-0 bg-[#0a0a0a] items-center justify-center flex p-3 cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-[0px_0px_25px] hover:shadow-white`}
                                    key={`ServiceScrollBannerItem-${service.title}-${servicekey}`}
                                    onClick={() => SelectService({ service: service })}
                                >
                                    <div className="flex gap-2 lg:gap-4 w-[200px] lg:w-[360px] items-center justify-between">
                                        <div className="shrink-0 pointer-events-none">
                                            <Image src={service.icon} alt="Service Icon" className="w-[32px] h-[32px] lg:w-[52px] lg:h-[52px]" height={52} width={52} />
                                        </div>
                                        <div className="pointer-events-none">
                                            <h3 className={`uppercase ${service.title === selectedService?.title ? 'text-[#0192dc]' : 'text-white'} text-xs lg:text-base font-bold text-right duration-500 transition-all group-hover:text-[#0192dc]`}>{service.title}</h3>
                                            <p className="text-white/60 text-[10px] text-right">{service.hook}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {!selectedService && <div className="py-2">
                        <p className="text-white text-center uppercase px-4">Click on a service to see how you&apos;re leaving money on the table.</p>
                    </div>}

                    {/* Carousel with buttons */}
                    <div className="absolute top-[calc(50%-16px)] left-2 lg:left-4 z-50">
                        {/* Left Button */}
                        <button
                            onClick={scrollPrev}
                            disabled={!canScrollPrev}
                            className="p-2 bg-white text-black hover:scale-110 disabled:opacity-30 rounded-full cursor-pointer"
                        >
                            <FaChevronLeft />
                        </button>
                    </div>

                    <div className="absolute top-[calc(50%-16px)] right-2 lg:right-4 z-50">
                        {/* Right Button */}
                        <button
                            onClick={scrollNext}
                            disabled={!canScrollNext}
                            className="p-2 bg-white text-black hover:scale-110 disabled:opacity-30 rounded-full cursor-pointer"
                        >
                            <FaChevronRight />
                        </button>
                    </div>

                    <div className="right-fade pointer-events-none" />
                    <div className="left-fade pointer-events-none" />
                </div>
                {selectedService && <div className={`relative max-w-7xl mx-auto px-4 duration-1000 transition-all ${showService ? 'opacity-100' : 'opacity-0'}`}>
                    {/* <div className="flex justify-end">
                        <div className="rounded-lg border-white/20 border-[2px] bg-[#0a0a0a] px-3 py-4">
                            <p className="text-white/60 uppercase">{selectedService.title}</p>
                        </div>
                    </div> */}
                    <div className="flex items-center gap-2 text-xs">
                        <FaClock className="text-[#7bf1a8]" /><p className="text-[#7bf1a8]">{fast}X FASTER</p><FaInfo className="text-white/60" /><p className="text-white/60">| {tc} T/C</p>
                    </div>
                    <h3 className="text-white uppercase mt-2 text-base lg:text-xl">{selectedService.title}</h3>
                    <p className="text-white/60 mt-2 lg:mt-4 text-sm lg:text-base">{selectedService.description}</p>
                    <p className="text-white/60 text-xs mt-4 lg:mt-8">HOW?</p>
                    <div className="grid lg:grid-cols-3 gap-3 mt-2 lg:mt-4">
                        {selectedService.cards.map((card, cardkey) => {
                            return (
                                <article key={`Service-Card-${selectedService.title}-${card.title}-${cardkey}`}
                                 className="parent relative bg-black group duration-300 transition-all border-white/20 border-[2px] p-3 lg:p-4 cursor-pointer hover:border-white hover:scale-105">
                                    <div className="service-glow pointer-events-none" />
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                {/* <div className="duration-300 transition-all group-hover:bg-white bg-text-secondary/30 leading-normal text-xs lg:text-[18px] w-[24px] h-[24px] lg:w-[32px] lg:h-[32px] relative rounded-md"><p className="duration-300 transition-all absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 group-hover:text-black text-white">⌘</p></div> */}
                                                <div className="duration-300 transition-all group-hover:bg-white bg-text-secondary/30 leading-normal text-xs lg:text-[18px] w-[24px] h-[24px] lg:w-[32px] lg:h-[32px] relative rounded-md"><p className="duration-300 transition-all absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 group-hover:text-black text-white">{cardkey +1}</p></div>
                                            </div>
                                            {/* <div className="rounded-full bg-white/40 h-6 w-6 duration-300 transition-all group-hover:bg-white flex items-center justify-center">
                                                <FaHandPointer />
                                            </div> */}
                                        </div>
                                        <figure className="flex justify-center mt-0 lg:mt-2 mb-4 lg:mb-8">
                                            <Image src={card.icon} height={48} width={48} alt="Card Icon" className="w-[32px] h-[32px] lg:w-[48px] lg:h-[48px]" />
                                        </figure>
                                        <h4 className="uppercase text-white mb-2 lg:mb-4 text-sm lg:text-base">{card.title}</h4>
                                        <p className="text-white/60 uppercase text-xs lg:text-sm">{card.description}</p>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                </div>}
            </section>
        </FadeInComponent>
    )
}
