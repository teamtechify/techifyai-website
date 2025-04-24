"use client";

import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Download, X } from "lucide-react";

interface PdfViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl: string;
}

export function PdfViewerModal({ isOpen, onClose, pdfUrl }: PdfViewerModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 bg-black/30 backdrop-blur-md border-0">
                {/* Header with controls */}
                <div className="absolute top-0 right-0 left-0 flex justify-between items-center p-4 z-10">
                    <a
                        href={pdfUrl}
                        download
                        className={cn(
                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-md",
                            "bg-white/90 text-gray-800",
                            "hover:bg-white hover:shadow-md",
                            "transition-all duration-150"
                        )}
                        aria-label="Download PDF"
                    >
                        <Download className="h-4 w-4" aria-hidden="true" />
                        <span className="text-sm font-medium">Download</span>
                    </a>

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
        </Dialog>
    );
}
