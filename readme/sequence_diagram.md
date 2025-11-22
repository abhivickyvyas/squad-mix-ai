# Sequence Diagram

## Diagram Explanation
This sequence diagram details the technical handshake between the frontend and the API.

1.  **User Interaction**: The user drives the flow (Actor `User`).
2.  **State Updates**: The `UI` (React App) updates its local state immediately upon user actions (selecting files/vibes).
3.  **Service Activation**: When "Cook It Up" is clicked, the `Service` layer takes over.
4.  **The Loop**: The `loop` block highlights a critical performance step: iterating through every uploaded file and converting it to Base64 using `FileReader`. This happens asynchronously in parallel (`Promise.all`).
5.  **API Call**: The `Google` participant represents the external API. Note that the `Service` sends the request and waits (activates) until a response is received.
6.  **Alt Block**: Handles the two possible outcomes from Google:
    *   **Success**: An image is returned.
    *   **Failure**: An error is thrown (e.g., 500 Internal Server Error).
7.  **Final Action**: The UI updates to show the result or error to the user.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as React App
    participant Service as Gemini Service
    participant Google as Google GenAI API

    User->>UI: Upload Images (1-5)
    UI->>UI: Update Local State (files)
    User->>UI: Select Vibe (e.g., 'Festival')
    User->>UI: Select Aspect Ratio (e.g., '16:9')
    User->>UI: Click "Cook It Up"
    
    UI->>Service: generateSquadImage(files, vibe, ratio)
    activate Service
    
    loop For each file
        Service->>Service: FileReader.readAsDataURL()
        Service->>Service: Extract Base64 string
    end
    
    Service->>Service: Construct Text Prompt (Prompt Engineering)
    
    note right of Service: Combines Base64 images + Text Prompt
    
    Service->>Google: models.generateContent(model='gemini-2.5-flash-image', content, config)
    activate Google
    
    note right of Google: Process Multimodal Input
    
    Google-->>Service: Response (Candidate with InlineData)
    deactivate Google
    
    alt Response has Image
        Service-->>UI: Return Image Data URI
    else Error / Blocked
        Service-->>UI: Throw Error
    end
    deactivate Service
    
    UI->>User: Display Generated Image
    User->>UI: Click Download
    UI->>User: Trigger File Download
```
