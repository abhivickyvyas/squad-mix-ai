# Architecture Diagram

## Diagram Explanation
This diagram provides a structural view of the **SquadMix** application.

1.  **Client Device Scope**: The left box encapsulates everything running on the user's machine.
    *   **UI Layer**: The visual components the user interacts with (`App`, `UploadZone`).
    *   **Logic Layer**: The JavaScript code running in the browser memory. Crucially, `PromptEng` (Prompt Engineering) happens here—we construct the text prompt on the client before sending it.
    *   **Styling**: Tailwind CSS handles the visual presentation.

2.  **Cloud Infrastructure Scope**: The right box represents Google's managed services.
    *   **Safety Filters**: Before the model processes data, Google's Trust & Safety layer scans the input images and text prompt for policy violations.
    *   **Gemini Model**: The core inference engine that generates the image.

3.  **Connection**: The arrow labeled `HTTPS / JSON` represents the API call. It carries a heavy payload (multiple Base64 images), which is why `Gemini 2.5 Flash` is preferred for its high throughput.

```mermaid
graph TB
    subgraph Client_Device ["Client Device / Browser"]
        direction TB
        
        subgraph UI_Layer ["UI Layer (React 19)"]
            AppComponent["App.tsx"]
            UploadZone["UploadZone.tsx"]
            ResultView["Result Display"]
        end
        
        subgraph Logic_Layer ["Logic Layer"]
            State["State Management (useState)"]
            Service["Gemini Service"]
            PromptEng["Prompt Engineering Logic"]
        end
        
        subgraph Styling ["Styling"]
            Tailwind["Tailwind CSS"]
            Assets["Fonts/Icons"]
        end
    end
    
    subgraph Cloud_Infrastructure ["Google Cloud Platform"]
        direction TB
        GeminiModel["Gemini 2.5 Flash Image Model"]
        SafetyFilters["Safety & Privacy Filters"]
    end
    
    AppComponent --> State
    AppComponent --> Service
    UploadZone --> State
    
    Service --> PromptEng
    
    Service -- "HTTPS / JSON (Base64 Payloads)" --> SafetyFilters
    SafetyFilters --> GeminiModel
    GeminiModel -- "Generated Image Blob" --> Service
```
