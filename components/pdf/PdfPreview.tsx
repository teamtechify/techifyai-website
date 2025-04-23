/**
 * @file PdfPreview.tsx
 * @description
 * Renders two distinct buttons for viewing and downloading PDF documents within the chat interface.
 * Each button links directly to the appropriate API endpoint.
 * Includes accessibility features and clear visual distinction between actions.
 *
 * @dependencies
 * - React: For component structure.
 * - lucide-react: For icons (ExternalLink, Download).
 * - @/lib/utils: For the `cn` utility function.
 *
 * @props
 * - documentId (string): The unique identifier for the PandaDoc document.
 * - className (string, optional): Additional CSS classes for custom styling.
 */
"use client";

import { cn } from '@/lib/utils';
import { Download, ExternalLink } from 'lucide-react'; // Import icons
import React from 'react';

/**
 * Props interface for the PdfPreview component.
 */
interface PdfPreviewProps {
  /** The unique identifier for the PandaDoc document. */
  documentId: string;
  /** Optional additional CSS classes for styling. */
  className?: string;
}

/**
 * PdfPreview Component
 *
 * Renders two distinct buttons for viewing and downloading PDFs.
 * Each button links directly to the appropriate API endpoint.
 *
 * @param {PdfPreviewProps} props - The component props.
 * @returns {JSX.Element} The rendered component with two action buttons.
 */
export const PdfPreview: React.FC<PdfPreviewProps> = ({ documentId, className }) => {
  // Construct URLs for view and download actions
  const viewPdfUrl = `/api/pandadoc?documentId=${documentId}`;
  const downloadPdfUrl = `/api/pandadoc?documentId=${documentId}&download=true`;

  return (
    <div
      className={cn(
        'flex gap-2 my-1', // Base container styling
        className
      )}
    >
      {/* View PDF Button */}
      <a
        href={viewPdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-md',
          'bg-blue-600/90 text-white', // Distinct color for view action
          'border border-blue-500/50',
          'hover:bg-blue-500/90 hover:border-blue-400/50',
          'active:opacity-90',
          'transition-all duration-150',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
        )}
        aria-label={`View PDF document ${documentId} in new tab`}
      >
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
        <span className="text-sm font-medium">View</span>
      </a>

      {/* Download PDF Button */}
      <a
        href={downloadPdfUrl}
        download
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-md',
          'bg-gray-700/90 text-white', // Different color for download action
          'border border-gray-600/50',
          'hover:bg-gray-600/90 hover:border-gray-500/50',
          'active:opacity-90',
          'transition-all duration-150',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
        )}
        aria-label={`Download PDF document ${documentId}`}
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        <span className="text-sm font-medium">Download</span>
      </a>
    </div>
  );
};
