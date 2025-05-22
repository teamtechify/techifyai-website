"use client";

import { Dialog, DialogClose, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect } from "react";
import { CustomPdfViewer } from "@/components/pdf/CustomPdfViewer"; // Import the new custom viewer

interface PdfViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl: string;
    documentTitle?: string; // Added documentTitle prop
}

export function PdfViewerModal({ isOpen, onClose, pdfUrl, documentTitle }: PdfViewerModalProps) {
    const isMobile = useIsMobile();

    // Mobile-specific optimizations for background scrolling
    useEffect(() => {
        if (!isOpen) {
            document.body.style.overflow = '';
            return;
        }
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null; // Don't render anything if not open

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-black/80 backdrop-blur-md transition-all duration-200 z-50" />
                <DialogContent
                    className={cn(
                        "fixed left-1/2 top-1/2 z-[60] grid w-full max-w-6xl -translate-x-1/2 -translate-y-1/2", // Ensure higher z-index than overlay
                        "h-[95vh] md:h-[90vh] p-0", // Modal itself has no padding, content will manage
                        "bg-neutral-800 rounded-lg shadow-2xl border border-neutral-700", // Darker theme for modal
                        "overflow-hidden transition-all duration-200 flex flex-col" // Flex column for CustomPdfViewer
                    )}
                >
                    {/* Optional: Modal Header if needed, separate from CustomPdfViewer's controls */}
                    <div className="flex justify-between items-center p-3 border-b border-neutral-700 shrink-0">
                        <h2 className="text-lg font-semibold text-white truncate pr-2">{documentTitle || 'Document'}</h2> {/* Used documentTitle */}
                        <DialogClose asChild>
                            <button className="p-2 rounded-full hover:bg-neutral-700 transition-all duration-150" aria-label="Close">
                                {/* <X className="h-5 w-5 text-neutral-400 hover:text-white" /> */}
                            </button>
                        </DialogClose>
                    </div>
                    
                    {/* Custom PDF Viewer takes up the remaining space */}
                    <div className="flex-grow overflow-hidden">
                        {pdfUrl ? (
                            <CustomPdfViewer pdfUrl={pdfUrl} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                <p>No PDF specified or URL is invalid.</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
