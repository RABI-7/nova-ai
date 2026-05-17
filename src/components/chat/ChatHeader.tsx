import { Settings, Sparkles, Trash2 } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface Props {
  onClear: () => void;
  onOpenSettings: () => void;
}

export function ChatHeader({ onClear, onOpenSettings }: Props) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border/50 bg-background/70 px-3 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <h1 className="text-sm font-semibold tracking-tight sm:text-base">
            <span className="text-gradient-primary">Nova</span> AI
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">Clear chat</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSettings}
          className="text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
