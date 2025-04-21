"use client";
import { Tag, TagProps } from "./tag";
import Image from "next/image";

export type PerformanceCardProps = {
  tag: TagProps;
  name: string;
  ticker: string;
  src: string;
};

export const PerformanceCard = ({
  tag,
  name,
  ticker,
  src,
}: PerformanceCardProps) => {
  return (
    <article className="w-full flex items-center justify-between p-4 hover:-translate-y-[1px] border-y-[1px] border-white/5 hover:border-white/30 hover:bg-white/3 transition-all duration-300">
      <div className="flex flex-row items-center">
        <div className="mr-4">
          <Image
            src={src}
            width={26}
            height={26}
            alt={`${ticker}-image`}
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-white uppercase regular">{name}</p>
          <p className="text-text-secondary uppercase small">{ticker}</p>
        </div>
      </div>
      <div>
        <Tag change={tag.change} />
      </div>
    </article>
  );
};
