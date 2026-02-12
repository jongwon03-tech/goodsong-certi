
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateMotivationalMessage = async (name: string, record: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `사용자 이름 '${name}'이(가) '${record}'라는 놀라운 기록을 달성했습니다. 이 기록증에 들어갈 짧고 품격 있는 축하 문구 1문장을 한국어로 작성해 주세요. (예: 끊임없는 도전으로 일궈낸 값진 결실을 진심으로 축하합니다.) 달성한 종목의 특성을 살리면 좋습니다.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 100,
      }
    });

    return response.text?.trim() || "끊임없는 도전으로 일궈낸 값진 결실을 진심으로 축하합니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "위 사람은 탁월한 역량과 열정으로 우수한 기록을 달성하였기에 이 증서를 수여합니다.";
  }
};
