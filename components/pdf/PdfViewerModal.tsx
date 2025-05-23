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
                <DialogOverlay className="fixed inset-0 bg-transparent backdrop-blur-[3px] transition-all duration-200 z-50" />
                {/* Title display removed based on user feedback */}
                {/* 
                {documentTitle && (
                    <div className="fixed top-6 left-6 z-[70] text-white text-2xl font-semibold">
                        {documentTitle}
                    </div>
                )}
                */}
                <DialogContent
                    onInteractOutside={(e) => { 
                        // Prevent closing on interact outside if it's the PDF itself, which might happen with react-pdf interactions
                        // This is a common pattern to avoid closing when interacting with complex embedded content.
                        // However, for now, let user click outside to close.
                        // e.preventDefault();
                    }}
                    className={cn(
                        "fixed left-1/2 top-1/2 z-[60] -translate-x-1/2 -translate-y-1/2", // Centering
                        "bg-transparent", // Keep background transparent
                        "p-0", // No padding on DialogContent itself
                        "overflow-visible", // Allow child shadows (e.g., from PDF page) to be visible
                        "w-auto h-auto", // Allow content to dictate size
                        "max-w-[90vw]", // Match CustomPdfViewer's maxWidth to prevent constraint
                        "pdf-modal-content-no-close" // Added marker class
                    )}
                >
                    {/* CustomPdfViewer is now the direct child and will define its own size/max-size */}
                    {/* The intermediate div with flex-grow has been removed */}
                    {pdfUrl ? (
                        <CustomPdfViewer pdfUrl={pdfUrl} onClose={onClose} />
                    ) : (
                        // Fallback for when there is no PDF url, give it some visible styling
                        <div className="p-6 bg-neutral-800 text-white rounded-md shadow-xl">
                            <p>No PDF specified or URL is invalid.</p>
                        </div>
                    )}
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
