# Implementation Plan

## Phase 1: Setup and Component Structure

-   [ x] Step 1: Create Directory Structure
    -   **Task**: Create the new directory required for the PDF components.
    -   **Files**:
        -   Create directory: `/components/pdf/`
    -   **Step Dependencies**: None
    -   **User Instructions**: None

-   [ x] Step 2: Create Basic `PdfPreview` Component
    -   **Task**: Create the initial file and basic structure for the `PdfPreview` client component. Include props definition and a placeholder return value.
    -   **Files**:
        -   `components/pdf/PdfPreview.tsx`: Create file. Add `"use client";`, import React, define `PdfPreviewProps` interface (`documentId`, `onClick`, `className?`), define the functional component structure accepting props, return a simple placeholder div.
    -   **Step Dependencies**: Step 1
    -   **User Instructions**: None

-   [ x] Step 3: Create Basic `PdfPopup` Component
    -   **Task**: Create the initial file and basic structure for the `PdfPopup` client component using Shadcn `Dialog`. Include props definition and basic dialog structure.
    -   **Files**:
        -   `components/pdf/PdfPopup.tsx`: Create file. Add `"use client";`, import React, `useState`, `Dialog`, `DialogContent`, `DialogOverlay`. Define `PdfPopupProps` interface (`isOpen`, `documentId`, `onClose`). Define the functional component structure accepting props. Return a basic `<Dialog>` structure controlled by the `isOpen` prop, with an `onOpenChange` handler calling `onClose`. Include `DialogOverlay` and `DialogContent` placeholders.
    -   **Step Dependencies**: Step 1
    -   **User Instructions**: None

## Phase 2: Core Functionality Integration

-   [ x] Step 4: Implement `PdfPreview` Icon and Click Handling
    -   **Task**: Add the PDF icon, button structure, basic styling, hover/active states, and click handler logic to `PdfPreview`. Implement basic accessibility.
    -   **Files**:
        -   `components/pdf/PdfPreview.tsx`: Import `FileText` from `lucide-react` and `cn` from `@/lib/utils`. Replace placeholder div with a `<button>` element. Inside the button, render `<FileText />`. Add `onClick` handler calling the passed `onClick` prop with `documentId`. Add `className` prop usage with `cn` for merging. Apply base Tailwind classes for inline display, padding, text color, basic rounding, and transitions. Add hover (`hover:text-blue-300`, `hover:bg-white/10`) and active (`active:opacity-80`) states. Add `aria-label` and `type="button"`. Include `sr-only` text for screen readers. Ensure focus styles are applied (`focus:outline-none focus-visible:ring-2 ...`).
    -   **Step Dependencies**: Step 2
    -   **User Instructions**: None

-   [ x] Step 5: Add State and Handlers to `VanishInput`
    -   **Task**: Introduce state variables and handler functions in `VanishInput` to manage the PDF popup modal's visibility and the currently selected document ID.
    -   **Files**:
        -   `components/inputs/vanishinput.tsx`: Import `useState`. Add state variables: `const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);` and `const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);`. Create handler functions: `openPdfPopup(docId: string)` (sets `currentDocumentId` and `isPopupOpen` to true) and `closePdfPopup()` (sets `isPopupOpen` to false and `currentDocumentId` to null).
    -   **Step Dependencies**: None (modifies existing component)
    -   **User Instructions**: None

