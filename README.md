# Techify AI Website

## Overview

This is the official website for Techify AI. The application showcases various AI-powered business solutions, allows users to interact with an AI assistant named Nova, and enables booking discovery calls through an integrated Cal.com system. It's built using Next.js with the App Router.

## Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) (v15+ with App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Package Manager:** [PNPM](https://pnpm.io/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4)
-   **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
-   **Animation:**
    -   [Framer Motion](https://www.framer.com/motion/) (for UI transitions, counters)
    -   [@react-spring/web](https://www.react-spring.dev/) (for 3D canvas animation)
-   **3D Rendering:** [Three.js](https://threejs.org/) / [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) (for `CoinCanvas` component)
-   **Video Playback:** [@cloudflare/stream-react](https://developers.cloudflare.com/stream/viewing-videos/using-the-react-player/)
-   **Charting:** [Recharts](https://recharts.org/)
-   **Form Handling:** [React Hook Form](https://react-hook-form.com/)
-   **Icons:** [React Icons](https://react-icons.github.io/react-icons/), [Lucide React](https://lucide.dev/)
-   **HTTP Client:** [Axios](https://axios-http.com/)
-   **Fonts:** [next/font](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) (Geist Mono, Inter, Pixel Mono, JetBrains Mono)

## Getting Started

### Prerequisites

-   Node.js (Check Next.js 15 requirements, likely v18.18+)
-   PNPM (`npm install -g pnpm`)

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repository-url>
    cd techifyai-website
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Set up environment variables:
    -   Create a `.env.local` file in the root directory.
    -   Copy the variable names from `.env.example` (if it exists) or request the necessary variables.
    -   You will need API keys/IDs for:
        -   Cal.com (Booking/Availability)
        -   Voiceflow (Nova Chat API)
        -   PandaDoc (Document Viewing)
        -   Cloudflare Stream (if videos are private)

### Running the Development Server

```bash
pnpm run dev
```

The application uses Turbopack for faster development builds. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure Highlights

-   `/app`: Contains the core application logic using the Next.js App Router.
    -   `/(home)`: **Main active directory for the homepage.** Contains components like `hero.tsx`, `stats.tsx`, `graph.tsx`, `nova.tsx`, `banner.tsx`, `chat.tsx`. **Focus development here.**
    -   `/(home-old)`: **Deprecated.** Avoid using components or logic from this directory.
    -   `/api`: Houses backend API routes handling interactions with external services (Cal.com, Voiceflow, PandaDoc).
    -   `/details`, `/tokenomics`: Routes related to previous crypto features (likely low priority for core AI services).
    -   `layout.tsx`: Root layout, includes font setup and main navigation (`NavComponent`).
    -   `page.tsx`: Root page, renders the primary homepage content from `app/(home)`.
    -   `globals.css`: Base styles, Tailwind configuration, Shadcn UI variables.
-   `/components`: Contains reusable React components.
    -   `/ui`: Base Shadcn UI components (Do not modify).
    -   Other subdirectories (`/buttons`, `/form`, `/inputs`, `/nav`, `/video`, etc.) contain custom components built for this application.
-   `/hooks`: Custom React hooks (e.g., `use-mobile.ts`).
-   `/lib`: Utility functions (e.g., `cn` utility).
-   `/public`: Static assets like images, fonts.

## Key Features

-   **Interactive Service Banner:** (`app/(home)/banner.tsx`) Carousel showcasing AI services.
-   **Nova AI Chat:** (`app/(home)/chat.tsx`, `components/inputs/vanishinput.tsx`, `/api/voiceflow`) Allows users to chat with an AI assistant powered by Voiceflow.
-   **Call Booking:** (`components/form/book.tsx`, `/api/cal`, `/api/book`) Integrates with Cal.com for users to book discovery calls.
-   **Video Integration:** (`components/video`) Uses Cloudflare Stream for displaying background and featured videos.
-   **Animated Statistics:** (`app/(home)/stats.tsx`, `components/countingCard`) Displays key business metrics with animated counters.
-   **3D Animation:** (`components/hero/coin.tsx`) Renders an animated 3D ring using Three.js / R3F.

## Environment Variables

A `.env.local` file is required for development. Obtain the necessary API keys and IDs for the following services:

-   `CAL_API_KEY`: For Cal.com API access.
-   `CAL_KEY`: Another key likely for Cal.com (verify specific usage).
-   `CAL_EVENT_TYPE_ID`: The specific Cal.com event type for booking.
-   `API_KEY`: Voiceflow API Key for Nova chat.
-   `PANDADOC_API_KEY`: For accessing PandaDoc documents (if used by Nova).

Ensure server-side keys are **not** prefixed with `NEXT_PUBLIC_`.

## Available Scripts

-   `pnpm run dev`: Starts the development server with Turbopack.
-   `pnpm run build`: Creates a production build.
-   `pnpm run start`: Starts the production server.
-   `pnpm run lint`: Runs ESLint to check for code issues.

## Deployment

This is a standard Next.js application. Deploy using platforms like Vercel, Netlify, or any Node.js compatible hosting service. Ensure environment variables are configured correctly in the deployment environment.