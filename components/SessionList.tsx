import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "./ui/button-group";
import { TrainingSession } from "@/lib/types";
import { SquarePen, Trash2 } from "lucide-react";

import DeleteDialog from "./DeleteDialog";
import { useState } from "react";
import { mutateFetcher } from "@/lib/fetcher";

import type { KeyedMutator } from "swr";
import { toast } from "sonner";

interface SessionListProps {
  data: TrainingSession[];
  API_ENDPOINT: string;
  mutate: KeyedMutator<TrainingSession[]>;
}

const SessionList = ({
  data,
  API_ENDPOINT,
  mutate
}: SessionListProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteSessionId, setDeleteSessionId] = useState("");
  const handleEditSession = (id: string) => {
    console.log(id);
  };
  const handleDeleteDialog = (id: string) => {
    setIsDeleteDialogOpen(true)
    setDeleteSessionId(id)
  }
  const handleDeleteSession = async (id: string) => {
    try {
      const isSuccess = await mutateFetcher(API_ENDPOINT, "DELETE", id);
      mutate(); // 再重新驗證
      if(isSuccess) toast.success("刪除訓練成功")
    } catch (error) {
      // 若失敗就回滾
      mutate(data, false);
      console.error(error);
    }
  };
  return (
    <>
      <Accordion type="multiple">
        {data ? (
          data.length > 0 ? (
            data.map((item, index) => (
              <AccordionItem key={item.id} value={`訓練 ${index + 1}`}>
                <div className="px-4 py-2 flex items-center justify-between">
                  <AccordionTrigger>
                    {item.title !== "" ? item.title : `訓練 ${index + 1}`}
                  </AccordionTrigger>
                  <ButtonGroup>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditSession(item.id)}
                    >
                      <SquarePen />
                    </Button>
                    <Button
                      className="hover:bg-red-500 hover:text-white"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDialog(item.id)}
                    >
                      <Trash2 />
                    </Button>
                  </ButtonGroup>
                </div>
                <AccordionContent className="px-8">
                  <div>訓練{index}的內容</div>
                </AccordionContent>
              </AccordionItem>
            ))
          ) : (
            <h3>今天還沒有訓練計劃...</h3>
          )
        ) : (
          <div className="space-y-2">
            <Skeleton className="h-8 w-100" />
            <Skeleton className="h-8 w-80" />
          </div>
        )}
      </Accordion>
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        id={deleteSessionId}
        handleDelete={handleDeleteSession}
      />
    </>
  );
};

export default SessionList;
