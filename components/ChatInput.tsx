"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (text: string) => void;
  isReplyLoading: boolean
}

export function ChatInput({ onSend, isReplyLoading }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  return (
    <div className="py-4 flex gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend}
        placeholder="請你幫我評估目前的訓練紀錄..."
      />
      <Button onClick={handleSend} disabled={isReplyLoading} type="button">
        <Send />
      </Button>
    </div>
  );
}
