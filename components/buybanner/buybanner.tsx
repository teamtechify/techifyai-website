import Image from "next/image"
import { ButtonMain } from "../buttons/buttons"
import Link from "next/link"

export const BuyBanner = () => {
    return(
        <article className="max-w-[1500px] lg:mx-auto px-4 mx-4 py-20 flex flex-col gap-12 items-center justify-center group relative">
            <figure className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none z-0 group-hover:opacity-50 duration-500 transition-all">
                <Image
                    src={"/images/banner2.png"}
                    alt="Service Offering"
                    className="w-full h-full object-cover"
                    height={1200}
                    width={1920} />
            </figure>
            <h4 className="uppercase text-center text-xl lg:text-5xl text-white relative z-10">
                Your competitors have already made the switch. Will you catch up or get left behind? 
            </h4>
            <Link href="/" className="relative z-10">
                <ButtonMain><span className="text-md lg:text-xl">BOOK A CALL</span></ButtonMain>
            </Link>
        </article>
    )
}