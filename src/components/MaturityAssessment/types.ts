
export interface AssessmentRespondent {
  hasProjectExperience: boolean | null;
  isPharmaceutical: boolean | null;
  pharmaceuticalType: string;
  companySize: string;
  state: string;
}

export interface AssessmentQuestion {
  id: number;
  meetsRequirement: boolean | null;
  selectedOption?: string;
  score?: number;
  details: {
    [key: string]: string;
  };
}

export interface AssessmentLevel {
  questions: AssessmentQuestion[];
}

export interface AssessmentScores {
  [key: number]: number;
}

export interface AssessmentData {
  respondent: AssessmentRespondent;
  levels: {
    [key: number]: AssessmentLevel;
  };
  scores: AssessmentScores;
  totalPoints: number;
  overallMaturity: number;
  assessmentId?: string;
  sessionId?: string;
}
