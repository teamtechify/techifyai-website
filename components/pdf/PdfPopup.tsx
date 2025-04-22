/**
 * @file PdfPopup.tsx
 * @description
 * This component renders a modal dialog for displaying PDF documents fetched via an iframe.
 * It utilizes the Shadcn UI Dialog component for structure, accessibility, and animations.
 * The modal displays the PDF specified by `documentId`, provides download and close actions,
 * and handles loading and error states for the iframe content.
 *
 * @dependencies
 * - React (useState, useEffect, useCallback): For component state, side effects, and memoized callbacks.
 * - @/components/ui/dialog: Shadcn UI components for the modal structure.
 * - @/components/ui/button: Shadcn UI Button component for actions.
 * - @/components/ui/skeleton: Shadcn UI Skeleton component for loading state.
 * - lucide-react: For icons (X, Download, AlertTriangle).
 * - @/lib/utils: For the `cn` utility function for conditional class merging.
 *
 * @props
 * - isOpen (boolean): Controls the visibility of the modal. True to show, false to hide.
 * - documentId (string | null): The unique identifier for the PandaDoc document to be displayed.
 *                                Null if no document is selected.
 * - onClose (function): Callback function triggered when the dialog requests to be closed.
 *
 * @notes
 * - Marked as a client component ("use client").
 * - Uses `useEffect` to reset loading/error state when the modal opens/closes or the document changes.
 * - Uses `useCallback` for iframe load/error handlers to prevent unnecessary re-renders.
 * - Conditionally renders a Skeleton loader or an error message based on iframe status.
 * - Hides the iframe visually until loaded successfully to prevent showing a broken state.
 * - Disables the download button during loading or if an error occurs.
 */
"use client";

import React, { useState, useEffect, useCallback } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton for loading state
import { X, Download, AlertTriangle } from 'lucide-react'; // Import icons
import { cn } from '@/lib/utils'; // Import cn utility

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
 * Includes header with title and close button, iframe container with loading/error handling,
 * and footer with download button.
 *
 * @param {PdfPopupProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
export const PdfPopup: React.FC<PdfPopupProps> = ({ isOpen, documentId, onClose }) => {
  // State to track if the iframe content is loading
  const [isLoading, setIsLoading] = useState(true);
  // State to store any error message during loading
  const [loadError, setLoadError] = useState<string | null>(null);

  /**
   * Effect hook to reset loading and error states when the modal opens/closes
   * or when the document ID changes.
   */
  useEffect(() => {
    if (isOpen && documentId) {
      // When modal opens with a valid document ID, start loading
      setIsLoading(true);
      setLoadError(null);
    } else {
      // Reset state when closing or if document ID is null
      setIsLoading(false); // No need to show loading if closed or no ID
      setLoadError(null);
    }
  }, [isOpen, documentId]); // Dependencies: run effect when these change

  /**
   * Callback handler for the iframe's onLoad event.
   * Sets loading to false and clears any previous error.
   */
  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
    setLoadError(null);
  }, []); // No dependencies, function identity is stable

  /**
   * Callback handler for the iframe's onError event.
   * Sets loading to false and sets a user-friendly error message.
   */
  const handleIframeError = useCallback(() => {
    setIsLoading(false);
    setLoadError("Document could not be loaded at this time. Please try again later or contact support.");
  }, []); // No dependencies, function identity is stable

  /**
   * Handler for when the Shadcn Dialog component signals a request to change its open state.
   * Calls the onClose prop only when the dialog is closing.
   * @param {boolean} open - The new open state requested by the Dialog.
   */
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  // Construct the URL for the iframe source based on the documentId
  const pdfUrl = documentId ? `/api/pandadoc?documentId=${documentId}` : '';

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* DialogOverlay: Provides the background overlay. Styling (e.g., backdrop blur) will be added later. */}
      <DialogOverlay className="fixed inset-0 z-50 bg-black/50" /> {/* Basic overlay */}

      {/* DialogContent: The main container for the modal content. */}
      <DialogContent
        className={cn(
          // Base Shadcn styles + custom layout
          "fixed left-1/2 top-1/2 z-50 grid w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
          // Custom layout: flex column, responsive height
          "h-[90vh] md:h-[85vh] flex flex-col"
        )}
        // Prevent closing on clicking outside the content area if desired
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
        <div className="flex-grow overflow-hidden relative border border-border rounded-md">
          {/* Loading State: Show Skeleton */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              {/* Using Skeleton for a placeholder loading UI */}
              <Skeleton className="h-full w-full" />
              {/* Alternative: Simple Spinner (requires installing a spinner library or CSS) */}
              {/* <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div> */}
            </div>
          )}

          {/* Error State: Show error message */}
          {loadError && !isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-muted">
              <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
              <p className="text-destructive-foreground font-medium">Loading Failed</p>
              <p className="text-sm text-muted-foreground mt-1">{loadError}</p>
            </div>
          )}

          {/* Iframe for PDF Display */}
          {pdfUrl && ( // Only render iframe if URL is valid
            <iframe
              src={pdfUrl}
              title={`PDF Document Viewer${documentId ? ` - ${documentId}` : ''}`} // Descriptive title
              className={cn(
                "w-full h-full border-0",
                // Hide iframe visually until loaded successfully or if there's an error
                (isLoading || loadError) ? 'invisible' : 'visible'
              )}
              onLoad={handleIframeLoad} // Attach load handler
              onError={handleIframeError} // Attach error handler
              allow="fullscreen" // Allow fullscreen mode for the PDF viewer
            />
          )}
          {!pdfUrl && !isLoading && !loadError && ( // Show message if no document ID and not loading/error
             <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                No document selected or available.
             </div>
          )}
        </div>

        {/* Modal Footer */}
        <DialogFooter className="sm:justify-end mt-4"> {/* Added margin-top */}
          <Button
            asChild
            variant="default"
            // Disable download button if no URL, loading, or error occurred
            disabled={!pdfUrl || isLoading || !!loadError}
          >
            <a href={pdfUrl} download={`document-${documentId || 'file'}.pdf`}> {/* Dynamic download filename */}
              <Download className="mr-2 h-4 w-4" /> Download
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};