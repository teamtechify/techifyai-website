# PandaDoc PDF Viewer Integration in Voiceflow Chat Technical Specification

## 1. System Overview

*   **Core Purpose:** To enhance the user experience of viewing PandaDoc documents shared via the Nova AI chat (powered by Voiceflow) by replacing direct iframe embedding with a clickable preview icon that opens the PDF in a modal popup.
*   **Key Workflows:**
    1.  AI assistant (via `/api/voiceflow`) sends a message containing a PandaDoc document ID formatted as `<DOCUMENTID>...</DOCUMENTID>`.
    2.  The chat interface (`VanishInput.tsx`) detects this format in the message.
    3.  A `PdfPreview` component (clickable PDF icon) is rendered inline with the AI message.
    4.  User clicks the `PdfPreview` icon.
    5.  A `PdfPopup` modal opens with a blurred background overlay.
    6.  The modal embeds the corresponding PDF using an `iframe` pointing to `/api/pandadoc?documentId={id}`.
    7.  The modal displays loading and error states for the PDF content.
    8.  The modal provides "Download" and "Close" actions.
*   **System Architecture:** Frontend integration within the existing Next.js application. Utilizes client components (`VanishInput`, `PdfPreview`, `PdfPopup`) for UI and interactivity, and a serverless API route (`/api/pandadoc`) to securely fetch PDF data from the external PandaDoc API.

## 2. Project Structure

```
/components
  /inputs
    └── vanishinput.tsx  # MODIFIED: Add parsing, state, rendering logic
  /pdf                 # NEW DIRECTORY
    ├── PdfPreview.tsx   # NEW: Client component for the clickable icon
    └── PdfPopup.tsx     # NEW: Client component for the modal display
  /ui
    ├── dialog.tsx       # USED: Shadcn dialog component for PdfPopup
    ├── button.tsx       # USED: Shadcn button component for actions
    └── skeleton.tsx     # USED (Optional): For loading state in PdfPopup
  # ... other existing components
/app
  /api
    /pandadoc
      └── route.ts       # EXISTING: Server route to fetch PDF (Verified)
    /voiceflow
      └── route.ts       # EXISTING: Server route for chat interaction
  /(home)
    └── chat.tsx         # Contains VanishInput
  # ... other existing routes and files
/hooks
  └── use-mobile.ts      # Potentially used for responsive adjustments
/lib
  └── utils.ts         # Contains cn utility
/public
  # ... existing assets
```

## 3. Feature Specification

### 3.1 Chat Interface Enhancement (`components/inputs/vanishinput.tsx`)

*   **User Story:** As a user interacting with Nova, when an AI message contains a document reference like `<DOCUMENTID>xyz</DOCUMENTID>`, I want to see the message text clearly along with a distinct PDF icon next to it, indicating an attached document I can view.
*   **Requirements:**
    *   Detect `<DOCUMENTID>...</DOCUMENTID>` pattern in `text` or `speak` trace payloads from Voiceflow responses.
    *   Extract the `documentId` from the detected pattern.
    *   Render the message text *without* the `<DOCUMENTID>` tags.
    *   Render the `PdfPreview` component adjacent to the message bubble containing the document ID.
    *   Manage the open/closed state of the `PdfPopup` modal.
    *   Pass the correct `documentId` to the modal when opened.
    *   Ensure functionality is tied to the user's session via `useSessionUserId`.
