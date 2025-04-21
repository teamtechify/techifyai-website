import { ContainerBig } from "@/components/containers/containerBig"
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import Image from "next/image";
import { FormatNumberWithCommas, PercentageGraph } from "@/components/graphs";

const DATAARRAY = [
    {
      name: "SOL 100M LPS (LOCKED & BURNS FOR UNCOMMITTED LPS)",
      amount: 500000000,
      percentage: 50,
      href: '/'
    },
    {
        name: "SOL 100M LPS (LOCKED & BURNS FOR UNCOMMITTED LPS)",
        amount: 500000000,
        percentage: 50,
        href: '/'
      },
      {
        name: "SOL 100M LPS (LOCKED & BURNS FOR UNCOMMITTED LPS)",
        amount: 500000000,
        percentage: 50,
        href: '/'
      },
      {
        name: "SOL 100M LPS (LOCKED & BURNS FOR UNCOMMITTED LPS)",
        amount: 500000000,
        percentage: 50,
        href: '/'
      },
      {
        name: "SOL 100M LPS (LOCKED & BURNS FOR UNCOMMITTED LPS)",
        amount: 500000000,
        percentage: 50,
        href: '/'
      },
      {
        name: "SOL 100M LPS (LOCKED & BURNS FOR UNCOMMITTED LPS)",
        amount: 500000000,
        percentage: 50,
        href: '/'
      },
      {
        name: "SOL 100M LPS (LOCKED & BURNS FOR UNCOMMITTED LPS)",
        amount: 500000000,
        percentage: 50,
        href: '/'
      },
]
  

export const TokenomicsTreasuriesSection = () =>{
    return(
        <ContainerBig>
            <section className="py-12 px-8 ">
                <h2 className="title">Treasuries</h2>
                <table className="w-full">
                    <thead>
                        <tr>
                            <td className="uppercase">
                                Treasury
                            </td>
                            <td className="uppercase">
                                Allocation
                            </td>
                            <td className="uppercase">
                                Percentage
                            </td>
                            <td className="text-right" />
                        </tr>
                    </thead>
                    <tbody>
                        {DATAARRAY.map((treasury, treasurykey) => {
                            return(
                                <tr key={`Tokenomics-Treasury-Table-Row-${treasury.name}-${treasurykey}`}>
                                    <td className="uppercase">{treasury.name}</td>
                                    <td className="uppercase flex items-center gap-2">
                                        <Image src="/svg/icon.svg" alt="Icon" height={11} width={11} />
                                        {FormatNumberWithCommas(treasury.amount)}
                                    </td>
                                    <td className="uppercase">
                                        <div className="flex items-center gap-2">
                                            {PercentageGraph({amount: treasury.percentage, max: 100})} 
                                            {treasury.percentage}%
                                        </div>
                                    </td>
                                    <td className="uppercase text-right flex justify-end">
                                        <Link className="flex items-center gap-2 pr-[8px]" href={treasury.href}>
                                        {/* @ts-ignore FaArrowRight Bullshit */}
                                            VIEW ON SOLSCAN <FaArrowRight />
                                        </Link>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </section>
        </ContainerBig>
    )
}