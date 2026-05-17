export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-2">
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground dot-bounce" style={{ animationDelay: "0s" }} />
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground dot-bounce" style={{ animationDelay: "0.15s" }} />
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground dot-bounce" style={{ animationDelay: "0.3s" }} />
    </div>
  );
}
