"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import { IoReturnDownForwardSharp } from "react-icons/io5";
import './index.css'
import { v4 as uuidv4 } from 'uuid';

const useSessionUserId = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let existingId = sessionStorage.getItem("nova-user-id");
    if (!existingId) {
      existingId = uuidv4();
      sessionStorage.setItem("nova-user-id", existingId);
    }
    setUserId(existingId);
  }, []);

  return userId;
};

export const VanishInput = ({
  placeholder,
  inputValue = "",
  required = true,
  type = "text",
  active,
  setActive,
  services,
  setServices
}: {
  placeholder: string;
  inputValue?: string;
  required?: boolean;
  type: string;
  active: boolean;
  setActive: Function;
  services: Array<string>;
  setServices: Function;
}) => {
  const userId = useSessionUserId();
  

  const [inputData, setInputData] = useState({ data: inputValue });
  const [isFocused, setIsFocused] = useState(false);
  const [showCaret, setShowCaret] = useState(true);
  const [conversation, setConversation] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  

  function arrayToCommaString(items: string[]): string {
    return items.join(", ");
  }

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData({ data: e.target.value });
  };

  const sendMessage = async () => {
    if (!inputData.data.trim()) return;
    console.log(userId)
    const userMessage = inputData.data;
    setConversation(prev => [...prev, { from: 'user', message: userMessage }]);
    setInputData({ data: "" });
    setLoading(true);
    setConversation(prev => [...prev, { from: 'ai', message: '...Nova is writing a response' }]);

    try {
      if (!initialized) {
        await axios.post("/api/voiceflow", {
          userId,
          actionType: "launch"
        });
        setInitialized(true);
      }

      const response = await axios.post("/api/voiceflow", {
        userId,
        actionType: "text",
        payload: userMessage + '::[SERVICES BEGIN]::' + arrayToCommaString(services),
      });
      setServices([]);

      const steps = response.data.steps;
      const parsed = steps.map((step: any) => {
        if ((step.type === "speak" || step.type === "text") && step.payload?.message) {
          const message = step.payload.message;

          const match = message.match(/<DOCUMENTID>(.*?)<\/DOCUMENTID>/);
          if (match) {
            return { from: "ai", documentId: match[1] };
          }

          return { from: "ai", message };
        } else if (step.type === "visual") {
          return { from: "ai", image: step.payload.image };
        }
      }).filter(Boolean);

      setConversation(prev => [
        ...prev.filter(msg => msg.message !== '...Nova is writing a response'),
        ...parsed
      ]);
    } catch (err) {
      console.error("Error sending message:", err);
      setConversation(prev => [
        ...prev.filter(msg => msg.message !== '...Nova is writing a response'),
        { from: 'ai', message: 'Sorry, something went wrong.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await sendMessage();
    }
  };

  useEffect(() => {
    if (isFocused || inputData.data.length === 0) {
      const interval = setInterval(() => {
        setShowCaret((prev) => !prev);
      }, 600);
      return () => clearInterval(interval);
    } else {
      setShowCaret(false);
    }
  }, [isFocused, inputData.data]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const FocusInput = () => {
    setIsFocused(true);
    setActive(true);
  };

  const BlurInput = () => {
    setIsFocused(false);
    setActive(true);
  };

  if (!userId) return null;

  return (
    <div className={`relative py-8 parent`}>
      <div ref={scrollContainerRef} className="mt-6 max-h-[320px] lg:max-h-[680px] overflow-y-scroll space-y-3 px-4 custom-scroll">
        {conversation.map((entry, idx) => (
          <div key={idx} className={`text-white ${entry.from === 'user' ? 'text-right' : 'text-left'}`}>
            {entry.message && <p className="inline-block p-2 rounded-md max-w-[75%]">{entry.message}</p>}

            {entry.image && (
              <div className="inline-block">
                <Image src={entry.image} alt="AI response" width={300} height={200} className="rounded-md mt-2" />
              </div>
            )}

            {entry.documentId && (
              <div className="mt-4 border border-white/20 rounded-lg overflow-hidden bg-white/5 p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-white text-sm font-medium">📄 Nova has shared a document with you:</p>
                  <a
                    href={`/api/pandadoc?documentId=${entry.documentId}`}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 text-sm hover:underline"
                  >
                    Download PDF
                  </a>
                </div>
                <iframe
                  src={`/api/pandadoc?documentId=${entry.documentId}`}
                  width="100%"
                  height="500px"
                  className="w-full border border-white/10 rounded"
                />
              </div>
            )}
          </div>
        ))}
        <div ref={conversationEndRef} />
      </div>
      <div className="flex justify-center w-full relative mt-8">
        <input
          ref={inputRef}
          onFocus={FocusInput}
          onBlur={BlurInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={inputData.data}
          required={required}
          type={type}
          placeholder={conversation.length === 0 ? placeholder : ""}
          className={`placeholder-white/90 text-center w-full max-w-[600px] text-[18px] py-3 px-4 text-white outline-none bg-transparent ${conversation.length > 0 && 'bg-white/5 rounded-lg'}`}
        />
      </div>
      <div className="flex justify-center items-center gap-4 py-8 hover:scale-105 cursor-pointer duration-300 transition-all" onClick={sendMessage}>
        <div className="bg-text-secondary/30 leading-normal text-[18px] w-[32px] h-[32px] relative rounded-md">
          <p className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-white">
            <IoReturnDownForwardSharp />
          </p>
        </div>
        <p className="text-[18px] text-white uppercase mt-1">to send</p>
      </div>
    </div>
  );
};
