# High Level Design (HLD) - SquadMix

## 1. Introduction
**SquadMix** is a web-based Generative AI application designed to solve a common social pain point: creating cohesive group photos from disparate individual selfies. Leveraging the **Google Gemini 2.5 Flash** multimodal model, the application ingests 1-5 source images and synthesizes a new image placing all subjects in a user-selected context (or "Vibe").

### 1.1 Purpose
The primary purpose is entertainment and social sharing ("Gen Z" aesthetic). It democratizes high-end photo manipulation, allowing users without Photoshop skills to create "party" or "fantasy" photos with friends who might not be physically present together.

## 2. System Architecture

### 2.1 Architectural Style
The system follows a **Serverless, Thick-Client Architecture**.
*   **Client-Side Rendering (CSR)**: The entire application logic resides in the browser, built with React 19.
*   **Direct-to-API**: The client communicates directly with the Google GenAI API. There is no intermediate backend service (Node.js/Python) managing requests.
*   **Stateless**: The application does not maintain a persistent database of users or images. All state is ephemeral, existing only during the user's session.

### 2.2 System Components

#### A. Presentation Layer (The Client)
*   **Device**: Desktop or Mobile Web Browser.
*   **Technology**: React 19 + Tailwind CSS.
*   **Role**: 
    *   Handles file I/O (Image selection, validation, preview).
    *   Manages the User Experience (Loading states, Success/Error feedback).
    *   Performs lightweight image processing (Client-side compression/Base64 encoding).

#### B. Inference Layer (The Intelligence)
*   **Provider**: Google Cloud (Vertex AI / AI Studio).
*   **Model**: `gemini-2.5-flash-image`.
*   **Role**: 
    *   **Multimodal Parsing**: Deconstructs input images to identify human subjects.
    *   **Semantic Understanding**: Interprets the "Vibe" prompt (e.g., "Cyberpunk setting").
    *   **Image Synthesis**: Generates pixels merging the subjects into the requested setting.

## 3. Data Flow Strategy

1.  **Input**: User selects local files -> Browser reads into memory.
2.  **Encoding**: Files are converted to Base64 strings.
3.  **Transport**: Base64 strings + Text Prompt are bundled into a JSON payload.
4.  **Transmission**: Payload is sent via HTTPS POST to Google GenAI Endpoint.
5.  **Processing**: Google servers process the request.
6.  **Response**: A Base64 encoded image string is returned in the JSON response.
7.  **Rendering**: Browser renders the string as an `<img>` source.

## 4. Design Constraints & Considerations

### 4.1 Performance
*   **Constraint**: Image generation is compute-intensive.
*   **Solution**: We utilize the **Flash** variant of Gemini. While the "Pro" model might offer slightly higher fidelity, "Flash" offers the low-latency (sub-10s) experience required for a consumer "fun" app.

### 4.2 Bandwidth
*   **Constraint**: Uploading 5 high-res images consumes significant bandwidth.
*   **Design Decision**: The application currently sends raw images. A future improvement would be client-side resizing (e.g., downscaling to 1024px width) before API transmission to reduce payload size and improve speed on mobile networks.

### 4.3 Cost & Quotas
*   **Constraint**: API calls are metered.
*   **Mitigation**: The frontend limits inputs to 5 images to prevent massive token consumption per request. Error handling detects `429 Too Many Requests` and advises the user to wait.

## 5. Security Design

### 5.1 Data Privacy
*   **Ephemeral Processing**: Since there is no backend database, user photos are never "stored" by SquadMix. They exist in the browser memory and are processed transiently by Google's API. This is a strong privacy selling point.

### 5.2 API Key Protection
*   **Risk**: In a pure frontend app, the API key is technically exposed in the client bundle.
*   **Defense**: 
    1.  **HTTP Referrer Restrictions**: The API key in Google Cloud Console must be restricted to the specific domain where SquadMix is hosted (e.g., `squadmix.vercel.app`).
    2.  **Budget Caps**: Strict daily budget quotas on the Google Cloud project to prevent abuse draining funds.

## 6. Technology Stack

| Layer | Technology | Justification |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19** | Latest features (hooks, optimization), vast ecosystem, component modularity. |
| **UI Library** | **Tailwind CSS** | "Utility-first" allows for rapid iteration of the specific "Neon/Dark" aesthetic without managing complex stylesheets. |
| **AI SDK** | **@google/genai** | Official SDK ensures compatibility, handles auth headers, and provides type safety for API responses. |
| **Build Tool** | **ES Modules** | Browser-native imports (via `importmap`) allow for a build-free development environment, reducing complexity. |
