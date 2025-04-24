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
import './index.css';

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
      const parsedAiResponses = steps.map((step: { type: string; payload?: { message?: string; image?: string } }): ConversationEntry | null => {
        if ((step.type === "speak" || step.type === "text") && step.payload?.message) {
          return { from: "ai", message: step.payload.message };
        } else if (step.type === "visual" && step.payload?.image) {
          return { from: "ai", image: step.payload.image };
        }
        return null;
      }).filter((entry: ConversationEntry | null): entry is ConversationEntry => entry !== null);

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
          // Update conversation state with the direct PDF URL
          setConversation(prev => [
            ...prev,
            // 1. Fixed message
            { from: 'ai', message: 'Here is your PDF for review:', pdfUrl: data.documentURL }
          ]);
          // Ensure scroll happens after state update
          scrollToBottom();
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
    <div className={cn(`relative py-8 parent`, active ? 'chat-active' : '')}>
      {/* Conversation Area */}
      <div
        ref={scrollContainerRef}
        className={cn(
          "mt-6 space-y-3 px-4 custom-scroll overflow-y-auto",
          active ? "max-h-[60vh] lg:max-h-[65vh]" : "max-h-[200px] lg:max-h-[250px]",
          "transition-[max-height] duration-500 ease-in-out"
        )}
        aria-live="polite"
      >
        {conversation.map((entry, idx) => {
          return (
            <div key={`msg-${idx}-${entry.from}-${uuidv4()}`} className={`flex ${entry.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={cn(
                `inline-block p-2 px-3 rounded-lg max-w-[85%] lg:max-w-[75%] break-words shadow-sm`,
                entry.from === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'
              )}>
                {entry.message && <p>{entry.message}</p>}

                {entry.image && (
                  <div className="mt-2">
                    <Image src={entry.image} alt="AI visual response" width={300} height={200} className="rounded-md" />
                  </div>
                )}

                {entry.pdfUrl && (
                  <PdfPreview
                    pdfUrl={entry.pdfUrl}
                    className={entry.message ? 'mt-2' : ''}
                  />
                )}
              </div>
            </div>
          );
        })}
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
            `border-b-2 transition-all duration-300 ease-in-out`,
            isFocused ? 'border-white' : 'border-white/30',
            active && conversation.length > 0 && 'bg-white/5 rounded-t-lg border-b-0 text-left pl-4',
            loading && 'opacity-70 cursor-not-allowed'
          )}
          disabled={loading}
          aria-label="Chat input"
        />
      </div>

      {/* Send Button Area */}
      <div
        className={cn(
          "flex justify-center items-center gap-4 py-4 lg:py-8 cursor-pointer duration-300 transition-all",
          loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:opacity-90"
        )}
        onClick={!loading ? sendMessage : undefined}
        role="button"
        aria-disabled={loading}
        tabIndex={loading ? -1 : 0}
        onKeyDown={(e) => { if (e.key === 'Enter' && !loading) sendMessage(); }}
      >
        <div className="bg-text-secondary/30 leading-normal text-[18px] w-[32px] h-[32px] relative rounded-md flex items-center justify-center">
          <IoReturnDownForwardSharp className="text-white" />
        </div>
        <p className="text-[14px] lg:text-[18px] text-white uppercase mt-1">to send</p>
      </div>

    </div>
  );
};
