# Architecture Diagram

## Diagram Explanation
This diagram provides a structural view of the **SquadMix** application.

1.  **Client Device Scope**: The left box encapsulates everything running on the user's machine.
    *   **Presentation Layer**: The visual interface components responsible for user interaction and rendering.
    *   **Business Logic**: The JavaScript runtime handling state, service communication, and prompt engineering.

2.  **Cloud Infrastructure Scope**: The right box represents Google's managed services.
    *   **Safety Filters**: The Trust & Safety layer that scans inputs before processing.
    *   **Gemini Model**: The multimodal inference engine (`gemini-2.5-flash-image`) that synthesizes the final image.

3.  **Data Flow**: The arrows represent the movement of data, specifically the HTTPS transport of JSON payloads containing Base64 encoded images.

```mermaid
graph TB
    %% Styles (No black used)
    classDef ui fill:#e8e3ff,stroke:#6a5acd,stroke-width:2px,color:#1a1a1a
    classDef logic fill:#e0f7fa,stroke:#00acc1,stroke-width:2px,color:#1a1a1a
    classDef cloud fill:#ffe4f2,stroke:#ff69b4,stroke-width:2px,color:#1a1a1a
    classDef container fill:#f7f7f7,stroke:#b0b0b0,stroke-width:2px,stroke-dasharray: 5 5,color:#333

    subgraph Client_Device["💻 Client Device / Browser"]
        direction TB
        
        subgraph UI_Layer["🎨 Presentation Layer"]
            CoreUI["Main Application View"]:::ui
            InputMod["Input Module"]:::ui
        end
        
        subgraph Logic_Layer["🧠 Business Logic Layer"]
            StateManager["State Manager"]:::logic
            APIService["Integration Service"]:::logic
            PromptEng["Prompt Engine"]:::logic
        end
    end
    
    subgraph Cloud_Infrastructure["☁️ Google Cloud Platform"]
        GeminiModel["♊ Gemini 2.5 Flash"]:::cloud
        SafetyFilters["🛡️ Safety Filters"]:::cloud
    end
    
    %% Applying Container Styles
    class Client_Device,Cloud_Infrastructure container

    CoreUI --> StateManager
    CoreUI --> APIService
    
    APIService --> PromptEng
    
    APIService -- "HTTPS / JSON (Multimodal Payload)" --> SafetyFilters
    SafetyFilters --> GeminiModel
    GeminiModel -- "Generated Image Blob" --> APIService
```