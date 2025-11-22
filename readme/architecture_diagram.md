# Architecture Diagram

```mermaid
graph TB
    subgraph Client_Device [Client Device / Browser]
        direction TB
        
        subgraph UI_Layer [UI Layer (React 19)]
            AppComponent[App.tsx]
            UploadZone[UploadZone.tsx]
            ResultView[Result Display]
        end
        
        subgraph Logic_Layer [Logic Layer]
            State[State Management (useState)]
            Service[Gemini Service]
            PromptEng[Prompt Engineering Logic]
        end
        
        subgraph Styling [Styling]
            Tailwind[Tailwind CSS]
            Assets[Fonts/Icons]
        end
    end
    
    subgraph Cloud_Infrastructure [Google Cloud Platform]
        direction TB
        GeminiModel[Gemini 2.5 Flash Image Model]
        SafetyFilters[Safety & Privacy Filters]
    end
    
    AppComponent --> State
    AppComponent --> Service
    UploadZone --> State
    
    Service --> PromptEng
    
    Service -- "HTTPS / JSON (Base64 Payloads)" --> SafetyFilters
    SafetyFilters --> GeminiModel
    GeminiModel -- "Generated Image Blob" --> Service
```
