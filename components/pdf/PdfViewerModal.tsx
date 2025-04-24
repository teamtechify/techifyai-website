"use client";

import { Dialog, DialogClose, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface PdfViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl: string;
}

export function PdfViewerModal({ isOpen, onClose, pdfUrl }: PdfViewerModalProps) {
    return (
        <div className="relative z-[9999]">
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogPortal>
                    <DialogOverlay className="fixed inset-0 z-[998] bg-black/60 backdrop-blur-md transition-all duration-200" />
                    <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 bg-black/30 backdrop-blur-md border-0 z-[999]">
                        {/* Header with controls */}
                        <div className="absolute top-0 right-0 left-0 flex justify-end items-center p-4 z-10">
                            <DialogClose className="p-2 rounded-full bg-white/90 hover:bg-white hover:shadow-md transition-all duration-150">
                                <X className="h-4 w-4 text-gray-800" />
                                <span className="sr-only">Close</span>
                            </DialogClose>
                        </div>

                        {/* PDF Viewer */}
                        <div className="w-full h-full bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl overflow-hidden mt-14">
                            <iframe
                                src={pdfUrl}
                                className="w-full h-full border-0"
                                title="PDF Viewer"
                                allow="autoplay"
                            />
                        </div>
                    </DialogContent>
                </DialogPortal>
            </Dialog>
        </div>
    );
}
