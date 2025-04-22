# Implementation Plan

## Phase 1: Setup and Component Structure

-   [ x] Step 1: Create Directory Structure
    -   **Task**: Create the new directory required for the PDF components.
    -   **Files**: Create directory: `/components/pdf/`
    -   **Step Dependencies**: None
    -   **User Instructions**: None

-   [ x] Step 2: Create Basic `PdfPreview` Component
    -   **Task**: Create the initial file and basic structure for the `PdfPreview` client component. Include props definition and a placeholder return value.
    -   **Files**: `components/pdf/PdfPreview.tsx`
    -   **Step Dependencies**: Step 1
    -   **User Instructions**: None

-   [ x] Step 3: Create Basic `PdfPopup` Component
    -   **Task**: Create the initial file and basic structure for the `PdfPopup` client component using Shadcn `Dialog`. Include props definition and basic dialog structure.
    -   **Files**: `components/pdf/PdfPopup.tsx`
    -   **Step Dependencies**: Step 1
    -   **User Instructions**: None

## Phase 2: Core Functionality Integration

-   [ x] Step 4: Implement `PdfPreview` Icon and Click Handling
    -   **Task**: Add the PDF icon, button structure, basic styling, hover/active states, and click handler logic to `PdfPreview`. Implement basic accessibility.
    -   **Files**: `components/pdf/PdfPreview.tsx`
    -   **Step Dependencies**: Step 2
    -   **User Instructions**: None

-   [ x] Step 5: Add State and Handlers to `VanishInput`
    -   **Task**: Introduce state variables and handler functions in `VanishInput` to manage the PDF popup modal's visibility and the currently selected document ID.
    -   **Files**: `components/inputs/vanishinput.tsx`
    -   **Step Dependencies**: None
    -   **User Instructions**: None

-   [ x] Step 6: Implement Message Parsing and Component Rendering in `VanishInput`
    -   **Task**: Implement the logic to parse AI messages for the `<DOCUMENTID>` tag, extract the ID, render the cleaned message text, and conditionally render the `PdfPreview` component. Also, conditionally render the `PdfPopup` component based on the state managed in the previous step. Includes temporary testing code for document ID.
    -   **Files**: `components/inputs/vanishinput.tsx`
    -   **Step Dependencies**: Step 4, Step 5
    -   **User Instructions**: None

-   [ x] Step 7: Implement `PdfPopup` Core UI (Iframe, Buttons, Header) - *Original version completed*
    -   **Task**: Add the iframe for PDF display, the "Download" button (as a link), the "Close" button, and the modal header to `PdfPopup`.
    -   **Files**: `components/pdf/PdfPopup.tsx`
    -   **Step Dependencies**: Step 3, Step 6
    -   **User Instructions**: None

## Phase 3: Interactivity and Refinements

-   [ x] Step 8: Implement Loading and Error Handling in `PdfPopup`
    -   **Task**: Add state and logic to `PdfPopup` to handle the loading state of the iframe and potential errors when fetching/displaying the PDF. Display appropriate UI feedback.
    -   **Files**: `components/pdf/PdfPopup.tsx`
    -   **Step Dependencies**: Step 7
    -   **User Instructions**: None

-   [ x] Step 9: Apply Styling and Responsiveness
    -   **Task**: Apply final Tailwind CSS styles to `PdfPreview` and `PdfPopup` to match the visual requirements, including the backdrop blur, responsive layout adjustments, and adherence to the existing design system. **Ensure the revised footer layout (with Download and Close buttons from Step 8.1) is styled appropriately.**
    -   **Files**:
        -   `components/pdf/PdfPreview.tsx`: Refine Tailwind classes for size, alignment, spacing, hover/active effects.
        -   `components/pdf/PdfPopup.tsx`: Apply `backdrop-blur-md` to `DialogOverlay`. Style `DialogContent` (max-width, padding, border, background, flex column, responsive height). Style the iframe container (`flex-grow`, `overflow-hidden`, `relative`, border). Ensure iframe fills container. Style error/loading states. **Style the `DialogFooter` to accommodate both Download and Close buttons (e.g., using `justify-between` or `gap-2`).** Test responsiveness.
    -   **Step Dependencies**: Step 8.1
    -   **User Instructions**: None

-   [ ] Step 10: Enhance Accessibility
    -   **Task**: Review `PdfPreview` and `PdfPopup` for accessibility best practices. **Verify accessibility of the revised footer Close button added in Step 8.1.**
    -   **Files**:
        -   `components/pdf/PdfPreview.tsx`: Verify `aria-label`, focus state.
        -   `components/pdf/PdfPopup.tsx`: Verify iframe `title`. Confirm `Dialog` accessibility features. **Verify keyboard accessibility and focus state for both Download and the new footer Close buttons.** Ensure loading/error states have appropriate ARIA attributes.
    -   **Step Dependencies**: Step 9
    -   **User Instructions**: None

-   [ ] Step 11: Final Testing and Review
    -   **Task**: Manually test the complete user flow to ensure seamless integration and functionality according to the project request and technical specification. **Verify the popup has no header and the footer Close button works as expected.**
    -   **Files**: N/A (Testing Step)
    -   **Step Dependencies**: Step 10
    -   **User Instructions**:
        1.  Interact with the Nova chat assistant.
        2.  Trigger a Voiceflow response that includes a `<DOCUMENTID>...</DOCUMENTID>` tag.
        3.  Verify the message appears correctly without the tags.
        4.  Verify the `PdfPreview` icon appears next to the message.
        5.  Hover over and click the `PdfPreview` icon.
        6.  Verify the `PdfPopup` modal opens smoothly with a blurred background **and no header title**.
        7.  Verify the loading indicator appears briefly.
        8.  Verify the PDF document renders correctly.
        9.  Test the "Download" button.
        10. **Test the footer "Close" button – it should close the modal smoothly.**
        11. Test clicking outside the modal (if not prevented) – it should close the modal.
        12. Test responsiveness.
        13. (Optional) Test error state.

-   [ ] Step 12: Remove Temporary Testing Code **(New Step)**
    -   **Task**: Remove any temporary code, placeholders, or hardcoded values added specifically for testing during development. This includes the placeholder document ID logic in `VanishInput.tsx`.
    -   **Files**:
        -   `components/inputs/vanishinput.tsx`: Locate and remove the temporary code block that forces a `documentId` onto a specific message index.
    -   **Step Dependencies**: Step 11 (Ensures testing is complete before cleanup)
    -   **User Instructions**: None

# Summary

This plan breaks down the PandaDoc PDF viewer integration into distinct phases: setup, core component creation, integration into the existing chat, adding interactivity (loading/error states), **refining the UI based on core requirements**, and finally, styling, accessibility refinements, final testing, and **cleanup of temporary code**. It follows a logical progression, starting with the new UI elements and then connecting them to the existing `VanishInput` component. Each step is designed to be atomic and targets a small number of files, making it suitable for sequential execution by a code generation AI. The backend API route `/api/pandadoc` is assumed to be functional as verified in the request. The final steps emphasize manual testing and code cleanup to ensure the feature meets all requirements and is ready for deployment.