*   **Detailed Implementation Steps:**
    1.  **State Management:**
        *   Add state variables using `useState`:
            ```typescript
            const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
            const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
            ```
    2.  **Helper Function (Parsing):**
        *   Create a function `parseMessageForDocument(message: string): { text: string; documentId: string | null }` that uses a regular expression to find and extract the document ID and return the cleaned text and the ID.
            ```typescript
            const docIdRegex = /<DOCUMENTID>(.*?)<\/DOCUMENTID>/;
            const match = message.match(docIdRegex);
            if (match && match[1]) {
              return {
                text: message.replace(docIdRegex, '').trim(),
                documentId: match[1],
              };
            }
            return { text: message, documentId: null };
            ```
    3.  **Modal Handlers:**
        *   Define functions to control modal state:
            ```typescript
            const openPdfPopup = (docId: string) => {
              setCurrentDocumentId(docId);
              setIsPopupOpen(true);
            };

            const closePdfPopup = () => {
              setIsPopupOpen(false);
              setCurrentDocumentId(null);
            };
            ```
    4.  **Rendering Logic:**
        *   Inside the `conversation.map` function:
            *   For each AI message (`entry.from === 'ai'` and `entry.message`), call `parseMessageForDocument(entry.message)`.
            *   Render the returned `text`.
            *   If `documentId` is not null, render the `PdfPreview` component:
                ```tsx
                {parsedMessage.documentId && (
                  <PdfPreview
                    documentId={parsedMessage.documentId}
                    onClick={openPdfPopup}
                  />
                )}
                ```
            *   Ensure unique `key` props are used for mapped elements.
    5.  **Modal Rendering:**
        *   Outside the message mapping, conditionally render the `PdfPopup`:
            ```tsx
            <PdfPopup
              isOpen={isPopupOpen}
              documentId={currentDocumentId}
              onClose={closePdfPopup}
            />
            ```
    6.  **Session Context:** The `userId` from `useSessionUserId` is already available and used for API calls. No further changes needed for session association unless specific cross-session persistence is required (which is not specified).
*   **Error Handling and Edge Cases:**
    *   If the regex fails to match, the original message text is displayed without a preview icon.
    *   Ensure efficient rendering to avoid performance degradation with many messages/previews (standard React list rendering practices).

### 3.2 PDF Preview Component (`components/pdf/PdfPreview.tsx`)

*   **User Story:** As a user, when I see the PDF icon in the chat, I want it to be clearly clickable and provide visual feedback on hover, so I know I can interact with it to view the document.
*   **Requirements:**
    *   Create a new client component `PdfPreview.tsx`.
    *   Display a recognizable PDF icon.
    *   Implement hover and active states.
    *   Trigger the modal opening via a passed `onClick` prop when clicked.
    *   Be accessible via keyboard.
*   **Detailed Implementation Steps:**
    1.  **File Creation:** Create `/components/pdf/PdfPreview.tsx`.
    2.  **Component Definition:**
        ```typescript
        "use client";

        import React from 'react';
        import { FileText } from 'lucide-react';
        import { cn } from '@/lib/utils'; // Assuming cn utility exists

        interface PdfPreviewProps {
          documentId: string;
          onClick: (documentId: string) => void;
          className?: string;
        }

        export const PdfPreview: React.FC<PdfPreviewProps> = ({ documentId, onClick, className }) => {
          const handleClick = () => {
            onClick(documentId);
          };

          return (
            <button
              type="button"
              onClick={handleClick}
              aria-label={`View PDF document ${documentId}`} // Consider a more user-friendly label if possible
              className={cn(
                'inline-flex items-center justify-center p-1 rounded text-white hover:text-blue-300 hover:bg-white/10 active:opacity-80 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background ml-2 align-middle', // Base styles + hover/active/focus
                className
              )}
            >
              <FileText className="h-5 w-5" /> {/* Adjust size as needed */}
              <span className="sr-only">View PDF</span> {/* Screen reader text */}
            </button>
          );
        };
        ```
    3.  **Styling:** Use Tailwind classes for size, color, spacing, hover/active effects (e.g., `hover:scale-105`, `hover:text-blue-300`, `active:opacity-75`). Ensure it aligns vertically with the message text.
    4.  **Accessibility:** Use a `<button>` element. Provide `aria-label`. Ensure focus states are visible.

### 3.3 PDF Popup Modal (`components/pdf/PdfPopup.tsx`)

*   **User Story:** As a user, after clicking the PDF icon, I want a modal window to appear smoothly over a blurred background, displaying the PDF document clearly. I need obvious options to download the PDF or close the modal.
*   **Requirements:**
    *   Create a new client component `PdfPopup.tsx`.
    *   Use Shadcn `Dialog` for modal structure, animations, and accessibility.
    *   Apply `backdrop-blur-md` to the overlay.
    *   Embed the PDF using an `iframe` with `src="/api/pandadoc?documentId={id}"`.
    *   Include "Download" and "Close" buttons.
    *   Implement loading and error states for the iframe content.
    *   Ensure responsiveness across devices.
