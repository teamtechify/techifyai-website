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
    useEffect(() => {
        if (isOpen) {
            // Prevent background scrolling when modal is open
            const originalBodyOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            let originalDocStylePosition = '';
            let originalDocStyleWidth = '';
            let originalDocStyleHeight = '';

            // For iOS devices - fix for full height issues
            if (isMobile) {
                originalDocStylePosition = document.documentElement.style.position;
                originalDocStyleWidth = document.documentElement.style.width;
                originalDocStyleHeight = document.documentElement.style.height;
                document.documentElement.style.position = 'fixed';
                document.documentElement.style.width = '100%';
                document.documentElement.style.height = '100%';
            }

            return () => {
                document.body.style.overflow = originalBodyOverflow;
                if (isMobile) {
                    document.documentElement.style.position = originalDocStylePosition;
                    document.documentElement.style.width = originalDocStyleWidth;
                    document.documentElement.style.height = originalDocStyleHeight;
                }
            };
        }
    }, [isOpen, isMobile]);

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
                <DialogOverlay
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[998]"
                />
                <DialogContent
                    className={cn(
                        // Base styles
                        "fixed inset-0 p-0 border-0 bg-transparent overflow-hidden z-[999]", // Added z-index
                        // Mobile-first approach
                        "flex flex-col justify-center items-center",
                        // Override for larger screens
                        "md:inset-auto md:w-[95vw] md:h-[90vh] md:max-w-5xl md:rounded-lg"
                    )}
                    // Prevent Dialog default focus trapping which can interfere with iframe
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    {/* PDF Viewer Container */}
                    <div className={cn(
                        "relative w-full h-full max-h-[100vh] md:max-h-[90vh] bg-white/95", // Adjusted bg opacity
                        "flex flex-col rounded-none md:rounded-lg shadow-2xl overflow-hidden"
                    )}>
                        {/* Close Button */}
                        <DialogClose
                            className={cn(
                                "absolute top-3 right-3 z-[1001]", // Ensure button is above iframe content
                                "p-2 rounded-full",
                                "bg-gray-800/60 hover:bg-gray-700/80 text-white",
                                "shadow-lg hover:shadow-xl",
                                "transition-all duration-150",
                                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-white"
                            )}
                        >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close</span>
                        </DialogClose>

                        {/* PDF wrapper with controlled dimensions */}
                        <div className="w-full h-full flex-grow overflow-hidden relative"> {/* Added relative positioning */}
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
                                    {/* Loading Indicator */}
                                    {!pdfLoaded && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-[1000]">
                                            <LoadingSpinner />
                                        </div>
                                    )}
                                    {/* PDF Iframe */}
                                    <iframe
                                        // Use a key to force re-render if url changes significantly
                                        key={pdfUrl}
                                        src={pdfUrl}
                                        className={cn(
                                            "w-full h-full border-0 transition-opacity duration-300",
                                            pdfLoaded ? "opacity-100" : "opacity-0" // Fade in on load
                                        )}
                                        title="PDF Viewer"
                                        onLoad={handleLoad}
                                        onError={handleError} // Basic error handling
                                        sandbox="allow-same-origin allow-scripts allow-forms" // Security sandbox
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
