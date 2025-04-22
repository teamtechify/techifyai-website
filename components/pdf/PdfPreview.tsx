/**
 * @file PdfPreview.tsx
 * @description
 * Renders a clickable preview button (Telegram-style) for PDF documents within the chat interface.
 * Triggers the provided onClick handler with the document ID.
 * Includes accessibility features like aria-label and focus states.
 *
 * @dependencies
 * - React: For component structure.
 * - lucide-react: For the FileText icon.
 * - @/lib/utils: For the `cn` utility function to merge class names.
 *
 * @props
 * - documentId (string): The unique identifier for the PandaDoc document.
 * - onClick (function): Callback function triggered when the preview icon is clicked.
 *                       It receives the documentId as an argument.
 * - className (string, optional): Additional CSS classes for custom styling.
 */
"use client";

import React from 'react';
import { FileText } from 'lucide-react'; // Import the icon
import { cn } from '@/lib/utils'; // Import the cn utility

/**
 * Props interface for the PdfPreview component.
 */
interface PdfPreviewProps {
  /** The unique identifier for the PandaDoc document. */
  documentId: string;
  /** Callback function triggered when the preview icon is clicked. Receives the documentId. */
  onClick: (documentId: string) => void;
  /** Optional additional CSS classes for styling. */
  className?: string;
}

/**
 * PdfPreview Component
 *
 * Renders a clickable PDF icon button in a Telegram-inspired style.
 * Clicking it triggers the provided onClick handler.
 * Ensures accessibility through proper labeling and focus management.
 *
 * @param {PdfPreviewProps} props - The component props.
 * @returns {JSX.Element} The rendered button component.
 */
export const PdfPreview: React.FC<PdfPreviewProps> = ({ documentId, onClick, className }) => {
  /**
   * Handles the click event on the button.
   * Calls the onClick prop passed from the parent component with the documentId.
   */
  const handleClick = () => {
    onClick(documentId);
  };

  // Construct a more descriptive aria-label
  const ariaLabel = `View PDF document: ${documentId}`;

  return (
    <button
      type="button" // Explicitly set button type
      onClick={handleClick}
      aria-label={ariaLabel} // Descriptive aria-label
      className={cn(
        // Base styling - Telegram style: inline flex, gap, padding, rounded, background, text, border
        'inline-flex items-center gap-2 p-1.5 rounded-md',
        'bg-gray-700/80 text-white', // Slightly transparent background
        'border border-gray-600/50', // Subtle border
        // Hover states: slightly darker background and border
        'hover:bg-gray-600/80 hover:border-gray-500/50',
        // Active state: slight opacity reduction
        'active:opacity-90',
        // Transitions for smooth visual feedback
        'transition-all duration-150',
        // Focus states: visible ring using Shadcn variables
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background',
        // Margin when placed inline (e.g., after text)
        'my-1', // Add some vertical margin
        // Merge with any additional classes passed via props
        className
      )}
    >
      {/* PDF Icon */}
      <FileText className="h-5 w-5 text-blue-400 flex-shrink-0" aria-hidden="true" /> {/* Hide decorative icon */}

      {/* Simple label - no filename per client requirement */}
      <span className="text-sm font-medium truncate">PDF Document</span>

      {/* Screen reader only text for additional context */}
      <span className="sr-only"> (Opens PDF viewer)</span>
    </button>
  );
};