*   **Detailed Implementation Steps:**
    1.  **File Creation:** Create `/components/pdf/PdfPopup.tsx`.
    2.  **Component Definition:**
        ```typescript
        "use client";

        import React, { useState, useEffect, useCallback } from 'react';
        import { Dialog, DialogContent, DialogOverlay, DialogClose, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
        import { Button } from '@/components/ui/button';
        import { Skeleton } from '@/components/ui/skeleton'; // Optional for loading
        import { X, Download, AlertTriangle } from 'lucide-react';
        import { cn } from '@/lib/utils';

        interface PdfPopupProps {
          isOpen: boolean;
          documentId: string | null;
          onClose: () => void;
        }

        export const PdfPopup: React.FC<PdfPopupProps> = ({ isOpen, documentId, onClose }) => {
          const [isLoading, setIsLoading] = useState(true);
          const [loadError, setLoadError] = useState<string | null>(null);

          // Reset state when documentId changes or modal opens/closes
          useEffect(() => {
            if (isOpen && documentId) {
              setIsLoading(true);
              setLoadError(null);
            } else {
              // Reset when closing or if ID is null
              setIsLoading(false);
              setLoadError(null);
            }
          }, [isOpen, documentId]);

          const handleIframeLoad = useCallback(() => {
            setIsLoading(false);
            setLoadError(null);
          }, []);

          const handleIframeError = useCallback(() => {
            setIsLoading(false);
            setLoadError("Document could not be loaded at this time. Please try again later or contact support.");
          }, []);

          const pdfUrl = documentId ? `/api/pandadoc?documentId=${documentId}` : '';

          return (
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
              <DialogOverlay className="bg-black/60 backdrop-blur-md fixed inset-0 z-50" />
              <DialogContent
                className={cn(
                  "fixed left-1/2 top-1/2 z-50 grid w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
                  "h-[90vh] md:h-[85vh] flex flex-col" // Responsive height
                )}
                onInteractOutside={(e) => e.preventDefault()} // Prevent closing on overlay click if desired, default allows it
              >
                <DialogHeader className="flex flex-row justify-between items-center space-y-0">
                  <DialogTitle className="text-lg font-semibold text-foreground">Document Viewer</DialogTitle>
                  <DialogClose asChild>
                    <Button variant="ghost" size="icon" aria-label="Close">
                      <X className="h-4 w-4" />
                    </Button>
                  </DialogClose>
                </DialogHeader>

                <div className="flex-grow overflow-hidden relative border border-border rounded-md">
                  {isLoading && (
                     <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        {/* Option 1: Simple Spinner (requires installing a spinner library or CSS) */}
                        {/* <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div> */}
                        {/* Option 2: Skeleton */}
                         <Skeleton className="h-full w-full" />
                     </div>
                  )}
                  {loadError && !isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-muted">
                       <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
                       <p className="text-destructive-foreground font-medium">Loading Failed</p>
                       <p className="text-sm text-muted-foreground mt-1">{loadError}</p>
                    </div>
                  )}
                  {pdfUrl && ( // Only render iframe if URL is valid
                    <iframe
                      src={pdfUrl}
                      title={`PDF Document Viewer - ${documentId}`}
                      className={cn(
                        "w-full h-full border-0",
                        (isLoading || loadError) ? 'invisible' : 'visible' // Hide iframe until loaded or if error
                      )}
                      onLoad={handleIframeLoad}
                      onError={handleIframeError}
                      allow="fullscreen"
                    />
                  )}
                </div>

                <DialogFooter className="sm:justify-end mt-4">
                   <Button asChild variant="default" disabled={!pdfUrl || isLoading || !!loadError}>
                     <a href={pdfUrl} download={`document-${documentId}.pdf`}>
                       <Download className="mr-2 h-4 w-4" /> Download
                     </a>
                   </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          );
        };
        ```
    3.  **Styling:** Use Tailwind for layout (flex column), iframe sizing (`w-full`, responsive height like `h-[70vh]`), button positioning. Ensure `DialogContent` has appropriate `max-width` and padding.
    4.  **Responsiveness:** Test modal layout on desktop, tablet, and mobile viewports. Adjust iframe height and content padding as needed.
    5.  **Accessibility:** Shadcn `Dialog` handles focus trapping and ARIA roles. Add a meaningful `title` to the `iframe`.

### 3.4 Backend API (`/api/pandadoc/route.ts`)

