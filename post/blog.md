# Building SquadMix: The Ultimate Gen Z Photo Mixer with Gemini 2.5

In the age of remote work and digital friendships, getting a photo of your whole "squad" together is harder than ever. And even when you are together, getting everyone to look at the camera at the same time is a miracle.

I decided to solve this using the power of Multimodal AI. Enter **SquadMix**, a web application that takes individual photos of people and merges them into stylized, cohesive group portraits.

## The Concept 💡

The goal was simple: **Input** (separate photos of friends) + **Vibe** (Style/Context) = **Output** (One epic group photo).

I wanted the UI to feel modern and appealing to a younger demographic—think dark modes, neon accents, and emojis. But more importantly, I wanted the technology underneath to be blazing fast.

## The Engine: Google Gemini 2.5 Flash ⚡

For this project, I chose Google's **Gemini 2.5 Flash Image** model. Here is why:

1.  **Speed**: As the name suggests, Flash is optimized for low latency. Waiting 30 seconds for an image generation kills the "fun" factor. Flash delivers results rapidly.
2.  **Multimodal Native**: It doesn't just look at text. It natively understands image inputs. I can pass it 5 distinct images and a text prompt like *"Make these people look like a rock band"*, and it understands the assignment.
3.  **Cost/Efficiency**: It's a lightweight model perfect for consumer-facing apps.

## The Tech Stack 🛠️

*   **Frontend**: React 19 (latest and greatest).
*   **Styling**: Tailwind CSS (crucial for iterating on the "Neon" aesthetic quickly).
*   **SDK**: The new `@google/genai` package.

## How It Works (Under the Hood)

### 1. Image Pre-processing
When a user uploads images, the browser's `FileReader` API reads them. We convert these raw files into Base64 encoded strings. This is the format the Gemini API expects for inline image data.

```typescript
const fileToPart = (file: File) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Extract base64 data
      const base64Data = reader.result.split(',')[1];
      resolve({ inlineData: { data: base64Data, mimeType: file.type } });
    };
    reader.readAsDataURL(file);
  });
};
```

### 2. Dynamic Prompt Engineering
The "Vibe" selector isn't just a UI element; it's a prompt engineer. When you select "Startup Founders", the app constructs a specific instruction set:

> *"They should look like a successful tech startup founding team posing for a magazine cover. Smart casual, arms crossed, confident smiles, modern office background."*

This text is combined with the image parts and sent to the API.

### 3. The "Flash" Generation
We make a single API call using `ai.models.generateContent`. We also specify the `aspectRatio` in the configuration, allowing users to generate square, portrait (for TikTok/Instagram Stories), or landscape images.

## Challenges & Learnings

*   **Consistency**: Preserving facial identity in GenAI is tough. By tweaking the prompt to explicitly say *"Maintain the facial features and identifying characteristics"*, the model does a much better job of keeping your friends recognizable.
*   **File Handling**: Handling multiple file uploads and managing browser memory requires care. We limit uploads to 5 images to ensure the payload stays within reasonable limits for the API.

## Conclusion

SquadMix demonstrates how accessible powerful AI tools have become. With just a few hundred lines of code, we can build an app that previously would have required expert Photoshop skills or a dedicated VFX team.

Go clone the repo and start mixing your squad!
