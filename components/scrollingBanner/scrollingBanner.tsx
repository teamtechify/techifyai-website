'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';


type StockItemProps = {
src: string,
name: string
price: number
change: number
}

const stockData: StockItemProps[] = [
    { src: "https://dd.dexscreener.com/ds-data/tokens/solana/2otVNpcHXn9MKeDk3Zby5uanF3s7tki4toaJ3PZcXaUd.png?key=1d5579", name: "OSOL", price: 0.0132, change: 2.08 },
    { src: "https://dd.dexscreener.com/ds-data/tokens/solana/BivtZFQ5mVdjMM3DQ8vxzvhKKiVs27fz1YUF8bRFdKKc.png?key=c13f90", name: "FLAME", price: 0.031815, change: -0.89 },
    { src: "https://dd.dexscreener.com/ds-data/tokens/solana/HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC.png?key=b380cb", name: "ai16z", price: 0.197, change: 4.79 },
    { src: "https://dd.dexscreener.com/ds-data/tokens/solana/Grass7B4RdKfBCjTKgSqnXkqjwiGvQyFbuSCUJr3XXjs.png?key=f4d065", name: "GRASS", price: 1.50, change: 0.11 },
    { src: "https://dd.dexscreener.com/ds-data/tokens/solana/BZLbGTNCSFfoth2GYDtwr7e4imWzpR5jqcUuGEwr646K.png?key=238e32", name: "IO", price: 0.9014, change: 2.05 },
    { src: "https://dd.dexscreener.com/ds-data/tokens/solana/4zdAbkyoYoT2F8ZSt6va4WZrmAwgFCfQsTEUo8zNpump.png?key=0fd385", name: "DIT", price: 0.04254, change: 19.75 },
    { src: "https://dd.dexscreener.com/ds-data/tokens/solana/KENJSUYLASHUMfHyy5o4Hp2FdNqZg1AsUPhfH2kYvEP.png?key=cfe49b", name: "GRIFFAIN", price: 0.0442, change: -3.92 },
    { src: "https://dd.dexscreener.com/ds-data/tokens/solana/AKzAhPPLMH5NG35kGbgkwtrTLeGyVrfCtApjnvqAATcm.png?key=f2f383", name: "OI", price: 29914725.58, change: 3.01 },
  ];
  

export const StockItem = ({src, name, price, change}:StockItemProps) =>{
    return(
        <article className='flex flex-row gap-4 items-center'>
            <Image
            src={src}
            width={20}
            height={20}
            alt={`${name}-icon`}
            className='rounded-full h-[20px] w-[20px]'/>
            <p className='text-white'>{name}</p>
            <p className='text-white'>${price}</p>
            <p className={`${change === 0 ? 'text-white' : change > 0 ? 'text-green-500' : 'text-red-500'}`}>
  {change}%
</p>
        </article>
    )
}

export const ScrollingBanner = () => {
    
  return (
    <article className="w-full flex items-center justify-center h-full overflow-hidden">
      <motion.div
        className="flex space-x-[2%] flex-nowrap"
        animate={{
          x: ['0%', '-100%'],
        }}
        transition={{
          duration: 160,
          ease: 'linear',
          repeat: Infinity, 
        }}
        whileHover={{}}
      >
      {stockData.map((item, index)=>(
        <StockItem src={item.src} name={item.name} price={item.price} change={item.change} key={`${item.name}-${index}`}/>
      ))}
      {stockData.map((item, index)=>(
        <StockItem src={item.src} name={item.name} price={item.price} change={item.change} key={`${item.name}-${index}`}/>
      ))}
      </motion.div>
    </article>
  );
};
