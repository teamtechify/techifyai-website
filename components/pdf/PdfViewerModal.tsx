"use client";

import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Download, X } from "lucide-react";

interface PdfViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl: string;
}

function extractGoogleDriveFileId(url: string): string | null {
    // Handle various Google Drive URL formats
    const patterns = [
        /\/file\/d\/([^/]+)/, // Standard sharing URL
        /\?id=([^&]+)/, // Open format
        /\/d\/([^/]+)/, // Direct link
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    return null;
}

export function PdfViewerModal({ isOpen, onClose, pdfUrl }: PdfViewerModalProps) {
    const fileId = extractGoogleDriveFileId(pdfUrl);
    const previewUrl = fileId ? `https://drive.google.com/file/d/${fileId}/preview` : pdfUrl;
    const downloadUrl = fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : pdfUrl;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 bg-transparent border-0">
                {/* Header with controls */}
                <div className="absolute top-0 right-0 left-0 flex justify-between items-center p-4 z-10">
                    <a
                        href={downloadUrl}
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
                <div className="w-full h-full bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl overflow-hidden">
                    <iframe
                        src={previewUrl}
                        className="w-full h-full border-0"
                        title="PDF Viewer"
                        allow="autoplay"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
