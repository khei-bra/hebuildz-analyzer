import React from 'react';
import { FileSearch, AlertTriangle, CheckCircle, Info, Upload, X, FileText } from 'lucide-react';
import { ConsultationResult } from '../types';
import Markdown from 'react-markdown';

interface Props {
  result: ConsultationResult | null;
  isLoading: boolean;
  onAnalyze: (fileData: { data: string; mimeType: string }) => void;
}

export const ConsultationAudit: React.FC<Props> = ({ result, isLoading, onAnalyze }) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
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

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 font-arabic" dir="rtl">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <FileSearch className="w-8 h-8 text-blue-900" />
          تدقيق إعلان الاستشارة (صورة / PDF)
        </h2>
        
        <div 
          onClick={() => !selectedFile && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-10 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer
            ${selectedFile ? 'border-blue-200 bg-blue-50/30' : 'border-slate-300 hover:border-blue-900 hover:bg-slate-50'}`}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" />
          
          {selectedFile ? (
            <div className="w-full flex flex-col items-center">
              <div className="relative group">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="max-h-48 rounded-lg shadow-md mb-4" />
                ) : (
                  <div className="w-20 h-20 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <FileText className="w-10 h-10 text-blue-900" />
                  </div>
                )}
                <button onClick={(e) => { e.stopPropagation(); clearFile(); }} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="font-semibold text-slate-800">{selectedFile.name}</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-blue-900" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-slate-800">اضغط لرفع الملف أو اسحبه هنا</p>
                <p className="text-sm text-slate-500 mt-1">صور (JPG, PNG) أو ملفات PDF لإعلان الاستشارة</p>
              </div>
            </>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={isLoading || !selectedFile}
          className="w-full mt-6 py-4 bg-blue-900 text-white rounded-xl font-bold text-lg hover:bg-blue-800 disabled:opacity-50 shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              جاري التحليل...
            </>
          ) : (
            'بدء تدقيق الإعلان'
          )}
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">التأهيل والقطاع</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">الفئة المطلوبة</span>
                <span className="font-bold text-blue-900 text-xl">الفئة {result.category}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">قطاع النشاط</span>
                <span className="font-semibold text-slate-800">{result.sector}</span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mt-6 mb-4">المعايير الإقصائية</h3>
            <div className="space-y-2">
              {result.eliminatoryCriteria.map((criteria, idx) => (
                <div key={idx} className="flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {criteria}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">الوثائق الإجبارية</h3>
            <div className="space-y-2">
              {result.mandatoryDocs.map((doc, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-700">{doc.name}</span>
                  {doc.status === 'Present' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                نصيحة إستراتيجية
              </h4>
              <div className="leading-relaxed text-slate-700">
                <Markdown>{result.legalAdvice}</Markdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
