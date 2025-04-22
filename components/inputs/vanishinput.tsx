/**
 * @file vanishinput.tsx
 * @description
 * Main chat interface for Nova AI. Handles input, Voiceflow API interaction,
 * conversation display, PandaDoc PDF preview/popup integration, and document polling.
 *
 * @dependencies
 * - React, axios, next/image, react-icons, uuid
 * - ./index.css, @/components/pdf/*, @/lib/utils
 */
"use client";

import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState, useCallback } from "react"; // Added useCallback
import { IoReturnDownForwardSharp } from "react-icons/io5";
import { v4 as uuidv4 } from 'uuid';
import './index.css';
// Import the PDF components
import { PdfPopup } from '@/components/pdf/PdfPopup';
import { PdfPreview } from '@/components/pdf/PdfPreview';
import { cn } from '@/lib/utils';

/**
 * @hook useSessionUserId
 * @description Custom hook to manage a unique user ID per browser session using sessionStorage.
 * @returns {string | null} The session user ID.
 */
const useSessionUserId = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      let existingId = sessionStorage.getItem("nova-user-id");
      if (!existingId) {
        existingId = uuidv4();
        sessionStorage.setItem("nova-user-id", existingId);
        console.log("Generated new session user ID:", existingId);
      } else {
        console.log("Using existing session user ID:", existingId);
      }
      setUserId(existingId);
    } else {
      console.warn("Session storage not available.");
      // Fallback or alternative ID generation could be placed here if needed for SSR/testing
    }
  }, []);

  return userId;
};

/** Props for VanishInput */
interface VanishInputProps {
  placeholder: string;
  inputValue?: string;
  required?: boolean;
  type?: string;
  active: boolean;
  setActive: (active: boolean) => void;
  services: Array<string>;
  setServices: (services: Array<string>) => void;
}

/** Structure for conversation entries */
interface ConversationEntry {
  from: 'user' | 'ai';
  message?: string;
  image?: string;
}

/**
 * Parses message for <DOCUMENTID> tag.
 * @param {string} message - The message to parse.
 * @returns {{ text: string; documentId: string | null }} Cleaned text and document ID.
 */
const parseMessageForDocument = (message: string): { text: string; documentId: string | null } => {
  // Ensure message is a string before processing
  if (!message || typeof message !== 'string') {
    return { text: message || '', documentId: null };
  }

  // Regex pattern to match document ID tags (case-insensitive)
  const docIdRegex = /<DOCUMENTID>(.*?)<\/DOCUMENTID>/i;
  const match = message.match(docIdRegex);

  if (match && match[1]) {
    const extractedId = match[1].trim(); // Trim whitespace from ID
    console.log(`Found document ID in message: ${extractedId}`);
    return {
      text: message.replace(docIdRegex, '').trim(), // Remove the tag and trim
      documentId: extractedId,
    };
  }

  // No document ID found
  return { text: message, documentId: null };
};


/**
 * VanishInput Component
 *
 * Main chat interface: handles input, conversation, Voiceflow API, PDF integration, and polling.
 */
