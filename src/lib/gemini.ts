import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeConsultation(fileData: { data: string; mimeType: string }) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: {
      parts: [
        { inlineData: { data: fileData.data, mimeType: fileData.mimeType } },
        { text: `أنت المحرك الخلفي لموقع HeBuildz.com. قم بتحليل إعلان الاستشارة أو المناقصة المرفق بناءً على المرسوم الرئاسي 15-247.
        
        المخرجات المطلوبة (باللغة العربية):
        1. فئة التأهيل المطلوبة (1-9).
        2. قطاع النشاط المتخصص.
        3. قائمة المستندات الإجبارية.
        4. المعايير الإقصائية (Critères éliminatoires).
        5. نصيحة قانونية إستراتيجية للمترشح (بالخط العريض).
        
        أرجع النتيجة بصيغة JSON فقط.` }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.NUMBER },
          sector: { type: Type.STRING },
          mandatoryDocs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                status: { type: Type.STRING, enum: ["Present", "Missing", "Expired"] }
              }
            }
          },
          eliminatoryCriteria: { type: Type.ARRAY, items: { type: Type.STRING } },
          legalAdvice: { type: Type.STRING }
        },
        required: ["category", "sector", "mandatoryDocs", "eliminatoryCriteria", "legalAdvice"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function analyzeCahierCharges(fileData: { data: string; mimeType: string }) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: {
      parts: [
        { inlineData: { data: fileData.data, mimeType: fileData.mimeType } },
        { text: `أنت المحرك المالي لـ HeBuildz.com. قم بتحليل دفتر الشروط المرفق (أو جزء منه) لتقديم إستراتيجية للفوز بالصفقة.
        
        المخرجات المطلوبة (باللغة العربية):
        1. تحليل تقني للمتطلبات.
        2. إستراتيجية مالية (BPU) بناءً على أسعار السوق الجزائرية 2024-2026.
        3. نصائح ذهبية للفوز بالصفقة.
        4. السعر الإجمالي المقترح (TTC) مع هامش أمان.
        
        أرجع النتيجة بصيغة JSON فقط.` }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          technicalAnalysis: { type: Type.STRING },
          financialStrategy: { type: Type.STRING },
          winningTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          winningTotalTTC: { type: Type.NUMBER }
        },
        required: ["technicalAnalysis", "financialStrategy", "winningTips", "winningTotalTTC"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
