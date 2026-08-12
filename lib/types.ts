export interface Pillar {
  id: string;
  name: string;
  weight: number;
}

export interface Indicator {
  id: string;
  pillar: string;
  label: string;
  unit: string;
  anchor_min: number;
  anchor_max: number;
  raw: number | null;
  as_of: string | null;
  source_name: string;
  source_url: string | null;
  retrieved: string | null;
  note: string | null;
}

export interface HsiData {
  version: string;
  methodology_version: string;
  computed_at: string;
  index: number | null;
  pillars: Pillar[];
  indicators: Indicator[];
}

export interface ScoredIndicator extends Indicator {
  score: number;
}

export interface ScoredPillar extends Pillar {
  score: number;
  indicators: ScoredIndicator[];
}

export interface HsiResult {
  index: number;
  pillars: ScoredPillar[];
  indicators: ScoredIndicator[];
}
