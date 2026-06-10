"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Flame } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Yo! This is Robert's crew. Got questions about ink, pricing, or booking? We got answers. What's on your mind?",
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(({ role, content }) => ({
            role,
            content,
          })),
        }),
      });

      if (!response.ok) throw new Error("Request failed");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      setIsLoading(false);

      let accum = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accum += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: accum };
          return updated;
        });
      }
    } catch {
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please try again or reach out directly at hello@robertavery.art",
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[340px] sm:w-[380px] flex flex-col bg-[#111111] border-2 border-[#1e1e1e] border-l-4 border-l-[#FF3C00] shadow-2xl transition-all duration-300 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{ maxHeight: "520px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1e1e1e] bg-[#141414] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-[#FF3C00]/20 border border-[#FF3C00]/40">
              <Flame size={16} className="text-[#FF3C00]" />
            </div>
            <div>
              <p className="text-[#F0F0F0] text-sm font-heading font-bold tracking-wider">
                ASK ROBERT&apos;S CREW
              </p>
              <p className="text-[#9CA3AF] text-xs">online</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[#9CA3AF] hover:text-[#FF3C00] transition-colors"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
          style={{ maxHeight: "360px" }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="flex-shrink-0 w-7 h-7 bg-[#FF3C00]/20 border border-[#FF3C00]/40 flex items-center justify-center mt-1">
                  <Flame size={12} className="text-[#FF3C00]" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-3 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#FF3C00] text-[#0A0A0A] font-semibold"
                    : "bg-[#1A1A1A] text-[#F0F0F0] border border-[#1e1e1e]"
                }`}
              >
                {msg.content || (
                  <span className="text-[#9CA3AF] italic text-xs">
                    Thinking...
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-7 h-7 bg-[#FF3C00]/20 border border-[#FF3C00]/40 flex items-center justify-center">
                <Flame size={12} className="text-[#FF3C00]" />
              </div>
              <div className="bg-[#1A1A1A] border border-[#1e1e1e] px-4 py-3 flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 bg-[#FF3C00] rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-[#1e1e1e] flex gap-2 flex-shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Got a question?"
            className="flex-1 bg-[#1A1A1A] border border-[#1e1e1e] text-[#F0F0F0] text-sm px-3 py-2.5 placeholder-[#9CA3AF]/60 focus:outline-none focus:border-[#FF3C00]/60 transition-colors"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="p-2.5 bg-[#FF3C00] text-[#0A0A0A] hover:bg-[#ff5a1a] disabled:opacity-40 disabled:cursor-not-allowed transition-all font-bold hover:shadow-[0_0_12px_#FF3C00]"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-300 ${
          isOpen
            ? "bg-[#1A1A1A] border-2 border-[#1e1e1e] text-[#FF3C00] hover:text-[#ff5a1a]"
            : "bg-[#FF3C00] text-[#0A0A0A] hover:shadow-[0_0_20px_rgba(255,60,0,0.6)]"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={22} /> : <Flame size={22} />}
      </button>
    </>
  );
}
