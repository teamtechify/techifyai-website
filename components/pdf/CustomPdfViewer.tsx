"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import ScrollContainer from 'react-indiana-drag-scroll';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { ZoomInIcon, ZoomOutIcon, DownloadIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'; // XIcon removed
import { cn } from '@/lib/utils'; // Import cn for conditional classnames

// Configure PDF.js worker
// Reverting to local worker with import.meta.url, ensuring versions are aligned.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface CustomPdfViewerProps {
  pdfUrl: string;
  onClose?: () => void; // Optional: if the close button is part of this viewer
}

// Helper to get a clean filename for download
const getFilenameFromUrl = (url: string, fallbackSuffix: string = "blueprint.pdf"): string => {
  try {
    const decodedUrl = decodeURIComponent(url);
    const fullFilename = decodedUrl.substring(decodedUrl.lastIndexOf('/') + 1);
    // Assuming format "Business Name - ID.pdf"
    const namePart = fullFilename.split(' - ')[0];
    if (namePart) {
      // Replace spaces with underscores and append the suffix
      const cleanName = namePart.replace(/\s+/g, '_');
      return `${cleanName}_${fallbackSuffix}`;
    }
  } catch (e) {
    console.error("Error parsing PDF URL for filename:", e);
  }
  // Fallback if parsing fails
  const fallbackBase = fallbackSuffix.split('.')[0] || "document";
  return `${fallbackBase}_${fallbackSuffix}`.replace(/_blueprint.pdf_blueprint.pdf$/, '_blueprint.pdf'); // Avoid double suffix
};

