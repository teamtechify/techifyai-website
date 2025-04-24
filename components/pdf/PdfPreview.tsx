"use client";

import { PdfViewerModal } from "@/components/pdf/PdfViewerModal";
import { cn } from "@/lib/utils";
import { Download, ExternalLink } from "lucide-react";
import { useState } from "react";

interface PdfPreviewProps {
  documentId: string;
  className?: string;
}

export const PdfPreview: React.FC<PdfPreviewProps> = ({ documentId, className }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const viewPdfUrl = `/api/pandadoc?documentId=${documentId}`;
  const downloadPdfUrl = `/api/pandadoc?documentId=${documentId}&download=true`;

  return (
    <>
      <div className={cn("flex gap-2 my-1", className)}>
        {/* View PDF Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-md",
            "bg-blue-600/90 text-white",
            "border border-blue-500/50",
            "hover:bg-blue-500/90 hover:border-blue-400/50",
            "active:opacity-90",
            "transition-all duration-150",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          aria-label={`View PDF document ${documentId}`}
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          <span className="text-sm font-medium">View</span>
        </button>

        {/* Download PDF Button */}
        <a
          href={downloadPdfUrl}
          download
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-md",
            "bg-gray-700/90 text-white",
            "border border-gray-600/50",
            "hover:bg-gray-600/90 hover:border-gray-500/50",
            "active:opacity-90",
            "transition-all duration-150",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          aria-label={`Download PDF document ${documentId}`}
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          <span className="text-sm font-medium">Download</span>
        </a>
      </div>

      <PdfViewerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pdfUrl={viewPdfUrl}
      />
    </>
  );
};
