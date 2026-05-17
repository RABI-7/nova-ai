import { useEffect, useRef } from "react";
import { Sparkles, User } from "lucide-react";
import { TypingIndicator } from "./TypingIndicator";
import type { ChatMessage } from "./types";

interface Props {
  messages: ChatMessage[];
  isTyping: boolean;
  onPromptClick: (prompt: string) => void;
}

const SUGGESTIONS = [
  "Explain quantum computing in simple terms",
  "Draft a friendly out-of-office email",
  "Brainstorm side project ideas in AI",
];

export function ChatMessages({ messages, isTyping, onPromptClick }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (messages.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
          <Sparkles className="h-7 w-7 text-primary-foreground" />
        </div>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
          How can I help you today?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Ask anything — I'll do my best to assist.
        </p>
        <div className="mt-8 grid w-full gap-2 sm:grid-cols-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onPromptClick(s)}
              className="rounded-xl border border-border/60 bg-card/40 p-3 text-left text-sm text-muted-foreground transition-all hover:border-primary/40 hover:bg-card hover:text-foreground hover:shadow-glow"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
      <div className="flex flex-col gap-6">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {isTyping && (
          <div className="flex items-start gap-3 animate-bubble-in">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="rounded-2xl rounded-tl-sm border border-border/50 bg-card px-4 py-3">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex items-start gap-3 animate-bubble-in ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          isUser
            ? "bg-secondary text-secondary-foreground"
            : "bg-gradient-primary text-primary-foreground shadow-glow"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </div>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%] ${
          isUser
            ? "rounded-tr-sm bg-gradient-primary text-primary-foreground shadow-glow"
            : "rounded-tl-sm border border-border/50 bg-card text-card-foreground"
        }`}
      >
        {message.content || <span className="opacity-60">…</span>}
      </div>
    </div>
  );
}
