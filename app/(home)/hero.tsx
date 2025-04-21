'use client'

import { ButtonMain } from "@/components/buttons/buttons"
import { AltVideo1Desktop, HeroVideo } from "@/components/video"
import { useEffect, useState } from "react"
import Image from "next/image"
import { FaArrowUpLong } from "react-icons/fa6"
import { BookFormComponent } from "@/components/form/book"

export const HeroSection = () => {
    const [loading, setLoading] = useState(true)
    const [bgLoading, setBGLoading] = useState(true)
    const [booking, setBooking] = useState(false)

    useEffect(() => {
        setTimeout(() => setLoading(false), 1500);
        setTimeout(() => setBGLoading(false), 1500);
    }, [])

    return (
        <section className="relative pt-20 lg:pt-40 pb-8 overflow-hidden">
            <div className={`absolute lg:top-[-100px] left-0 w-full h-full duration-500 transition-all ${bgLoading ? 'opacity-0' : 'opacity-100'}`}>
                <HeroVideo src="2f8877f802e241bd4b51308e41e8ddd5" overlay={`bg-[rgba(0,0,0,.8)] min-h-[240px]`} />
            </div>
            <div className="bottom-fade small z-10" />
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row z-20 relative gap-4">
                <div className="lg:w-5/12 px-4 flex flex-col items-center lg:items-start">
                    <h2 className="uppercase jb text-white text-xl lg:text-3xl text-center lg:text-left">
                        <span className="">We build AI systems so you </span> <br />
                        <span style={{textShadow: "0 0px 8px white"}} className=" text-2xl lg:text-3xl tracking-regular lg:tracking-widest font-extrabold">make more, spend less, and grow faster</span>
                    </h2>
                    <p className="text-white/60 my-8 text-center lg:text-left">
                        Not using AI in your business equals higher costs, slower growth, and being outcompeted.
                    </p>
                    <ButtonMain onClick={() => setBooking(true)}>
                        <div className="lg:text-lg">BOOK A CALL</div> <FaArrowUpLong className="text-xl" />
                    </ButtonMain>
                    <div className="flex items-center gap-2 mt-3">
                        <Image src="/images/students.png" width={69} height={35} alt="Company Logos" />
                        <p className="text-white/60 text-xs"> TRUSTED BY <span className="text-white">100+ BUSINESSES</span></p>
                    </div>
                </div>
                <div className={`lg:w-7/12 border-[2px] border-white/20 transition-all duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                    <AltVideo1Desktop autoplay={true} src="b4125d06814af1359a2ff9220aa57568" overlay={`bg-[rgba(0,0,0,.6)] min-h-[280px] lg:min-h-[410px] duration-500 transition-all ${loading ? 'opacity-0' : 'opacity-100'}`} />
                </div>
            </div>
            {booking && <BookFormComponent close={() => setBooking(false)} />}
        </section>
    )
}