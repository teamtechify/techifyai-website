"use client";
import { motion } from "framer-motion";



export const LiveUpdates = () => {
  return (
    <article className="relative flex flex-col w-full  max-w-[370px] gap-3">
        <div className="w-full bg-light-gray-background flex flex-row items-center">
      <div className="h-[24px] w-[24px] bg-dark-green flex items-center justify-center relative">
        <div className="h-[4px] w-[4px] bg-green-500/50 rounded-full absolute" />
        <motion.div
          className="absolute h-[4px] w-[4px] bg-green-500/50 rounded-full"
          animate={{
            scale: [1, 3],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            times: [0, 1], 
          }}
        />
      </div>
      <p className="ml-4 uppercase text-text-secondary small mt-1">// live updates</p>
      </div>
      <div className="flex flex-row items-start">
        <p className="w-[50%] text-text-secondary uppercase small">market cap:</p>
        <p className="small text-start w-[50%] text-white">$12,523,090,0854 <span className="text-mellow-green small">(+6162%)</span></p>  
      </div>
      <div className="flex flex-row items-start">
        <p className="w-[50%] text-text-secondary uppercase small">price:</p>
        <p className="small text-start text-white">$0.01240</p>  
      </div>
      <div className="flex flex-row items-start">
        <p className="w-[50%] text-text-secondary uppercase small">24h volume:</p>
        <p className="small text-start text-white">$239,045.252</p>  
      </div>
      <div className="flex flex-row items-start">
        <p className="w-[50%] text-text-secondary uppercase small">osol.d:</p>
        <p className="small text-start text-white">0.53%</p>  
      </div>
      <div className="flex flex-row items-start">
        <p className="w-[50%] text-text-secondary uppercase small">holders:</p>
        <p className="small text-start text-white">51,776 </p>  
      </div>
    </article>
  );
};