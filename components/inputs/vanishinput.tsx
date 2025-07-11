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
  initialConversation?: ConversationEntry[];
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
export const VanishInput = ({ services, setServices, active, setActive, initialConversation, placeholder, required }: VanishInputProps) => {
  const sessionUserId = useSessionUserId();
  const [inputData, setInputData] = useState<{ data: string; files: File[] }>({ data: "", files: [] });
  const [conversation, setConversation] = useState<ConversationEntry[]>(initialConversation || []);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const pusherClientRef = useRef<Pusher | null>(null);
  const processedDocumentURLsRef = useRef(new Set<string>());
  const [inputFocused, setInputFocused] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholder || "Hi I'm Nova...How can I help you?");

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
    setInputData({ data: e.target.value, files: inputData.files });
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const currentMessage = inputData.data;
      const currentFiles = inputData.files;
      if (currentMessage.trim() || currentFiles.length > 0) {
        setInputData({ data: "", files: [] }); // Clear input immediately
        await sendMessage(currentMessage, currentFiles, services);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const currentMessage = inputData.data;
    const currentFiles = inputData.files;
    if (currentMessage.trim() || currentFiles.length > 0) {
      setInputData({ data: "", files: [] }); // Clear input immediately
      await sendMessage(currentMessage, currentFiles, services);
    }
  };

  const sendMessage = useCallback(async (message: string, files: File[], currentServices: string[]) => {
    if (!message.trim() && files.length === 0 || !sessionUserId || loading) return;

    console.log(`Sending message from user ${sessionUserId}: ${message}`);
    const newConversationEntry: ConversationEntry = { from: 'user', message };
    if (files.length > 0) {
      newConversationEntry.message += ` (Files: ${files.map(f => f.name).join(', ')})`;
    }
    setConversation(prev => [...prev, newConversationEntry]);
    setLoading(true);
    
    // --- BEGIN TEST PDF MODIFICATION ---
    /*
    if (message.trim().toLowerCase() === "testpdf") {
      console.log("TESTPDF keyword detected. Displaying test PDF.");
      setConversation(prev => [
        ...prev,
        { 
          from: 'ai', 
          message: 'Displaying test PDF:', 
          pdfUrl: 'https://storage.googleapis.com/nova-plans/mahis%20burgers%20-%20Cque7SNCPvmrD4dMZehU9V.pdf' 
        }
      ]);
      setLoading(false);
      scrollToBottom();
      return; // Skip Voiceflow call
    }
      */
    // --- END TEST PDF MODIFICATION ---

    setConversation(prev => [...prev, { from: 'ai', message: '...Nova is writing a response' }]);
    scrollToBottom();

    try {
      if (!initialized) {
        console.log(`Sending launch event for user ${sessionUserId}`);
        await axios.post("/api/voiceflow", { userId: sessionUserId, actionType: "launch" });
        setInitialized(true); // Set initialized *after* successful launch
      }

      const servicesString = currentServices.length > 0 ? `::[SERVICES BEGIN]::${arrayToCommaString(currentServices)}` : '';
      const payload = `${message}${servicesString}`;
      console.log(`Sending text event for user ${sessionUserId} with payload: ${payload}`);
      const response = await axios.post("/api/voiceflow", { userId: sessionUserId, actionType: "text", payload });
      setServices([]);

      const steps = response.data.steps;
      console.log(`Received response from Voiceflow for user ${sessionUserId}:`, steps);

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
      
      // Save the transcript after each interaction
      try {
        console.log(`Saving transcript for user ${sessionUserId}`);
        await axios.put("/api/transcripts", { sessionID: sessionUserId });
      } catch (saveError) {
        console.error(`Error saving transcript for user ${sessionUserId}:`, saveError);
        // Don't interrupt the main flow for transcript saving errors
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`Error sending message to Voiceflow for user ${sessionUserId}:`, errorMessage);
      setConversation(prev => [
        ...prev.filter(msg => msg.message !== '...Nova is writing a response'),
        { from: 'ai', message: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  }, [sessionUserId, loading, initialized, services, setServices, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation, scrollToBottom]);

  const FocusInput = useCallback(() => {
    setInputFocused(true);
    setActive(true);
  }, [setActive]);

  const BlurInput = useCallback(() => {
    setInputFocused(false);
  }, []);

  // --- Pusher Connection Effect ---
  useEffect(() => {
    if (!sessionUserId) {
      console.log("Pusher: Waiting for sessionUserId...");
      return;
    }
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
    if (!pusherKey || !pusherCluster) {
      console.error("Pusher Error: NEXT_PUBLIC_PUSHER_KEY or NEXT_PUBLIC_PUSHER_CLUSTER is not defined in environment variables.");
      return;
    }
    if (pusherClientRef.current) {
      console.log("Pusher: Already connected.");
      return;
    }
    console.log("Pusher: Initializing connection...");
    try {
      const pusherClient = new Pusher(pusherKey, {
        cluster: pusherCluster,
      });
      pusherClientRef.current = pusherClient;
      const channelName = `user-${sessionUserId}`;
      console.log(`Pusher: Subscribing to channel: ${channelName}`);
      const channel = pusherClient.subscribe(channelName);

      channel.bind('document-ready', (data: { documentURL?: string; documentId?: string }) => {
        console.log(`Pusher: Received event 'document-ready' on channel ${channelName}:`, data);
        const eventDocumentURL = data.documentURL;
        if (eventDocumentURL) {
          const baseURL = eventDocumentURL.split('?')[0];
          if (!processedDocumentURLsRef.current.has(baseURL)) {
            processedDocumentURLsRef.current.add(baseURL);
            console.log(`Pusher: Adding new PDF to conversation from 'document-ready' event: ${eventDocumentURL}`);
            const urlWithId = `${eventDocumentURL}${eventDocumentURL.includes('?') ? '&' : '?'}t=${Date.now()}`;
            setConversation(prev => [
              ...prev,
              { from: 'ai', message: `Your AI Blueprint is ready:`, pdfUrl: urlWithId }
            ]);
            scrollToBottom();
          } else {
            console.log(`Pusher: Duplicate PDF (already processed by this client instance): ${baseURL}`);
          }
        } else {
          console.warn("Pusher: 'document-ready' event received without a documentURL:", data);
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
          pusherClientRef.current = null;
        }
      };

    } catch (error) {
      console.error("Pusher: Failed to initialize client:", error);
    }
  }, [sessionUserId, scrollToBottom]); // Removed setConversation, relying on processedDocumentURLsRef for de-dupe before setConversation


  // --- Polling Logic Removed ---
  // const checkForPendingDocuments = useCallback(async () => { ... }, [sessionUserId, scrollToBottom]); // REMOVED
  // useEffect(() => { ... setInterval(checkForPendingDocuments, 5000); ... }, [sessionUserId, initialized, checkForPendingDocuments]); // REMOVED


  if (active && !sessionUserId) {
    console.warn("VanishInput: Chat is active but sessionUserId is not yet available. Rendering empty temporarily.");
    return null;
  }

  return (
    <div className={`w-full flex flex-col h-full`}> {/* Ensure h-full to take space from parent */}
      {/* Message display area - takes up most of the space and is scrollable */}
      <div
        ref={scrollContainerRef}
        className={`flex-grow overflow-y-auto flex justify-center ${active ? 'p-4' : 'p-0'}`}
        onClick={() => !active && setActive(true)} // Allow clicking messages area to activate if not active
      >
        {/* Centered message container */}
        <div className="w-full max-w-7xl space-y-4">
        {/* Render messages or placeholder */}
        {active && conversation.length > 0 && conversation.map((item, index) => (
          <div key={`msg-${index}-${item.from}-${item.pdfUrl ? item.pdfUrl.split('?')[0] : index}`} className={`flex w-full mb-4 ${item.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={cn(
              "max-w-3xl px-4 py-2 rounded break-words",
              item.from === 'user'
                ? 'bg-neutral-700 text-white rounded-2xl'
                : 'text-white'
            )}>
              {!item.from && (
                <div className="flex items-center gap-2 mb-2 text-sm text-gray-400">
                  <span>Nova</span>
                </div>
              )}
              {item.message && <p className="whitespace-pre-wrap">{item.message}</p>}
              {item.image && (
                <div className="mt-3">
                  <Image src={item.image} alt="AI visual response" width={300} height={200} className="rounded-md" />
                </div>
              )}
              {item.pdfUrl && (
                <PdfPreview pdfUrl={item.pdfUrl} />
              )}
            </div>
          </div>
        ))}
        {!active && (
          <div className="flex items-center justify-center h-full text-neutral-500 px-4 py-10 cursor-pointer" onClick={() => setActive(true)}>
            {placeholder}
          </div>
        )}
        {active && conversation.length === 0 && (
          <div className="flex items-center justify-center h-full text-neutral-400 px-4">
            Enter your message below...
          </div>
        )}
        </div>
      </div>

      {/* Input area - now part of the scroll flow, not sticky */}
      {active && (
        <div
          ref={inputContainerRef}
          className="bg-transparent transition-all duration-300 ease-in-out p-4"
        >
          {/* Centering and max-width wrapper for the form */}
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
              <input
                ref={inputRef}
                onFocus={FocusInput}
                onBlur={BlurInput}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                value={inputData.data}
                required={required}
                placeholder={active ? "" : currentPlaceholder}
                className="w-full p-3 bg-neutral-700 text-white rounded-md focus:outline-none focus:ring-transparent placeholder-neutral-500 text-sm"
              />
              {/* Centered Send button and text */}
              <div className="flex flex-row items-center justify-center gap-2 mt-2">
                <button
                  type="submit"
                  disabled={loading || (!inputData.data.trim() && inputData.files.length === 0)}
                  className={cn(
                    "p-1.5 rounded-lg bg-neutral-700 text-white transition-all duration-150", // Adjusted padding and bg
                    loading ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-600 active:opacity-90",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  )}
                  aria-label="Send message"
                >
                  <IoReturnDownForwardSharp className="w-5 h-5" />
                </button>
                <span className="text-white text-sm">TO SEND</span>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
