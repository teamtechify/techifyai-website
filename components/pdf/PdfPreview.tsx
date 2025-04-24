"use client";

import { PdfViewerModal } from "@/components/pdf/PdfViewerModal";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface PdfPreviewProps {
  pdfUrl: string;
  className?: string;
}

export const PdfPreview: React.FC<PdfPreviewProps> = ({ pdfUrl, className }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          aria-label="View PDF document"
        >
          <span>View My Plan</span>
        </button>
      </div>

      <PdfViewerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pdfUrl={pdfUrl}
      />
    </>
  );
};
