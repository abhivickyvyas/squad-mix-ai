
import { GoogleGenAI } from "@google/genai";
import { AspectRatio, VibeType } from "../types";

const fileToPart = (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // Remove the Data-URI prefix to get just the base64 string
        const base64Data = reader.result.split(',')[1];
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        });
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateSquadImage = async (
  files: File[],
  vibe: VibeType,
  aspectRatio: AspectRatio,
  promptSuffix: string
): Promise<string> => {
  try {
    // Use the standard environment API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // 1. Prepare Image Parts
    const imageParts = await Promise.all(files.map(file => fileToPart(file)));

    // 2. Construct Prompt
    let prompt = "Generate a high-quality, cohesive group image featuring the people from the provided reference images. ";
    
    switch (vibe) {
      case VibeType.TOGETHER:
        prompt += "They should be sitting or standing together casually in a modern lounge setting, looking at the camera like a group photo. ";
        break;
      case VibeType.DANCING:
        prompt += "They should be dancing energetically at a vibrant party with colorful lighting. Dynamic poses. ";
        break;
      case VibeType.CELEBRATING:
        prompt += "They should be celebrating a big win, popping confetti or holding drinks, looking extremely happy and cheering. ";
        break;
      case VibeType.CARTOON:
        prompt += "Transform them into high-quality 3D Pixar-style cartoon characters standing together. ";
        break;
      case VibeType.CYBERPUNK:
        prompt += "Place them in a futuristic cyberpunk city street with neon lights, wearing tech-wear fashion. ";
        break;
      case VibeType.BEACH_DAY:
        prompt += "They should be having fun on a sunny beach, wearing summer casual outfits. ";
        break;
      case VibeType.RETRO_90S:
        prompt += "Generate a 1990s style sitcom promotional photo or yearbook photo. They should be wearing 90s fashion (denim, colorful patterns), with a nostalgic film grain texture. ";
        break;
      case VibeType.FESTIVAL:
        prompt += "They should be at a golden-hour music festival like Coachella, wearing boho-chic festival outfits with glitter and accessories. Ferris wheel in background. ";
        break;
      case VibeType.STARTUP:
        prompt += "They should look like a successful tech startup founding team posing for a magazine cover. Smart casual, arms crossed, confident smiles, modern office background. ";
        break;
      case VibeType.FANTASY:
        prompt += "Reimagine them as an epic fantasy adventuring party (warriors, mages, rogues). Wearing detailed armor and robes, holding magical items. Epic landscape background. ";
        break;
      default:
        prompt += "They should be posed together naturally. ";
    }

    prompt += "Maintain the facial features and identifying characteristics of each person from the source images as much as possible. The composition should be balanced.";
    
    if (promptSuffix) {
        prompt += ` ${promptSuffix}`;
    }

    // 3. Call API
    // Using gemini-2.5-flash-image for general availability and speed
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          ...imageParts,
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        }
      }
    });

    // 4. Extract Image
    // Iterate through parts to find the image
    if (response.candidates && response.candidates.length > 0) {
        const parts = response.candidates[0].content.parts;
        for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }
    
    throw new Error("No image data found in response.");

  } catch (error: any) {
    console.error("Generation Error:", error);
    throw error;
  }
};