-   [ ] Step 6: Implement Message Parsing and Component Rendering in `VanishInput`
    -   **Task**: Implement the logic to parse AI messages for the `<DOCUMENTID>` tag, extract the ID, render the cleaned message text, and conditionally render the `PdfPreview` component. Also, conditionally render the `PdfPopup` component based on the state managed in the previous step.
    -   **Files**:
        -   `components/inputs/vanishinput.tsx`: Import `PdfPreview` and `PdfPopup` from `/components/pdf/`. Create a helper function `parseMessageForDocument(message: string): { text: string; documentId: string | null }` using the specified regex (`/<DOCUMENTID>(.*?)<\/DOCUMENTID>/`). Inside the `conversation.map` function, specifically for AI messages (`entry.from === 'ai'`), call `parseMessageForDocument` on `entry.message`. Render the returned `parsedMessage.text`. If `parsedMessage.documentId` exists, render `<PdfPreview documentId={parsedMessage.documentId} onClick={openPdfPopup} className="ml-2 align-middle" />` (adjust styling/positioning as needed). *Remove the old iframe rendering logic if it exists based on `entry.documentId`*. Outside the `conversation.map`, conditionally render `<PdfPopup isOpen={isPopupOpen} documentId={currentDocumentId} onClose={closePdfPopup} />`. Ensure correct `key` props are used within the map.
    -   **Step Dependencies**: Step 4, Step 5
    -   **User Instructions**: None

-   [ ] Step 7: Implement `PdfPopup` Core UI (Iframe, Buttons, Header)
    -   **Task**: Add the iframe for PDF display, the "Download" button (as a link), the "Close" button, and the modal header to `PdfPopup`.
    -   **Files**:
        -   `components/pdf/PdfPopup.tsx`: Import `DialogHeader`, `DialogTitle`, `DialogClose`, `DialogFooter`, `Button` from `@/components/ui/*`, and `X`, `Download` icons from `lucide-react`. Add `DialogHeader` containing `DialogTitle` ("Document Viewer") and a `DialogClose` button (using `Button` variant="ghost" size="icon" with an `X` icon). Add the `iframe` element within the main content area. Set its `src` dynamically using the `documentId` prop: `const pdfUrl = documentId ? \`/api/pandadoc?documentId=\${documentId}\` : '';`, then use `pdfUrl` in the `src`. Set `title` attribute for accessibility. Add `DialogFooter` containing the "Download" button. Use `<Button asChild ...>` with an `<a>` tag inside. Set the `href` to `pdfUrl` and add the `download` attribute (e.g., `download={\`document-\${documentId}.pdf\`}`). Add the `Download` icon inside the button text. Ensure the iframe and footer are laid out vertically (e.g., using flex column on `DialogContent`).
    -   **Step Dependencies**: Step 3, Step 6
    -   **User Instructions**: None

## Phase 3: Interactivity and Refinements

-   [ ] Step 8: Implement Loading and Error Handling in `PdfPopup`
    -   **Task**: Add state and logic to `PdfPopup` to handle the loading state of the iframe and potential errors when fetching/displaying the PDF. Display appropriate UI feedback.
    -   **Files**:
        -   `components/pdf/PdfPopup.tsx`: Import `useState`, `useEffect`, `useCallback`, `Skeleton` from `@/components/ui/skeleton` (optional), and `AlertTriangle` from `lucide-react`. Add state variables: `const [isLoading, setIsLoading] = useState(true);` and `const [loadError, setLoadError] = useState<string | null>(null);`. Add `useEffect` hook to reset `isLoading` and `loadError` when `isOpen` or `documentId` changes. Create `handleIframeLoad = useCallback(...)` to set `isLoading` false and `loadError` null. Create `handleIframeError = useCallback(...)` to set `isLoading` false and set an error message to `loadError`. Attach these handlers to the `iframe`'s `onLoad` and `onError` attributes. Conditionally render a loading indicator (e.g., `<Skeleton className="absolute inset-0 h-full w-full" />` or a spinner) inside the main content area when `isLoading` is true. Conditionally render an error message UI (using `AlertTriangle`, text) when `loadError` is not null and `isLoading` is false. Use `cn` on the `iframe` to add `invisible` class when `isLoading` or `loadError` is true, and `visible` otherwise. Disable the Download button if `!pdfUrl`, `isLoading`, or `loadError` is true.
    -   **Step Dependencies**: Step 7
    -   **User Instructions**: If using a spinner instead of Skeleton, you might need to install a library like `react-spinners` (`pnpm install react-spinners`).

