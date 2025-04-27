/**
 * @file vanishinput.tsx
 * @description
 * Main chat interface for Nova AI. Handles input, Voiceflow API interaction,
 * conversation display, PandaDoc PDF preview/popup integration, and Pusher real-time notifications.
 *
 * @dependencies
 * - React, axios, next/image, react-icons, uuid, pusher-js
 * - ./index.css, @/components/pdf/*, @/lib/utils
 */
"use client";

import { PdfPreview } from '@/components/pdf/PdfPreview';
import { cn } from '@/lib/utils';
import axios from "axios";
import Image from "next/image";
import Pusher from 'pusher-js'; // Import Pusher client library
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoReturnDownForwardSharp } from "react-icons/io5";
import { v4 as uuidv4 } from 'uuid';
import './index.css'; // Keep for scrollbar styles, remove bubble styles later if needed

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
  pdfUrl?: string;
}


/**
 * VanishInput Component
 *
 * Main chat interface: handles input, conversation, Voiceflow API, PDF integration, and Pusher notifications.
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
  const [inputData, setInputData] = useState({ data: inputValue });
  const [isFocused, setIsFocused] = useState(false);
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null); // Ref for input area container
  const pusherClientRef = useRef<Pusher | null>(null); // Ref to hold the Pusher client instance

  const arrayToCommaString = (items: string[]): string => items.join(", ");

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData({ data: e.target.value });
  };

  const sendMessage = useCallback(async () => {
    if (!inputData.data.trim() || !userId || loading) return;

    const userMessage = inputData.data;
    console.log(`Sending message from user ${userId}: ${userMessage}`);
    setConversation(prev => [...prev, { from: 'user', message: userMessage }]);
    setInputData({ data: "" });
    setLoading(true);
    setConversation(prev => [...prev, { from: 'ai', message: '...Nova is writing a response' }]);
    scrollToBottom();

    try {
      if (!initialized) {
        console.log(`Sending launch event for user ${userId}`);
        await axios.post("/api/voiceflow", { userId, actionType: "launch" });
        setInitialized(true); // Set initialized *after* successful launch
      }

      const servicesString = services.length > 0 ? `::[SERVICES BEGIN]::${arrayToCommaString(services)}` : '';
      const payload = `${userMessage}${servicesString}`;
      console.log(`Sending text event for user ${userId} with payload: ${payload}`);
      const response = await axios.post("/api/voiceflow", { userId, actionType: "text", payload });
      setServices([]);

      const steps = response.data.steps;
      console.log(`Received response from Voiceflow for user ${userId}:`, steps);

      // Process responses and deduplicate PDFs
      const parsedAiResponses = steps.map((step: { type: string; payload?: { message?: string; image?: string } }): ConversationEntry | null => {
        if ((step.type === "speak" || step.type === "text") && step.payload?.message) {
          // Extract PDF URL if present in message
          const docUrlMatch = step.payload.message.match(/<DOCUMENTID>(.*?)<\/DOCUMENTID>/);
          if (docUrlMatch && docUrlMatch[1]) {
            const pdfUrl = docUrlMatch[1];
            // Add timestamp to URL for uniqueness
            const urlWithId = `${pdfUrl}${pdfUrl.includes('?') ? '&' : '?'}t=${Date.now()}`;
            return { from: "ai", message: 'Here is your PDF for review:', pdfUrl: urlWithId };
          }
          return { from: "ai", message: step.payload.message };
        } else if (step.type === "visual" && step.payload?.image) {
          return { from: "ai", image: step.payload.image };
        }
        return null;
      }).filter((entry: ConversationEntry | null): entry is ConversationEntry => entry !== null);

      // Update conversation with deduplication
      setConversation(prev => {
        const newEntries = parsedAiResponses.filter((newEntry: ConversationEntry) => {
          // If this entry has a PDF URL, check for duplicates
          if (newEntry.pdfUrl) {
            const baseURL = newEntry.pdfUrl.split('?')[0];
            const urlExists = prev.some(existingEntry =>
              existingEntry.pdfUrl && existingEntry.pdfUrl.split('?')[0] === baseURL
            );
            if (urlExists) {
              console.log(`Prevented duplicate PDF from Voiceflow response: ${baseURL}`);
              return false;
            }
          }
          return true;
        });

        return [
          ...prev.filter(msg => msg.message !== '...Nova is writing a response'),
          ...newEntries
        ];
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`Error sending message to Voiceflow for user ${userId}:`, errorMessage);
      setConversation(prev => [
        ...prev.filter(msg => msg.message !== '...Nova is writing a response'),
        { from: 'ai', message: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  }, [inputData.data, userId, loading, initialized, services, setServices, scrollToBottom]);

  const handleKeyDown = useCallback(async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await sendMessage();
    }
  }, [sendMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation, scrollToBottom]);

  const FocusInput = useCallback(() => {
    setIsFocused(true);
    setActive(true);
  }, [setActive]);

  const BlurInput = useCallback(() => {
    setIsFocused(false);
  }, []);

  // --- Pusher Connection Effect ---
  useEffect(() => {
    // Only proceed if userId is available
    if (!userId) {
      console.log("Pusher: Waiting for userId...");
      return;
    }

    // Ensure environment variables are present
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!pusherKey || !pusherCluster) {
      console.error("Pusher Error: NEXT_PUBLIC_PUSHER_KEY or NEXT_PUBLIC_PUSHER_CLUSTER is not defined in environment variables.");
      return; // Don't attempt to connect without keys
    }

    // Avoid reconnecting if already connected
    if (pusherClientRef.current) {
      console.log("Pusher: Already connected.");
      return;
    }

    // Track processed document URLs using a ref to persist across rerenders
    const processedDocumentURLs = new Set<string>();

    console.log("Pusher: Initializing connection...");
    try {
      const pusherClient = new Pusher(pusherKey, {
        cluster: pusherCluster,
        // encrypted: true, // default is true for TLS
      });
      pusherClientRef.current = pusherClient; // Store the instance

      const channelName = `user-${userId}`;
      console.log(`Pusher: Subscribing to channel: ${channelName}`);
      const channel = pusherClient.subscribe(channelName);

      // --- Bind Event Handlers ---
      channel.bind('document-ready', (data: { documentURL: string }) => {
        console.log(`Pusher: Received document-ready event for user ${userId}:`, data);
        if (data.documentURL) {
          // Get base URL without query parameters
          const baseURL = data.documentURL.split('?')[0];

          // Check if we've already processed this document
          if (!processedDocumentURLs.has(baseURL)) {
            processedDocumentURLs.add(baseURL);

            // Add a timestamp to URL to ensure uniqueness if needed
            const urlWithId = `${data.documentURL}${data.documentURL.includes('?') ? '&' : '?'}t=${Date.now()}`;

            // Update conversation state with deduplication check
            setConversation(prev => {
              // Check if we already have this document in the conversation
              const urlExists = prev.some(entry =>
                entry.pdfUrl && entry.pdfUrl.split('?')[0] === baseURL
              );

              if (urlExists) {
                console.log(`Prevented duplicate PDF: ${baseURL}`);
                return prev; // Don't add duplicate
              }

              return [
                ...prev,
                { from: 'ai', message: 'Here is your PDF for review:', pdfUrl: urlWithId }
              ];
            });

            // Ensure scroll happens after state update
            scrollToBottom();
          } else {
            console.log(`Skipped duplicate document-ready event for URL: ${baseURL}`);
          }
        } else {
          console.warn("Pusher: Received document-ready event without documentURL:", data);
        }
      });

      channel.bind('pusher:subscription_succeeded', () => {
        console.log(`Pusher: Successfully subscribed to channel: ${channelName}`);
      });

      channel.bind('pusher:subscription_error', (status: any) => {
        console.error(`Pusher: Failed to subscribe to channel ${channelName}:`, status);
        // Optional: Implement retry logic or notify user
      });

      channel.bind('pusher:connection_error', (err: any) => {
        console.error("Pusher: Connection Error:", err);
      });

      pusherClient.connection.bind('connected', () => {
        console.log("Pusher: Connection established.");
      });

      pusherClient.connection.bind('disconnected', () => {
        console.warn("Pusher: Connection disconnected.");
      });

      // --- Cleanup Function ---
      return () => {
        if (pusherClientRef.current) {
          console.log(`Pusher: Unsubscribing from channel ${channelName} and disconnecting.`);
          pusherClientRef.current.unsubscribe(channelName);
          pusherClientRef.current.disconnect();
          pusherClientRef.current = null; // Clear the ref
        }
      };

    } catch (error) {
      console.error("Pusher: Failed to initialize client:", error);
    }

  }, [userId, setConversation, scrollToBottom]); // Dependencies: userId, setConversation, scrollToBottom


  // --- Polling Logic Removed ---
  // const checkForPendingDocuments = useCallback(async () => { ... }, [userId, scrollToBottom]); // REMOVED
  // useEffect(() => { ... setInterval(checkForPendingDocuments, 5000); ... }, [userId, initialized, checkForPendingDocuments]); // REMOVED


  if (!userId) return null; // Render nothing until userId is available

  return (
    // Adjust main container for active state: flex column, full height
    <div className={cn(
      `relative parent`,
      active ? 'flex flex-col min-h-[80vh] pt-16 pb-24' : 'py-8' // Significant height when active
    )}>
      {/* Conversation Area - takes remaining space in active state */}
      <div
        ref={scrollContainerRef}
        className={cn(
          "px-4 custom-scroll overflow-y-auto",
          active
            ? "flex-grow space-y-4" // Takes remaining height, increased spacing
            : "mt-6 space-y-3 max-h-[200px] lg:max-h-[250px]", // Original inactive state
          "transition-all duration-500 ease-in-out" // Keep transition
        )}
        aria-live="polite"
      >
        {conversation.map((entry, idx) => {
          const messageKey = `msg-${idx}-${entry.from}-${entry.pdfUrl ? entry.pdfUrl.split('?')[0] : idx}`;
          const isUser = entry.from === 'user';
          const messageStyles = cn(
            "w-full max-w-3xl px-6 py-4 rounded break-words", // Base styles: full width container, padding, rounded corners
            isUser
              ? 'ml-auto bg-blue-600 text-white' // User: Right aligned, blue background
              : 'mr-auto bg-gray-800 text-white border-l-4 border-blue-500' // AI: Left aligned, dark gray, blue left border
          );

          return (
            // Outer container for alignment
            <div key={messageKey} className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {/* Inner message container with new styles */}
              <div className={messageStyles}>
                {/* Optional: Add NOVA icon/name for AI messages */}
                {!isUser && (
                  <div className="flex items-center gap-2 mb-2 text-sm text-gray-400">
                    {/* Placeholder for NOVA icon */}
                    {/* <span className="text-lg">🤖</span> */}
                    <span>Nova</span>
                  </div>
                )}

                {entry.message && <p className="whitespace-pre-wrap">{entry.message}</p>}

                {entry.image && (
                  <div className="mt-3"> {/* Increased margin */}
                    <Image src={entry.image} alt="AI visual response" width={300} height={200} className="rounded-md" />
                  </div>
                )}

                {entry.pdfUrl && (
                  <PdfPreview
                    pdfUrl={entry.pdfUrl}
                    // Add a specific class if needed for styling within the new layout
                    className={cn(entry.message ? 'mt-3' : '', 'pdf-preview-container')}
                  />
                )}
              </div>
            </div>
          );
        })}
        <div ref={conversationEndRef} style={{ height: '1px' }} />
      </div>

      {/* Input Area - Fixed at bottom when active */}
      <div
        ref={inputContainerRef}
        className={cn(
          "w-full px-4",
          active
            ? "sticky bottom-0 bg-black border-t border-white/20 py-4 z-10" // Sticky instead of fixed
            : "relative mt-8" // Original inactive styles
        )}
      >
        <div className="max-w-3xl mx-auto flex items-center gap-3"> {/* Centered container */}
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
              `placeholder-white/60 flex-grow text-[16px] lg:text-[18px]`, // Input takes available space
              `py-3 px-4 text-white outline-none bg-white/5 rounded-lg`, // Consistent background, rounded
              `border border-white/30 focus:border-white focus:ring-1 focus:ring-blue-500`, // Border and focus styles
              loading && 'opacity-70 cursor-not-allowed'
            )}
            disabled={loading}
            aria-label="Chat input"
          />
          {/* Send Button */}
          <button
            onClick={!loading ? sendMessage : undefined}
            disabled={loading}
            className={cn(
              "p-3 rounded-lg bg-blue-600 text-white transition-all duration-150",
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-500 active:opacity-90",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
            aria-label="Send message"
          >
            <IoReturnDownForwardSharp className="w-5 h-5" />
          </button>
        </div>
      </div>
      {/* Removed original Send Button Area */}
    </div>
  );
};