export const VanishInput: React.FC<VanishInputProps> = ({
  placeholder,
  inputValue = "",
  required = true,
  type = "text",
  active,
  setActive,
  services,
  setServices
}) => {
  const userId = useSessionUserId();

  // Input and focus state
  const [inputData, setInputData] = useState({ data: inputValue });
  const [isFocused, setIsFocused] = useState(false);
  // Conversation state
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false); // Track if initial launch sent

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- PDF Popup State ---
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);

  // --- PDF Popup Handlers ---
  const openPdfPopup = useCallback((docId: string) => {
    console.log(`Opening PDF popup for document: ${docId}`);
    setCurrentDocumentId(docId);
    setIsPopupOpen(true);
  }, []);

  const closePdfPopup = useCallback(() => {
    console.log("Closing PDF popup.");
    setIsPopupOpen(false);
    setCurrentDocumentId(null);
  }, []);
  // --- End PDF Popup ---

  /** Converts array to comma-separated string */
  const arrayToCommaString = (items: string[]): string => items.join(", ");

  /** Scrolls conversation to the bottom */
  const scrollToBottom = useCallback(() => {
    // Use requestAnimationFrame for smoother scrolling after DOM updates
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    });
  }, []); // No dependencies needed if it only relies on refs

  /** Handles input field changes */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData({ data: e.target.value });
  };

  /** Sends message to Voiceflow API */
  const sendMessage = useCallback(async () => {
    if (!inputData.data.trim() || !userId || loading) return; // Prevent sending if empty, no user ID, or already loading

    const userMessage = inputData.data;
    console.log(`Sending message from user ${userId}: ${userMessage}`);

    // Optimistic UI update
    setConversation(prev => [...prev, { from: 'user', message: userMessage }]);
    setInputData({ data: "" }); // Clear input
    setLoading(true); // Set loading state

    // Add temporary "thinking" message
    setConversation(prev => [...prev, { from: 'ai', message: '...Nova is writing a response' }]);
    scrollToBottom(); // Scroll after adding messages

    try {
      // Send initial launch if not done yet
      if (!initialized) {
        console.log(`Sending launch event for user ${userId}`);
        await axios.post("/api/voiceflow", { userId, actionType: "launch" });
        setInitialized(true);
      }

      // Prepare payload with services if any
      const servicesString = services.length > 0 ? `::[SERVICES BEGIN]::${arrayToCommaString(services)}` : '';
      const payload = `${userMessage}${servicesString}`;
      console.log(`Sending text event for user ${userId} with payload: ${payload}`);

      // Send text message
      const response = await axios.post("/api/voiceflow", {
        userId,
        actionType: "text",
        payload,
      });
      setServices([]); // Clear services after sending

      const steps = response.data.steps;
      console.log(`Received response from Voiceflow for user ${userId}:`, steps);

      // Parse AI responses
      const parsedAiResponses = steps.map((step: { type: string; payload?: { message?: string; image?: string } }): ConversationEntry | null => {
        if ((step.type === "speak" || step.type === "text") && step.payload?.message) {
          return { from: "ai", message: step.payload.message };
        } else if (step.type === "visual" && step.payload?.image) {
          return { from: "ai", image: step.payload.image };
        }
        return null;
      }).filter((entry: ConversationEntry | null): entry is ConversationEntry => entry !== null);

      // Update conversation: remove thinking message, add AI responses
      setConversation(prev => [
        ...prev.filter(msg => msg.message !== '...Nova is writing a response'),
        ...parsedAiResponses
      ]);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`Error sending message to Voiceflow for user ${userId}:`, errorMessage);
      setConversation(prev => [
        ...prev.filter(msg => msg.message !== '...Nova is writing a response'),
        { from: 'ai', message: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setLoading(false); // Clear loading state
      scrollToBottom(); // Scroll after final update
    }
  }, [inputData.data, userId, loading, initialized, services, setServices, scrollToBottom]); // Added dependencies

  /** Handles Enter key press */
  const handleKeyDown = useCallback(async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await sendMessage();
    }
  }, [sendMessage]); // Depends on sendMessage

  // Effect to scroll to bottom when conversation changes
  useEffect(() => {
    scrollToBottom();
  }, [conversation, scrollToBottom]); // Depend on conversation and the memoized scrollToBottom

  /** Handles input focus */
  const FocusInput = useCallback(() => {
    setIsFocused(true);
    setActive(true);
  }, [setActive]); // Depends on setActive

  /** Handles input blur */
  const BlurInput = useCallback(() => {
    setIsFocused(false);
    // Keep chat active on blur
  }, []);

  // --- Document Polling ---
  const checkForPendingDocuments = useCallback(async () => {
    if (!userId) return; // Don't poll if userId isn't set

    console.log(`Polling for pending documents for user ${userId}...`);
    try {
      const response = await axios.get(`/api/plan?userID=${userId}`);
      const { pendingDocument } = response.data;

      if (pendingDocument?.documentID) {
        console.log(`Found pending document ${pendingDocument.documentID} for user ${userId}. Adding to chat.`);
        // Format message with standard tags
        const documentMessage = `${pendingDocument.text || 'Here is your document:'} <DOCUMENTID>${pendingDocument.documentID}</DOCUMENTID>`;

        // Add the document message from AI to the conversation
        setConversation(prev => [
          ...prev,
          { from: 'ai', message: documentMessage }
        ]);
        scrollToBottom(); // Scroll to show the new message
      } else {
        // console.log(`No pending documents found for user ${userId}.`); // Optional: reduce log noise
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Error checking for pending documents for user ${userId}:`, errorMessage);
    }
  }, [userId, scrollToBottom]); // Depends on userId and scrollToBottom

  // Effect for polling initialization and interval
  useEffect(() => {
    // Only start polling once userId is available and the chat has been initialized (first message sent/received)
    if (!userId || !initialized) return;

    console.log(`Initializing document polling for user ${userId}.`);
    // Check immediately once initialized
    checkForPendingDocuments();

    // Set up polling interval (e.g., every 5 seconds)
    const intervalId = setInterval(checkForPendingDocuments, 5000);
    console.log(`Polling interval set for user ${userId} (ID: ${intervalId})`);

    // Cleanup function to clear the interval when the component unmounts or dependencies change
    return () => {
      console.log(`Clearing polling interval for user ${userId} (ID: ${intervalId})`);
      clearInterval(intervalId);
    };
  }, [userId, initialized, checkForPendingDocuments]); // Dependencies for the polling effect
  // --- End Document Polling ---


  // Render null if userId isn't ready yet
  if (!userId) return null;

  return (
    <div className={cn(`relative py-8 parent`, active ? 'chat-active' : '')}>
      {/* Conversation Area */}
      <div
        ref={scrollContainerRef}
        className={cn(
          "mt-6 space-y-3 px-4 custom-scroll overflow-y-auto",
          active ? "max-h-[60vh] lg:max-h-[65vh]" : "max-h-[200px] lg:max-h-[250px]", // Dynamic height
          "transition-[max-height] duration-500 ease-in-out" // Smooth transition
        )}
        aria-live="polite" // Announce new messages
      >
        {conversation.map((entry, idx) => {
          // Parse AI messages for document ID
          const parsedMessage = entry.from === 'ai' && entry.message
            ? parseMessageForDocument(entry.message)
            : { text: entry.message || '', documentId: null };

          return (
            <div key={`msg-${idx}-${entry.from}`} className={`flex ${entry.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={cn(
                `inline-block p-2 px-3 rounded-lg max-w-[85%] lg:max-w-[75%] break-words shadow-sm`, // Added shadow
                entry.from === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'
              )}>
                {/* Render cleaned message text */}
                {parsedMessage.text && <p>{parsedMessage.text}</p>}

                {/* Render images if present */}
                {entry.image && (
                  <div className="mt-2">
                    <Image src={entry.image} alt="AI visual response" width={300} height={200} className="rounded-md" />
                  </div>
                )}

                {/* Render PdfPreview if documentId exists */}
                {parsedMessage.documentId && (
                  <PdfPreview
                    documentId={parsedMessage.documentId}
                    onClick={openPdfPopup}
                    className="mt-2" // Add margin top for spacing
                  />
                )}
              </div>
            </div>
          );
        })}
        {/* Empty div for scrolling reference */}
        <div ref={conversationEndRef} style={{ height: '1px' }} />
      </div>

      {/* Input Area */}
      <div className="flex justify-center w-full relative mt-8 px-4">
        <input
          ref={inputRef}
          onFocus={FocusInput}
          onBlur={BlurInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={inputData.data}
          required={required}
          type={type}
          placeholder={loading ? "Nova is thinking..." : (conversation.length === 0 ? placeholder : "Type your message...")}
          className={cn(
            `placeholder-white/60 text-center w-full max-w-[600px] text-[16px] lg:text-[18px]`,
            `py-3 px-4 text-white outline-none bg-transparent`,
            `border-b-2 transition-all duration-300 ease-in-out`, // Added transition
            isFocused ? 'border-white' : 'border-white/30',
            // Style change when conversation active
            active && conversation.length > 0 && 'bg-white/5 rounded-t-lg border-b-0 text-left pl-4', // Adjusted style
            loading && 'opacity-70 cursor-not-allowed' // Style when loading
          )}
          disabled={loading} // Disable input while loading
          aria-label="Chat input"
        />
      </div>

      {/* Send Button Area */}
      <div
        className={cn(
          "flex justify-center items-center gap-4 py-4 lg:py-8 cursor-pointer duration-300 transition-all",
          loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:opacity-90" // Loading/hover states
        )}
        onClick={!loading ? sendMessage : undefined} // Clickable only if not loading
        role="button" // Semantics
        aria-disabled={loading} // Accessibility
        tabIndex={loading ? -1 : 0} // Keyboard accessibility
        onKeyDown={(e) => { if (e.key === 'Enter' && !loading) sendMessage(); }} // Allow Enter key on button
      >
        <div className="bg-text-secondary/30 leading-normal text-[18px] w-[32px] h-[32px] relative rounded-md flex items-center justify-center">
          <IoReturnDownForwardSharp className="text-white" />
        </div>
        <p className="text-[14px] lg:text-[18px] text-white uppercase mt-1">to send</p>
      </div>

      {/* Render PdfPopup (conditionally rendered based on isPopupOpen) */}
      <PdfPopup
        isOpen={isPopupOpen}
        documentId={currentDocumentId}
        onClose={closePdfPopup}
      />
    </div>
  );
};