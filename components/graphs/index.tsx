export function FormatNumberWithCommas(num:number) {
    return num.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function FormatNumberWithCommasSimple(num:number) {
    return num.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const PercentageGraph = ({amount, max}:{amount: number, max: number}) => {
    const percentage = Math.round((amount / max) * 100)
    const percentageTicks = percentage / 2
    return(
        <article className="flex items-center">
            {Array.from({ length: 50 }).map((_, i) => (
                <div key={`PercentageGraph-Component-${amount}-${max}-${i}`} 
                    className={`${(i <= percentageTicks) ? 'bg-white' : 'bg-[rgb(51,51,51)]'} w-[2px] mr-[1px] h-[12px]`} />
            ))}
        </article>
        
    )
}

interface DATAPOINTTYPE {
    date: string,
    value: number
}

const CalculateHeight = ({value, highestValue}:{value: number, highestValue: number}) => {
    return value/highestValue * 200
}

export const RelativePercentageGraph = ({data}:{data: Array<DATAPOINTTYPE>}) => {
    let highestValue = 0
    for(let i = 0; i < data.length; i++) {
        if(data[i].value > highestValue) {
            highestValue = data[i].value
        }
    }

    return(
        <article className="w-full flex items-end gap-[1px] md:gap-[2px] lg:gap-[4px]">
            {data.map((point, pointkey) => {
                return(
                    <div key={`RelativePercentageGraph-Component-${point.date}-${point.value}-${pointkey}`} 
                        className={`bg-[rgb(51,51,51)] w-[4px] hover:bg-white relative group`} 
                        style={{height: CalculateHeight({value: point.value, highestValue: highestValue})}}>
                            <div className="absolute top-[-100px] w-48 left-0 p-2 pointer-events-none opacity-0 group-hover:opacity-100 border-[1px] border-white/20 rounded-md z-10 bg-black">
                                <h6 className="text-white">{point.date}</h6>
                                <p className="text-white">${FormatNumberWithCommas(point.value)}.00</p>
                            </div>
                        </div>
                )
            })}
        </article>
        
    )
}