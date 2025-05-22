"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import ScrollContainer from 'react-indiana-drag-scroll';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { ZoomInIcon, ZoomOutIcon, DownloadIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'; // Example icons

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

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pageWrapperRef = useRef<HTMLDivElement>(null);
  const initialCenteringDoneRef = useRef<boolean>(false);
  const viewportCenterRatioRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const prevScaleRef = useRef(1.0);

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
  }, []);

  const handlePageRenderSuccess = useCallback(() => {
    if (!initialCenteringDoneRef.current && currentPageNumber === 1 && scale === 1.0) {
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
  }, [currentPageNumber, scale]);

  useEffect(() => {
    if (!scrollContainerRef.current || !pageWrapperRef.current) {
      prevScaleRef.current = scale;
      return;
    }

    if (!initialCenteringDoneRef.current) {
      prevScaleRef.current = scale;
      return;
    }

    const scrollEl = scrollContainerRef.current;
    const pageEl = pageWrapperRef.current;

    if (scale !== prevScaleRef.current) {
      if (scale === 1.0) {
        setTimeout(centerView, 10);
      } else {
        setTimeout(() => {
          const newScrollLeft = (viewportCenterRatioRef.current.x * pageEl.offsetWidth) - scrollEl.clientWidth / 2;
          const newScrollTop = (viewportCenterRatioRef.current.y * pageEl.offsetHeight) - scrollEl.clientHeight / 2;
          
          scrollEl.scrollLeft = Math.max(0, Math.min(newScrollLeft, scrollEl.scrollWidth - scrollEl.clientWidth));
          scrollEl.scrollTop = Math.max(0, Math.min(newScrollTop, scrollEl.scrollHeight - scrollEl.clientHeight));
        }, 0);
      }
    }
    
    prevScaleRef.current = scale;

  }, [scale, centerView]);

  const goToPreviousPage = () => {
    setCurrentPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages || 1));
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
  };

  const zoomIn = () => {
    handleZoom(Math.min(scale + 0.2, 3.75));
  };

  const zoomOut = () => {
    handleZoom(Math.max(scale - 0.2, 0.5));
  };

  const handleDownload = async () => {
    if (!pdfUrl || isDownloading) return;
    setIsDownloading(true);
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

  const viewerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    overflow: 'hidden',
  };

  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    backgroundColor: '#333',
    color: 'white',
    flexWrap: 'wrap',
    gap: '8px',
  };
  
  const pageControlsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const zoomControlsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const documentContainerStyle: React.CSSProperties = {
    flexGrow: 1,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  };

  return (
    <div style={viewerStyle} className="bg-neutral-800 text-white w-full h-full flex flex-col">
      <ScrollContainer 
        innerRef={scrollContainerRef}
        className="flex-grow w-full overflow-auto bg-neutral-700 cursor-grab"
        draggingClassName="cursor-grabbing"
        vertical={true}
        horizontal={true}
        hideScrollbars={false}
      >
        {pdfUrl ? (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => console.error('Error while loading document!', error.message)}
            loading={<p>Loading PDF...</p>}
            error={<p>Error loading PDF. Please try again.</p>}
          >
            <div className="inline-block" ref={pageWrapperRef}>
              <Page 
                pageNumber={currentPageNumber} 
                scale={scale * 0.8}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="shadow-lg"
                onRenderSuccess={handlePageRenderSuccess}
              />
            </div>
          </Document>
        ) : (
          <p>No PDF URL provided.</p>
        )}
      </ScrollContainer>

      <div style={controlsStyle} className="bg-neutral-900 p-2 flex items-center justify-center gap-2 flex-wrap shrink-0">
        <div style={pageControlsStyle} className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={goToPreviousPage} disabled={currentPageNumber <= 1}>
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
          <span>
            Page {currentPageNumber} of {numPages || '--'}
          </span>
          <Button variant="ghost" size="icon" onClick={goToNextPage} disabled={currentPageNumber >= (numPages || 0)}>
            <ChevronRightIcon className="h-5 w-5" />
          </Button>
        </div>

        <div style={zoomControlsStyle} className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={zoomOut} disabled={scale <= 0.5 || isDownloading}>
            <ZoomOutIcon className="h-5 w-5" />
          </Button>
          <span>{(scale * 100).toFixed(0)}%</span>
          <Button variant="ghost" size="icon" onClick={zoomIn} disabled={scale >= 3.75 || isDownloading}>
            <ZoomInIcon className="h-5 w-5" />
          </Button>
        </div>
        
        <Button variant="ghost" size="icon" onClick={handleDownload} disabled={isDownloading} aria-label="Download PDF">
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