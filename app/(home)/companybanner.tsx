'use client'

import Image from "next/image"
import './companybanner.css'

export const COMPANIES = [
    {
        icon: '/images/companies/uni.png',
        title: 'University.com',
    },
    {
        icon: '/images/companies/kw.png',
        title: 'Keller Williams',
    },
    {
        icon: '/images/companies/dn.png',
        title: "Driver's Net",
    },
    {
        icon: '/images/companies/fcc.png',
        title: "First-Class Citizen",
    },
    {
        icon: '/images/companies/rls.png',
        title: 'RLS-Solutions',
    },
]

export const CompanyBannerSection = () => {
    return (
        <section className="w-full overflow-hidden mb-8">
            <div className="w-full inline-flex flex-nowrap overflow-hidden">
                <ul className="flex items-center justify-center md:justify-start animate-infinite-scroll gap-4">
                    {[...COMPANIES, ...COMPANIES].map((company, index) => (
                        <li
                            key={`${company.title}-${index}`}
                            className="bg-[#0a0a0a] p-3 w-[240px] lg:w-[380px] flex-shrink-0 cursor-pointer hover:scale-105 duration-300 transition-all"
                        >
                            <div className="flex gap-2 lg:gap-4 items-center justify-center">
                                <div className="shrink-0">
                                    <Image src={company.icon} alt="Service Icon" height={40} width={40} className="w-[30px] h-[30px] lg:w-[40px] lg:h-[40px]" />
                                </div>
                                <h3 className="uppercase text-white font-bold text-right text-sm lg:text-xl">
                                    {company.title}
                                </h3>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}