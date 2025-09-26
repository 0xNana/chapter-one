import { useState } from "react";
import { EditionCard } from "./EditionCard";
import { EditionModal } from "./EditionModal";
import { ClaimFlow } from "./ClaimFlow";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, Users, Globe } from "lucide-react";

// Mock data for the 13 editions
const editions = [
  {
    id: 1,
    title: "Genesis Protocol",
    date: "2024-01-15",
    headline: "Plasma Network Initialization",
    stat: "First Block Mined",
    description: "The foundational moment when Plasma's genesis block was mined, establishing the protocol's immutable foundation for programmable finance.",
    lore: "In the depths of cryptographic history, the Genesis Protocol emerged as the first whisper of what would become a financial revolution. This edition captures the exact moment when mathematics met money.",
    mintCount: 847,
    totalSupply: 1000,
    rarity: "Legendary"
  },
  {
    id: 2,
    title: "Settlement Surge",
    date: "2024-02-08",
    headline: "First Major Institution Onboard",
    stat: "$1.2M Volume",
    description: "The first institutional settlement marked Plasma's transition from experimental protocol to enterprise-grade infrastructure.",
    lore: "Traditional finance meets programmable money. The old guard recognizes the new paradigm, marking a pivotal shift in global capital flows.",
    mintCount: 623,
    totalSupply: 1000,
    rarity: "Epic"
  },
  {
    id: 3,
    title: "Cross-Chain Confluence",
    date: "2024-02-28",
    headline: "Multi-Chain Bridge Activation",
    stat: "7 Networks Connected",
    description: "Plasma's interoperability framework goes live, connecting disparate blockchain ecosystems under one settlement layer.",
    lore: "The great convergence begins. Islands of value become an archipelago of liquidity, all flowing through Plasma's canonical channels.",
    mintCount: 456,
    totalSupply: 1000,
    rarity: "Rare"
  },
  {
    id: 4,
    title: "Regulatory Recognition",
    date: "2024-03-15",
    headline: "G7 Nations Acknowledge Protocol",
    stat: "Global Compliance",
    description: "International regulatory bodies formally recognize Plasma as a legitimate settlement infrastructure, paving the way for mass adoption.",
    lore: "When governments speak, markets listen. The moment sovereign powers acknowledged the inevitability of programmable money.",
    mintCount: 789,
    totalSupply: 1000,
    rarity: "Epic"
  },
  {
    id: 5,
    title: "Velocity Breakthrough",
    date: "2024-04-02",
    headline: "100k TPS Milestone Achieved",
    stat: "Network Performance",
    description: "Plasma achieves unprecedented transaction throughput, proving its capability to handle global financial traffic.",
    lore: "Speed is the currency of the digital age. This edition commemorates the moment Plasma outpaced legacy financial rails.",
    mintCount: 234,
    totalSupply: 1000,
    rarity: "Legendary"
  },
  {
    id: 6,
    title: "DeFi Integration Wave",
    date: "2024-04-20",
    headline: "50+ Protocols Launch",
    stat: "Ecosystem Expansion",
    description: "The DeFi ecosystem explodes on Plasma, with dozens of protocols launching innovative financial primitives.",
    lore: "Innovation compounds exponentially. Fifty minds building fifty different futures, all settling on the same trustless foundation.",
    mintCount: 567,
    totalSupply: 1000,
    rarity: "Rare"
  },
  {
    id: 7,
    title: "Enterprise Exodus",
    date: "2024-05-10",
    headline: "Fortune 500 Migration Begins",
    stat: "Corporate Adoption",
    description: "Major corporations begin migrating treasury operations to Plasma-based solutions, signaling mainstream acceptance.",
    lore: "The corporate world sheds its antiquated skin. Balance sheets transform from static ledgers to dynamic, programmable assets.",
    mintCount: 678,
    totalSupply: 1000,
    rarity: "Epic"
  },
  {
    id: 8,
    title: "Quantum Resilience",
    date: "2024-06-01",
    headline: "Post-Quantum Cryptography Deployed",
    stat: "Future-Proof Security",
    description: "Plasma becomes the first major protocol to implement post-quantum cryptographic standards, securing against future threats.",
    lore: "Preparing for tomorrow's threats with today's mathematics. When quantum computers arrive, Plasma will remain unbreakable.",
    mintCount: 345,
    totalSupply: 1000,
    rarity: "Legendary"
  },
  {
    id: 9,
    title: "Global South Awakening",
    date: "2024-06-25",
    headline: "Emerging Markets Embrace Protocol",
    stat: "3B+ Population Served",
    description: "Plasma infrastructure enables financial inclusion for billions in emerging markets, democratizing access to global capital.",
    lore: "The unbanked become the rebanked. Geography ceases to determine financial destiny as Plasma erases digital divides.",
    mintCount: 890,
    totalSupply: 1000,
    rarity: "Epic"
  },
  {
    id: 10,
    title: "Central Bank Capitulation",
    date: "2024-07-18",
    headline: "First CBDC on Plasma",
    stat: "Monetary Sovereignty",
    description: "The first central bank digital currency launches on Plasma infrastructure, validating the protocol's institutional grade.",
    lore: "Sovereign power meets sovereign code. When central banks build on your rails, you've achieved something beyond disruption.",
    mintCount: 445,
    totalSupply: 1000,
    rarity: "Legendary"
  },
  {
    id: 11,
    title: "AI-Financial Fusion",
    date: "2024-08-05",
    headline: "Autonomous Trading Protocols Go Live",
    stat: "AI-Native Finance",
    description: "AI-driven financial protocols launch on Plasma, creating the first truly autonomous financial ecosystem.",
    lore: "When artificial intelligence meets programmable money, the result transcends human financial imagination.",
    mintCount: 123,
    totalSupply: 1000,
    rarity: "Mythical"
  },
  {
    id: 12,
    title: "Carbon Credit Confluence",
    date: "2024-08-28",
    headline: "Global Climate Finance Integration",
    stat: "Planetary Scale",
    description: "Plasma becomes the backbone for global carbon credit markets, financializing climate action at planetary scale.",
    lore: "When saving the planet becomes profitable, and profits become programmable. The earth's lungs breathe through code.",
    mintCount: 667,
    totalSupply: 1000,
    rarity: "Epic"
  },
  {
    id: 13,
    title: "Pre-TGE Culmination",
    date: "2024-09-20",
    headline: "Final Preparations Complete",
    stat: "TGE Countdown",
    description: "All systems converge as Plasma completes final preparations for the token generation event, marking the end of the pre-TGE arc.",
    lore: "The chapter closes, but the story begins. Thirteen moments captured in time, leading to the dawn of a new financial epoch.",
    mintCount: 0,
    totalSupply: 1000,
    rarity: "Mythical"
  }
];

