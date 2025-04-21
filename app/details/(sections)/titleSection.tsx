import { ContainerBig } from "@/components/containers/containerBig"
import Image from "next/image"


export const DetailsTitleSection = () =>{
     return(
            <section className="mt-20">
           <ContainerBig>
            <div className="relative ">
                <Image
                src='/images/details_1.png'
                width={700}
                height={200}
                alt="details"
                className="w-[100%] absolute left-1/2 -translate-x-1/2 object-contain"/>
            </div>
            <div className="pt-[80px] p-6 flex flex-col lg:max-w-[600px]">
                <h2 className="fuck text-white">$OSOL Details</h2>
                <p className="text-text-secondary small uppercase">OSOL operates as an index fund, <span className="text-white">tracking Solana's top 100 AI projects.</span> Think of OSOL as the S&P500 of Solana-based AI projects, including AI infrastructure projects, AI agents, and AI meme tokens.</p>
            </div>
            
           </ContainerBig>
           </section>
        )
    }