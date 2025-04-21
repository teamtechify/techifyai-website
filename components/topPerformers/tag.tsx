export type TagProps = {
  change: number;
  big?: boolean
};

export const Tag = ({ change, big }: TagProps) => {
  return (
    <article className="">
      {change >= 0 ? (
        <div className={`text-mellow-green bg-mellow-green/10 rounded-[4px] px-2 py-1 flex flex-row items-center ${big ? 'gap-2':'gap-1 '}`}>
          <span className={`${big ? 'text-[12px]' : 'text-[10px]'}`}>▲</span>
          <p className={`${big ? 'text-[16px]' : 'small'}`}>{Math.abs(change).toFixed(2)}%</p>
          {big && <p className="">24h</p>}
        </div>
      ) : (
        <div className={`text-mellow-red bg-mellow-red/10 rounded-[4px] px-2 py-1 flex flex-row items-center ${big ? 'gap-2':'gap-1 '}`}>
          <span className={`${big ? 'text-[12px]' : 'text-[10px]'}`}>▼</span>
          <p className={`${big ? 'text-[16px]' : 'small'}`}>{Math.abs(change).toFixed(2)}%</p>
          {big && <p className="">24h</p>}
        </div>
      )}
      
    </article>
  );
};
