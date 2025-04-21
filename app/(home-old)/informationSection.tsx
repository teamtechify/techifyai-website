import { ImageContentBoxComponent } from "@/components/imagecontentbox/imagecontentbox"
import { FaChartColumn, FaClipboardUser, FaHeadset, FaIdCard, FaLaptopCode, FaPhone } from "react-icons/fa6";


const Data1 = {
    // @ts-ignore
    icon: <div className="text-3xl lg:text-5xl text-white"><FaLaptopCode /></div>, 
    title: "AI WEBSITE CREATION", 
    description: <p>
        Your website should be your best salesperson - <span className="text-white font-bold">closing deals while you sleep.</span>
        <br /><br />
        That&apos;s exactly what we do. 
        <br /><br />
        We will create you a website that will <span className="text-white font-bold">beat your current website by 45% in conversion rate. </span>
        <br /><br />
        Hyper-targeted SEO precision, stunning design, and every pixel designed to convert. 
        <br /><br />
        We decode customer psychology with <span className="text-white font-bold">AI-powered A/B testing to make sure that visitors can&apos;t help but to buy.</span> 
    </p>, 
    note: "NO CODING NEEDED", 
    src: '/images/service_bg1.png', 
    href: "/"
}

const Data2 = {
    // @ts-ignore
    icon: <div className="text-3xl lg:text-5xl text-white"><FaPhone /></div>, 
    title: "AI PHONE CALLERS", 
    description: <p>
        AI-powered phone callers will <span className="text-white font-bold">follow up on your leads for you, 
            increase customer satisfaction, and provide customer support.</span> 
        <br /><br />
        And most importantly, they will <span className="text-white font-bold">close deals for you every minute.</span>
        <br /><br />
        TECHIFY AI Phone Callers will adapt to customer responses and <span className="text-white font-bold">learn directly from the client to close them effortlessly. </span>
        <br /><br />
        Natural, human-like conversations, automatic follow-ups, easy CRM connections, 
        live call insights with transcripts, and personalized voice and style - <span className="text-white font-bold">all designed to make you more money.</span>
    </p>, 
    note: "CLOSE SALES CALLS EVERY MINUTE", 
    src: '/images/service_bg2.png', 
    href: "/",
    alt: true
}

const Data3 = {
    // @ts-ignore
    icon: <div className="text-3xl lg:text-5xl text-white"><FaHeadset /></div>, 
    title: "24/7 CUSTOMER SUPPORT", 
    description: <p>
        We will deploy an AI Chat Agent that will learn everything 
        there is to know about your business and <span className="text-white font-bold">guide customers who need support.</span>
        <br /><br />
        No need for employees, <span className="text-white font-bold">no mistakes, and no delay.</span>
    </p>, 
    note: "ZERO DELAY, SUPPORT ALL DAY & NIGHT", 
    src: '/images/service_bg3.png', 
    href: "/"
}

const Data4 = {
    // @ts-ignore
    icon: <div className="text-3xl lg:text-5xl text-white"><FaChartColumn /></div>, 
    title: "AI ANALYTICS", 
    description: <p>
        AI is tracking all your analytics and <span className="text-white font-bold">applies changes in real time.</span>
        <br /><br />
        It also <span className="text-white font-bold">calculates where your business will be</span> in the foreseeable future and helps you make the right decisions.
    </p>, 
    note: "SEE THE FUTURE, LEARN FROM THE PAST", 
    src: '/images/service_bg4.png', 
    href: "/",
    alt: true
}

const Data5 = {
    // @ts-ignore
    icon: <div className="text-3xl lg:text-5xl text-white"><FaClipboardUser /></div>, 
    title: "HIRING SYSTEMS", 
    description: <p>
        AI will help you <span className="text-white font-bold">vet candidates for the position.</span>
        <br /><br />
        It&apos;ll save you time, getting rid of unfit applicants and even <span className="text-white font-bold">conducting interviews for you.</span>
        <br /><br />
        After the interviews, our AI will <span className="text-white font-bold">analyze the recordings and rank the candidates for you.</span>
    </p>, 
    note: "YOUR PERSONAL HIRING ASSISTANT", 
    src: '/images/service_bg5.png', 
    href: "/"
}

const Data6 = {
    // @ts-ignore
    icon: <div className="text-3xl lg:text-5xl text-white"><FaIdCard /></div>, 
    title: "AI PROJECT MANAGER", 
    description: <p>
        AI manages the deadlines, synchronizes tasks within teams, and automates routine actions.
        <br /><br />
        It can plan out teams&apos; entire work schedules in order to get <span className="text-white font-bold">tasks completed as efficiently as possible.</span>
        <br /><br />
        It makes your company <span className="text-white font-bold">operate at TRUE 100%.</span>
    </p>, 
    note: "REMOVE BARRIERS & START GROWING", 
    src: '/images/service_bg6.png', 
    href: "/",
    alt: true
}

export const InformationSection = () => {
    return(
        <section>
            <div className="max-w-[1500px] px-4 mx-auto">
                <h3>This is how Techify AI Ecosystem will make your business constantly make more money:</h3>
                <div className="flex flex-col gap-8">
                    <ImageContentBoxComponent data={Data1} />
                    <ImageContentBoxComponent data={Data2} />
                    <ImageContentBoxComponent data={Data3} />
                    <ImageContentBoxComponent data={Data4} />
                    <ImageContentBoxComponent data={Data5} />
                    <ImageContentBoxComponent data={Data6} />
                </div>
            </div>
        </section>
    )
}