export function CustomPdfViewer({ pdfUrl, onClose }: CustomPdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [areControlsVisible, setAreControlsVisible] = useState(true);
  const [isMouseOverToolbar, setIsMouseOverToolbar] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pageWrapperRef = useRef<HTMLDivElement>(null);
  const initialCenteringDoneRef = useRef<boolean>(false);
  const viewportCenterRatioRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const prevScaleRef = useRef(1.0);
  const controlsActivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null); // Ref for the main viewer div

  const showControlsAndStartTimer = useCallback(() => {
    setAreControlsVisible(true);
    if (controlsActivityTimeoutRef.current) {
      clearTimeout(controlsActivityTimeoutRef.current);
    }
    controlsActivityTimeoutRef.current = setTimeout(() => {
      if (!isMouseOverToolbar) {
        setAreControlsVisible(false);
      }
    }, 3000);
  }, [isMouseOverToolbar]);

  useEffect(() => {
    const currentViewerRef = viewerRef.current;
    const currentScrollContainerRef = scrollContainerRef.current;
    
    const handleActivity = () => {
      showControlsAndStartTimer();
    };

    if (currentViewerRef) {
      currentViewerRef.addEventListener('mousemove', handleActivity);
    }
    if (currentScrollContainerRef) {
      currentScrollContainerRef.addEventListener('scroll', handleActivity, { passive: true });
    }

    showControlsAndStartTimer();

    return () => {
      if (controlsActivityTimeoutRef.current) {
        clearTimeout(controlsActivityTimeoutRef.current);
      }
      if (currentViewerRef) {
        currentViewerRef.removeEventListener('mousemove', handleActivity);
      }
      if (currentScrollContainerRef) {
        currentScrollContainerRef.removeEventListener('scroll', handleActivity);
      }
    };
  }, [showControlsAndStartTimer]);

  const centerView = useCallback(() => {
    if (scrollContainerRef.current && pageWrapperRef.current) {
      const scrollEl = scrollContainerRef.current;
      const pageWrapperEl = pageWrapperRef.current;

      const newScrollLeft = (pageWrapperEl.offsetWidth - scrollEl.clientWidth) / 2;
      const newScrollTop = (pageWrapperEl.offsetHeight - scrollEl.clientHeight) / 2;

      scrollEl.scrollLeft = Math.max(0, newScrollLeft);
      scrollEl.scrollTop = Math.max(0, newScrollTop);
    }
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages: nextNumPages }: { numPages: number }) => {
    setNumPages(nextNumPages);
    setCurrentPageNumber(1);
    setScale(1.0);
    initialCenteringDoneRef.current = false;
    prevScaleRef.current = 1.0;
    showControlsAndStartTimer();
  }, [showControlsAndStartTimer]);

  const handlePageRenderSuccess = useCallback(() => {
    if (!initialCenteringDoneRef.current && currentPageNumber === 1) {
      setTimeout(() => {
        if (scrollContainerRef.current && pageWrapperRef.current) {
          const scrollEl = scrollContainerRef.current;
          const pageWrapperEl = pageWrapperRef.current;

          const newScrollLeft = (pageWrapperEl.offsetWidth - scrollEl.clientWidth) / 2;
          scrollEl.scrollLeft = Math.max(0, newScrollLeft);
          
          scrollEl.scrollTop = 0;
          
          initialCenteringDoneRef.current = true;
        }
      }, 0);
    }
  }, [currentPageNumber]);

  useEffect(() => {
    if (!scrollContainerRef.current || !pageWrapperRef.current || !initialCenteringDoneRef.current) {
      prevScaleRef.current = scale;
      return;
    }

    const scrollEl = scrollContainerRef.current;
    const pageEl = pageWrapperRef.current;

    if (scale !== prevScaleRef.current) {
        setTimeout(() => {
          const prevActualScale = prevScaleRef.current * 0.80;
          const currentActualScale = scale * 0.80;
          const newScrollLeft = (viewportCenterRatioRef.current.x * pageEl.offsetWidth * (currentActualScale / prevActualScale) ) - scrollEl.clientWidth / 2;
          const newScrollTop = (viewportCenterRatioRef.current.y * pageEl.offsetHeight * (currentActualScale / prevActualScale)) - scrollEl.clientHeight / 2;
          
          scrollEl.scrollLeft = Math.max(0, Math.min(newScrollLeft, scrollEl.scrollWidth - scrollEl.clientWidth));
          scrollEl.scrollTop = Math.max(0, Math.min(newScrollTop, scrollEl.scrollHeight - scrollEl.clientHeight));
        }, 0);
    }
    
    prevScaleRef.current = scale;

  }, [scale]);

  const goToPreviousPage = () => {
    setCurrentPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
    showControlsAndStartTimer();
  };

  const goToNextPage = () => {
    setCurrentPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages || 1));
    showControlsAndStartTimer();
  };

  const handleZoom = (newScale: number) => {
    if (scrollContainerRef.current && pageWrapperRef.current) {
      const scrollEl = scrollContainerRef.current;
      const pageEl = pageWrapperRef.current;

      const viewportCenterXInPage = scrollEl.scrollLeft + scrollEl.clientWidth / 2;
      const viewportCenterYInPage = scrollEl.scrollTop + scrollEl.clientHeight / 2;

      let ratioX = pageEl.offsetWidth > 0 ? viewportCenterXInPage / pageEl.offsetWidth : 0.5;
      let ratioY = pageEl.offsetHeight > 0 ? viewportCenterYInPage / pageEl.offsetHeight : 0.5;

      ratioX = Math.max(0, Math.min(1, ratioX));
      ratioY = Math.max(0, Math.min(1, ratioY));

      viewportCenterRatioRef.current = { x: ratioX, y: ratioY };
    }
    setScale(newScale);
    showControlsAndStartTimer();
  };

  const zoomIn = () => {
    handleZoom(Math.min(scale + 0.2, 4.68));
  };

  const zoomOut = () => {
    handleZoom(Math.max(scale - 0.2, 0.5));
  };

  const handleDownload = async () => {
    if (!pdfUrl || isDownloading) return;
    setIsDownloading(true);
    showControlsAndStartTimer();
    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = getFilenameFromUrl(pdfUrl, "blueprint.pdf");
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

  // viewerStyle now controls the max size of the entire PDF viewing area including toolbar space
  const viewerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center ScrollContainer horizontally
    // width: '100%', // No longer 100% of parent, but defines its own max extent
    // height: '100%',
    maxWidth: '90vw', // Max width of the PDF viewer area
    maxHeight: '90vh', // Max height of the PDF viewer area (allows space for toolbar too)
    overflow: 'hidden', // The viewer itself should not scroll, ScrollContainer does
    position: 'relative', // For fixed positioning of controls relative to this viewer box
  };

  // documentContainerStyle is for the ScrollContainer itself
  const documentContainerStyle: React.CSSProperties = {
    flexGrow: 1, 
    width: '100%', 
    // Removed display: 'flex' and justifyContent: 'center' to allow content to align top
    paddingTop: '0rem', 
    paddingBottom: '0rem', 
  };

  return (
    // The main div (viewerRef) now has maxWidth and maxHeight applied via viewerStyle
    <div style={viewerStyle} className="text-white flex flex-col" ref={viewerRef}>
      <ScrollContainer 
        innerRef={scrollContainerRef}
        // ScrollContainer takes up space defined by viewerStyle minus toolbar space (implicitly via flex-grow)
        className={cn(
          "flex-grow w-full overflow-auto cursor-grab pdf-scroll-container",
          areControlsVisible ? 'scrollbar-active' : 'scrollbar-inactive'
        )}
        draggingClassName="cursor-grabbing"
        vertical={true}
        horizontal={true}
        hideScrollbars={false}
        style={documentContainerStyle}
      >
        {pdfUrl ? (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => console.error('Error while loading document!', error.message)}
            loading={<div className="flex justify-center items-center h-full"><p>Loading PDF...</p></div>}
            error={<div className="flex justify-center items-center h-full text-red-400"><p>Error loading PDF. Please try again.</p></div>}
            className="flex justify-center"
          >
            <div className="inline-block" ref={pageWrapperRef}>
              <Page 
                pageNumber={currentPageNumber} 
                scale={scale * 0.80}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="shadow-2xl bg-white"
                onRenderSuccess={handlePageRenderSuccess}
              />
            </div>
          </Document>
        ) : (
          <div className="flex justify-center items-center h-full"><p>No PDF URL provided.</p></div>
        )}
      </ScrollContainer>

      {/* Controls Toolbar - fixed at bottom, with transition for visibility */}
      <div
        className={cn(
            "fixed bottom-0 left-1/2 -translate-x-1/2 mb-3 p-2 flex items-center justify-center rounded-lg bg-black/80 backdrop-blur-sm shadow-xl z-[70] transition-opacity duration-300 ease-in-out",
            areControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
            "gap-x-2 sm:gap-x-3" // Reduced gap between control groups
        )}
        onMouseEnter={() => { setIsMouseOverToolbar(true); showControlsAndStartTimer(); }}
        onMouseLeave={() => {
          setIsMouseOverToolbar(false);
          if (controlsActivityTimeoutRef.current) clearTimeout(controlsActivityTimeoutRef.current);
          controlsActivityTimeoutRef.current = setTimeout(() => setAreControlsVisible(false), 1000);
        }}
      >
        {/* Page navigation controls */}
        <div className="flex items-center gap-x-1"> {/* Reduced inner gap */}
          <Button variant="ghost" size="icon" onClick={goToPreviousPage} disabled={currentPageNumber <= 1} className={cn("text-white hover:bg-white/20", currentPageNumber > 1 ? "cursor-pointer" : "cursor-not-allowed")} aria-label="Previous Page">
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
          <span className="text-xs text-neutral-300 whitespace-nowrap">
            Page {currentPageNumber} of {numPages || '--'}
          </span>
          <Button variant="ghost" size="icon" onClick={goToNextPage} disabled={currentPageNumber >= (numPages || 0)} className={cn("text-white hover:bg-white/20", currentPageNumber < (numPages || 0) ? "cursor-pointer" : "cursor-not-allowed")} aria-label="Next Page">
            <ChevronRightIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-x-1"> {/* Reduced inner gap */}
          <Button variant="ghost" size="icon" onClick={zoomOut} disabled={(scale * 0.80) <= 0.4 || isDownloading} className={cn("text-white hover:bg-white/20", (scale * 0.80) > 0.4 && !isDownloading ? "cursor-pointer" : "cursor-not-allowed")} aria-label="Zoom Out">
            <ZoomOutIcon className="h-5 w-5" />
          </Button>
          <span className="text-xs text-neutral-300 whitespace-nowrap w-10 text-center">{(scale * 100).toFixed(0)}%</span>
          <Button variant="ghost" size="icon" onClick={zoomIn} disabled={(scale * 0.80) >= 3.75 || isDownloading} className={cn("text-white hover:bg-white/20", (scale * 0.80) < 3.75 && !isDownloading ? "cursor-pointer" : "cursor-not-allowed")} aria-label="Zoom In">
            <ZoomInIcon className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Download button */}
        <Button variant="ghost" size="icon" onClick={handleDownload} disabled={isDownloading} aria-label="Download PDF" className={cn("text-white hover:bg-white/20", !isDownloading ? "cursor-pointer" : "cursor-not-allowed")}>
          {isDownloading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <DownloadIcon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
} 