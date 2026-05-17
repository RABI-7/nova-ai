import { useEffect, useRef, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChatSidebar } from "./ChatSidebar";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { SettingsDialog } from "./SettingsDialog";
import {
  loadActiveId,
  loadConversations,
  saveActiveId,
  saveConversations,
} from "./storage";
import type { ChatMessage, Conversation } from "./types";

const RESPONSES = [
  "That's a great question! Here's a thoughtful take: every problem has multiple angles, and exploring them often reveals surprising connections.",
  "Absolutely — I can help with that. Let's break it down into clear steps so it's easy to follow and implement.",
  "Interesting! Based on what you've shared, I'd suggest starting small, iterating quickly, and gathering feedback along the way.",
  "Here's a concise summary: focus on clarity, prioritize what matters most, and don't be afraid to revisit earlier decisions.",
];

const uid = () => Math.random().toString(36).slice(2, 10);

const newConversation = (title = "New chat"): Conversation => ({
  id: uid(),
  title,
  updatedAt: Date.now(),
  messages: [],
});

export function ChatLayout() {
  // Start empty for SSR-safe first render; hydrate from localStorage in effect.
  const [conversations, setConversations] = useState<Conversation[]>(() => [newConversation()]);
  const [activeId, setActiveId] = useState<string>(() => "");
  const [hydrated, setHydrated] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const typingTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    const stored = loadConversations();
    if (stored && stored.length > 0) {
      setConversations(stored);
      const storedActive = loadActiveId();
      setActiveId(stored.find((c) => c.id === storedActive)?.id ?? stored[0].id);
    } else {
      setActiveId((prev) => prev || conversations[0].id);
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist conversations & activeId after hydration.
  useEffect(() => {
    if (!hydrated) return;
    saveConversations(conversations);
  }, [conversations, hydrated]);

  useEffect(() => {
    if (!hydrated || !activeId) return;
    saveActiveId(activeId);
  }, [activeId, hydrated]);

  const active =
    conversations.find((c) => c.id === activeId) ?? conversations[0];

  const updateActive = (fn: (c: Conversation) => Conversation) => {
    setConversations((prev) => prev.map((c) => (c.id === activeId ? fn(c) : c)));
  };

  const clearTimers = () => {
    typingTimers.current.forEach(clearTimeout);
    typingTimers.current = [];
  };

  const generateReply = async (prompt: string) => {
  setIsTyping(true);

  try {
    const response = await fetch("http://127.0.0.1:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
      }),
    });

    const data = await response.json();

    const aiMessage: ChatMessage = {
      id: uid(),
      role: "assistant",
      content: data.reply,
    };

    updateActive((c) => ({
      ...c,
      messages: [...c.messages, aiMessage],
    }));
  } catch (error) {
    const errorMessage: ChatMessage = {
      id: uid(),
      role: "assistant",
      content: "Error connecting to backend.",
    };

    updateActive((c) => ({
      ...c,
      messages: [...c.messages, errorMessage],
    }));
  }

  setIsTyping(false);
};

  const handleSend = (text: string) => {
    const userMsg: ChatMessage = { id: uid(), role: "user", content: text };
    updateActive((c) => ({
      ...c,
      title: c.messages.length === 0 ? text.slice(0, 40) : c.title,
      updatedAt: Date.now(),
      messages: [...c.messages, userMsg],
    }));
    generateReply(text);
  };

  const handleNew = () => {
    clearTimers();
    setIsTyping(false);
    const c = newConversation();
    setConversations((prev) => [c, ...prev]);
    setActiveId(c.id);
  };

  const handleSelect = (id: string) => {
    clearTimers();
    setIsTyping(false);
    setActiveId(id);
  };

  const handleClear = () => {
    clearTimers();
    setIsTyping(false);
    updateActive((c) => ({ ...c, messages: [] }));
    setClearOpen(false);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <ChatSidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={handleSelect}
          onNew={handleNew}
          onOpenSettings={() => setSettingsOpen(true)}
        />
        <SidebarInset className="flex min-h-screen flex-1 flex-col">
          <ChatHeader
            onClear={() => {
              if (active.messages.length === 0) return;
              setClearOpen(true);
            }}
            onOpenSettings={() => setSettingsOpen(true)}
          />
          <main className="flex flex-1 flex-col">
            <ChatMessages
              messages={active.messages}
              isTyping={isTyping}
              onPromptClick={handleSend}
            />
          </main>
          <ChatInput onSend={handleSend} disabled={isTyping} />
        </SidebarInset>
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />

      <AlertDialog open={clearOpen} onOpenChange={setClearOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear this chat?</AlertDialogTitle>
            <AlertDialogDescription>
              All messages in this conversation will be removed. This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClear}>Clear</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
