import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

interface AlertMessageDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setIsChatWithAI: (isChatWithAI: boolean) => void;
}

export function AlertMessageDialog({
  isOpen,
  setIsOpen,
  setIsChatWithAI,
}: AlertMessageDialogProps) {
  const handleChatWithAI = () => {
    setIsChatWithAI(true)
    setIsOpen(false)
  }
  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>使用同意書</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="px-4 text-sm space-y-4">
          <p>AI回覆內容僅供參考，若有醫療上的問題，請洽專業醫療人員。</p>
          <p>與AI的對話內容將不會儲存，請自行留存相關資料。</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            取消
          </Button>
          <Button onClick={handleChatWithAI}>同意並繼續</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