*   **User Story:** As a system component (`PdfPopup` iframe), I need to securely request a specific PandaDoc PDF using its ID, so I can display it to the user without exposing API keys on the client-side.
*   **Requirements:**
    *   Verify the existing route correctly fetches the PDF from PandaDoc using the `PANDADOC_API_KEY`.
    *   Confirm it returns the PDF with `Content-Type: application/pdf` and `Content-Disposition: inline`.
*   **Verification:** (As per project request, this is already verified)
    *   The route uses `fetch` to call the PandaDoc download endpoint.
    *   It includes the `Authorization: API-Key ...` header.
    *   It sets `Content-Type: application/pdf` and `Content-Disposition: inline` on the `NextResponse`.
*   **Error Handling:** The existing code includes basic error handling for the fetch request and returns JSON errors. This is sufficient.

## 4. Server Actions

*   **`/api/pandadoc/route.ts`:**
    *   **Description:** Acts as a server-side proxy to fetch PDF documents from the PandaDoc API using a secure API key.
    *   **Integration:** PandaDoc API (`https://api.pandadoc.com/public/v1/documents/{documentId}/download`).
    *   **Authentication:** Uses `Authorization: API-Key ${process.env.PANDADOC_API_KEY}` header.
    *   **Input:** `documentId` (string) via URL query parameter.
    *   **Output:** PDF file stream (`application/pdf`) with `Content-Disposition: inline`, or a JSON error object.
    *   **Data Format:** Input: Query Param. Output: `application/pdf` or `application/json`.
*   **`/api/voiceflow/route.ts`:**
    *   **Description:** Interacts with the Voiceflow Runtime API to manage chat sessions and retrieve AI responses.
    *   **Relevance:** Source of the messages containing `<DOCUMENTID>` tags. No modifications needed.

## 5. Design System

### 5.1 Visual Style

*   **Color Palette:** Adhere to variables defined in `app/globals.css` (e.g., `--background`, `--foreground`, `--primary`, `--destructive`, `--muted`, `--border`). Use existing Techify AI brand colors where appropriate, primarily through Tailwind/Shadcn theme.
*   **Typography:** Use existing font variables (`--font-geist-mono`, `--font-inter`, etc.) as applied in the chat interface.
*   **Component Styling:** Utilize Tailwind utility classes. Use `cn()` for conditional classes. Match the aesthetic of existing Shadcn components used on the site.
*   **Spacing and Layout:** Follow existing spacing patterns (e.g., padding, margins) used in the chat interface and site components.
*   **Effects:** Apply `backdrop-blur-md` Tailwind class to the `DialogOverlay`.

### 5.2 Core Components

*   **Layout:** The `PdfPreview` is rendered inline within the chat message flow. The `PdfPopup` uses the Shadcn `Dialog` component, which provides modal structure, overlay, and content areas.
*   **Navigation:** Not applicable within the modal itself, beyond Close/Download actions.
*   **Shared Components:**
    *   `Dialog` (`@/components/ui/dialog`): Used for `PdfPopup`. Props: `open`, `onOpenChange`.
    *   `Button` (`@/components/ui/button`): Used for Download and Close buttons in `PdfPopup`. Props: `variant`, `size`, `asChild`, `disabled`.
    *   `Skeleton` (`@/components/ui/skeleton`): Optional for loading state within `PdfPopup`.
    *   `lucide-react` Icons: `FileText` (Preview), `Download` (Popup), `X` (Popup Close), `AlertTriangle` (Popup Error).
*   **Interactive States:**
    *   `PdfPreview`: Hover (`opacity`, `bg-color` change), Active (`scale`, `opacity` change), Focus (outline ring).
    *   `PdfPopup` Buttons: Standard Shadcn button states (hover, active, focus, disabled).
    *   `iframe`: Standard browser interaction for PDF viewing.

## 6. Component Architecture

### 6.1 Server Components

*   Not directly involved in implementing the new UI features. The page structure (`app/(home)/page.tsx`, `app/(home)/chat.tsx`) may involve Server Components, but the interactive elements are Client Components.

### 6.2 Client Components

*   **`VanishInput.tsx` (`"use client"`):**
    *   **State:** `useState` for `isPopupOpen`, `currentDocumentId`.
    *   **Event Handlers:** `handleChange`, `sendMessage`, `handleKeyDown`, `openPdfPopup`, `closePdfPopup`. Includes message parsing logic.
    *   **UI Interactions:** Input focus/blur, message sending, triggering modal.
    *   **Props:** Existing props (`placeholder`, `inputValue`, `required`, `type`, `active`, `setActive`, `services`, `setServices`).
