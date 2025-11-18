import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, SlidersHorizontal, X } from "lucide-react";
import { Button } from "./ui/button";
import { ActivityRecord } from "@/lib/types";
import TempActivityRecordList from "./TempActivityRecordList";

interface TempActivityCardProps {
  setIsActivityDialogOpen: (open: boolean) => void;
  activityName: string;
  activityRecordTemp: ActivityRecord[];
  setIsSetVolumeDialog: (open: boolean) => void;
  setIsVolumeDialogOpen: (open: boolean) => void;
  handleCancelActivity: () => void;
  handleSetVolume: (id: string, set: number) => void;
  handleActivityRecordTempDelete: (id: string) => void;
  handleActivitySubmit: () => void;
  isTrainingCardOpen: boolean;
  setIsTrainingCardOpen: (open: boolean) => void;
}

const TempActivityCard = ({
  setIsActivityDialogOpen,
  activityName,
  activityRecordTemp,
  setIsSetVolumeDialog,
  setIsVolumeDialogOpen,
  handleCancelActivity,
  handleSetVolume,
  handleActivityRecordTempDelete,
  handleActivitySubmit,
  isTrainingCardOpen,
  setIsTrainingCardOpen,
}: TempActivityCardProps) => {
  return (
    <>
      {isTrainingCardOpen ? (
        activityName === "" ? (
          <Card>
            {isTrainingCardOpen && (
              <CardHeader>
                <CardTitle>訓練項目</CardTitle>

                <CardAction>
                  <Button
                    variant="destructive"
                    onClick={() => setIsTrainingCardOpen(false)}
                  >
                    <X />
                  </Button>
                </CardAction>
              </CardHeader>
            )}
            <CardContent className="flex justify-around">
              {isTrainingCardOpen && (
                <div className="space-x-8">
                  <Button onClick={() => setIsActivityDialogOpen(true)}>
                    肌力與體能訓練
                  </Button>
                  <Button disabled>其他</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{activityName}</CardTitle>
              <CardAction>
                <div className="space-x-2">
                  {activityRecordTemp.length > 0 && (
                    <Button onClick={() => setIsSetVolumeDialog(true)}>
                      <Plus /> 新增組數
                    </Button>
                  )}
                  <Button variant="destructive" onClick={handleCancelActivity}>
                    <X />
                  </Button>
                </div>
              </CardAction>
            </CardHeader>
            <CardContent className="text-center">
              {activityRecordTemp.length > 0 ? (
                <>
                  <TempActivityRecordList
                    activityRecordTemp={activityRecordTemp}
                    handleSetVolume={handleSetVolume}
                    handleActivityRecordTempDelete={
                      handleActivityRecordTempDelete
                    }
                  />
                  <Button onClick={handleActivitySubmit}>儲存</Button>
                </>
              ) : (
                <Button onClick={() => setIsVolumeDialogOpen(true)}>
                  <SlidersHorizontal />
                  訓練量設定
                </Button>
              )}
            </CardContent>
          </Card>
        )
      ) : (
        <Button className="w-full" onClick={() => setIsTrainingCardOpen(true)}>
          <Plus />
          新增訓練項目
        </Button>
      )}
    </>
  );
};

export default TempActivityCard;
