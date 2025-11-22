# Low Level Design (LLD) - SquadMix

## 1. Frontend Component Architecture

The application is built as a React 19 Functional Component tree.

### 1.1 `App.tsx` (Root Controller)
The central hub handling state and orchestration.

*   **State Variables**:
    *   `files` (`File[]`): Stores the array of raw image objects selected by the user.
    *   `selectedVibe` (`VibeType`): The current style configuration.
    *   `selectedAspectRatio` (`AspectRatio`): Output dimensions (1:1, 3:4, 16:9).
    *   `generatedImage` (`string | null`): The Base64 result string.
    *   `isLoading` (`boolean`): Toggles the UI between "Edit" and "Processing" modes.
    *   `error` (`string | null`): Capture mechanism for API failures.
*   **Logic Flow**:
    *   `handleGenerate`: 
        1.  Checks `files.length > 0`.
        2.  Sets `isLoading = true`.
        3.  Calls `generateSquadImage`.
        4.  On success: Sets `generatedImage`, clears `isLoading`.
        5.  On fail: Sets `error`, clears `isLoading`.

### 1.2 `components/UploadZone.tsx`
Handles drag-and-drop and file selection logic.
*   **Props**: `files`, `onFilesSelected`, `onRemoveFile`.
*   **Validation**: Enforces hard limit of 5 images. If `files.length >= 5`, the input is disabled and visual cues (opacity) are applied.
*   **Preview**: Uses `URL.createObjectURL(file)` to generate temporary thumbnails for immediate user feedback before upload.

### 1.3 `services/geminiService.ts` (Data Layer)
Encapsulates the `@google/genai` SDK interactions.

*   **Function `fileToPart(file: File)`**:
    *   **Purpose**: Converts binary file to API-compatible Base64 string.
    *   **Mechanism**: Uses `FileReader` API.
    *   **Critical Step**: Strips the `data:image/xyz;base64,` prefix from the string, as the Gemini API expects raw Base64 data in the `inlineData` field.

*   **Function `generateSquadImage(...)`**:
    *   **Inputs**: `files`, `vibe`, `aspectRatio`, `promptSuffix`.
    *   **Prompt Construction Strategy**:
        *   Base Prompt: "Generate a high-quality, cohesive group image..."
        *   Context Injection: Appends the specific description associated with the `VibeType` (e.g., "sitting together", "cyberpunk city").
        *   Identity Preservation: Explicitly adds instructions: "Maintain the facial features and identifying characteristics...".
    *   **API Call**:
        *   Method: `ai.models.generateContent`.
        *   Model: `gemini-2.5-flash-image`.
        *   Config: Passes `aspectRatio` in `imageConfig`.

## 2. Data Structures & Enums

### 2.1 `types.ts`

**Enum: `VibeType`**
Used to ensure type safety when selecting styles.
```typescript
export enum VibeType {
  TOGETHER = 'sitting_together',
  DANCING = 'dancing_party',
  CELEBRATING = 'celebrating',
  CARTOON = 'cartoon_style',
  CYBERPUNK = 'cyberpunk',
  BEACH_DAY = 'beach_day',
  RETRO_90S = 'retro_90s',
  FESTIVAL = 'festival',
  STARTUP = 'startup',
  FANTASY = 'fantasy'
}
```

**Interface: `VibeOption`**
Metadata for UI generation.
```typescript
export interface VibeOption {
  id: VibeType;
  label: string;       // Button text
  emoji: string;       // Visual icon
  promptSuffix: string;// Prompt engineering text
  description: string; // Helper text
}
```

## 3. Error Handling & Edge Cases

| Scenario | Detection | Handling |
| :--- | :--- | :--- |
| **No File Selected** | `files.length === 0` in `handleGenerate` | Display error toast "Please upload at least 1 image". |
| **API Key Missing** | `process.env.API_KEY` is undefined | SDK throws error. UI displays generic "Configuration Error". |
| **Safety Block** | API returns `finishReason: SAFETY` | `try/catch` block in Service layer catches exception. UI shows "Image blocked by safety filters". |
| **Network Fail** | `fetch` failure inside SDK | `try/catch` block catches network error. UI shows "Connection failed". |

## 4. UI/UX Implementation Details

*   **Loading State**: When `isLoading` is true, the "Cook It Up" button transforms into a spinner. The interface does *not* lock completely, but the generate button is disabled to prevent double-submission.
*   **Result View**: The result section uses an animation (`animate-in slide-in-from-bottom`) to provide a smooth entry when the image is ready.
*   **Tailwind Configuration**: Custom colors (`neon-pink`, `neon-blue`) are defined in the `tailwind.config` within `index.html` to ensure consistent branding across components.
