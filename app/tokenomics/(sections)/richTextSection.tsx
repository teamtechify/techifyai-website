import { ContainerBig } from "@/components/containers/containerBig"
import { TokenomicsText, } from "@/components/richText/tokenomicsTextSections"
import { RichTextSnippet, RichTextSnippetProps } from "@/components/richText/richTextSnippet"


export const TokenomicsAllocations = [
  {
    title: "OBOT Holders Strategic Reserve: 15%",
    points: [
      "Rewards for existing OBOT holders",
      "Ecosystem cross-pollination incentives",
      "Long-term holder benefits"
    ]
  },
  {
    title: "Growth & Marketing (35%)",
    points: [
      "Key Opinion Leader (KOL) collaborations",
      "Industry influencer engagements",
      "Strategic advisor allocations"
    ]
  },
  {
    title: "Ecosystem Development: 10%",
    points: [
      "R&D initiatives",
      "Product development funding",
      "Technical infrastructure improvements"
    ]
  },
  {
    title: "Marketing Operations: 15%",
    points: [
      "Global marketing campaigns",
      "Brand awareness initiatives",
      "Community building activities"
    ]
  },
  {
    title: "Community Rewards: 15%",
    points: [
      "Airdrops for active participants",
      "User acquisition incentives",
      "Early adopter rewards"
    ]
  },
  {
    title: "Events & Education: 10%",
    points: [
      "Hackathons",
      "Developer workshops",
      "Community meetups",
      "Educational content creation"
    ]
  },
  {
    title: "Exchange & Liquidity (25%)",
    points: [
      "Exchange Listings: 15%",
      "Major exchange listing fees",
      "Market making provisions",
      "Trading pair establishment",
    ]
  },
  {
    title: "Liquidity Reserves: 10%",
    points: [
      "DEX liquidity provision",
      "Market stability fund",
      "Emergency reserves"
    ]
  }
]

const OSOLGivesDetails = [
  {
    title: 'Key Features',
    points: [
      "100% of allocated funds go to chosen charities",
      "Smart contract automated distributions",
      "Public voting records on chain",
      "Regular impact assessment updates"
    ]
  },
  {
    title: "Example Initiatives",
    points: [
      "Funding coding bootcamps in underserved communities",
      "Supporting AI education programs",
      "Backing environmental tech solutions",
      "Enabling digital literacy initiatives"
    ]
  },
  {
    title: "By combining community wisdom with AI verification, OSOL GIVES creates a new model for crypto philanthropy that is:",
    points: [

      "Transparent",
      "Community-driven",
      "Impact-focused",
      "Globally accessible"
    ]
  }
]

export const RichTextSection = () => {
  return (
    <ContainerBig>
      <TokenomicsText index={1} title="SOL 100M LPs">
        <p className="text-text-secondary text-[13.6px]">The allocations are distributed among over 50 LPs, with each LP contributing over $2M to the DAO Fund smart wallet. These projects invest in us, just as we invest in them through the index.</p>
      </TokenomicsText>
      <TokenomicsText index={2} title="Index Unlocked Treasury">
        <p className="text-text-secondary text-[13.6px]">
          Are wallets that hold the OSOL coins for the purpose of contributing its value inside the main fund smart wallet to grow it, a proportion of the allocation trading decisions should be governed by community voting, and a proportion should be automated by missO and the market makers.<br /><br />
          1. 5% will be directly added to the smart wallet to sustain a high fund NAV.<br />
          2. 5% will be allocated for community-driven requests for coin purchases, based on collective voting.<br />
          3. 10% will be prepared for allocation to one of the aforementioned wallets.<br /></p>
      </TokenomicsText>
      <TokenomicsText index={3} title="OSOL Ventures">
        <p className="text-text-secondary text-[13.6px]">OSOL Ventures introduces a revolutionary investment model where artificial intelligence meets community-driven venture capital. As a decentralized investment vehicle powered by MissO (the world's first AI CEO) and governed by OSOL token holders, OSOL Ventures represents a paradigm shift in how venture capital operates in the Web3 space.</p>
      </TokenomicsText>
      <TokenomicsText index={4} title="Ecosystem & OBOT Treasury">
        <div className="grid grid-cols-2 gap-8">
          {TokenomicsAllocations.map((item, index) => (
            <RichTextSnippet key={`${item}-${index}`} title={item.title} points={item.points} />
          ))}

        </div>
      </TokenomicsText>
      <TokenomicsText index={5} title="OSOL CHARITY">
        <div>
          <p className="text-text-secondary text-[13.6px]">OSOL introduces OSOL CHARITY, a revolutionary approach to charitable giving where our community and AI work together to create meaningful social impact. 3% of all OSOL fund management fees are automatically allocated to charitable causes, with recipients chosen through community voting and vetted by MissO AI.</p><br />
          <div className="grid grid-cols-2 gap-8">
            {OSOLGivesDetails.map((item, index) => (
              <RichTextSnippet key={`${item}-${index}`} title={item.title} points={item.points} />
            ))}

          </div>
        </div>
      </TokenomicsText>
    </ContainerBig>
  )
}