# Project Name
PandaDoc PDF Viewer Integration in Voiceflow Chat

## Project Description
Integrate PandaDoc PDF viewing capabilities into the existing Voiceflow-powered chat interface (Nova). When the AI assistant's response (via the `/api/voiceflow` interact endpoint) contains a specific message with a PandaDoc document ID, the chat should display a clearly clickable PDF preview element. Clicking this preview should smoothly open a modal popup with a blurred background, embedding the PDF for viewing and providing an intuitive download option. This enhancement aims to replace the current direct iframe embedding within the chat log, offering a cleaner and more user-friendly document viewing experience.

## Target Audience
Website visitors interacting with the Nova AI chat assistant.

## User Experience Goals
- **Seamless Integration:** The PDF preview and popup should feel like a natural part of the chat flow, not an abrupt interruption.
- **Clarity & Intuitiveness:** Users should immediately understand that the preview icon represents a document and how to interact with the popup (view, download, close).
- **Responsiveness:** Ensure a smooth and functional experience across desktop, tablet, and mobile devices.
- **Performance:** The new features should not introduce noticeable lag or performance degradation to the chat interface.
- **Graceful Handling:** Loading states and potential errors should be handled clearly and without disrupting the overall chat session.

## Desired Features
### Chat Interface (`components/inputs/vanishinput.tsx`)
- [ ] Enhance Voiceflow message parsing to efficiently detect PandaDoc document IDs formatted as `<DOCUMENTID>...</DOCUMENTID>` within `text` or `speak` trace payloads.
- [ ] When a document ID is detected, render the new `PdfPreview` component inline with the corresponding AI message bubble. Ensure clear visual association between the message and the preview icon.
- [ ] Introduce and manage state for the PDF popup modal (`isPopupOpen`, `currentDocumentId`) reliably.
- [ ] Ensure PDF display is correctly associated with the specific user's session (`userId` from `useSessionUserId` hook).
- [ ] Maintain smooth scrolling performance within the chat log, even with the addition of preview elements.

### PDF Preview Component (`components/pdf/PdfPreview.tsx` - New Component)
- [ ] Create a new client component `PdfPreview.tsx` within a new `/components/pdf/` directory.
- [ ] Display a simple, universally recognizable PDF icon (e.g., using `lucide-react` or `react-icons`).
- [ ] Implement clear visual feedback on hover/click (e.g., slight scale/opacity change) to indicate interactivity.
- [ ] On click, this component should trigger the opening of the `PdfPopup` modal and pass the relevant `documentId` to it.

### PDF Popup Modal (`components/pdf/PdfPopup.tsx` - New Component)
- [ ] Create a new client component `PdfPopup.tsx` within the new `/components/pdf/` directory.
- [ ] Implement a modal/dialog structure (using `components/ui/dialog` is recommended for consistency and built-in animations/accessibility).
- [ ] Ensure the modal opens and closes with smooth transitions/animations.
- [ ] When open, display an overlay that blurs the background page content (using Tailwind's `backdrop-blur-md`).
- [ ] Embed the PDF document using an `iframe`. The `src` attribute should point to `/api/pandadoc?documentId={id}`.
- [ ] Include a prominent and clearly labeled "Download" button.
    - [ ] This button should be an `<a>` tag linking to `/api/pandadoc?documentId={id}` and include the `download` HTML attribute to initiate a browser download reliably.
- [ ] Include an intuitive "Close" button (e.g., an 'X' icon, potentially using `DialogClose` from Shadcn).
- [ ] Ensure the modal layout, including the iframe and buttons, is fully responsive and provides a comfortable viewing experience on all screen sizes.
- [ ] Implement a non-intrusive visual loading indicator (e.g., a subtle spinner or progress bar within the modal) while the PDF inside the `iframe` is loading. This should be replaced by the PDF or an error message upon completion.
- [ ] Implement graceful error handling: If the PDF fails to load, display a clear, user-friendly message (e.g., "Document could not be loaded at this time. Please try again later or contact support.") within the modal content area. Avoid showing technical errors or a broken iframe.

### Backend API (`/api/pandadoc/route.ts`)
- [X] Verify the existing API route correctly fetches the PDF from PandaDoc using the `PANDADOC_API_KEY` environment variable. (Verified as correct)
- [X] Confirm the route returns the PDF with `Content-Type: application/pdf` and `Content-Disposition: inline` headers. (Verified as correct)

## Design Requests
- [ ] Style the `PdfPreview` component icon with appropriate sizing and hover/active states.
- [ ] Design the `PdfPopup` modal layout for optimal readability and ease of use (positioning of iframe, download, and close buttons).
- [ ] Apply the `backdrop-blur-md` effect consistently.
- [ ] Ensure all new UI elements adhere strictly to the Techify AI website's existing visual style guide (fonts, colors, spacing, component aesthetics).

## Other Notes
- Thumbnail previews in the chat are explicitly out of scope.
- Prioritize accessibility: Use semantic HTML, ensure keyboard navigability for the preview icon and modal elements (buttons, iframe focus), and add appropriate ARIA attributes where necessary (e.g., for the modal dialog role).
- The format `<DOCUMENTID>...</DOCUMENTID>` relies on Voiceflow project configuration. Assume this format will be consistently provided in relevant messages.
- Consider edge cases like extremely long PDF documents and how they behave within the responsive iframe.