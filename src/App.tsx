import React from 'react';
import { FileCheck, ShieldCheck } from 'lucide-react';
import { ConsultationAudit } from './components/ConsultationAudit';
import { CahierChargesAnalysis } from './components/CahierChargesAnalysis';
import { analyzeConsultation, analyzeCahierCharges } from './lib/gemini';
import { ConsultationResult, CahierChargesResult } from './types';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<'consultation' | 'cahier'>('consultation');
  const [consultationResult, setConsultationResult] = React.useState<ConsultationResult | null>(null);
  const [isConsulting, setIsConsulting] = React.useState(false);
  
  const [cahierResult, setCahierResult] = React.useState<CahierChargesResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const handleConsultation = async (fileData: { data: string; mimeType: string }) => {
    setIsConsulting(true);
    try {
      const result = await analyzeConsultation(fileData);
      setConsultationResult(result);
    } catch (error) {
      console.error('Consultation audit failed:', error);
    } finally {
      setIsConsulting(false);
    }
  };

  const handleCahierAnalysis = async (fileData: { data: string; mimeType: string }) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeCahierCharges(fileData);
      setCahierResult(result);
    } catch (error) {
      console.error('Cahier analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent font-arabic py-4" dir="rtl">
      <main className="max-w-7xl mx-auto px-4">
        {/* Navigation Tabs */}
        <div className="flex gap-1 p-1 bg-slate-200 rounded-xl w-fit mb-8 mx-auto">
          <button
            onClick={() => setActiveTab('consultation')}
            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'consultation' 
                ? 'bg-blue-900 text-white shadow-lg' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <FileCheck className="w-5 h-5" />
            تدقيق إعلان الاستشارة
          </button>
          <button
            onClick={() => setActiveTab('cahier')}
            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'cahier' 
                ? 'bg-amber-500 text-white shadow-lg' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            تحليل دفتر الشروط
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'consultation' ? (
            <ConsultationAudit 
              result={consultationResult} 
              isLoading={isConsulting} 
              onAnalyze={handleConsultation} 
            />
          ) : (
            <CahierChargesAnalysis 
              result={cahierResult} 
              isLoading={isAnalyzing} 
              onAnalyze={handleCahierAnalysis} 
            />
          )}
        </div>
      </main>
    </div>
  );
}
