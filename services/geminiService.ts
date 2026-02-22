
import { GoogleGenAI } from "@google/genai";
import { Order } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePersonalizedMessage = async (order: Order): Promise<string> => {
  try {
    const itemNames = order.items.map(i => i.name).join(", ");
    const prompt = `You are a helpful and elegant AI assistant for ASUBAA ONLINE STORE, an online beverage and spirit retail store in Tanzania. 
    The customer just purchased: ${itemNames}. 
    Total order value: ${order.total.toLocaleString()} Tsh.
    Generate a short, sophisticated, and personalized "Thank You" message for their receipt. 
    Mention one of the items they bought and suggest how it might improve their evening or celebration. 
    Include a subtle Swahili greeting like "Karibu tena" or "Asante sana".
    Keep it under 60 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Asante kwa kuchagua ASUBAA ONLINE STORE. Tunathamini sana ununuzi wako!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Asante kwa oda yako! Vinywaji vyako vinaandaliwa kwa ajili ya usafirishaji wa haraka.";
  }
};
