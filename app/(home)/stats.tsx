import { Card } from "@/components/countingCard/card";
import { Counter } from "@/components/countingCard/counterText";
import Image from "next/image";

const data = [
  {
    value: 78,
    title: "more qualified leads",
    subtitle: "leads that buy.",
  },
  {
    value: 113,
    title: "boost in engagement",
    subtitle: "an AI that gets replies.",
  },
  {
    value: 72,
    title: "increase in conversions",
    subtitle: "websites that close.",
  },
];

export const StatsSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row gap-4 w-full">
            {data.map((item, index) => (
              <Card key={`${item.title}-${index}`}>
                <h3 className="text-white text-[48px] lg:text-[64px] font-[600]">
                  <Counter
                    from={0}
                    to={item.value}
                    endChar="%"
                    className="text-white"
                    animationOptions={{ ease: "easeOut" }}
                  />

                </h3>
                <div className="pb-2">
                  <p className="text-white uppercase text-[16px]">{item.title}</p>
                  <p className="text-text-secondary text-[12px] capitalize">
                    {item.subtitle}
                  </p>
                </div>
              </Card>
            ))}
          </div>
          <div className="w-full">
            <Card>
              <div className="pb-2 h-full">
                <h3 className="text-white text-[48px] lg:text-[64px] font-[600]">
                  <span>$</span>
                  <Counter
                    from={0}
                    to={11347829.012}
                    endChar=""
                    className="text-white"
                    animationOptions={{ ease: "easeOut" }}
                  />
                </h3>
                <p className=" uppercase text-[16px] text-green-300">saved for businesses</p>
                <p className="text-text-secondary text-[12px] capitalize">
                  Through Techify AI
                </p>
              </div>
            </Card>
          </div>
        </div>
        <div className="w-full lg:w-[30%]">
          <Card className="h-full">
            <div className="flex flex-col items-center pt-2">
              <Image
                src='/images/GLOBE.png'
                width={32}
                height={32}
                alt="globe"
                className=""
              />
              <Image
                src='/images/WORLD_MAP.png'
                width={400}
                height={400}
                alt="worldmap"
                className="w-full h-full my-[-25px] object-cover" />
            </div>
            <div className="pb-2">
              <p className="text-white uppercase text-[16px]">worldwide</p>
              <p className="text-text-secondary text-[12px] capitalize">
                wherever you are
              </p>
            </div>
          </Card>

        </div>
      </div>
    </section>
  );
};
