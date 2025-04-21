
export type RichTextSnippetProps={
    title: string
    points: string[]
}

export const RichTextSnippet = ({title, points}:RichTextSnippetProps) =>{
    return(
        <article className="flex flex-col gap-4">
            <h2 className="text-white">
                {title}
            </h2>
            <ul>
                {points.map((point, index)=>(
                    <li key={`${point}-${index}`} className="text-text-secondary text-[13px]">
                        {point}
                    </li>
                ))}
            </ul>

        </article>
    )
}