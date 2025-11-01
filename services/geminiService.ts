
import { GoogleGenAI, Modality } from "@google/genai";
import type { GenerativePart } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function removeBackground(imagePart: GenerativePart): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          imagePart,
          { text: 'remove the background. return only the subject with a transparent background.' },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const candidate = response.candidates?.[0];
    if (!candidate) {
        throw new Error("No candidates returned from the API.");
    }

    const imagePartResponse = candidate.content.parts.find(part => part.inlineData);

    if (imagePartResponse && imagePartResponse.inlineData) {
        return imagePartResponse.inlineData.data;
    } else {
        throw new Error("No image data found in the API response.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Gemini API request failed.");
  }
}
