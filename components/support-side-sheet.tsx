"use client";

import { useCallback, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { ArrowUpIcon, LifeBuoyIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function SupportSideSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [message, setMessage] = useState("");

  const handleSend = useCallback(() => {
    const trimmed = message.trim();
    if (!trimmed) return;
    onOpenChange(false);
    setMessage("");
  }, [message, onOpenChange]);

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      /* Prevents focus-out dismissal when tapping non-focusable in-dialog UI (Base UI couples this to pointer dismissal). */
      disablePointerDismissal
    >
      <SheetContent
        side="right"
        showCloseButton={false}
        overlayClassName="z-[170]"
        onOverlayClick={() => onOpenChange(false)}
        className={cn(
          "z-[170] gap-0 border-0 bg-transparent p-0 shadow-none outline-none",
          /* Chatbase-like compact panel: fixed-ish size, not full-height */
          "data-[side=right]:!top-[calc(var(--header-height)+0.5rem)] data-[side=right]:!right-[max(0.75rem,env(safe-area-inset-right,0px))] data-[side=right]:!left-auto",
          "data-[side=right]:!h-[min(78dvh,640px)] data-[side=right]:!max-h-[calc(100dvh-var(--header-height)-1.25rem)] data-[side=right]:!min-h-[520px]",
          "data-[side=right]:!w-[min(calc(100vw-1.5rem),380px)] data-[side=right]:!max-w-none",
        )}
      >
        <div
          className={cn(
            "flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card text-card-foreground shadow-xl",
          )}
        >
          <header className="flex shrink-0 items-center justify-between gap-2 rounded-t-2xl bg-neutral-950 px-4 py-3.5 text-neutral-50">
            <div className="flex min-w-0 items-center gap-2.5">
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15"
                aria-hidden
              >
                <LifeBuoyIcon className="size-[18px] text-white" />
              </div>
              <div className="min-w-0">
                <SheetTitle className="truncate text-base font-medium tracking-tight text-white">
                  DrNote support
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Get help from our team. We typically respond within 24 hours.
                  Describe your question or issue and we will get back to you.
                </SheetDescription>
                <p className="truncate text-xs text-neutral-400">
                  Replies within ~24 hours
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close support"
            >
              <XIcon className="size-4" />
            </button>
          </header>

          <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto bg-background px-3.5 pb-2.5 pt-3.5">
            <p className="max-w-[95%] rounded-2xl rounded-bl-md bg-muted px-3 py-2.5 text-[13px] leading-relaxed text-foreground">
              Hi — need help with DrNote? Tell us what you&apos;re trying to do
              and we&apos;ll point you in the right direction.
            </p>
          </div>

          <div className="shrink-0 space-y-1.5 border-t border-border/60 bg-background px-3.5 pb-2.5 pt-2.5">
            <div className="flex items-end gap-2 rounded-2xl border border-border bg-muted/40 px-2 py-1.5 pl-3 shadow-inner">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask us anything about DrNote…"
                rows={2}
                className="max-h-32 min-h-[64px] w-full flex-1 resize-none bg-transparent py-1.5 text-[13px] leading-snug text-foreground placeholder:text-muted-foreground focus-visible:outline-none"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!message.trim()}
                className="mb-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-white shadow-sm transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-35 dark:bg-neutral-50 dark:text-neutral-950"
                aria-label="Send message"
              >
                <ArrowUpIcon className="size-4" />
              </button>
            </div>

            <p className="text-center text-[10px] text-muted-foreground">
              Messages go to our team — not an automated chatbot.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
