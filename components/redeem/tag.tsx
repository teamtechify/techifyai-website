import Image from "next/image";

export type RedeemTagProps = {
  src: string;
  ticker: string;
  price?: number;
};

export const RedeemTag = ({ src, ticker, price }: RedeemTagProps) => {
  return (
    <article className="flex flex-row items-center px-2 py-2 bg-[#1f1f1f] gap-2">
      <Image src={src} width={20} height={20} alt={`${ticker}-logo`} className="rounded-full"/>
      <p className="uppercase text-white small">{ticker}</p>
      {price && <p className="text-white small">({price})</p>}
      
    </article>
  );
};
