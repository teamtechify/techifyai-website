/**
 * @file PdfPopup.tsx
 * @description
 * This component renders a modal dialog for displaying PDF documents fetched via an iframe.
 * It utilizes the Shadcn UI Dialog component for structure, accessibility, and animations.
 * The modal displays the PDF specified by `documentId`, provides download and close actions,
 * and will handle loading and error states for the iframe content (implemented in later steps).
 *
 * @dependencies
 * - React: For component structure and state management (future steps).
 * - @/components/ui/dialog: Shadcn UI components for the modal structure.
 * - @/components/ui/button: Shadcn UI Button component for actions.
 * - lucide-react: For icons (X, Download).
 * - @/lib/utils: For the `cn` utility function (will be used for styling).
 *
 * @props
 * - isOpen (boolean): Controls the visibility of the modal. True to show, false to hide.
 * - documentId (string | null): The unique identifier for the PandaDoc document to be displayed.
 *                                Null if no document is selected.
 * - onClose (function): Callback function triggered when the dialog requests to be closed.
 *
 * @notes
 * - Marked as a client component ("use client").
 * - Loading and error handling for the iframe will be added in Step 8.
 * - Styling and responsiveness will be refined in Step 9.
 */
"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download } from 'lucide-react'; // Import icons
// import { cn } from '@/lib/utils'; // Will be used later
// import { Skeleton } from '@/components/ui/skeleton'; // Will be used later
// import { AlertTriangle } from 'lucide-react'; // Will be used later

/**
 * Props interface for the PdfPopup component.
 */
interface PdfPopupProps {
  /** Controls the visibility of the modal. True to show, false to hide. */
  isOpen: boolean;
  /** The unique identifier for the PandaDoc document to display, or null if none. */
  documentId: string | null;
  /** Callback function triggered when the dialog requests to be closed. */
  onClose: () => void;
}

/**
 * PdfPopup Component
 *
 * Renders a modal dialog structure for displaying PDF documents via an iframe.
 * Includes header with title and close button, iframe container, and footer with download button.
 *
 * @param {PdfPopupProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
export const PdfPopup: React.FC<PdfPopupProps> = ({ isOpen, documentId, onClose }) => {
  // Internal state for loading/error handling will be added later
  // const [isLoading, setIsLoading] = useState(true);
  // const [loadError, setLoadError] = useState<string | null>(null);

  // Handler for when the Shadcn Dialog component signals a request to change its open state.
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  // Construct the URL for the iframe source
  const pdfUrl = documentId ? `/api/pandadoc?documentId=${documentId}` : '';

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* DialogOverlay: Provides the background overlay. Styling (e.g., backdrop blur) will be added later. */}
      <DialogOverlay className="fixed inset-0 z-50 bg-black/50" /> {/* Basic overlay */}

      {/* DialogContent: The main container for the modal content. */}
      <DialogContent
        className="fixed left-1/2 top-1/2 z-50 grid w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg flex flex-col h-[80vh]" // Added flex-col and basic height
        // Prevent closing on clicking outside the content area if needed
        // onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Modal Header */}
        <DialogHeader className="flex flex-row justify-between items-center space-y-0 pr-6"> {/* Adjusted padding for close button */}
          <DialogTitle className="text-lg font-semibold text-foreground">Document Viewer</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        {/* Main Content Area (for iframe, loading, error states) */}
        <div className="flex-grow overflow-hidden relative border border-border rounded-md"> {/* Added flex-grow and overflow-hidden */}
          {/* Loading/Error states will go here */}

          {/* Iframe for PDF Display */}
          {pdfUrl && ( // Only render iframe if URL is valid
            <iframe
              src={pdfUrl}
              title={`PDF Document Viewer${documentId ? ` - ${documentId}` : ''}`} // Descriptive title
              className="w-full h-full border-0" // Basic iframe styling
              // onLoad and onError handlers will be added later
              allow="fullscreen" // Allow fullscreen mode for the PDF viewer
            />
          )}
          {!pdfUrl && (
             <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                No document selected.
             </div>
          )}
        </div>

        {/* Modal Footer */}
        <DialogFooter className="sm:justify-end mt-4"> {/* Added margin-top */}
          <Button asChild variant="default" disabled={!pdfUrl}> {/* Disable button if no URL */}
            <a href={pdfUrl} download={`document-${documentId || 'file'}.pdf`}> {/* Dynamic download filename */}
              <Download className="mr-2 h-4 w-4" /> Download
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};