/**
 * @file PdfPopup.tsx
 * @description
 * Renders a modal dialog for displaying PDF documents fetched via an iframe.
 * Features a blurred backdrop, loading/error states, and download/close actions.
 * Uses Shadcn UI components and Tailwind CSS for styling.
 *
 * @dependencies
 * - React (useState, useEffect, useCallback): For component state and handlers.
 * - @/components/ui/dialog: Shadcn UI Dialog components.
 * - @/components/ui/button: Shadcn UI Button component.
 * - lucide-react: For icons (X, Download, AlertTriangle).
 * - @/lib/utils: For the `cn` utility function.
 *
 * @props
 * - isOpen (boolean): Controls the visibility of the modal.
 * - documentId (string | null): The ID of the PandaDoc document to display.
 * - onClose (function): Callback triggered when the dialog requests to close.
 */
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogClose, // Used for the footer close button
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download, AlertTriangle, Loader2 } from 'lucide-react'; // Added Loader2
import { cn } from '@/lib/utils';

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
 * Renders a responsive modal dialog for displaying PDF documents via an iframe.
 * Includes iframe container with loading/error handling, and footer with download/close buttons.
 * Features a blurred backdrop overlay and enhanced accessibility features.
 *
 * @param {PdfPopupProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
export const PdfPopup: React.FC<PdfPopupProps> = ({ isOpen, documentId, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Construct the URL for the iframe source.
  const pdfUrl = documentId ? `/api/pandadoc?documentId=${documentId}` : '';
  // Construct a meaningful title for the iframe for accessibility
  const iframeTitle = `PDF Document Viewer${documentId ? ` - Document ID: ${documentId}` : ''}`;

  /**
   * Effect hook to reset loading and error states when the modal opens/closes
   * or when the document ID changes.
   */
  useEffect(() => {
    if (isOpen && documentId) {
      console.log(`PdfPopup opened for document: ${documentId}`);
      setIsLoading(true);
      setLoadError(null);
    } else {
      // Reset when closing or if ID is null
      setIsLoading(false);
      setLoadError(null);
    }
  }, [isOpen, documentId]);

  /**
   * Callback handler for the iframe's onLoad event. Sets loading to false.
   */
  const handleIframeLoad = useCallback(() => {
    console.log(`Iframe loaded successfully for document: ${documentId}`);
    setIsLoading(false);
    setLoadError(null);
  }, [documentId]);

  /**
   * Callback handler for the iframe's onError event. Sets loading to false and sets an error message.
   */
  const handleIframeError = useCallback(() => {
    console.error(`Iframe failed to load for document: ${documentId}`);
    setIsLoading(false);
    setLoadError("Document could not be loaded. Please try again later.");
  }, [documentId]);

  /**
   * Handler for when the Shadcn Dialog component signals a request to change its open state.
   * Calls the onClose prop only when the dialog is *closing*.
   * @param {boolean} open - The new open state requested by the Dialog.
   */
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      console.log("PdfPopup closing.");
      onClose(); // Call the close handler provided by the parent
    }
  };

  return (
    // Shadcn Dialog component handles base modal logic, accessibility, and focus trapping.
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* DialogOverlay: Blurred background overlay per client request */}
      <DialogOverlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md" aria-hidden="true" />

      {/* DialogContent: Main modal container */}
      <DialogContent
        className={cn(
          // Base Shadcn styles + custom layout adjustments
          "fixed left-1/2 top-1/2 z-50 grid w-full max-w-4xl", // Increased max-width
          "-translate-x-1/2 -translate-y-1/2",
          // Custom layout: flex column, responsive height, remove default gap, adjust padding
          "h-[90vh] md:h-[85vh] flex flex-col p-0 sm:p-6", // Edge-to-edge on mobile, padding on larger
          "bg-background border border-white/10 shadow-lg rounded-lg", // Styling
          "transition-all duration-200"
        )}
        // Prevent closing on clicking outside (optional)
        // onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Main Content Area (iframe container) */}
        <div
          className={cn(
            "flex-grow overflow-hidden relative border border-border rounded-md",
            "m-6 mb-0 sm:m-0 sm:mb-0" // Margin for spacing on mobile, remove on larger
          )}
          // Indicate loading state for accessibility
          aria-busy={isLoading}
        >
          {/* Loading State: Show spinner. Announce change politely. */}
          {isLoading && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground"
              aria-live="polite"
              aria-label="Loading document..."
            >
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              Loading Document...
            </div>
          )}

          {/* Error State: Show error message. Announce change assertively. */}
          {loadError && !isLoading && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-muted"
              role="alert"
              aria-live="assertive"
            >
              <AlertTriangle className="h-10 w-10 text-destructive mb-4" aria-hidden="true" />
              <p className="text-destructive-foreground font-medium">Loading Failed</p>
              <p className="text-sm text-muted-foreground mt-1">{loadError}</p>
            </div>
          )}

          {/* Iframe for PDF Display */}
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              title={iframeTitle} // Descriptive title for accessibility
              className={cn(
                "w-full h-full border-0", // Ensure iframe fills container
                (isLoading || loadError) ? 'invisible' : 'visible' // Hide until loaded or if error
              )}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              allow="fullscreen" // Allow fullscreen mode
            />
          )}
          {/* Message if no document ID is provided */}
          {!pdfUrl && !isLoading && !loadError && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground" aria-live="polite">
              No document selected or available.
            </div>
          )}
        </div>

        {/* Modal Footer with Download and Close buttons */}
        <DialogFooter className={cn(
          "mt-4 flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-2", // Responsive layout
          "px-6 pb-6 sm:px-0 sm:pb-0" // Padding for mobile
        )}>
          {/* Close Button (using DialogClose for built-in functionality) */}
          <DialogClose asChild>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <X className="mr-2 h-4 w-4" aria-hidden="true" /> Close
            </Button>
          </DialogClose>

          {/* Download Button - Prominent style */}
          <Button
            asChild // Use asChild to render an anchor tag
            variant="default" // Default Shadcn button style
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium w-full sm:w-auto" // Prominent styling
            disabled={!pdfUrl || isLoading || !!loadError} // Disable if no URL, loading, or error
          >
            {/* Anchor tag for download functionality */}
            <a href={pdfUrl} download={`document-${documentId || 'file'}.pdf`}>
              <Download className="mr-2 h-4 w-4" aria-hidden="true" /> Download
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};