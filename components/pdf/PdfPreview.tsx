/**
 * @file PdfPreview.tsx
 * @description
 * This component renders a clickable preview icon for PDF documents within the chat interface.
 * It receives a document ID and an onClick handler to trigger the opening of a PDF viewer modal.
 *
 * @dependencies
 * - React: For component structure and lifecycle.
 *
 * @props
 * - documentId (string): The unique identifier for the PandaDoc document.
 * - onClick (function): Callback function triggered when the preview icon is clicked.
 *                       It receives the documentId as an argument.
 * - className (string, optional): Additional CSS classes for styling.
 *
 * @notes
 * - This is the initial basic structure. Icon, styling, and accessibility features will be added in subsequent steps.
 * - Marked as a client component ("use client") because it handles user interaction (onClick).
 */
"use client";

import React from 'react';

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
 * Renders a placeholder for the clickable PDF preview icon.
 *
 * @param {PdfPreviewProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
export const PdfPreview: React.FC<PdfPreviewProps> = ({ documentId, onClick, className }) => {
  // Placeholder handler for the click event
  const handleClick = () => {
    onClick(documentId);
  };

  // Placeholder return value - will be replaced with an icon/button later
  return (
    <div
      onClick={handleClick}
      className={`pdf-preview-placeholder ${className || ''}`} // Basic placeholder styling
      style={{ display: 'inline-block', cursor: 'pointer', padding: '4px', border: '1px dashed gray', marginLeft: '8px' }} // Temporary inline styles
      title={`View PDF: ${documentId}`} // Basic title attribute
    >
      [PDF] {/* Placeholder text */}
    </div>
  );
};