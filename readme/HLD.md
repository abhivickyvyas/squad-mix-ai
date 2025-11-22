# High Level Design (HLD) - SquadMix

## 1. Introduction
SquadMix is a client-side web application designed to leverage generative AI for image composition. It solves the problem of creating group photos when people aren't physically together, or when a specific artistic style is desired for social media.

## 2. System Architecture
The system follows a **Client-Server** architecture, but strictly as a "Thick Client" interacting directly with a 3rd Party API (Google Gemini). There is no intermediate application backend server.

### High-Level Components
1.  **Client (Browser)**:
    *   Hosts the React Application.
    *   Handles UI/UX interactions.
    *   Performs client-side image processing (File to Base64 conversion).
2.  **AI Service Provider (Google Cloud)**:
    *   Exposes the Gemini API.
    *   Processes multimodal inputs (Text + Images).
    *   Returns generated image data.

## 3. Key Functional Requirements
*   **Input**: Users must be able to upload multiple image files (JPEG/PNG).
*   **Configuration**: Users must be able to select style parameters (Vibe) and output format (Aspect Ratio).
*   **Processing**: The system must combine these inputs into a single prompt for the AI model.
*   **Output**: The system must display the generated image and allow downloading.

## 4. Non-Functional Requirements
*   **Latency**: Image generation should take seconds, not minutes (addressed by using Gemini 2.5 Flash).
*   **Responsiveness**: UI must work on Mobile and Desktop.
*   **Aesthetics**: The visual design must appeal to a younger demographic (Gen Z), utilizing dark mode, neon accents, and emojis.

## 5. Data Flow
1.  User selects files -> Browser memory.
2.  User selects options -> Application State.
3.  "Generate" Trigger -> Files converted to Base64 strings.
4.  Base64 Strings + Text Prompt -> Sent via HTTPS to Gemini API.
5.  Gemini API -> Returns Base64 Image Data.
6.  Browser -> Renders Image from Data URI.
