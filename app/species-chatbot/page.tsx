/* eslint-disable */
"use client";
import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function SpeciesChatbot() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState<{ role: "user" | "bot"; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleSubmit = async () => {
    // Trim the message and check if it's empty
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading) {
      return;
    }

    // Add user message to chat log
    const userMessage = { role: "user" as const, content: trimmedMessage };
    setChatLog((prev) => [...prev, userMessage]);

    // Clear the input and reset textarea height
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Set loading state
    setIsLoading(true);

    try {
      // Call your API endpoint
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as { response: string };

      // Add bot response to chat log
      const botMessage = { role: "bot" as const, content: data.response };
      setChatLog((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error calling chatbot API:", error);

      // Add error message to chat log
      const errorMessage = {
        role: "bot" as const,
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
      };
      setChatLog((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <TypographyH2>Species Chatbot</TypographyH2>
      <div className="mt-4 flex gap-4">
        <div className="mt-4 rounded-lg bg-foreground p-4 text-background">
          <TypographyP>
            The Species Chatbot is a feature to be implemented that is specialized to answer questions about animals.
            Ideally, it will be able to provide information on various species, including their habitat, diet,
            conservation status, and other relevant details. Any unrelated prompts will return a message to the user
            indicating that the chatbot is specialized for species-related queries only.
          </TypographyP>
          <TypographyP>
            To use the Species Chatbot, simply type your question in the input field below and hit enter. The chatbot
            will respond with the best available information.
          </TypographyP>
        </div>
      </div>
      {/* Chat UI, ChatBot to be implemented */}
      <div className="mx-auto mt-6">
        {/* Chat history */}
        <div className="h-[400px] space-y-3 overflow-y-auto rounded-lg border border-border bg-muted p-4">
          {chatLog.length === 0 ? (
            <p className="text-sm text-muted-foreground">Start chatting about a species!</p>
          ) : (
            chatLog.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] whitespace-pre-wrap rounded-2xl p-3 text-sm ${
                    msg.role === "user"
                      ? "rounded-br-none bg-primary text-primary-foreground"
                      : "rounded-bl-none border border-border bg-foreground text-primary-foreground"
                  }`}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ))
          )}
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[75%] rounded-2xl rounded-bl-none border border-border bg-foreground p-3 text-sm text-primary-foreground">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-current"></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-current"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-current"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Textarea and submission */}
        <div className="mt-4 flex flex-col items-end">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onInput={handleInput}
            onKeyPress={handleKeyPress}
            rows={1}
            placeholder="Ask about a species..."
            className="w-full resize-none overflow-hidden rounded border border-border bg-background p-2 text-sm text-foreground focus:outline-none disabled:opacity-50"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={isLoading || !message.trim()}
            className="mt-2 rounded bg-primary px-4 py-2 text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Enter"}
          </button>
        </div>
      </div>
    </>
  );
}
