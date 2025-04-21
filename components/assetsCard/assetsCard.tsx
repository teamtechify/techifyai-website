import Image from "next/image";

type AssetCardProps = {
  value: number;
  change: number;
};

const assetCardItem: AssetCardProps = {
  value: 500000,
  change: -5,
};

export const AssetsCard = ({ value, change }: AssetCardProps) => {
  return (
    <article className="lg:max-w-[1500px] p-20 px-4 w-full border-[1px] border-white/10 hover:border-white/40 mx-auto duration-300 transition-all relative group overflow-hidden flex items-center">
      <div className="absolute inset-0 mx-auto h-[339px] w-[632px]">
        <Image
          src="/images/def.png"
          width={750}
          height={400}
          alt="def"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="mx-auto flex flex-col justify-center items-center ">

        <h2 className="big text-white text-center">HUMANS ARE LIMITED.</h2>
        <div className="text-red-500 flex flex-row text-[22px] items-center mt-3 uppercase" >We All Are</div>
        <p className="text-center text-text-secondary max-w-[512px] mt-4 text-[14px] lg:text-[18px]">
          Paid leaves, sick days, vacations - <span className="text-white">you cover all the costs.</span>
          <br /><br />
          Tasks get delayed, they take time, and priorities shift.
          <br /><br />
          People aren&apos;t built to run 24/7, but your business needs to.
          <br /><br />
          <span className="text-white">AI WORKS FOR YOU ALL DAY AND NIGHT.</span>
          <br /><br />
          No breaks. No emotion. No sick days.
          <br /><br />
          It completes tasks to <span className="text-white">make your business more money</span> that usually would take weeks in a matter of minutes.
          <br /><br />
          From website creation to customer support and even fully automated AI sales agents that <span className="text-white">close deals every minute.</span>
          <br /><br />
          <span className="text-white">A machine makes you money every day.</span>
        </p>
      </div>
    </article>
  );
};

export const AssetsCardDisplay = () => {
  return (
    <AssetsCard value={assetCardItem.value} change={assetCardItem.change} />
  );
};
