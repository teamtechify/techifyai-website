'use client'

import { FormatNumberWithCommasSimple } from '@/components/graphs';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data1 = [
    { name: '01 MAR', aicosts: 72000, earnings: 100000, costs: 75000 },
    { name: '08 MAR', aicosts: 68000, earnings: 120000, costs: 75000 },
    { name: '15 MAR', aicosts: 60000, earnings: 125000, costs: 75000 },
    { name: '22 MAR', aicosts: 42000, earnings: 128000, costs: 75000 },
    { name: '29 MAR', aicosts: 38000, earnings: 129000, costs: 75000 },
    { name: '05 APR', aicosts: 35000, earnings: 145000, costs: 75000 },
];


export const GraphSection = () => {
    const CalculateAICosts = () => {
        let total = 0
        for(let i = 0; i < data1.length; i++) {
            total += data1[i].aicosts
        }
        return total
    }

    const CalculateEarnings = () => {
        let total = 0
        for(let i = 0; i < data1.length; i++) {
            total += data1[i].earnings
        }
        return total
    }

    const CalculateCosts = () => {
        let total = 0
        for(let i = 0; i < data1.length; i++) {
            total += data1[i].costs
        }
        return total
    }

    return (
        <section className='px-4 max-w-7xl mx-auto mt-8'>
            <h2 className="text-white uppercase font-bold text-2xl mb-4">
                Businesses w/ and w/0 ai
            </h2>
            <div className='relative hidden lg:block'>
                <ResponsiveContainer width="100%" height={450}>
                    <LineChart data={data1}>
                        <XAxis dataKey="name" padding={{ left: 60, right: 60 }} />
                        <YAxis />
                        {/* <Tooltip /> */}
                        <Line type="monotone" dataKey="aicosts" stroke="#0192dc" strokeWidth={2} />
                        <Line type="monotone" dataKey="costs" stroke="#b04343" strokeWidth={2} />
                        <Line type="monotone" dataKey="earnings" stroke="#7bf1a8" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
                <div className='w-72 absolute top-0 right-0'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                            <div className='w-4 h-4 rounded-[50px] bg-[#7bf1a8]' />
                            <p className='uppercase text-white/20'>Total Earnings:</p>
                        </div>
                        <p className='text-white'>${FormatNumberWithCommasSimple(CalculateEarnings())}</p>
                    </div>
                </div>
                <div className='w-72 absolute bottom-34 right-0'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                            <div className='w-4 h-4 rounded-[50px] bg-[#0192dc]' />
                            <p className='uppercase text-white/20'>profit w/ ai:</p>
                        </div>
                        <p className='text-white'>${FormatNumberWithCommasSimple(CalculateEarnings() - CalculateAICosts())}</p>
                    </div>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                            <div className='w-4 h-4 rounded-[50px] bg-[#0192dc]' />
                            <p className='uppercase text-white/20'>costs w/ ai:</p>
                        </div>
                        <p className='text-white'>${FormatNumberWithCommasSimple(CalculateAICosts())}</p>
                    </div>
                </div>
                <div className='w-72 absolute bottom-60 right-0'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                            <div className='w-4 h-4 rounded-[50px] bg-[#b04343]' />
                            <p className='uppercase text-white/20'>profit w/o ai:</p>
                        </div>
                        <p className='text-white'>${FormatNumberWithCommasSimple(CalculateEarnings() - CalculateCosts())}</p>
                    </div>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                            <div className='w-4 h-4 rounded-[50px] bg-[#b04343]' />
                            <p className='uppercase text-white/20'>costs w/o ai:</p>
                        </div>
                        <p className='text-white'>${FormatNumberWithCommasSimple(CalculateCosts())}</p>
                    </div>
                </div>
            </div>
            <div className='relative lg:hidden'>
                <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={data1}>
                        <XAxis dataKey="name" padding={{ left: 10, right: 10 }} />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="aicosts" stroke="#0192dc" strokeWidth={2} />
                        <Line type="monotone" dataKey="costs" stroke="#b04343" strokeWidth={2} />
                        <Line type="monotone" dataKey="earnings" stroke="#7bf1a8" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
                <div className='mt-2'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                            <div className='w-4 h-4 rounded-[50px] bg-[#7bf1a8]' />
                            <p className='uppercase text-white/20'>Total Earnings:</p>
                        </div>
                        <p className='text-white'>${FormatNumberWithCommasSimple(CalculateEarnings())}</p>
                    </div>
                </div>
                <div className='mt-2'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                            <div className='w-4 h-4 rounded-[50px] bg-[#0192dc]' />
                            <p className='uppercase text-white/20'>profit w/ ai:</p>
                        </div>
                        <p className='text-white'>${FormatNumberWithCommasSimple(CalculateEarnings() - CalculateAICosts())}</p>
                    </div>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                            <div className='w-4 h-4 rounded-[50px] bg-[#0192dc]' />
                            <p className='uppercase text-white/20'>costs w/ ai:</p>
                        </div>
                        <p className='text-white'>${FormatNumberWithCommasSimple(CalculateAICosts())}</p>
                    </div>
                </div>
                <div className='mt-2'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                            <div className='w-4 h-4 rounded-[50px] bg-[#b04343]' />
                            <p className='uppercase text-white/20'>profit w/o ai:</p>
                        </div>
                        <p className='text-white'>${FormatNumberWithCommasSimple(CalculateEarnings() - CalculateCosts())}</p>
                    </div>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                            <div className='w-4 h-4 rounded-[50px] bg-[#b04343]' />
                            <p className='uppercase text-white/20'>costs w/o ai:</p>
                        </div>
                        <p className='text-white'>${FormatNumberWithCommasSimple(CalculateCosts())}</p>
                    </div>
                </div>
            </div>
        </section>

    )
}