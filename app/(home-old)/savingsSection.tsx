// import { ContainerBig } from "@/components/containers/containerBig"
// import { CountingCard, CountingCardProps } from "@/components/countingCard/countingCard"
// import { PercentageGraph, RelativePercentageGraph } from "@/components/graphs";


// const countingCards: CountingCardProps[] = [
//     { title: "human hours saved by a.i.", value: 120000000 },
//     { title: "positions filled by a.i.", value: 5000000 },
//     { title: "productivity increase", value: 96.202 }
// ];

// const ReturnData = () => {
//     const data = [];

//     const startDate = new Date("2024-12-01");
//     const endDate = new Date("2025-04-01");
    
//     for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
//       const options: Intl.DateTimeFormatOptions = {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       };
    
//       const formattedDate = date.toLocaleDateString("en-US", options);
//       const value = Math.floor(Math.random() * (10000000 - 9000000 + 1)) + 9000000;
    
//       data.push({ date: formattedDate, value });
//       data.push({ date: formattedDate, value: value + 50 });
//     }
//     return data
// }



// export const SavingsSection = () => {
//     return (
//         <section className="max-w-[1500px] mx-auto px-4">
//             <h2 className="title">Save with AI</h2>
//             <ContainerBig>
//                 <section className="p-8 relative">
//                     <div className="flex items-center gap-2">
//                         <p className="text-text-secondary small uppercase">TOTAL AI SAVINGS</p>
//                         <div className="live" />
//                         <p className="text-[rgb(185,255,161)] small uppercase">LIVE</p>
//                     </div>
//                     <h2 className="title larger mb-12">$999,997,837.00</h2>
//                     {RelativePercentageGraph({data: ReturnData()})}

//                 </section>
//                 <div className="flex lg:flex-row flex-col">
//                     {countingCards.map((item, index) => (<CountingCard key={`${item.title}-${index}`} title={item.title} value={item.value} />))}
//                 </div>
//             </ContainerBig>
//         </section>
        
        
//     )
// }