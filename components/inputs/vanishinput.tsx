/**
 * @file vanishinput.tsx
 * @description
 * This component provides the main chat interface for the Nova AI assistant.
 * It handles user input, sends messages to the Voiceflow API, displays the conversation history,
 * and manages the state for the integrated PandaDoc PDF viewer popup.
 *
 * Key features:
 * - User input field with focus/blur handling.
 * - Sends user messages to the Voiceflow API via `/api/voiceflow`.
 * - Displays conversation history between user and AI (Nova).
 * - Detects PandaDoc document IDs in AI responses and prepares for rendering previews.
 * - Manages the open/closed state of the PDF popup modal.
 * - Uses a unique session-based user ID for Voiceflow interactions.
 *
 * @dependencies
 * - React (useState, useEffect, useRef): For state management, side effects, and DOM references.
 * - axios: For making HTTP requests to the backend API.
 * - next/image: For optimized image rendering (used for AI visual responses).
 * - react-icons/io5: For the send icon.
 * - uuid: For generating unique session user IDs.
 * - ./index.css: For custom scrollbar styling.
 * - @/components/pdf/PdfPreview: Component for the clickable PDF icon (to be added in next step).
 * - @/components/pdf/PdfPopup: Component for the PDF modal (to be added in next step).
 *
 * @notes
 * - The component uses a custom hook `useSessionUserId` to manage a unique ID per browser session.
 * - Message parsing for `<DOCUMENTID>` tags and rendering of `PdfPreview`/`PdfPopup` will be implemented in the next step.
 * - Error handling for API calls is included.
 * - Conversation scrolling automatically scrolls to the bottom on new messages.
 */
"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import { IoReturnDownForwardSharp } from "react-icons/io5";
import './index.css';
import { v4 as uuidv4 } from 'uuid';
// PdfPreview and PdfPopup will be imported and used in the next step
// import { PdfPreview } from '@/components/pdf/PdfPreview';
// import { PdfPopup } from '@/components/pdf/PdfPopup';

/**
 * @hook useSessionUserId
 * @description Custom hook to get or create a unique user ID stored in session storage.
 * This ensures that the Voiceflow session persists across page refreshes within the same browser tab/session.
 * @returns {string | null} The unique user ID for the current session, or null if not yet initialized.
 */
const useSessionUserId = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check if running in a browser environment
    if (typeof window !== 'undefined' && window.sessionStorage) {
      let existingId = sessionStorage.getItem("nova-user-id");
      if (!existingId) {
        existingId = uuidv4();
        sessionStorage.setItem("nova-user-id", existingId);
      }
      setUserId(existingId);
    } else {
      // Handle server-side rendering or environments without sessionStorage
      // Potentially generate a temporary ID or handle appropriately
      console.warn("Session storage not available. Using temporary ID logic if needed.");
      // setUserId(uuidv4()); // Example: Generate a temporary ID if needed, but be aware of SSR implications
    }
  }, []);

  return userId;
};

/**
 * Props interface for the VanishInput component.
 */
interface VanishInputProps {
  /** Placeholder text for the input field. */
  placeholder: string;
  /** Initial value for the input field (optional). */
  inputValue?: string;
  /** Whether the input field is required (optional, defaults to true). */
  required?: boolean;
  /** Input field type (optional, defaults to "text"). */
  type?: string;
  /** Boolean indicating if the chat interface is active/expanded. */
  active: boolean;
  /** Function to set the active state of the chat interface. */
  setActive: (active: boolean) => void;
  /** Array of selected service strings to be sent with the next message. */
  services: Array<string>;
  /** Function to update the selected services array. */
  setServices: (services: Array<string>) => void;
}

/**
 * ConversationEntry interface defines the structure for each message in the conversation history.
 */
interface ConversationEntry {
  from: 'user' | 'ai';
  message?: string;
  image?: string;
  documentId?: string; // Existing field for old iframe logic (to be potentially removed/refactored)
}

