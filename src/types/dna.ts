export interface DNAMatch {
  matchName: string;
  chromosome: string;
  startLocation: number;
  endLocation: number;
  centimorgans: number;
  matchingSNPs: number;
}

export interface ParsedDNAData {
  matches: DNAMatch[];
  totalMatches: number;
  totalCentimorgans: number;
}

export interface SelectedMatch {
  matchName: string;
  totalCentimorgans: number;
  longestSegment: number;
  segmentCount: number;
}

export interface ComparisonMetric {
  id: string;
  name: string;
  description: string;
}

export interface RelationshipRange {
  min: string;
  max: string;
  color: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface MatrixCell {
  match1: string;
  match2: string;
  relationship: RelationshipRange | null;
  value: number;
  metric: string;
}