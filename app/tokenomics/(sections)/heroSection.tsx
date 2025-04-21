import { ContainerBig } from "@/components/containers/containerBig"
import Image from "next/image"

export const TokenomicsHeroSection = () => {
    return (
        <section className="mt-[80px]">
            <ContainerBig>
                <div className="relative ">
                    <Image
                        src='/images/details_1.png'
                        width={700}
                        height={200}
                        alt="details"
                        className="w-[100%] absolute left-1/2 -translate-x-1/2 object-contain" />
                </div>
                <div className="pt-[80px] p-6">
                    <h2 className="fuck text-white">Tokenomics</h2>
                </div>

            </ContainerBig>
        </section>
    )
}