export const EditionSelector = () => {
  const [selectedEdition, setSelectedEdition] = useState<typeof editions[0] | null>(null);
  const [showClaimFlow, setShowClaimFlow] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  return (
    <div className="space-y-8">
      {/* View Mode Toggle */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-lg">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="flex items-center gap-2"
          >
            <Globe className="w-4 h-4" />
            Grid View
          </Button>
          <Button
            variant={viewMode === 'timeline' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('timeline')}
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Timeline
          </Button>
        </div>
      </div>

      {/* Claim All Button */}
      <div className="text-center">
        <Button
          onClick={() => setShowClaimFlow(true)}
          className="claim-button text-lg px-12 py-6"
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          Claim Your Chapter
        </Button>
        <p className="text-sm text-muted-foreground mt-3">
          Mint individual editions or claim the complete collection
        </p>
      </div>

      {/* Editions Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {editions.map((edition, index) => (
            <EditionCard
              key={edition.id}
              edition={edition}
              onClick={() => setSelectedEdition(edition)}
              animationDelay={index * 100}
            />
          ))}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {editions.map((edition, index) => (
            <div key={edition.id} className="flex items-center gap-6 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="flex flex-col items-center">
                <div className="timeline-marker" />
                {index < editions.length - 1 && <div className="w-px h-16 bg-border/30 mt-2" />}
              </div>
              <div className="flex-1">
                <EditionCard
                  edition={edition}
                  onClick={() => setSelectedEdition(edition)}
                  compact
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <EditionModal
        edition={selectedEdition}
        open={!!selectedEdition}
        onClose={() => setSelectedEdition(null)}
        onClaim={() => {
          setSelectedEdition(null);
          setShowClaimFlow(true);
        }}
      />

      <ClaimFlow
        open={showClaimFlow}
        onClose={() => setShowClaimFlow(false)}
        editions={editions}
        selectedEdition={selectedEdition}
      />
    </div>
  );
};