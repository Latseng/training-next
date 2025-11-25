import { ScrollArea } from "@/components/ui/scroll-area";
import { AIMessageRenderer } from "./AIMessageRenderer";
import { ReplyLoading } from "./ReplyLoading";
import { useEffect, useRef, type ReactNode } from "react";
import { Message } from "@/lib/types";

interface ChatBoxProps {
  messages: Message[];
  children?: ReactNode;
}

export function ChatBox({ messages, children }: ChatBoxProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    const viewport = scrollRef.current.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement | null;

    if (!viewport) return;

    viewport.scrollTop = viewport.scrollHeight;
    
  }, [messages]);

  return (
    <div className="h-80">
      <ScrollArea ref={scrollRef} className="h-64 p-2 border rounded">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              } `}
            >
              <div
                className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-left"
                }`}
              >
                {msg.role === "user" ? (
                  // 使用者訊息：直接渲染純文字
                  <p>{msg.content}</p>
                ) : msg.isLoading ? (
                  <ReplyLoading />
                ) : (
                  <AIMessageRenderer content={msg.content} />
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      {children}
    </div>
  );
}
