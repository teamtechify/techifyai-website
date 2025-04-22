/**
 * @file PdfPopup.tsx
 * @description
 * This component renders a modal dialog for displaying PDF documents fetched via an iframe.
 * It utilizes the Shadcn UI Dialog component for structure, accessibility, and animations.
 * The modal displays the PDF specified by `documentId`, provides download and close actions,
 * and handles loading and error states for the iframe content. Styling is applied using
 * Tailwind CSS for responsiveness and visual consistency, including a blurred backdrop.
 *
 * Accessibility Notes (Step 10):
 * - Leverages Shadcn's `Dialog` which handles ARIA roles (`dialog`, `aria-modal="true"`),
 *   focus trapping, and allows closing via the Escape key.
 * - Sets a descriptive `title` attribute on the `iframe` for screen reader context.
 * - Adds `aria-live="polite"` to the loading and error message containers so assistive
 *   technologies announce these state changes without interrupting the user.
 * - Uses `aria-hidden="true"` on decorative icons (AlertTriangle) within the error message.
 * - Ensures interactive elements (Download, Close buttons) are keyboard accessible and have
 *   clear focus states provided by Shadcn `Button` and Tailwind `focus-visible`.
 * - The main content area (iframe container) uses `aria-busy` during loading.
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
 * - Implements responsive design for various screen sizes.
 * - Applies a backdrop blur effect to the overlay.
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
import { Skeleton } from '@/components/ui/skeleton';
import { X, Download, AlertTriangle } from 'lucide-react';
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

  /**
   * Effect hook to reset loading and error states when the modal opens/closes
   * or when the document ID changes.
   */
  useEffect(() => {
    if (isOpen && documentId) {
      setIsLoading(true);
      setLoadError(null);
    } else {
      // Reset when closing or if ID is null to avoid showing stale state
      setIsLoading(false);
      setLoadError(null);
    }
  }, [isOpen, documentId]);

  /**
   * Callback handler for the iframe's onLoad event. Sets loading to false.
   */
  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
    setLoadError(null);
  }, []);

  /**
   * Callback handler for the iframe's onError event. Sets loading to false and sets an error message.
   */
  const handleIframeError = useCallback(() => {
    setIsLoading(false);
    setLoadError("Document could not be loaded at this time. Please try again later or contact support.");
  }, []);

  /**
   * Handler for when the Shadcn Dialog component signals a request to change its open state.
   * Calls the onClose prop only when the dialog is *closing* (new state is false).
   * @param {boolean} open - The new open state requested by the Dialog.
   */
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose(); // Call the close handler provided by the parent
    }
  };

  // Construct the URL for the iframe source. Defaults to empty string if no documentId.
  const pdfUrl = documentId ? `/api/pandadoc?documentId=${documentId}` : '';
  // Construct a meaningful title for the iframe for accessibility
  const iframeTitle = `PDF Document Viewer${documentId ? ` - Document ID: ${documentId}` : ''}`;

  return (
    // Shadcn Dialog component handles base modal logic, accessibility roles, and focus trapping.
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* DialogOverlay: Blurred background overlay */}
      <DialogOverlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md" aria-hidden="true" />

      {/* DialogContent: Main modal container. Shadcn adds aria-modal="true" and role="dialog" */}
      <DialogContent
        className={cn(
          // Base Shadcn styles + custom layout adjustments
          "fixed left-1/2 top-1/2 z-50 grid w-full max-w-4xl", // Increased max-width
          "-translate-x-1/2 -translate-y-1/2 border bg-background shadow-lg duration-200",
          "sm:rounded-lg",
          // Custom layout: flex column, responsive height, remove default gap, adjust padding
          "h-[90vh] md:h-[85vh] flex flex-col p-0 sm:p-6" // Edge-to-edge on mobile, padding on larger screens
        )}
        // Prevent closing on clicking outside the content area (optional)
        // onInteractOutside={(e) => e.preventDefault()}
        // aria-labelledby (optional): If there was a DialogTitle, link it here.
        // aria-describedby (optional): If there was descriptive text, link it here.
      >
        {/* Main Content Area (iframe container) */}
        <div
            className={cn(
                "flex-grow overflow-hidden relative border border-border rounded-md",
                "m-6 mb-0 sm:m-0 sm:mb-0" // Margin for spacing on mobile, remove on larger screens
            )}
            // Indicate to screen readers that content is loading
            aria-busy={isLoading}
            >
            {/* Loading State: Show Skeleton. Announce change politely. */}
            {isLoading && (
                <div
                className="absolute inset-0 flex items-center justify-center bg-muted"
                aria-live="polite" // Announce appearance
                aria-label="Loading document..." // Provide label for the loading state
                >
                <Skeleton className="h-full w-full" />
                </div>
            )}

            {/* Error State: Show error message. Announce change politely. */}
            {loadError && !isLoading && (
                <div
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-muted"
                role="alert" // Indicate this is an important message
                aria-live="assertive" // Announce immediately as it's an error
                >
                <AlertTriangle className="h-10 w-10 text-destructive mb-4" aria-hidden="true" /> {/* Hide decorative icon */}
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
                allow="fullscreen" // Allow fullscreen mode if browser supports it
                />
            )}
            {/* Optional: Message if no document ID is provided */}
            {!pdfUrl && !isLoading && !loadError && (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground" aria-live="polite">
                    No document selected or available.
                </div>
            )}
        </div>

        {/* Modal Footer with Download and Close buttons */}
        <DialogFooter className={cn(
            "mt-4 flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-2", // Stack buttons on mobile, side-by-side on larger, space between
            "px-6 pb-6 sm:px-0 sm:pb-0" // Padding for spacing on mobile, remove on larger screens
            )}>
          {/* Close Button (using DialogClose for built-in functionality & Esc key) */}
          {/* Place Close button first in source order for better mobile layout, use flex order for visual */}
          <DialogClose asChild>
            <Button variant="outline" size="sm" className="w-full sm:w-auto"> {/* Outline variant for secondary action */}
              <X className="mr-2 h-4 w-4" aria-hidden="true" /> Close
            </Button>
          </DialogClose>

           {/* Download Button */}
           <Button
            asChild
            variant="default"
            size="sm" // Smaller button size
            disabled={!pdfUrl || isLoading || !!loadError} // Disable if no URL, loading, or error
            className="w-full sm:w-auto"
          >
            <a href={pdfUrl} download={`document-${documentId || 'file'}.pdf`}>
              <Download className="mr-2 h-4 w-4" aria-hidden="true" /> Download
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};