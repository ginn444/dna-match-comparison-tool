import { DNAMatch, ParsedDNAData, SelectedMatch } from '../types/dna';

export const parseCSVFile = (csvText: string): ParsedDNAData => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  // Validate headers
  const requiredHeaders = ['Match Name', 'Chromosome', 'Start Location', 'End Location', 'Centimorgans', 'Matching SNPs'];
  const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
  
  if (missingHeaders.length > 0) {
    throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
  }
  
  const matches: DNAMatch[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    
    if (values.length !== headers.length) continue;
    
    const match: DNAMatch = {
      matchName: values[headers.indexOf('Match Name')],
      chromosome: values[headers.indexOf('Chromosome')],
      startLocation: parseInt(values[headers.indexOf('Start Location')]),
      endLocation: parseInt(values[headers.indexOf('End Location')]),
      centimorgans: parseFloat(values[headers.indexOf('Centimorgans')]),
      matchingSNPs: parseInt(values[headers.indexOf('Matching SNPs')])
    };
    
    matches.push(match);
  }
  
  const totalCentimorgans = matches.reduce((sum, match) => sum + match.centimorgans, 0);
  
  return {
    matches,
    totalMatches: matches.length,
    totalCentimorgans
  };
};

export const aggregateMatchData = (matches: DNAMatch[]): SelectedMatch[] => {
  const matchMap = new Map<string, {
    totalCentimorgans: number;
    longestSegment: number;
    segmentCount: number;
  }>();
  
  matches.forEach(match => {
    const existing = matchMap.get(match.matchName);
    if (existing) {
      existing.totalCentimorgans += match.centimorgans;
      existing.longestSegment = Math.max(existing.longestSegment, match.centimorgans);
      existing.segmentCount += 1;
    } else {
      matchMap.set(match.matchName, {
        totalCentimorgans: match.centimorgans,
        longestSegment: match.centimorgans,
        segmentCount: 1
      });
    }
  });
  
  return Array.from(matchMap.entries()).map(([matchName, data]) => ({
    matchName,
    ...data
  }));
};

export const estimateRelationship = (centimorgans: number) => {
  if (centimorgans >= 2600) return { min: 'Parent', max: 'Child', color: '#dc2626', confidence: 'high' as const };
  if (centimorgans >= 1300) return { min: 'Sibling', max: 'Sibling', color: '#ea580c', confidence: 'high' as const };
  if (centimorgans >= 680) return { min: 'Grandparent', max: 'Aunt/Uncle', color: '#d97706', confidence: 'high' as const };
  if (centimorgans >= 200) return { min: '1st Cousin', max: 'Great Aunt/Uncle', color: '#ca8a04', confidence: 'high' as const };
  if (centimorgans >= 90) return { min: '2nd Cousin', max: '1st Cousin 1x Removed', color: '#65a30d', confidence: 'medium' as const };
  if (centimorgans >= 45) return { min: '3rd Cousin', max: '2nd Cousin 1x Removed', color: '#059669', confidence: 'medium' as const };
  if (centimorgans >= 20) return { min: '4th Cousin', max: '3rd Cousin 1x Removed', color: '#0891b2', confidence: 'medium' as const };
  if (centimorgans >= 10) return { min: '5th Cousin', max: '4th Cousin 1x Removed', color: '#3b82f6', confidence: 'low' as const };
  if (centimorgans >= 5) return { min: '6th Cousin', max: 'Remote', color: '#6366f1', confidence: 'low' as const };
  return null;
};