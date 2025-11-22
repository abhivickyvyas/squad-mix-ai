# Low Level Design (LLD) - SquadMix

## 1. Component Structure (React)

### `App.tsx` (Container)
*   **State**:
    *   `files`: Array of `File` objects.
    *   `selectedVibe`: Enum `VibeType`.
    *   `selectedAspectRatio`: String literal.
    *   `generatedImage`: Base64 string URL (nullable).
    *   `isLoading`: Boolean.
    *   `error`: String (nullable).
*   **Responsibilities**: Orchestrates the data flow, manages global state, handles top-level layout.

### `components/UploadZone.tsx`
*   **Props**: `files`, `onFilesSelected`, `onRemoveFile`.
*   **Logic**: Handles drag-and-drop (native file input), file limit validation (max 5), and preview rendering.

### `components/Button.tsx`
*   **Props**: `variant` (primary, neon, etc.), `isLoading`, `onClick`.
*   **Styling**: Contains specific Tailwind classes for the "Neon" glow effects.

## 2. Service Layer

### `services/geminiService.ts`
This is a pure TypeScript module handling API communication.

#### Function: `fileToPart(file: File)`
*   **Input**: Standard JS `File` object.
*   **Output**: Promise resolving to an object `{ inlineData: { data: string, mimeType: string } }`.
*   **Logic**: Uses `FileReader` to read file as DataURL, then strips the metadata prefix (`data:image/jpeg;base64,`) to get raw base64.

#### Function: `generateSquadImage(...)`
*   **Inputs**: `files`, `vibe`, `aspectRatio`, `promptSuffix`.
*   **Logic**:
    1.  Initialize `GoogleGenAI` client with `process.env.API_KEY`.
    2.  Map input files to API-compatible parts using `fileToPart`.
    3.  **Prompt Engineering**: A `switch` statement constructs a detailed text prompt based on the `VibeType`.
        *   *Example*: If `VibeType.CYBERPUNK`, appends "Place them in a futuristic cyberpunk city...".
    4.  Calls `ai.models.generateContent` using model `gemini-2.5-flash-image`.
    5.  Configures `imageConfig` with the selected `aspectRatio`.
    6.  Parses the response to find the `inlineData` of the generated image.
    7.  Returns the full Data URI to the UI.

## 3. Data Models (`types.ts`)

```typescript
enum VibeType {
  TOGETHER, DANCING, CELEBRATING, CARTOON, 
  CYBERPUNK, BEACH_DAY, RETRO_90S, FESTIVAL, 
  STARTUP, FANTASY
}

type AspectRatio = '1:1' | '3:4' | '16:9';
```

## 4. Error Handling
*   **UI Level**: Displays error banners if upload count is 0 or API fails.
*   **Service Level**: Catches API exceptions (e.g., quota exceeded, safety filters) and propagates meaningful messages to the UI.