-   [ ] Step 9: Apply Styling and Responsiveness
    -   **Task**: Apply final Tailwind CSS styles to `PdfPreview` and `PdfPopup` to match the visual requirements, including the backdrop blur, responsive layout adjustments, and adherence to the existing design system.
    -   **Files**:
        -   `components/pdf/PdfPreview.tsx`: Refine Tailwind classes for size (`h-5 w-5`), alignment (`align-middle`), spacing (`ml-2`), hover/active effects to ensure they match the site's aesthetic.
        -   `components/pdf/PdfPopup.tsx`: Apply `backdrop-blur-md` to `DialogOverlay` via `className`. Style `DialogContent` with `max-w-3xl`, appropriate padding (`p-6`), border, background (`bg-background`). Use flexbox (`flex flex-col`) to structure header, content (iframe container), and footer. Give the iframe container `flex-grow` and `overflow-hidden`. Set a responsive height on `DialogContent` (e.g., `h-[90vh] md:h-[85vh]`). Ensure the iframe itself fills its container (`w-full h-full`). Style the error state container (padding, alignment). Adjust footer justification (`sm:justify-end`). Ensure consistency with `--color-*` variables where applicable. Test responsiveness on different screen sizes.
    -   **Step Dependencies**: Step 4, Step 8
    -   **User Instructions**: None

-   [ ] Step 10: Enhance Accessibility
    -   **Task**: Review `PdfPreview` and `PdfPopup` for accessibility best practices, ensuring proper ARIA attributes, keyboard navigability, and focus management.
    -   **Files**:
        -   `components/pdf/PdfPreview.tsx`: Verify `aria-label` is descriptive (e.g., `aria-label={\`View PDF document\${documentId ? \` \${documentId}\` : ''}\`}`). Confirm focus state (`focus-visible:ring...`) is working correctly.
        -   `components/pdf/PdfPopup.tsx`: Ensure the iframe `title` attribute is descriptive (e.g., `title={\`PDF Document Viewer\${documentId ? \` - \${documentId}\` : ''}\`}`). Confirm Shadcn `Dialog` handles focus trapping and ARIA roles (`dialog`, `modal`) correctly. Verify Close and Download buttons are keyboard accessible and have clear focus states.
    -   **Step Dependencies**: Step 9
    -   **User Instructions**: None

-   [ ] Step 11: Final Testing and Review
    -   **Task**: Manually test the complete user flow to ensure seamless integration and functionality according to the project request and technical specification.
    -   **Files**: N/A (Testing Step)
    -   **Step Dependencies**: Step 10
    -   **User Instructions**:
        1.  Interact with the Nova chat assistant.
        2.  Trigger a Voiceflow response that includes a `<DOCUMENTID>...</DOCUMENTID>` tag.
        3.  Verify the message appears correctly without the tags.
        4.  Verify the `PdfPreview` icon appears next to the message.
        5.  Hover over and click the `PdfPreview` icon.
        6.  Verify the `PdfPopup` modal opens smoothly with a blurred background.
        7.  Verify the loading indicator appears briefly (if the PDF loads quickly) or stays longer for larger files.
        8.  Verify the PDF document renders correctly within the iframe.
        9.  Test the "Download" button – it should initiate a download of the PDF.
        10. Test the "Close" button (X icon) – it should close the modal smoothly.
        11. Test clicking outside the modal (if not prevented) – it should close the modal.
        12. Test responsiveness by resizing the browser window or using developer tools to simulate different devices (desktop, tablet, mobile). Check modal layout and PDF readability.
        13. (Optional) Simulate an error by temporarily modifying the `/api/pandadoc` route or providing an invalid `documentId` to check the error state UI in the popup.

# Summary

This plan breaks down the PandaDoc PDF viewer integration into distinct phases: setup, core component creation, integration into the existing chat, adding interactivity (loading/error states), and finally, styling and accessibility refinements. It follows a logical progression, starting with the new UI elements and then connecting them to the existing `VanishInput` component. Each step is designed to be atomic and targets a small number of files, making it suitable for sequential execution by a code generation AI. The backend API route `/api/pandadoc` is assumed to be functional as verified in the request. The final step emphasizes manual testing to ensure the feature meets all requirements.