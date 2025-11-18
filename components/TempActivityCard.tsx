import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, SlidersHorizontal, SquarePen, Trash2, X } from "lucide-react";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { ActivityRecord } from "@/lib/types";

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
  isTrainingCardOpen: boolean
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
                    variant="ghost"
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
              <CardDescription>資料尚未儲存</CardDescription>
              <CardAction>
                {activityRecordTemp.length > 0 && (
                  <Button onClick={() => setIsSetVolumeDialog(true)}>
                    + 新增組數
                  </Button>
                )}
                <Button variant="ghost" onClick={handleCancelActivity}>
                  <X />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="text-center">
              {activityRecordTemp.length > 0 ? (
                <>
                  {activityRecordTemp.map((item, index) => (
                    <div
                      key={item.id}
                      className="my-8 flex justify-around items-center"
                    >
                      <p>Set {index + 1}</p>
                      <div className="text-center space-y-2">
                        <p>Weight</p>
                        <p>{item.weight}（Kg）</p>
                      </div>
                      <div className="text-center space-y-2">
                        <p>Reps</p>
                        <p>{item.repetition}</p>
                      </div>
                      <ButtonGroup>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetVolume(item.id, index + 1)}
                        >
                          <SquarePen />
                        </Button>
                        <Button
                          className="hover:bg-red-600 hover:text-white"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleActivityRecordTempDelete(item.id)
                          }
                        >
                          <Trash2 />
                        </Button>
                      </ButtonGroup>
                    </div>
                  ))}
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
