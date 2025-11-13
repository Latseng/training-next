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

interface DeleteDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  id: string;
  handleDelete: (id: string) => void;
}

const DeleteDialog = ({
  isOpen,
  setIsOpen,
  id,
  handleDelete,
}: DeleteDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>確定要刪除嗎？</AlertDialogTitle>
          <AlertDialogDescription>注意：本操作無法復原</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete(id)}>
            確定
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
