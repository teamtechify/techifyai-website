"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import ScrollContainer from 'react-indiana-drag-scroll';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { DownloadIcon, ChevronLeftIcon, ChevronRightIcon, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils'; // Import cn for conditional classnames

// Configure PDF.js worker
// Reverting to local worker with import.meta.url, ensuring versions are aligned.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

// --- START NEW ZOOM CONSTANTS ---
const BASE_SCALE = 0.9; // MODIFIED: New baseline: 0.9 actual scale is 100% displayed
const ZOOM_STEP_PERCENTAGE = 0.10; // User-facing 10% increments
const ACTUAL_ZOOM_STEP = BASE_SCALE * ZOOM_STEP_PERCENTAGE; // Actual increment for pageContentScale

const DISPLAY_MIN_ZOOM_PERCENT = 0.50; // e.g., 50% displayed
const DISPLAY_MAX_ZOOM_PERCENT = 2.50; // e.g., 250% displayed

const MIN_ACTUAL_SCALE = BASE_SCALE * DISPLAY_MIN_ZOOM_PERCENT;
const MAX_ACTUAL_SCALE = BASE_SCALE * DISPLAY_MAX_ZOOM_PERCENT;
// --- END NEW ZOOM CONSTANTS ---

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
  const [pageContentScale, setPageContentScale] = useState<number>(BASE_SCALE);
  const [isDownloading, setIsDownloading] = useState(false);
  const [areControlsVisible, setAreControlsVisible] = useState(true);
  const [isMouseOverToolbar, setIsMouseOverToolbar] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pageWrapperRef = useRef<HTMLDivElement>(null);
  const initialCenteringDoneRef = useRef<boolean>(false);
  const prevPageContentScaleRef = useRef(BASE_SCALE);
  const controlsActivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  const viewerOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close if the click is directly on viewerRef (the ultimate backdrop)
    // OR if the click is on the scrollContainer itself (acting as an inner backdrop)
    // but not on its children (the PDF page or scrollbars).
    if (e.target === viewerRef.current || e.target === scrollContainerRef.current) {
      if (onClose) {
        onClose();
      }
    }
  };

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
    setPageContentScale(BASE_SCALE);
    initialCenteringDoneRef.current = false;
    prevPageContentScaleRef.current = BASE_SCALE;
    showControlsAndStartTimer();
  }, [showControlsAndStartTimer]);

  const handlePageRenderSuccess = useCallback(() => {
    if (!initialCenteringDoneRef.current && currentPageNumber === 1) {
       initialCenteringDoneRef.current = true; 
    }
  }, [currentPageNumber]);

  useEffect(() => {
    if (!scrollContainerRef.current || !pageWrapperRef.current) {
      prevPageContentScaleRef.current = pageContentScale;
      return;
    }

    const scrollEl = scrollContainerRef.current;
    const pageWrapperEl = pageWrapperRef.current;

    // Defer scroll adjustment to allow DOM to update after scale change
    const timeoutId = setTimeout(() => {
      if (scrollEl && pageWrapperEl) { // Add null check for refs inside timeout
        const scaledWidth = pageWrapperEl.offsetWidth;
        const scaledHeight = pageWrapperEl.offsetHeight;

        let newScrollLeft = (scaledWidth - scrollEl.clientWidth) / 2;
        let newScrollTop = (scaledHeight - scrollEl.clientHeight) / 2;

        scrollEl.scrollLeft = Math.max(0, newScrollLeft);
        scrollEl.scrollTop = Math.max(0, newScrollTop);
      }
    }, 0); // Delay of 0ms to push to next tick

    prevPageContentScaleRef.current = pageContentScale;

    return () => clearTimeout(timeoutId); // Cleanup timeout

  }, [pageContentScale, currentPageNumber]); // Removed numPages from dependencies, not directly used for centering

  const goToPreviousPage = () => {
    setCurrentPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
    showControlsAndStartTimer();
  };

  const goToNextPage = () => {
    setCurrentPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages || 1));
    showControlsAndStartTimer();
  };

  const handleZoom = (newScale: number) => {
    setPageContentScale(newScale);
    showControlsAndStartTimer();
  };

  const zoomIn = () => {
    handleZoom(Math.min(pageContentScale + ACTUAL_ZOOM_STEP, MAX_ACTUAL_SCALE));
  };

  const zoomOut = () => {
    handleZoom(Math.max(pageContentScale - ACTUAL_ZOOM_STEP, MIN_ACTUAL_SCALE));
  };

  const resetZoom = () => {
    handleZoom(BASE_SCALE);
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
    alignItems: 'center', 
    justifyContent: 'center', // Added to help center the ScrollContainer if it's not full height
    width: '100vw',
    height: '100vh',
    overflow: 'visible', 
    position: 'relative',
    pointerEvents: 'auto',
  };

  // documentContainerStyle is for the ScrollContainer itself
  const documentContainerStyle: React.CSSProperties = {
    // flexGrow: 1, // REMOVED: Don't let it grow beyond its content's needs or max-height
    width: '100%', 
    maxWidth: '100vw', // Ensure it doesn't exceed viewport width
    maxHeight: '100vh', // Ensure it doesn't exceed viewport height
    display: 'flex',        
    alignItems: 'flex-start',
    justifyContent: 'center', 
    overflow: 'auto',    
    padding: 0, 
    margin: 0, 
    boxSizing: 'border-box',
    pointerEvents: 'auto',
  };

  const pageWrapperStyle: React.CSSProperties = {
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    margin: '0 auto', // MODIFIED: Vertical margin 0, horizontal auto
    width: 'fit-content', 
    height: 'fit-content', 
  };

  // Styles for the div containing the react-pdf Page component
  const pageStyle: React.CSSProperties = {
  };

  return (
    <div 
      style={viewerStyle} 
      className="text-white flex flex-col" 
      ref={viewerRef} 
      onClick={viewerOnClick}
    >
      <ScrollContainer 
        innerRef={scrollContainerRef}
        className={cn(
          "w-full h-full pdf-scroll-container", 
          areControlsVisible ? 'scrollbar-active' : 'scrollbar-inactive'
        )}
        draggingClassName="cursor-grabbing"
        vertical={true}
        horizontal={true}
        hideScrollbars={false} // Explicitly false, though default
        style={documentContainerStyle} // Apply the new centering styles
      >
        {pdfUrl ? (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => console.error('Error while loading document!', error.message)}
            loading={<div className="flex justify-center items-center h-full"><p>Loading PDF...</p></div>}
            error={<div className="flex justify-center items-center h-full text-red-400"><p>Error loading PDF. Please try again.</p></div>}
          >
            <div ref={pageWrapperRef} style={pageWrapperStyle} className="bg-neutral-900 shadow-2xl rounded-md border border-neutral-700"> 
              <Page 
                key={`page_${currentPageNumber}`}
                pageNumber={currentPageNumber}
                scale={pageContentScale}
                onRenderSuccess={handlePageRenderSuccess}
                className="pdf-page-canvas"
                renderTextLayer={true}
                renderAnnotationLayer={true}
                canvasBackground="transparent" // ADDED: Prevent white flash
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
            "fixed bottom-0 left-1/2 -translate-x-1/2 mb-3 px-4 py-2 flex items-center justify-center rounded-lg bg-black/80 backdrop-blur-sm shadow-xl z-[70] transition-opacity duration-300 ease-in-out",
            areControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
            "gap-x-2 sm:gap-x-3"
        )}
        style={{ pointerEvents: 'auto' }}
        onMouseEnter={() => { setIsMouseOverToolbar(true); showControlsAndStartTimer(); }}
        onMouseLeave={() => {
          setIsMouseOverToolbar(false);
          if (controlsActivityTimeoutRef.current) clearTimeout(controlsActivityTimeoutRef.current);
          controlsActivityTimeoutRef.current = setTimeout(() => setAreControlsVisible(false), 1000);
        }}
      >
        {/* Page navigation controls */}
        <div className="flex items-center gap-x-1"> {/* Reduced inner gap */}
          <Button variant="ghost" size="icon" onClick={goToPreviousPage} disabled={currentPageNumber <= 1} className="text-white hover:text-blue-300 disabled:text-gray-500">
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
          <span className="text-sm tabular-nums whitespace-nowrap">
            {currentPageNumber} of {numPages || '--'}
          </span>
          <Button variant="ghost" size="icon" onClick={goToNextPage} disabled={currentPageNumber >= (numPages || 0)} className="text-white hover:text-blue-300 disabled:text-gray-500">
            <ChevronRightIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-x-1"> {/* Reduced inner gap */}
          <Button variant="ghost" size="icon" onClick={zoomOut} className="text-white hover:text-blue-300">
            <Minus className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={resetZoom} className="text-white hover:text-blue-300" title="Reset zoom to 100%">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
              <path d="M11 8v6"/>
              <path d="M8 11h6"/>
            </svg>
          </Button>
          <Button variant="ghost" size="icon" onClick={zoomIn} className="text-white hover:text-blue-300">
            <Plus className="h-5 w-5" />
          </Button>
          <span className="text-sm tabular-nums w-12 text-center">
            {Math.round((pageContentScale / BASE_SCALE) * 100)}%
          </span>
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