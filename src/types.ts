export interface BPUItem {
  id: string;
  designation: string;
  unite: string;
  quantite: number;
  prixUnitaireHT: number;
  marketRate?: number;
  marginType?: 'High' | 'Low' | 'Medium';
  riskLevel?: 'High' | 'Low' | 'Medium';
}

export interface ConsultationResult {
  category: number;
  sector: string;
  mandatoryDocs: {
    name: string;
    status: 'Present' | 'Missing' | 'Expired';
  }[];
  eliminatoryCriteria: string[];
  legalAdvice: string;
}

export interface CahierChargesResult {
  technicalAnalysis: string;
  financialStrategy: string;
  winningTips: string[];
  optimizedBPU?: BPUItem[];
  winningTotalTTC: number;
}
