import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export class AIService {
  static async analyzeMoodPatterns(moodEntries: any[]) {
    const prompt = `Analyze these mood entries for a student and detect emotional patterns, continuous stress, or burnout risk. 
    Entries: ${JSON.stringify(moodEntries.map(e => ({ mood: e.mood, intensity: e.moodIntensity, stress: e.stressLevel, note: e.note })))}
    
    Provide:
    1. A summary of the emotional state.
    2. A list of detected patterns.
    3. Sentiment score (0-1).
    4. Burnout risk level (low, medium, high).`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            patterns: { type: Type.ARRAY, items: { type: Type.STRING } },
            sentimentScore: { type: Type.NUMBER },
            riskLevel: { type: Type.STRING, enum: ['low', 'medium', 'high'] }
          }
        }
      }
    });

    return JSON.parse(response.text);
  }

  static async summarizeJournal(content: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this student's journal entry and provide:
      1. One sentence summary.
      2. Top 3 emotional keywords.
      3. Sentiment score (-1 to 1).
      
      Entry: "${content}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            sentimentScore: { type: Type.NUMBER }
          }
        }
      }
    });

    return JSON.parse(response.text);
  }

  static async generateWellnessSuggestions(userData: any) {
    const prompt = `Generate personalized wellness suggestions for a student with the following profile:
    Mood Trends: ${JSON.stringify(userData.trends)}
    Interests: ${JSON.stringify(userData.interests)}
    
    Keep suggestions actionable, tech-focused (bio-hacking, neuro-plasticity based), and concise.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING }
            }
          }
        }
      }
    });

    return JSON.parse(response.text);
  }

  static async assistantChat(message: string, context: any) {
    const systemPrompt = `You are MindCare AI, a sophisticated wellness assistant for students. 
    You specialize in biological hacking, neuro-plasticity, and student mental health.
    Keep your tone professional, empathetic, and slightly futuristic/technical.
    User Context: ${JSON.stringify(context)}
    
    Guidelines:
    - Provide actionable, evidence-based wellness advice.
    - If the user shows signs of severe distress, gently encourage them to use the "Emergency Link" or talk to a professional.
    - Be concise but thorough.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "user", parts: [{ text: message }] }
      ]
    });

    return response.text;
  }
}
