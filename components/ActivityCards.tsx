import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "./ui/button";
import { SlidersHorizontal, SquarePen, Trash2, X } from "lucide-react";
import { useState } from "react";
import TrainingActivityDialog from "./TrainingActivityDialog";
import ActivityRecordDialog from "./ActivityRecordDialog";
import { ActivityRecord, TrainingActivity } from "@/lib/types";
import { ButtonGroup } from "./ui/button-group";
import SetVolumeDialog from "./SetVolumeDialog";
import { toast } from "sonner";

import type { KeyedMutator } from "swr";
import { TrainingSession } from "@/lib/types";
import DeleteDialog from "./DeleteDialog";
import { mutateFetcher } from "@/lib/fetcher";
import TempActivityCard from "./TempActivityCard";

interface ActivityCardsProps {
  note: string;
  id: string;
  mutate: KeyedMutator<TrainingSession[]>;
  activityData: TrainingActivity[];
}

interface SelectedSetData {
  id: string;
  weight: number;
  repetition: number;
  set: number;
}

const ActivityCards = ({
  note,
  id,
  activityData,
  mutate,
}: ActivityCardsProps) => {
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  const [activityCategory, setActivityCategory] = useState("");
  const [activityName, setActivityName] = useState("");
  const [isVolumeDialogOpen, setIsVolumeDialogOpen] = useState(false);
  const [activityRecordTemp, setActivityRecordTemp] = useState<
    ActivityRecord[]
  >([]);
  const [isSetVolumeDialog, setIsSetVolumeDialog] = useState(false);
  const [selectedSetData, setSelectedSetData] =
    useState<SelectedSetData | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [isResetVolume, setIsResetVolume] = useState(false);
  const [isTrainingCardOpen, setIsTrainingCardOpen] = useState(false);

  const handleCancelActivity = () => {
    setActivityCategory("");
    setActivityName("");
    setActivityRecordTemp([]);
  };

  const handleSetVolume = (id: string, set: number) => {
    setSelectedSetData({
      ...activityRecordTemp.filter((item) => item.id === id)[0],
      set: set,
    });
    setIsSetVolumeDialog(true);
  };

  const handleActivityRecordTempDelete = (id: string) => {
    setActivityRecordTemp((prev) =>
      prev.filter((prevData) => prevData.id !== id)
    );
  };

  const handleActivitySubmit = async () => {
    const activityPayload = {
      session_id: id,
      name: activityName,
      category: activityCategory,
      activity_records: activityRecordTemp.map((item, index) => ({
        set_number: index + 1,
        weight: item.weight,
        repetition: item.repetition,
      })),
    };

    try {
      const response = await fetch(
        "http://localhost:8000/api/training-activities",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(activityPayload),
        }
      );

      if (response.ok) {
        mutate();
        setActivityName("");
        setActivityCategory("");
        setActivityRecordTemp([]);
        setIsTrainingCardOpen(false)
        toast.success("建立資料成功");
      } else {
        toast.warning("建立資料失敗");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDialog = (id: string) => {
    setIsDeleteDialogOpen(true);
    setSelectedActivityId(id);
  };

  const handleDeleteActivity = async (id: string) => {
    try {
      const isSuccess = await mutateFetcher(
        "/api/training-activities",
        "DELETE",
        id
      );
      mutate();
      if (isSuccess) toast.success("刪除訓練項目成功");
    } catch (error) {
      console.error(error);
      toast.error("刪除訓練項目失敗");
    }
  };

  // 編輯訓練量資料
  const handleResetVolume = (
    selectedActivityId: string,
    activityRecord: ActivityRecord[]
  ) => {
    setActivityRecordTemp(activityRecord);
    setSelectedActivityId(selectedActivityId);
    setIsResetVolume(true);
  };

  // 取消編輯訓練量資料
  const handleResetVolumeCancel = () => {
    setActivityRecordTemp([]);
    setSelectedActivityId("");
    setIsResetVolume(false);
  };
console.log(activityData);

  return (
    <div>
      <div className="space-y-4 my-4">
        <TempActivityCard
          setIsActivityDialogOpen={setIsActivityDialogOpen}
          activityName={activityName}
          activityRecordTemp={activityRecordTemp}
          setIsSetVolumeDialog={setIsSetVolumeDialog}
          setIsVolumeDialogOpen={setIsVolumeDialogOpen}
          handleCancelActivity={handleCancelActivity}
          handleSetVolume={handleSetVolume}
          handleActivityRecordTempDelete={handleActivityRecordTempDelete}
          handleActivitySubmit={handleActivitySubmit}
          isTrainingCardOpen={isTrainingCardOpen}
          setIsTrainingCardOpen={setIsTrainingCardOpen}
        />
        {activityData.length > 0 ? (
          activityData.map((activity) => (
            <Card key={activity.id}>
              <Accordion type="multiple">
                <AccordionItem value="item-1">
                  <CardHeader className="flex items-center justify-between">
                    <AccordionTrigger>
                      <CardTitle>{activity.name}</CardTitle>
                    </AccordionTrigger>
                    <CardAction>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-red-600 hover:text-white"
                        onClick={() => handleDeleteDialog(activity.id)}
                      >
                        <Trash2 />
                      </Button>
                    </CardAction>
                  </CardHeader>
                  <AccordionContent>
                    <CardContent>
                      {isResetVolume && selectedActivityId === activity.id ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleResetVolumeCancel()}
                        >
                          <X />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleResetVolume(
                              activity.id,
                              activity.records
                            )
                          }
                        >
                          <SlidersHorizontal />
                        </Button>
                      )}
                      <div className="space-y-8 my-4">
                        {activity.records.map((record) => (
                          <div
                            key={record.id}
                            className="flex justify-around items-center"
                          >
                            <p>Set：{record.set_number}</p>
                            <div className="text-center space-y-2">
                              <p>Weight</p>
                              <p>{record.weight}</p>
                            </div>
                            <div className="text-center space-y-2">
                              <p>Reps</p>
                              <p>{record.repetition}</p>
                            </div>
                            {isResetVolume &&
                              selectedActivityId === activity.id && (
                                <ButtonGroup>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleSetVolume(
                                        record.id,
                                        record.set_number
                                      )
                                    }
                                  >
                                    <SquarePen />
                                  </Button>
                                  <Button
                                    className="hover:bg-red-600 hover:text-white"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      console.log("刪除", record.id)
                                    }
                                  >
                                    <Trash2 />
                                  </Button>
                                </ButtonGroup>
                              )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    {isResetVolume && selectedActivityId === activity.id && (
                      <CardFooter>
                        <Button className="w-full">儲存</Button>
                      </CardFooter>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent>
              <p className="font-semibold text-center">尚未建立訓練項目</p>
            </CardContent>
          </Card>
        )}
        <p>備註：{note === "" ? "無" : note}</p>
      </div>
      <TrainingActivityDialog
        isOpen={isActivityDialogOpen}
        setIsOpen={setIsActivityDialogOpen}
        setActivityCategory={setActivityCategory}
        activityCategory={activityCategory}
        setActivityName={setActivityName}
      />
      <ActivityRecordDialog
        isOpen={isVolumeDialogOpen}
        setIsOpen={setIsVolumeDialogOpen}
        activityName={activityName}
        setActivityRecordTemp={setActivityRecordTemp}
      />
      <SetVolumeDialog
        activityName={activityName}
        isOpen={isSetVolumeDialog}
        setIsOpen={setIsSetVolumeDialog}
        setActivityRecordTemp={setActivityRecordTemp}
        selectedSetData={selectedSetData}
        setSelectedSetData={setSelectedSetData}
      />
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        id={selectedActivityId}
        handleDelete={handleDeleteActivity}
        type="訓練項目"
      />
    </div>
  );
};

export default ActivityCards;
