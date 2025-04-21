import { ContainerBig } from "@/components/containers/containerBig"
import Link from "next/link"
import Image from "next/image"
import { FormatNumberWithCommas } from "@/components/graphs"
import { FaArrowRight } from "react-icons/fa6"

const DATAARRAY = [
    {
        address: "J8NPO6CH...SJJU",
        holdings: 500000000,
        value: 507000,
        updated: '13 MINS AGO',
        href: '/'
    },
    {
        address: "J8NPO6CH...SJJU",
        holdings: 500000000,
        value: 507000,
        updated: '13 MINS AGO',
        href: '/'
    },
    {
        address: "J8NPO6CH...SJJU",
        holdings: 500000000,
        value: 507000,
        updated: '13 MINS AGO',
        href: '/'
    },
    {
        address: "J8NPO6CH...SJJU",
        holdings: 500000000,
        value: 507000,
        updated: '13 MINS AGO',
        href: '/'
    },
    {
        address: "J8NPO6CH...SJJU",
        holdings: 500000000,
        value: 507000,
        updated: '13 MINS AGO',
        href: '/'
    },
    {
        address: "J8NPO6CH...SJJU",
        holdings: 500000000,
        value: 507000,
        updated: '13 MINS AGO',
        href: '/'
    },
    {
        address: "J8NPO6CH...SJJU",
        holdings: 500000000,
        value: 507000,
        updated: '13 MINS AGO',
        href: '/'
    },
    {
        address: "J8NPO6CH...SJJU",
        holdings: 500000000,
        value: 507000,
        updated: '13 MINS AGO',
        href: '/'
    },
    {
        address: "J8NPO6CH...SJJU",
        holdings: 500000000,
        value: 507000,
        updated: '13 MINS AGO',
        href: '/'
    },
    {
        address: "J8NPO6CH...SJJU",
        holdings: 500000000,
        value: 507000,
        updated: '13 MINS AGO',
        href: '/'
    },
    {
        address: "J8NPO6CH...SJJU",
        holdings: 500000000,
        value: 507000,
        updated: '13 MINS AGO',
        href: '/'
    },
]

export const DetailsDAOWalletsSection = () => {
    return (
        <ContainerBig>
            <section className=" p-8 relative">
                <h2 className="title">DAO Wallets</h2>
                <table className="w-full">
                    <thead>
                        <tr>
                            <td className="uppercase">
                                WALLET ADDRESS
                            </td>
                            <td className="uppercase">
                                HOLDINGS
                            </td>
                            <td className="uppercase">
                                VALUE IN USD
                            </td>
                            <td className="uppercase">
                                LAST UPDATED
                            </td>
                            <td className="text-right" />
                        </tr>
                    </thead>
                    <tbody>
                        {DATAARRAY.map((wallet, walletkey) => {
                            return (
                                <tr key={`Details-Wallets-Table-Row-${wallet.address}-${walletkey}`}>
                                    <td className="uppercase alt">{wallet.address}</td>
                                    <td className="uppercase flex items-center gap-2">
                                        <Image src="/svg/icon.svg" alt="Icon" height={11} width={11} />
                                        {FormatNumberWithCommas(wallet.holdings)}
                                    </td>
                                    <td className="uppercase">
                                        ${FormatNumberWithCommas(wallet.value)}
                                    </td>
                                    <td className="uppercase alt">
                                        {wallet.updated}
                                    </td>
                                    <td className="uppercase text-right flex justify-end">
                                        <Link className="flex items-center gap-2 pr-[8px]" href={wallet.href}>
                                            {/* @ts-ignore FaArrowRight Bullshit */}
                                            VIEW ASSETS <FaArrowRight />
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