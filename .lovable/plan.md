## ChatGPT-style AI Chatbot UI (Frontend Only)

A dark, modern, responsive chatbot interface with a collapsible sidebar, chat bubbles, and a fixed input bar. No backend — AI responses are simulated with a typing animation and canned replies.

### Design system

Update `src/styles.css` dark tokens to a futuristic palette:
- Background: deep near-black (`oklch(0.16 0.01 260)`)
- Sidebar: slightly lighter panel
- Primary accent: vibrant violet/indigo gradient (`--primary` + `--primary-glow`)
- Add `--gradient-primary`, `--shadow-glow`, subtle border tokens
- Force `dark` class on `<html>` in `__root.tsx` so the app is always dark
- Use Inter font (loaded via Google Fonts link in root head)

### Routes & files

- `src/routes/__root.tsx` — add Inter font link, set `<html lang="en" class="dark">`, update title/meta to "Nova AI — Chat"
- `src/routes/index.tsx` — replace placeholder with the chat layout

### Components (`src/components/chat/`)

1. **ChatLayout.tsx** — wraps sidebar + main panel using shadcn `SidebarProvider`. Holds chat state (conversations, active id, messages) in React state only.
2. **ChatSidebar.tsx** — uses shadcn `Sidebar` (`collapsible="icon"`):
   - Top: "New chat" button with Plus icon
   - List of mock conversations (title + timestamp), active item highlighted
   - Footer: settings icon button (opens Settings dialog)
3. **ChatHeader.tsx** — sticky top bar:
   - `SidebarTrigger`, logo mark (gradient circle) + "Nova AI" title
   - Right side: "Clear chat" button (Trash icon) and Settings icon
4. **ChatMessages.tsx** — scrollable message list:
   - Empty state: centered logo, greeting, 3 suggested-prompt cards
   - User bubble: right-aligned, primary gradient background
   - AI bubble: left-aligned with avatar circle, card background
   - Auto-scroll to bottom on new message
5. **TypingIndicator.tsx** — three bouncing dots while AI is "thinking"
6. **ChatInput.tsx** — fixed at bottom of main panel:
   - Auto-grow `Textarea`, Send button (Arrow icon) with gradient + glow
   - Enter to send, Shift+Enter for newline, disabled while typing
   - Small disclaimer text underneath
7. **SettingsDialog.tsx** — shadcn `Dialog` with mock controls (model select, temperature slider, toggle for sounds) — purely visual
8. **ClearChatDialog.tsx** — shadcn `AlertDialog` confirming chat clear

### Behavior (frontend simulation)

- On send: append user message, show typing indicator after ~300ms, then stream a canned response character-by-character into a new AI bubble (~15ms/char) for the typing animation
- "New chat" creates a new conversation entry; switching conversations swaps message list (kept in memory only)
- "Clear chat" empties the active conversation's messages

### Animations

- Add fade-in / slide-up keyframes in `styles.css`
- Bubbles use `animate-in fade-in slide-in-from-bottom-2`
- Sidebar items hover-scale subtly; send button glows on hover
- Typing dots use staggered bounce keyframes

### Responsiveness

- Sidebar: `collapsible="icon"` on desktop, off-canvas via `Sheet` on mobile (shadcn sidebar handles this)
- Header trigger always visible
- Input bar full-width with max-width container (`max-w-3xl mx-auto`)
- Bubbles cap at `max-w-[80%]` mobile / `max-w-[70%]` desktop

### Out of scope

No real AI calls, no persistence, no auth, no backend.
