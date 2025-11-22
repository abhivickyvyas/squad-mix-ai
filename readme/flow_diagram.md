# User Flow Diagram

## Diagram Explanation
This flowchart maps the user's interactive journey through the application.

*   **Start**: The user lands on the index page.
*   **Validation (Check)**: The system prevents the user from proceeding if no images are selected. This is a client-side validation step.
*   **Configuration**: The user has two axes of configuration: **Vibe** (Style) and **Ratio** (Dimensions).
*   **Processing (Loading)**: The "Cook It Up" action triggers the API call. This is the synchronous wait period where the UI shows a spinner.
*   **Result Handling**: 
    *   **Success Path**: The image is rendered, and the user can download it or try again.
    *   **Failure Path**: If the API fails (e.g., rate limit, safety block), the error is caught, displayed, and the user is returned to the configuration state to try again.

```mermaid
graph TD
    Start((Start)) --> Upload[Upload 1-5 Images]
    Upload --> Check{Count > 0?}
    Check -- No --> Error[Show Error]
    Check -- Yes --> Vibe[Select Vibe]
    
    Vibe --> Ratio[Select Aspect Ratio]
    Ratio --> Cook[Click 'Cook It Up']
    
    Cook --> Loading[Show Loading Spinner]
    Loading --> Process[Convert Files to Base64]
    Process --> Prompt[Construct Prompt based on Vibe]
    Prompt --> API[Call Gemini API]
    
    API --> Result{Success?}
    
    Result -- No --> Catch[Catch Error]
    Catch --> DisplayErr[Display Error Message]
    DisplayErr --> Cook
    
    Result -- Yes --> Render[Render Generated Image]
    Render --> Download[Download Image]
    Render --> Retry[Change Vibe/Retry]
    Retry --> Vibe
```
