"use client";

import { Dialog, DialogClose, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

interface PdfViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl: string;
}

export function PdfViewerModal({ isOpen, onClose, pdfUrl }: PdfViewerModalProps) {
    const isMobile = useIsMobile();
    const overlayRef = useRef<HTMLDivElement>(null);

    // Handle click on empty space within PDF container
    const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        // Check if click is on the overlay and not on the PDF content
        if (target === overlayRef.current) {
            onClose();
        }
    }, [onClose]);

    // Handle ESC key (backup to Radix UI's built-in handling)
    useEffect(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscKey);
        return () => window.removeEventListener('keydown', handleEscKey);
    }, [isOpen, onClose]);

    return (
        <div className="relative z-[9999]">
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogPortal>
                    <DialogOverlay
                        className={cn(
                            "fixed inset-0 z-[998] bg-black/60 backdrop-blur-md",
                            "transition-all duration-200"
                        )}
                    />
                    <DialogContent
                        className={cn(
                            "relative max-w-[95vw] w-full md:max-w-5xl",
                            "h-[95vh] md:h-[90vh]",
                            "p-0 border-0 z-[999]",
                            "bg-transparent"
                        )}
                    >
                        {/* PDF Container with Overlay */}
                        <div
                            className={cn(
                                "relative w-full h-full",
                                "bg-white/95 backdrop-blur-xl",
                                "rounded-lg shadow-2xl overflow-hidden"
                            )}
                        >
                            {/* Close Button */}
                            <DialogClose
                                className={cn(
                                    "absolute top-4 right-4 z-[1000]",
                                    "p-3 md:p-2 rounded-full",
                                    "bg-white/90 hover:bg-white",
                                    "shadow-lg hover:shadow-xl",
                                    "transition-all duration-150",
                                    "focus:outline-none focus:ring-2 focus:ring-blue-500"
                                )}
                            >
                                <X className={cn(
                                    "h-5 w-5 md:h-4 md:w-4",
                                    "text-gray-800"
                                )} />
                                <span className="sr-only">Close</span>
                            </DialogClose>

                            {/* Clickable Overlay */}
                            <div
                                ref={overlayRef}
                                onClick={handleOverlayClick}
                                className={cn(
                                    "absolute inset-0 z-[999]",
                                    "bg-transparent"
                                )}
                            />

                            {/* PDF Viewer */}
                            <iframe
                                src={pdfUrl}
                                className={cn(
                                    "w-full h-full border-0",
                                    "relative z-[998]"
                                )}
                                title="PDF Viewer"
                                allow="autoplay"
                                style={{
                                    objectFit: 'contain'
                                }}
                            />
                        </div>
                    </DialogContent>
                </DialogPortal>
            </Dialog>
        </div>
    );
}
