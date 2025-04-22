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
 * - Detects PandaDoc document IDs (`<DOCUMENTID>...</DOCUMENTID>`) in AI responses.
 * - Renders a clickable `PdfPreview` icon for detected documents.
 * - Manages the open/closed state of the `PdfPopup` modal for viewing PDFs.
 * - Uses a unique session-based user ID for Voiceflow interactions.
 *
 * @dependencies
 * - React (useState, useEffect, useRef): For state management, side effects, and DOM references.
 * - axios: For making HTTP requests to the backend API.
 * - next/image: For optimized image rendering (used for AI visual responses).
 * - react-icons/io5: For the send icon.
 * - uuid: For generating unique session user IDs.
 * - ./index.css: For custom scrollbar styling.
 * - @/components/pdf/PdfPreview: Component for the clickable PDF icon.
 * - @/components/pdf/PdfPopup: Component for the PDF modal.
 * - @/lib/utils: For the `cn` utility function.
 *
 * @notes
 * - The component uses a custom hook `useSessionUserId` to manage a unique ID per browser session.
 * - Error handling for API calls is included.
 * - Conversation scrolling automatically scrolls to the bottom on new messages.
 * - PDF document ID parsing relies on the specific format `<DOCUMENTID>...</DOCUMENTID>`.
 */
"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import { IoReturnDownForwardSharp } from "react-icons/io5";
import './index.css';
import { v4 as uuidv4 } from 'uuid';
// Import the new PDF components
import { PdfPreview } from '@/components/pdf/PdfPreview';
import { PdfPopup } from '@/components/pdf/PdfPopup';
import { cn } from '@/lib/utils'; // Ensure cn is imported

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
      console.warn("Session storage not available. Using temporary ID logic if needed.");
      // Example: Generate a temporary ID if needed, but be aware of SSR implications
      // setUserId(uuidv4());
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
}

/**
 * Parses a message string to find and extract a PandaDoc document ID
 * enclosed in <DOCUMENTID> tags.
 * @param {string} message - The message string to parse.
 * @returns {{ text: string; documentId: string | null }} An object containing the cleaned message text
 *          (tags removed) and the extracted document ID, or null if no ID was found.
 */
const parseMessageForDocument = (message: string): { text: string; documentId: string | null } => {
  // Regular expression to find the document ID tag and capture its content
  const docIdRegex = /<DOCUMENTID>(.*?)<\/DOCUMENTID>/;
  const match = message.match(docIdRegex);

  if (match && match[1]) {
    // Found a document ID
    return {
      text: message.replace(docIdRegex, '').trim(), // Remove the tag and trim whitespace
      documentId: match[1], // Return the extracted ID
    };
  }

  // No document ID found
  return { text: message, documentId: null };
};


