"use client";

import { PdfViewerModal } from "@/components/pdf/PdfViewerModal";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";

interface PdfPreviewProps {
  pdfUrl: string;
  className?: string;
}

// Helper function to extract business name and create title
const getDocumentTitleFromUrl = (url: string): string => {
  try {
    const decodedUrl = decodeURIComponent(url);
    const filename = decodedUrl.substring(decodedUrl.lastIndexOf('/') + 1);
    // Assuming format "Business Name - ID.pdf"
    const namePart = filename.split(' - ')[0];
    if (namePart) {
      return `${namePart} Blueprint`;
    }
  } catch (e) {
    console.error("Error parsing PDF URL for title:", e);
  }
  return 'Document Blueprint'; // Fallback title
};

export const PdfPreview: React.FC<PdfPreviewProps> = ({ pdfUrl, className }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const documentTitle = useMemo(() => getDocumentTitleFromUrl(pdfUrl), [pdfUrl]);

  return (
    <>
      <div className={cn("flex my-1", className)}>
        {/* View My Plan Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-md",
            "bg-blue-600/90 text-white",
            "border border-blue-500/50",
            "hover:bg-blue-500/90 hover:border-blue-400/50",
            "active:opacity-90",
            "transition-all duration-150",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "font-medium"
          )}
          aria-label={`View ${documentTitle}`}
        >
          <span>View My Plan</span>
        </button>
      </div>

      <PdfViewerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pdfUrl={pdfUrl}
        documentTitle={documentTitle}
      />
    </>
  );
};
