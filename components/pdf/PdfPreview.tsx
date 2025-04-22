/**
 * @file PdfPreview.tsx
 * @description
 * This component renders a clickable preview icon (using lucide-react's FileText)
 * for PDF documents within the chat interface. It receives a document ID and an
 * onClick handler to trigger the opening of a PDF viewer modal. It provides visual
 * feedback on hover and focus for better usability and accessibility, styled with
 * Tailwind CSS to match the application's design system.
 *
 * Accessibility Notes (Step 10):
 * - Uses a semantic <button> element.
 * - Includes an `aria-label` providing context about the action and document ID.
 * - Includes screen-reader-only text for additional context.
 * - Utilizes Tailwind's `focus-visible` utilities to ensure clear focus states for keyboard navigation,
 *   integrating with Shadcn's ring styles.
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
 *
 * @notes
 * - Marked as a client component ("use client") because it handles user interaction (onClick).
 * - Styling uses Tailwind CSS utility classes for consistency with the project's design system.
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
 * Renders a clickable PDF icon button. Clicking it triggers the provided onClick handler.
 * Styled for visual consistency and responsiveness within the chat interface.
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
      type="button" // Explicitly set button type for accessibility
      onClick={handleClick}
      aria-label={ariaLabel} // Use the descriptive aria-label
      className={cn(
        // Base styles: inline flex container, centered items, padding, rounded corners, text color
        'inline-flex items-center justify-center p-1 rounded text-white',
        // Hover states: change text color and add subtle background
        'hover:text-blue-300 hover:bg-white/10',
        // Active state: slight opacity reduction on click
        'active:opacity-80',
        // Transitions for smooth visual feedback
        'transition-all duration-150',
        // Focus states: remove default outline, add visible ring using Shadcn variables
        // Tailwind's focus-visible ensures the ring only appears for keyboard navigation
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background',
        // Vertical alignment and margin (useful when placed next to text)
        'ml-2 align-middle', // Ensure vertical alignment with text
        // Merge with any additional classes passed via props
        className
      )}
    >
      {/* Render the PDF icon */}
      <FileText className="h-5 w-5" aria-hidden="true" /> {/* Hide decorative icon from screen readers */}
      {/* Screen reader only text for additional context */}
      <span className="sr-only">View PDF</span>
    </button>
  );
};