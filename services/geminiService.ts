import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { GenerativePart, Quality, BoundingBox } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PROMPTS = {
  standard: 'remove the background. return only the subject with a transparent background.',
  high: 'Perform a high-precision background removal. Pay close attention to fine details like hair, fur, and semi-transparent edges. The output should be only the main subject on a transparent background.',
};

export async function detectSubject(imagePart: GenerativePart): Promise<BoundingBox> {
  const prompt = 'Analyze this image and identify the main subject. Return a JSON object representing a tight bounding box around the subject. The coordinates and dimensions must be normalized, ranging from 0.0 to 1.0. The JSON object should have four properties: "x" (top-left corner, horizontal), "y" (top-left corner, vertical), "width", and "height".';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          imagePart,
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            x: { type: Type.NUMBER },
            y: { type: Type.NUMBER },
            width: { type: Type.NUMBER },
            height: { type: Type.NUMBER },
          },
          required: ['x', 'y', 'width', 'height'],
        },
      },
    });

    const jsonString = response.text.trim();
    const boundingBox = JSON.parse(jsonString);

    if (
      typeof boundingBox.x !== 'number' ||
      typeof boundingBox.y !== 'number' ||
      typeof boundingBox.width !== 'number' ||
      typeof boundingBox.height !== 'number'
    ) {
      throw new Error("Invalid bounding box format received from API.");
    }
    
    return boundingBox as BoundingBox;

  } catch (error) {
    console.error("Error calling Gemini API for subject detection:", error);
    throw new Error("Gemini API request for subject detection failed.");
  }
}


export async function removeBackground(imagePart: GenerativePart, quality: Quality): Promise<string> {
  try {
    const prompt = PROMPTS[quality];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          imagePart,
          { text: prompt },
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

export async function detectText(imagePart: GenerativePart): Promise<string> {
  const prompt = "Perform OCR on this image. Extract all visible text exactly as it appears. If there is no text, return an empty string. Return only the extracted text content, without any commentary, formatting, or explanations.";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          imagePart,
          { text: prompt },
        ],
      },
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API for text detection:", error);
    throw new Error("Gemini API request for text detection failed.");
  }
}