/**
 * VanishInput Component
 *
 * The main chat interface component.
 *
 * @param {VanishInputProps} props - The component props.
 * @returns {JSX.Element | null} The rendered chat interface, or null if userId is not available.
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

  // State for the input field's value
  const [inputData, setInputData] = useState({ data: inputValue });
  // State to track if the input field is focused
  const [isFocused, setIsFocused] = useState(false);
  // State to control the visibility of the blinking caret
  const [showCaret, setShowCaret] = useState(true);
  // State to store the conversation history
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  // State to indicate if the AI is currently responding
  const [loading, setLoading] = useState(false);
  // State to track if the initial Voiceflow launch message has been sent
  const [initialized, setInitialized] = useState(false);

  // Refs for DOM elements
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null); // Ref to scroll to the end of the conversation
  const scrollContainerRef = useRef<HTMLDivElement>(null); // Ref for the scrollable conversation area

  // --- State for PDF Popup ---
  /** State to control the visibility of the PDF popup modal. */
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  /** State to store the document ID currently being viewed in the popup. */
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);

  // --- Handlers for PDF Popup ---
  /**
   * Opens the PDF popup modal.
   * @param {string} docId - The ID of the document to display.
   */
  const openPdfPopup = (docId: string) => {
    setCurrentDocumentId(docId);
    setIsPopupOpen(true);
  };

  /**
   * Closes the PDF popup modal.
   */
  const closePdfPopup = () => {
    setIsPopupOpen(false);
    setCurrentDocumentId(null); // Clear the document ID when closing
  };
  // --- End PDF Popup State and Handlers ---


  /**
   * Converts an array of strings into a single comma-separated string.
   * Used to pass selected services to the Voiceflow API.
   * @param {string[]} items - The array of strings.
   * @returns {string} A comma-separated string.
   */
  function arrayToCommaString(items: string[]): string {
    return items.join(", ");
  }

  /**
   * Scrolls the conversation container to the bottom.
   */
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  /**
   * Handles changes in the input field.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData({ data: e.target.value });
  };

  /**
   * Sends the user's message to the Voiceflow API and updates the conversation.
   */
  const sendMessage = async () => {
    if (!inputData.data.trim() || !userId) return; // Ensure userId is available

    const userMessage = inputData.data;
    // Add user message to conversation
    setConversation(prev => [...prev, { from: 'user', message: userMessage }]);
    setInputData({ data: "" }); // Clear input field
    setLoading(true); // Show loading indicator
    // Add temporary AI thinking message
    setConversation(prev => [...prev, { from: 'ai', message: '...Nova is writing a response' }]);

    try {
      // Send initial launch message if not already done
      if (!initialized) {
        await axios.post("/api/voiceflow", {
          userId,
          actionType: "launch"
        });
        setInitialized(true);
      }

      // Send the user's text message along with any selected services
      const response = await axios.post("/api/voiceflow", {
        userId,
        actionType: "text",
        payload: userMessage + '::[SERVICES BEGIN]::' + arrayToCommaString(services),
      });
      setServices([]); // Clear selected services after sending

      const steps = response.data.steps;

      // Parse the steps from the Voiceflow response
      const parsed = steps.map((step: any): ConversationEntry | null => {
        if ((step.type === "speak" || step.type === "text") && step.payload?.message) {
          const message = step.payload.message;

          // --- Existing Document ID Handling (for old iframe logic) ---
          // This part might be refactored or removed in the next step when PdfPreview is integrated.
          const match = message.match(/<DOCUMENTID>(.*?)<\/DOCUMENTID>/);
          if (match && match[1]) {
            // For now, keep the old structure until parsing logic is fully moved
            return { from: "ai", documentId: match[1], message: message.replace(/<DOCUMENTID>.*?<\/DOCUMENTID>/, '').trim() }; // Keep cleaned message too
          }
          // --- End Existing Document ID Handling ---

          return { from: "ai", message };
        } else if (step.type === "visual" && step.payload?.image) {
          return { from: "ai", image: step.payload.image };
        }
        return null; // Ignore other step types or steps without relevant payload
      }).filter((entry): entry is ConversationEntry => entry !== null); // Filter out null entries and assert type

      // Update conversation: remove thinking message and add parsed AI responses
      setConversation(prev => [
        ...prev.filter(msg => msg.message !== '...Nova is writing a response'),
        ...parsed
      ]);
    } catch (err) {
      console.error("Error sending message:", err);
      // Update conversation: remove thinking message and add error message
      setConversation(prev => [
        ...prev.filter(msg => msg.message !== '...Nova is writing a response'),
        { from: 'ai', message: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  /**
   * Handles the Enter key press in the input field to send the message.
   * @param {React.KeyboardEvent<HTMLInputElement>} e - The keyboard event.
   */
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission behavior
      await sendMessage();
    }
  };

  // Effect to manage the blinking caret visibility
  useEffect(() => {
    if (isFocused || inputData.data.length === 0) {
      const interval = setInterval(() => {
        setShowCaret((prev) => !prev);
      }, 600); // Standard caret blink interval
      return () => clearInterval(interval); // Cleanup interval on unmount or state change
    } else {
      setShowCaret(false); // Hide caret when input is not focused and has text
    }
  }, [isFocused, inputData.data]);

  // Effect to scroll to the bottom whenever the conversation updates
  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  /**
   * Handles the input field focus event.
   * Sets focus state and activates/expands the chat interface.
   */
  const FocusInput = () => {
    setIsFocused(true);
    setActive(true); // Expand chat on focus
  };

  /**
   * Handles the input field blur event.
   * Clears focus state but keeps the chat interface active/expanded.
   */
  const BlurInput = () => {
    setIsFocused(false);
    // setActive(true); // Keep active even on blur, user might be interacting with conversation
  };

  // Render null if userId hasn't been initialized yet
  if (!userId) return null;

  return (
    <div className={`relative py-8 parent`}>
      {/* Conversation Area */}
      <div ref={scrollContainerRef} className="mt-6 max-h-[320px] lg:max-h-[680px] overflow-y-scroll space-y-3 px-4 custom-scroll">
        {conversation.map((entry, idx) => (
          <div key={`${entry.from}-${idx}`} className={`flex ${entry.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`inline-block p-2 px-3 rounded-lg max-w-[85%] lg:max-w-[75%] break-words ${
              entry.from === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'
            }`}>
              {/* Render message text */}
              {entry.message && <p>{entry.message}</p>}

              {/* Render images if present */}
              {entry.image && (
                <div className="mt-2">
                  <Image src={entry.image} alt="AI visual response" width={300} height={200} className="rounded-md" />
                </div>
              )}

              {/* --- Existing iFrame Rendering (To be replaced) --- */}
              {/* This section renders the PDF directly in an iframe based on the old logic.
                  It will be replaced by the PdfPreview component in the next step. */}
              {entry.documentId && !entry.message && ( // Only render iframe if no message text (old logic assumption)
                <div className="mt-4 border border-white/20 rounded-lg overflow-hidden bg-white/5 p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-white text-sm font-medium">📄 Nova has shared a document with you:</p>
                    <a
                      href={`/api/pandadoc?documentId=${entry.documentId}`}
                      download={`document-${entry.documentId}.pdf`} // Add download attribute
                      target="_blank" // Open in new tab for safety/convenience
                      rel="noopener noreferrer"
                      className="text-blue-300 text-sm hover:underline"
                    >
                      Download PDF
                    </a>
                  </div>
                  <iframe
                    src={`/api/pandadoc?documentId=${entry.documentId}`}
                    title={`PDF Document Viewer - ${entry.documentId}`} // Add title for accessibility
                    width="100%"
                    height="500px" // Fixed height, consider responsiveness
                    className="w-full border border-white/10 rounded"
                    // sandbox="allow-scripts allow-same-origin" // Consider sandbox attributes for security
                  />
                </div>
              )}
              {/* --- End Existing iFrame Rendering --- */}

              {/* --- Placeholder for PdfPreview (Next Step) --- */}
              {/* {parsedMessage.documentId && (
                <PdfPreview
                  documentId={parsedMessage.documentId}
                  onClick={openPdfPopup}
                  className="ml-2 align-middle" // Example styling
                />
              )} */}
              {/* --- End Placeholder --- */}
            </div>
          </div>
        ))}
        {/* Empty div at the end to help with scrolling */}
        <div ref={conversationEndRef} />
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
          placeholder={conversation.length === 0 ? placeholder : "Type your message..."} // More specific placeholder after conversation starts
          className={`placeholder-white/60 text-center w-full max-w-[600px] text-[16px] lg:text-[18px] py-3 px-4 text-white outline-none bg-transparent border-b-2 ${isFocused ? 'border-white' : 'border-white/30'} transition-colors duration-300 ${conversation.length > 0 && 'bg-white/5 rounded-t-lg border-b-0'}`} // Style adjustments
          disabled={loading} // Disable input while AI is responding
        />
        {/* Blinking caret simulation (optional, consider CSS caret-color) */}
        {/* {showCaret && isFocused && <span className="absolute right-[calc(50%-290px)] top-1/2 transform -translate-y-1/2 h-5 w-px bg-white animate-blink"></span>} */}
      </div>

      {/* Send Button Area */}
      <div className="flex justify-center items-center gap-4 py-4 lg:py-8 hover:scale-105 cursor-pointer duration-300 transition-all" onClick={sendMessage}>
        <div className="bg-text-secondary/30 leading-normal text-[18px] w-[32px] h-[32px] relative rounded-md flex items-center justify-center">
          <IoReturnDownForwardSharp className="text-white" />
        </div>
        <p className="text-[14px] lg:text-[18px] text-white uppercase mt-1">to send</p>
      </div>

      {/* --- Placeholder for PdfPopup Rendering (Next Step) --- */}
      {/* <PdfPopup
        isOpen={isPopupOpen}
        documentId={currentDocumentId}
        onClose={closePdfPopup}
      /> */}
      {/* --- End Placeholder --- */}
    </div>
  );
};

// Helper animation class for caret (if not using CSS caret-color)
// Add this to your globals.css or a relevant CSS file if needed:
/*
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.animate-blink {
  animation: blink 1.2s step-end infinite;
}
*/