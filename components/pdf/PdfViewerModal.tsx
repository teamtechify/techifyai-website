"use client";

import { Dialog, DialogClose, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
// Assuming a LoadingSpinner component exists, adjust path if necessary
// import { LoadingSpinner } from "@/components/ui/spinner"; 
import { useEffect, useState } from "react";

// Placeholder for LoadingSpinner if not available
const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
);

interface PdfViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl: string;
}

export function PdfViewerModal({ isOpen, onClose, pdfUrl }: PdfViewerModalProps) {
    const isMobile = useIsMobile();
    const [pdfLoaded, setPdfLoaded] = useState(false);
    const [pdfLoadError, setPdfLoadError] = useState(false);

    // Reset states when modal opens or URL changes
    useEffect(() => {
        if (isOpen) {
            setPdfLoaded(false);
            setPdfLoadError(false);
        }
    }, [isOpen, pdfUrl]);

    // Mobile-specific optimizations
    // Handle modal open/close effects
    useEffect(() => {
        if (!isOpen) return;

        // Prevent background scrolling
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleLoad = () => {
        setPdfLoaded(true);
        setPdfLoadError(false);
    };

    // Basic error handling - iframe onError is not standard/reliable
    // A timeout approach might be more robust if needed.
    const handleError = () => {
        console.error("Error loading PDF iframe.");
        setPdfLoadError(true);
        setPdfLoaded(false); // Ensure loading spinner hides
    };

    const handleRetry = () => {
        setPdfLoadError(false);
        setPdfLoaded(false);
        // Optional: Force iframe reload by changing src slightly
        // e.g., setPdfUrlInternal(pdfUrl + `?retry=${Date.now()}`);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-black/80 backdrop-blur-md transition-all duration-200" />
                <DialogContent
                    className={cn(
                        "fixed left-1/2 top-1/2 z-50 grid w-full max-w-6xl -translate-x-1/2 -translate-y-1/2",
                        "h-[95vh] md:h-[90vh] p-0",
                        "bg-background/95 backdrop-blur-sm rounded-lg shadow-2xl border border-white/10",
                        "overflow-hidden transition-all duration-200"
                    )}
                >
                    {/* PDF Viewer Container */}
                    <div className="relative w-full h-full flex flex-col">
                        {/* Header with close button - Increased z-index */}
                        <div className="absolute top-0 right-0 left-0 flex justify-end p-4 z-30">
                            <DialogClose className="p-2 rounded-full bg-white/90 hover:bg-white hover:shadow-md transition-all duration-150">
                                <X className="h-4 w-4 text-gray-800" />
                                <span className="sr-only">Close</span>
                            </DialogClose>
                        </div>

                        {/* PDF wrapper */}
                        <div className="w-full h-full flex-grow overflow-hidden mt-14">
                            {pdfLoadError ? (
                                <div className="flex flex-col items-center justify-center p-6 h-full text-center bg-gray-100">
                                    <p className="text-gray-700 mb-4">
                                        There was an issue displaying the PDF.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <a
                                            href={pdfUrl}
                                            download
                                            target="_blank" // Good practice for downloads
                                            rel="noopener noreferrer" // Security for target="_blank"
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                        >
                                            Download PDF
                                        </a>
                                        <button
                                            onClick={handleRetry}
                                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Loading Indicator - Added explicit z-index */}
                                    {!pdfLoaded && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-20">
                                            <LoadingSpinner />
                                        </div>
                                    )}
                                    {/* PDF Iframe - Added explicit z-index */}
                                    <iframe
                                        // Use a key to force re-render if url changes significantly
                                        key={pdfUrl}
                                        src={pdfUrl}
                                        className={cn(
                                            "w-full h-full border-0 z-10", // Added z-10
                                            "transition-opacity duration-300",
                                            pdfLoaded ? "opacity-100" : "opacity-0"
                                        )}
                                        title="PDF Viewer"
                                        onLoad={handleLoad}
                                        onError={handleError} // Basic error handling
                                        loading="eager" // Prioritize loading as it's modal content
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
