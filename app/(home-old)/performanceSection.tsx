'use client'

import { ButtonGhost } from "@/components/buttons/buttons";
import { PerformanceCard, PerformanceCardProps } from "@/components/topPerformers/performanceCard";
import { Tag } from "@/components/topPerformers/tag";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 9800 },
  { name: 'Feb', value: 2400 },
  { name: 'Mar', value: 1398 },
];

const data2 = [
  
  { name: 'Jan', value: 1398 },
  { name: 'Feb', value: 2400 },
  { name: 'Mar', value: 9800 },
];

const topPerformers: PerformanceCardProps[] = [
  {
    tag: { change: 28.81 },
    name: "NOVA",
    ticker: "AI Shell NOVA",
    src: "https://coin-images.coingecko.com/coins/images/52975/large/Nova.jpeg?1734884774",
  },
  {
    tag: { change: 27.34 },
    name: "ALPHA",
    ticker: "AlphaArc",
    src: "https://coin-images.coingecko.com/coins/images/53293/large/Elemento.png?1736543734",
  },
  {
    tag: { change: 25.36 },
    name: "FOMO",
    ticker: "FOMO",
    src: "https://coin-images.coingecko.com/coins/images/52987/large/fomo.png?1734921088",
  },
  {
    tag: { change: 22.73 },
    name: "AIMONICA",
    ticker: "Aimonica Brands",
    src: "https://coin-images.coingecko.com/coins/images/52526/large/PFP_%281%29.png?1733558435",
  },
  {
    tag: { change: 17.67 },
    name: "WHISP",
    ticker: "WHISP",
    src: "https://coin-images.coingecko.com/coins/images/53593/large/Screenshot_2025-01-13_at_14.20.29.png?1736805799",
  },
];
const bottomPerformers: PerformanceCardProps[] = [
  {
    tag: { change: -39.99 },
    name: "Kin",
    ticker: "KIN",
    src: "https://coin-images.coingecko.com/coins/images/959/large/image.png?1721122241",
  },
  {
    tag: { change: -22.53 },
    name: "SPICE",
    ticker: "SPICE",
    src: "https://coin-images.coingecko.com/coins/images/54046/large/Logo.png?1738102000",
  },
  {
    tag: { change: -20.52 },
    name: "Mentat",
    ticker: "KWEEN",
    src: "https://coin-images.coingecko.com/coins/images/52772/large/photo_2024-12-08_15-26-24.jpg?1734278967",
  },
  {
    tag: { change: -18.74 },
    name: "HOLO",
    ticker: "Holozone",
    src: "https://coin-images.coingecko.com/coins/images/53616/large/holopfp.png?1736889131",
  },
  {
    tag: { change: -13.53 },
    name: "TANK",
    ticker: "AgentTank",
    src: "https://coin-images.coingecko.com/coins/images/52616/large/cursor_icon_w.png?1740318179",
  },
];




export const PerformanceSection = () => {
  return (
    <section className="section mx-auto max-lg:px-4">
      <h2 className="title">The A.I. Difference</h2>
      <div className="flex lg:flex-row  mx-auto gap lg:gap-10 mb-6 lg:mb-10 gap-4  max-lg:overflow-x-scroll snap-mandatory snap-x">

        <div className="flex flex-col lg:w-full p-6 gap-4 border-[1px] max-lg:min-w-[100%] border-white/10 rounded-[8px] snap-center">
          <h3 className="text-text-secondary  uppercase">Companies without A.I.</h3>
          <div className="flex flex-row items-center gap-4">
            <h2 className="text-[36px] text-white">$2.2B</h2>
            <Tag change={-7.1} big />
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#fe3851" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>


        <div className="flex flex-col lg:w-full p-6 gap-4 border-[1px] max-lg:min-w-[100%] border-white/10 rounded-[8px] snap-center">
          <h3 className="text-text-secondary uppercase">Trading Volume (24hr)</h3>
          <div className="flex flex-row items-center gap-4">
            <h2 className="text-[36px] text-white">143M</h2>
            <Tag change={8.5} big />
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={data2}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#b8ffa1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex lg:flex-row  mx-auto gap lg:gap-10 gap-4 max-lg:overflow-x-scroll snap-mandatory snap-x">

        <div className="flex flex-col lg:w-full border-[1px] max-lg:min-w-[100%]  border-white/10 rounded-[8px] snap-center">
          <h3 className="text-text-secondary p-4 uppercase">Yearly Performance without AI</h3>
          {bottomPerformers.map((performer, index) => (
            <PerformanceCard
              key={`${index}-${performer.ticker}`}
              tag={performer.tag}
              name={performer.name}
              ticker={performer.ticker}
              src={performer.src}
            />

          ))}
        </div>

        <div className="flex flex-col lg:w-full border-[1px] max-lg:min-w-[100%] border-white/10  rounded-[8px] snap-center">
          <h3 className="text-text-secondary p-4 uppercase">Yearly Performance with AI</h3>
          {topPerformers.map((performer, index) => (
            <PerformanceCard
              key={`${index}-${performer.ticker}`}
              tag={performer.tag}
              name={performer.name}
              ticker={performer.ticker}
              src={performer.src}
            />

          ))}
        </div>

      </div>
      <p className="text-white text-[16px] lg:text-xl text-center max-w-[768px] mx-auto mt-8">
        We will show you exactly what you are overpaying for and how much you can save using Techify AI Ecosystem
      </p>
      <div className="flex justify-center mt-6 lg:mt-8">
        <Link href="/"><ButtonGhost large>BOOK A CALL NOW</ButtonGhost></Link>
      </div>
    </section>
  );
};
