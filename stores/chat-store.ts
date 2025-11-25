import { ChatStore, Message } from "@/lib/types";
import { create } from "zustand";

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (message: Message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  updateLoadingMessage: (loadingId: string, newContent: string) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === loadingId
          ? {
              ...msg,
              content: newContent,
              isLoading: false,
              role: "model",
            }
          : msg
      ),
    })),
  reset: () => set({ messages: [] }),
}));
