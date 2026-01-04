
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchWithAI = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `您现在是 App Store 的智能导购。用户正在搜索： "${query}"。
      请根据该搜索意图，从专业的角度推荐 3 个符合该类别的应用建议。
      这些建议应该看起来非常专业，像真实上架的应用一样。
      返回 JSON 格式，包含应用名称 (name)、副标题 (subtitle)、分类 (category) 和模拟评分 (rating)。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              category: { type: Type.STRING },
              rating: { type: Type.NUMBER }
            },
            required: ["name", "subtitle", "category", "rating"]
          }
        }
      }
    });

    const jsonStr = response.text?.trim() || "[]";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Search Error:", error);
    return null;
  }
};

export const getAppGeniusInsight = async (appName: string) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `您是 App Store 的资深评测家。请为应用 "${appName}" 撰写一段两句左右的专业、热情的评测总结。不要提及这是虚构的或AI生成的，直接针对应用的功能和体验进行评价。`,
      });
  
      return response.text;
    } catch (error) {
      console.error("AI Insight Error:", error);
      return "目前无法生成洞察。";
    }
  };