*   **`PdfPreview.tsx` (`"use client"`):**
    *   **State:** None (visual states handled by CSS/Tailwind).
    *   **Event Handlers:** `onClick` handler calling the passed prop.
    *   **UI Interactions:** Click to trigger action.
    *   **Props Interface:**
        ```typescript
        interface PdfPreviewProps {
          documentId: string;
          onClick: (documentId: string) => void;
          className?: string;
        }
        ```
*   **`PdfPopup.tsx` (`"use client"`):**
    *   **State:** `useState` for `isLoading`, `loadError`.
    *   **Event Handlers:** `handleIframeLoad`, `handleIframeError` (internal), uses `onClose` prop.
    *   **UI Interactions:** Modal display, iframe loading/error display, Download button action, Close button action.
    *   **Props Interface:**
        ```typescript
        interface PdfPopupProps {
          isOpen: boolean;
          documentId: string | null;
          onClose: () => void;
        }
        ```

## 7. Authentication & Authorization

*   No specific authentication or authorization logic is implemented for *viewing* the PDF via this feature.
*   The `userId` obtained via `useSessionUserId` in `VanishInput` is used solely for maintaining the Voiceflow chat session context.
*   Access control relies on the assumption that the `documentId` provided by Voiceflow is intended for the current user. The `/api/pandadoc` route does not perform additional user-specific validation based on the request origin.

## 8. Data Flow

1.  **Input:** Voiceflow API response (via `/api/voiceflow`) containing message objects arrives at `VanishInput`.
2.  **Parsing:** `VanishInput` parses message strings for `<DOCUMENTID>`.
3.  **State (Control):** `VanishInput` holds `isPopupOpen` and `currentDocumentId` state.
4.  **Props (Trigger):** `documentId` and `openPdfPopup` function are passed to `PdfPreview`.
5.  **Props (Modal):** `isOpen`, `currentDocumentId`, and `closePdfPopup` function are passed to `PdfPopup`.
6.  **API Call (Data):** `PdfPopup` uses `currentDocumentId` to construct the `iframe`'s `src` attribute (`/api/pandadoc?documentId=...`).
7.  **Proxy:** The `iframe` request hits `/api/pandadoc`.
8.  **External API:** `/api/pandadoc` calls the PandaDoc API with the secure key.
9.  **Response:** PandaDoc API returns PDF data to `/api/pandadoc`.
10. **Streaming:** `/api/pandadoc` streams the PDF data back to the `iframe`.
11. **State (Display):** `PdfPopup` manages internal `isLoading` and `loadError` state based on iframe events.
12. **Output:** PDF is displayed in the `iframe` within the modal.

## 9. Testing

*   **Unit Tests (Jest / React Testing Library):**
    *   `VanishInput`: Test `parseMessageForDocument` function with various inputs (match, no match, edge cases). Test state updates via `openPdfPopup` and `closePdfPopup`.
    *   `PdfPreview`: Test component renders an icon/button. Mock `onClick` prop and verify it's called with the correct `documentId` on button click.
    *   `PdfPopup`: Test initial state (loading). Simulate iframe `onLoad` and verify loading state changes and iframe becomes visible. Simulate iframe `onError` and verify error state changes and error message appears. Verify `onClose` prop is called when `Dialog` triggers close. Verify download link `href` and `download` attribute are correct.
*   **E2E Tests (Playwright / Cypress):**
    *   **Scenario:** AI sends a message with a document ID.
        *   **Verify:** `PdfPreview` icon appears next to the cleaned message text.
        *   **Action:** Click the `PdfPreview` icon.
        *   **Verify:** `PdfPopup` modal opens, overlay has blur effect.
        *   **Verify:** Loading indicator is visible initially within the modal content area.
        *   **Verify:** `iframe` element exists with the correct `src` attribute pointing to `/api/pandadoc`.
        *   **Verify:** "Download" button exists, has correct `href` and `download` attributes.
        *   **Verify:** "Close" button exists.
        *   **Action:** Click the "Close" button.
        *   **Verify:** Modal closes.
    *   **Scenario:** Test responsiveness by resizing viewport and repeating the open/close flow.
    *   **(Optional/Difficult):** Mock the `/api/pandadoc` response to simulate success/error states for the iframe load within E2E, if feasible.