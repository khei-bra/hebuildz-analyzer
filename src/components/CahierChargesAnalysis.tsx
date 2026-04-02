import React from 'react';
import { ShieldCheck, TrendingUp, AlertCircle, Upload, X, FileText, CheckCircle2 } from 'lucide-react';
import { CahierChargesResult } from '../types';
import Markdown from 'react-markdown';

interface Props {
  result: CahierChargesResult | null;
  isLoading: boolean;
  onAnalyze: (fileData: { data: string; mimeType: string }) => void;
}

export const CahierChargesAnalysis: React.FC<Props> = ({ result, isLoading, onAnalyze }) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(',')[1];
      onAnalyze({ data: base64Data, mimeType: selectedFile.type });
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="space-y-6 font-arabic" dir="rtl">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-amber-500" />
          تحليل دفتر الشروط (صورة / PDF)
        </h2>
        
        <div 
          onClick={() => !selectedFile && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-10 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer
            ${selectedFile ? 'border-amber-200 bg-amber-50/30' : 'border-slate-300 hover:border-amber-500 hover:bg-slate-50'}`}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" />
          
          {selectedFile ? (
            <div className="w-full flex flex-col items-center">
              <div className="w-20 h-20 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-10 h-10 text-amber-600" />
              </div>
              <p className="font-semibold text-slate-800">{selectedFile.name}</p>
              <button onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }} className="mt-2 text-red-500 text-sm hover:underline">إلغاء</button>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-amber-600" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-slate-800">ارفع دفتر الشروط أو جزء منه</p>
                <p className="text-sm text-slate-500 mt-1">لتحليل المتطلبات التقنية والمالية وتقديم إستراتيجية الفوز</p>
              </div>
            </>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={isLoading || !selectedFile}
          className="w-full mt-6 py-4 bg-amber-500 text-white rounded-xl font-bold text-lg hover:bg-amber-600 disabled:opacity-50 shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              جاري استخراج الإستراتيجية...
            </>
          ) : (
            'بدء تحليل دفتر الشروط'
          )}
        </button>
      </div>

      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                التحليل التقني والمالي
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-2">المتطلبات التقنية:</h4>
                  <div className="text-sm text-slate-700 leading-relaxed">
                    <Markdown>{result.technicalAnalysis}</Markdown>
                  </div>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                  <h4 className="font-bold text-emerald-800 mb-2">الإستراتيجية المالية:</h4>
                  <div className="text-sm text-emerald-700 leading-relaxed">
                    <Markdown>{result.financialStrategy}</Markdown>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                نصائح ذهبية للفوز بالصفقة
              </h3>
              <div className="space-y-2">
                {result.winningTips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {tip}
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-blue-900 text-white rounded-2xl shadow-xl">
                <div className="text-sm opacity-80 mb-1">السعر الإجمالي المقترح (TTC)</div>
                <div className="text-3xl font-black">
                  {result.winningTotalTTC.toLocaleString()} دج
                </div>
                <div className="text-xs mt-2 opacity-70">بناءً على أسعار السوق 2024-2026 مع هامش أمان</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
