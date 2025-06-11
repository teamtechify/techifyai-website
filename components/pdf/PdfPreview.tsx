"use client";

import { PdfViewerModal } from "@/components/pdf/PdfViewerModal";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { FaFilePdf, FaDownload } from "react-icons/fa6";

interface PdfPreviewProps {
  pdfUrl: string;
  className?: string;
}

// Helper function to extract filename from URL
const getFilenameFromUrl = (url: string): string => {
  try {
    const decodedUrl = decodeURIComponent(url);
    const filename = decodedUrl.substring(decodedUrl.lastIndexOf('/') + 1);
    // Clean up the filename and add .pdf if not present
    const cleanFilename = filename.split('?')[0]; // Remove query parameters
    return cleanFilename.endsWith('.pdf') ? cleanFilename : 'plan.pdf';
  } catch (e) {
    console.error("Error parsing PDF URL for filename:", e);
  }
  return 'plan.pdf'; // Fallback filename
};

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
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const documentTitle = useMemo(() => getDocumentTitleFromUrl(pdfUrl), [pdfUrl]);
  const filename = useMemo(() => getFilenameFromUrl(pdfUrl), [pdfUrl]);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!pdfUrl || isDownloading) return;
    setIsDownloading(true);
    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Sorry, there was an issue downloading the PDF. Please try again or use the direct link if available.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div className={cn("flex my-2", className)}>
        {/* Gmail-style PDF Preview Card */}
        <button
          onClick={() => setIsModalOpen(true)}
          className={cn(
            "relative w-72 h-40 border border-gray-200 bg-white overflow-hidden shadow-sm group",
            "hover:border-gray-300 hover:shadow-md",
            "transition-all duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          )}
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0% 100%)'
          }}
          aria-label={`View ${filename}`}
        >
          {/* PDF Content Preview */}
          <div className="w-full h-full relative bg-gray-50">
            {/* Loading state */}
            {isLoading && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* PDF iframe preview - spans full width, no scrollbars */}
            <div className="w-full h-full relative" style={{ clipPath: 'inset(0 0 0 0)' }}>
              <div className="absolute inset-0 overflow-hidden">
                <iframe
                  src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&zoom=FitH&page=1`}
                  className="border-0 pointer-events-none"
                  onLoad={() => setIsLoading(false)}
                  onError={() => setIsLoading(false)}
                  title="PDF Preview"
                  style={{
                    width: 'calc(100% + 20px)',
                    height: '100%',
                    marginLeft: '0',
                    marginRight: '-20px'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bottom info bar */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gray-200 border-t border-gray-200 px-3 py-2 flex items-center gap-2" 
            style={{ 
              backfaceVisibility: 'hidden', 
              transform: 'translateZ(0)', 
              borderTopWidth: '0.5px'
            }}
          >
            {/* PDF icon */}
            <FaFilePdf className="w-4 h-4 text-red-500 flex-shrink-0" />
            
            {/* Filename */}
            <span 
              className="text-sm text-gray-700 font-medium truncate" 
              style={{ 
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility',
                fontVariantLigatures: 'none',
                backfaceVisibility: 'hidden'
              }}
            >
              {filename}
            </span>
            
            {/* Gmail-style corner fold triangles */}
            <div className="absolute bottom-0 right-0 z-10">
              {/* Shadow triangle (darker) - positioned to the left of red triangle */}
              <div className="absolute bottom-0 right-6 w-0 h-0 border-l-[24px] border-l-transparent border-b-[24px] border-b-gray-400 z-10"></div>
              {/* Main triangle (red) - rotated 180 degrees in the corner */}
              <div 
                className="absolute bottom-0 right-0 w-0 h-0 border-l-[24px] border-l-transparent border-b-[24px] border-b-red-500 z-15"
                style={{ transform: 'rotate(180deg)', transformOrigin: 'center' }}
              ></div>
            </div>
          </div>

          {/* Gmail-style hover overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4">
            {/* Filename at top */}
            <div className="text-white text-sm font-medium truncate">
              {filename}
            </div>
            
            {/* Download button at bottom */}
            <div className="flex justify-center">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="bg-white/90 hover:bg-white text-gray-700 px-3 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <div className="w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaDownload className="w-4 h-4" />
                )}
                {isDownloading ? 'Downloading...' : 'Download'}
              </button>
            </div>
          </div>
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
