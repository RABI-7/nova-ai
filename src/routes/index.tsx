import { createFileRoute } from "@tanstack/react-router";
import { ChatLayout } from "@/components/chat/ChatLayout";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <ChatLayout />;
}
