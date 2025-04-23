/**
 * @file PdfPopup.tsx
 * @description
 * Renders a modal dialog with options to open a PDF document in a new tab or download it.
 * Features a blurred backdrop and clear action buttons.
 * Uses Shadcn UI components and Tailwind CSS for styling.
 *
 * @dependencies
 * - React: For component structure.
 * - @/components/ui/dialog: Shadcn UI Dialog components.
 * - @/components/ui/button: Shadcn UI Button component.
 * - lucide-react: For icons (X, Download, ExternalLink).
 * - @/lib/utils: For the `cn` utility function.
 *
 * @props
 * - isOpen (boolean): Controls the visibility of the modal.
 * - documentId (string | null): The ID of the PandaDoc document to display.
 * - onClose (function): Callback triggered when the dialog requests to close.
 */
"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogClose,
  DialogFooter,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download, ExternalLink } from 'lucide-react';
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
 * Renders a dialog with options to open the PDF in a new tab or download it.
 * No longer attempts to render the PDF inline to avoid rendering issues.
 *
 * @param {PdfPopupProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
export const PdfPopup: React.FC<PdfPopupProps> = ({ isOpen, documentId, onClose }) => {
  // Construct the URLs for view and download
  const viewPdfUrl = documentId ? `/api/pandadoc?documentId=${documentId}` : '';
  const downloadPdfUrl = documentId ? `/api/pandadoc?documentId=${documentId}&download=true` : '';
  
  /**
   * Handler for opening the PDF in a new tab
   */
  const handleOpenInNewTab = () => {
    if (viewPdfUrl) {
      window.open(viewPdfUrl, '_blank');
    }
  };

  /**
   * Handler for when the Shadcn Dialog component signals a request to change its open state.
   * Calls the onClose prop only when the dialog is *closing*.
   * @param {boolean} open - The new open state requested by the Dialog.
   */
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose(); // Call the close handler provided by the parent
    }
  };

  return (
    // Shadcn Dialog component handles base modal logic, accessibility, and focus trapping.
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* DialogOverlay: Blurred background overlay */}
      <DialogOverlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md" aria-hidden="true" />

      {/* DialogContent: Main modal container */}
      <DialogContent
        className={cn(
          // Base Shadcn styles + custom layout adjustments
          "fixed left-1/2 top-1/2 z-50 grid w-full max-w-md", 
          "-translate-x-1/2 -translate-y-1/2",
          // Custom layout: smaller size for just buttons, no iframe
          "flex flex-col p-6", 
          "bg-background border border-white/10 shadow-lg rounded-lg", 
          "transition-all duration-200"
        )}
      >
        <DialogHeader className="mb-4">
          <DialogTitle>Document Options</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-4">
          {/* Open in New Tab Button */}
          <Button 
            onClick={handleOpenInNewTab}
            className="flex items-center justify-center w-full"
            disabled={!viewPdfUrl}
          >
            <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" /> 
            Open in New Tab
          </Button>

          {/* Download Button */}
          <Button
            asChild
            variant="outline"
            className="flex items-center justify-center w-full"
            disabled={!downloadPdfUrl}
          >
            <a href={downloadPdfUrl} download>
              <Download className="mr-2 h-4 w-4" aria-hidden="true" /> Download
            </a>
          </Button>
        </div>

        {/* Close button at bottom */}
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="ghost" size="sm" className="w-full">
              <X className="mr-2 h-4 w-4" aria-hidden="true" /> Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};