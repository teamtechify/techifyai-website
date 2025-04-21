import { ButtonGhost } from "@/components/buttons/buttons"
import Image from "next/image"
import Link from "next/link"

export const RevolutionSection = () => {
    return (
        <section className="max-w-[1500px] px-4 mx-auto section">
            <h2 className="title">Don't Fall Behind</h2>
            <div className="w-full bg-black group relative border-[1px] border-white/20">
                <figure className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none z-0 group-hover:opacity-5 duration-1000 transition-all">
                    <Image
                        src={'/images/service_bg6.png'}
                        alt="Service Offering"
                        className="w-full h-full object-cover"
                        height={2048}
                        width={2048}
                    />
                </figure>

                <div className="relative z-10 group-hover duration-500 transition-all p-4 lg:p-20 w-full">
                    <h2 className="text-center text-white text-xl lg:text-5xl font-bold uppercase duration-500 transition-all max-w-[768px] mx-auto">
                        AI is the 4th Industrial Revolution.
                    </h2>
                    <p className="text-center text-[14px] lg:text-xl text-base mt-2 text-white duration-500 transition-all max-w-[512px] mx-auto mt-8">
                        Businesses that do not use AI are already falling behind. 
                        <br /><br />
                        Dozens of employees, software, and a huge payroll. 
                        <br /><br />
                        The truth is, you are not only overpaying but also moving slower than you should. 
                        <br /><br />
                        AI is cutting costs, saving time, and making companies grow faster than ever. 
                    </p>
                    <div className="flex justify-center mt-4 lg:mt-20">
                        <Link href="/"><ButtonGhost large>BOOK A CALL NOW</ButtonGhost></Link>
                    </div>
                </div>
            </div>
        </section>
    )
}