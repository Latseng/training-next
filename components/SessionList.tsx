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
import TrainingSessionDialog from "./TrainingSessionDialog";
import ActivityCards from "./ActivityCards";

interface SessionListProps {
  sessionData: TrainingSession[];
  API_ENDPOINT: string;
  mutate: KeyedMutator<TrainingSession[]>;
  date: Date;
}

const SessionList = ({
  sessionData,
  API_ENDPOINT,
  mutate,
  date,
}: SessionListProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [selectedSessionData, setSelectedSessionData] =
    useState<TrainingSession | null>(null);
  const [isTrainingSessionDialog, setIsTrainingSessionDialog] = useState(false);

  const handleEditSession = async (id: string) => {
    const selectedData = sessionData.filter((data) => data.id === id)[0];
    setSelectedSessionData(selectedData);
    setIsTrainingSessionDialog(true);
  };

  const handleDeleteDialog = (id: string) => {
    setIsDeleteDialogOpen(true);
    setSelectedSessionId(id);
  };
  const handleDeleteSession = async (id: string) => {
    try {
      const isSuccess = await mutateFetcher(API_ENDPOINT, "DELETE", id);
      mutate(); // 再重新驗證
      if (isSuccess) toast.success("刪除訓練成功");
    } catch (error) {
      // 若失敗就回滾
      mutate(sessionData, false);
      console.error(error);
    }
  };
  return (
    <>
      <Accordion type="multiple">
        {sessionData ? (
          sessionData.length > 0 ? (
            sessionData.map((item, index) => (
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
                <AccordionContent className="px-8 space-y-4">
                  <ActivityCards note={item.note} id={item.id}  />
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
      <TrainingSessionDialog
        isOpen={isTrainingSessionDialog}
        setIsOpen={setIsTrainingSessionDialog}
        date={date}
        mutate={mutate}
        initialData={selectedSessionData}
      />
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        id={selectedSessionId}
        handleDelete={handleDeleteSession}
      />
    </>
  );
};

export default SessionList;