/**
 * VanishInput Component
 *
 * The main chat interface component. Handles user input, conversation display,
 * Voiceflow API interaction, and PDF preview/popup integration.
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
  // State to control the visibility of the blinking caret (optional, CSS preferred)
  const [showCaret, setShowCaret] = useState(true);
  // State to store the conversation history
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  // State to indicate if the AI is currently responding
  const [loading, setLoading] = useState(false);
  // State to track if the initial Voiceflow launch message has been sent
  const [initialized, setInitialized] = useState(false);

  // Refs for DOM elements
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null); // Ref to scroll to the end
  const scrollContainerRef = useRef<HTMLDivElement>(null); // Ref for the scrollable area

  // --- State for PDF Popup ---
  /** State to control the visibility of the PDF popup modal. */
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  /** State to store the document ID currently being viewed in the popup. */
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);

  // --- Handlers for PDF Popup ---
  /**
   * Opens the PDF popup modal and sets the current document ID.
   * @param {string} docId - The ID of the document to display.
   */
  const openPdfPopup = (docId: string) => {
    setCurrentDocumentId(docId);
    setIsPopupOpen(true);
  };

  /**
   * Closes the PDF popup modal and clears the current document ID.
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
   * Scrolls the conversation container to the bottom smoothly.
   * Uses setTimeout to ensure scrolling happens after DOM updates.
   */
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      // Use setTimeout to defer execution until after the render cycle
      setTimeout(() => {
        if (scrollContainerRef.current) {
           scrollContainerRef.current.scrollTo({
             top: scrollContainerRef.current.scrollHeight,
             behavior: 'smooth' // Use smooth scrolling
           });
        }
      }, 0);
    }
  };

  /**
   * Handles changes in the input field, updating the inputData state.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData({ data: e.target.value });
  };

  /**
   * Sends the user's message to the Voiceflow API, updates the conversation state,
   * handles loading indicators, and processes the AI's response.
   */
  const sendMessage = async () => {
    // Prevent sending empty messages or if userId is not yet available
    if (!inputData.data.trim() || !userId) return;

    const userMessage = inputData.data;
    // Add user message optimistically to the conversation
    setConversation(prev => [...prev, { from: 'user', message: userMessage }]);
    setInputData({ data: "" }); // Clear input field immediately
    setLoading(true); // Show loading state

    // Add a temporary "thinking" message from the AI
    const thinkingMessageId = `ai-thinking-${Date.now()}`; // Unique key/id
    setConversation(prev => [...prev, { from: 'ai', message: '...Nova is writing a response' }]);

    try {
      // Send initial launch message if this is the first interaction
      if (!initialized) {
        await axios.post("/api/voiceflow", {
          userId,
          actionType: "launch"
        });
        setInitialized(true); // Mark as initialized
      }

      // Send the user's text message, including any selected services
      const response = await axios.post("/api/voiceflow", {
        userId,
        actionType: "text",
        // Append selected services in a structured way for Voiceflow to parse
        payload: `${userMessage}::[SERVICES BEGIN]::${arrayToCommaString(services)}`,
      });
      setServices([]); // Clear selected services after they've been sent

      const steps = response.data.steps;

      // Parse the steps from the Voiceflow response into ConversationEntry format
      const parsedAiResponses = steps.map((step: any): ConversationEntry | null => {
        if ((step.type === "speak" || step.type === "text") && step.payload?.message) {
          // Message content will be parsed for document ID during rendering
          return { from: "ai", message: step.payload.message };
        } else if (step.type === "visual" && step.payload?.image) {
          // Handle image responses
          return { from: "ai", image: step.payload.image };
        }
        return null; // Ignore other step types
      }).filter((entry): entry is ConversationEntry => entry !== null); // Filter out nulls and assert type

      // Update conversation: remove the "thinking" message and add the actual AI responses
      setConversation(prev => [
        ...prev.filter(msg => msg.message !== '...Nova is writing a response'), // Remove thinking message
        ...parsedAiResponses // Add new AI messages
      ]);

    } catch (err) {
      console.error("Error sending message:", err);
      // Update conversation on error: remove thinking message and add an error message
      setConversation(prev => [
        ...prev.filter(msg => msg.message !== '...Nova is writing a response'),
        { from: 'ai', message: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setLoading(false); // Hide loading state regardless of success or error
    }
  };

  /**
   * Handles the Enter key press in the input field to trigger sendMessage.
   * @param {React.KeyboardEvent<HTMLInputElement>} e - The keyboard event.
   */
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission behavior
      await sendMessage(); // Send the message
    }
  };

  // Effect to manage the blinking caret visibility (optional, CSS preferred)
  useEffect(() => {
    // Show caret if focused or if input is empty
    if (isFocused || inputData.data.length === 0) {
      const interval = setInterval(() => {
        setShowCaret((prev) => !prev);
      }, 600); // Standard caret blink interval
      return () => clearInterval(interval); // Cleanup interval
    } else {
      setShowCaret(false); // Hide caret when input has text and is not focused
    }
  }, [isFocused, inputData.data]);

  // Effect to scroll to the bottom whenever the conversation updates
  useEffect(() => {
    scrollToBottom();
  }, [conversation]); // Dependency array includes conversation state

  /**
   * Handles the input field focus event.
   * Sets focus state and activates/expands the chat interface.
   */
  const FocusInput = () => {
    setIsFocused(true);
    setActive(true); // Expand chat interface when input is focused
  };

  /**
   * Handles the input field blur event.
   * Clears focus state. Keeps the chat interface active.
   */
  const BlurInput = () => {
    setIsFocused(false);
    // Keep chat active even on blur, user might be interacting with conversation history
    // setActive(true);
  };

  // Render null if userId hasn't been initialized yet (prevents API calls with no ID)
  if (!userId) return null;

  return (
    <div className={cn(`relative py-8 parent`, active ? 'chat-active' : '')}> {/* Add class based on active state */}
      {/* Conversation Area */}
      <div
        ref={scrollContainerRef}
        className={cn(
          "mt-6 space-y-3 px-4 custom-scroll overflow-y-auto",
          // Adjust max-height based on active state for smooth transition
          active ? "max-h-[60vh] lg:max-h-[65vh]" : "max-h-[200px] lg:max-h-[250px]",
          "transition-[max-height] duration-500 ease-in-out" // Smooth transition for height change
        )}
      >
        {conversation.map((entry, idx) => {
          // Parse AI messages for document ID during rendering
          const parsedMessage = entry.from === 'ai' && entry.message
            ? parseMessageForDocument(entry.message)
            : { text: entry.message || '', documentId: null };

          // --- REMOVED Temporary Testing Code Block ---
          // The block that forced a documentId for idx === 1 is removed.

          return (
            <div key={`${entry.from}-${idx}-${parsedMessage.documentId || 'no-doc'}`} className={`flex ${entry.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={cn(
                `inline-block p-2 px-3 rounded-lg max-w-[85%] lg:max-w-[75%] break-words`,
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
                    className="ml-2 align-middle" // Basic styling for positioning
                  />
                )}
              </div>
            </div>
          );
        })}
        {/* Empty div at the end to help ensure the last message is fully visible when scrolling */}
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
          placeholder={conversation.length === 0 ? placeholder : "Type your message..."}
          className={cn(
            `placeholder-white/60 text-center w-full max-w-[600px] text-[16px] lg:text-[18px]`,
            `py-3 px-4 text-white outline-none bg-transparent`,
            `border-b-2 transition-colors duration-300`,
            isFocused ? 'border-white' : 'border-white/30',
            // Apply different style when conversation has started and input is active
            active && conversation.length > 0 && 'bg-white/5 rounded-t-lg border-b-0'
          )}
          disabled={loading} // Disable input while AI is responding
        />
        {/* Optional: Blinking caret simulation (CSS preferred: caret-color: white;) */}
        {/* {showCaret && isFocused && <span className="absolute right-[calc(50%-290px)] top-1/2 transform -translate-y-1/2 h-5 w-px bg-white animate-blink"></span>} */}
      </div>

      {/* Send Button Area */}
      <div
        className={cn(
          "flex justify-center items-center gap-4 py-4 lg:py-8 cursor-pointer duration-300 transition-all",
          loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105" // Dim and disable cursor when loading
        )}
        onClick={!loading ? sendMessage : undefined} // Only allow click if not loading
        aria-disabled={loading} // Accessibility attribute for disabled state
      >
        <div className="bg-text-secondary/30 leading-normal text-[18px] w-[32px] h-[32px] relative rounded-md flex items-center justify-center">
          <IoReturnDownForwardSharp className="text-white" />
        </div>
        <p className="text-[14px] lg:text-[18px] text-white uppercase mt-1">to send</p>
      </div>

      {/* Render PdfPopup conditionally */}
      <PdfPopup
        isOpen={isPopupOpen}
        documentId={currentDocumentId}
        onClose={closePdfPopup}
      />
    </div>
  );
};

// Optional: Add CSS for the blinking caret if not using caret-color
/*
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.animate-blink {
  animation: blink 1.2s step-end infinite;
}
*/

// Optional: Add CSS for chat active state transitions if needed
/*
.chat-active {
  // Styles for when the chat is expanded
}
*/