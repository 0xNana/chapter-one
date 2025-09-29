export interface EditionMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface EditionData {
  id: number;
  title: string;
  date: string;
  headline: string;
  stat: string;
  lore: string;
  mintCount: number;
  totalSupply: number;
  image: string;
  externalUrl?: string;
  theme?: string;
  visualTier?: string;
}

const editionSupplyLimits = [
  420,  
  480,  
  510,  
  540,  
  555,  
  555,  
  555,  
  555,  
  555,  
  540,  
  555,  
  555,  
  594   
];

export const loadEditionMetadata = async (editionNumber: number): Promise<EditionMetadata | null> => {
  try {
    const response = await fetch(`/ipfs/where%20money%20moves/metadata/edition${editionNumber}.json`);
    if (!response.ok) {
      console.warn(`Failed to load metadata for edition ${editionNumber}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading metadata for edition ${editionNumber}:`, error);
    return null;
  }
};

export const loadAllEditions = async (editionStats?: number[]): Promise<EditionData[]> => {
  const editions: EditionData[] = [];
  
  for (let i = 1; i <= 13; i++) {
    const metadata = await loadEditionMetadata(i);
    if (metadata) {
      const editionData = mapMetadataToEditionData(metadata, i, editionStats);
      editions.push(editionData);
    }
  }
  
  return editions.sort((a, b) => a.id - b.id);
};

const mapMetadataToEditionData = (metadata: EditionMetadata, editionNumber: number, editionStats?: number[]): EditionData => {
  const attributes = metadata.attributes.reduce((acc, attr) => {
    acc[attr.trait_type] = attr.value;
    return acc;
  }, {} as Record<string, any>);

  const mintCount = editionStats && editionStats[editionNumber - 1] !== undefined 
    ? editionStats[editionNumber - 1] 
    : 0;
  
  const totalSupply = editionSupplyLimits[editionNumber - 1] || 0;

  return {
    id: editionNumber,
    title: metadata.name.replace("Where Money Moves - Edition #", ""),
    date: attributes.date || "Unknown Date",
    headline: attributes.theme || "Stablecoin Evolution",
    stat: attributes.loreFragment || "Key Developments",
    lore: attributes.loreFragment || "A moment in the evolution of programmable money.",
    mintCount,
    totalSupply,
    image: metadata.image,
    externalUrl: attributes.external_url,
    theme: attributes.theme,
    visualTier: attributes.visualTier
  };
};

export const getFallbackEditions = (): EditionData[] => {
  return editionSupplyLimits.map((supplyLimit, index) => ({
    id: index + 1,
    title: `Edition ${index + 1}`,
    date: "2025",
    headline: "Where Money Moves",
    stat: "Stablecoin Evolution",
    lore: "A moment in the evolution of programmable money.",
    mintCount: 0, 
    totalSupply: supplyLimit,
    image: "ipfs://bafkreibwhq2qgrb3zab2sn3eign3pajgqpx4tw27eqcqdc2gtjepckexkm",
    theme: "Stablecoin Evolution",
    visualTier: "Teal Genesis"
  }));
};
