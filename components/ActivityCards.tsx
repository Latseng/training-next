import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
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
import { Edit, Plus, SlidersHorizontal, SquarePen, Trash, Trash2, X } from "lucide-react";
import { useState } from "react";
import TrainingActivityDialog from "./TrainingActivityDialog";
import ActivityRecordDialog from "./ActivityRecordDialog";
import { ActivityRecord } from "@/lib/types";
import { ButtonGroup } from "./ui/button-group";
import SetVolumeDialog from "./SetVolumeDialog";

interface ActivityCardsProps {
  note: string;
  id: string
}
interface SelectedSetData {
  id: string;
  weight: number;
  repetition: number;
  set: number;
}

const ActivityCards = ({ note, id }: ActivityCardsProps) => {
  const [trainingCardOpen, setTrainingCardOpen] = useState(false);
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  const [activityCategory, setActivityCategory] = useState("");
  const [activityName, setActivityName] = useState("");
  const [isVolumeDialogOpen, setIsVolumeDialogOpen] = useState(false);
  const [activityRecord, setActivityRecord] = useState<ActivityRecord[]>([]);
  const [isSetVolumeDialog, setIsSetVolumeDialog] = useState(false)
  const [selectedSetData, setSelectedSetData] = useState<SelectedSetData|null>(null);

  // console.log(activityCategory, activityName);
  // console.log(activityRecord);

  // const handleSettingActivity = (category:string) => {
  //   setActivityCategory(category)
  //   setIsActivityDialogOpen(true)
  // }
  // console.log(activityCategory);
  const handleCancelActivity = () => {
    setActivityCategory("");
    setActivityName("");
    setActivityRecord([])
  };

  const handleSetVolume = (id: string, set: number) => {
    setSelectedSetData({...activityRecord.filter((item) => item.id ===id)[0], set: set})
    setIsSetVolumeDialog(true)
  }

  const handleActivityRecordDelete = (id:string) => {
    setActivityRecord((prev) =>
      prev.filter((prevData) => prevData.id !== id)
    );
  }

  const handleActivitySubmit = async () => {
    const activityPayload = {
      sessionId: id,
      name: activityName,
      category: activityCategory,
      activityRecords: activityRecord.map((item, index) => ({setNumber: index + 1, weight: item.weight, repetition: item.repetition}))
    }
    console.log(activityPayload);
 
  }

  return (
    <div>
      <div className="space-y-4">
        <div>
          <p>{note}</p>
        </div>
        {activityName === "" ? (
          <Card>
            <CardHeader>
              <CardTitle>訓練項目</CardTitle>
              {trainingCardOpen && (
                <CardAction>
                  <Button
                    variant="ghost"
                    onClick={() => setTrainingCardOpen(false)}
                  >
                    <X />
                  </Button>
                </CardAction>
              )}
            </CardHeader>
            <CardContent className="flex justify-around">
              {trainingCardOpen ? (
                <div className="space-x-8">
                  <Button onClick={() => setIsActivityDialogOpen(true)}>
                    肌力與體能訓練
                  </Button>
                  <Button disabled>其他</Button>
                </div>
              ) : (
                <p>尚未建立</p>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-2">
              {!trainingCardOpen && (
                <Button
                  className="w-full"
                  onClick={() => setTrainingCardOpen(true)}
                >
                  <Plus />
                  新增訓練項目
                </Button>
              )}
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{activityName}</CardTitle>
              <CardDescription>資料尚未儲存</CardDescription>
              <CardAction>
                {activityRecord.length > 0 && (
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
              {activityRecord.length > 0 ? (
                <>
                  {activityRecord.map((item, index) => (
                    <div
                      key={item.id}
                      className="my-8 flex justify-around items-center"
                    >
                      <p>Set {index + 1}</p>
                      <div className="text-center space-y-2">
                        <p>Weight</p>
                        <p>{item.weight}</p>
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
                          className="hover:bg-red-500 hover:text-white"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleActivityRecordDelete(item.id)}
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
        )}
        <Card>
          <Accordion type="multiple">
            <AccordionItem value="item-1">
              <CardHeader className="flex items-center justify-between">
                <AccordionTrigger>
                  <CardTitle>範例動作一</CardTitle>
                </AccordionTrigger>
                <CardAction>
                  <Button variant="ghost" size="sm">
                    <Trash />
                  </Button>
                </CardAction>
              </CardHeader>
              <AccordionContent>
                <CardContent className="space-y-8">
                  <div className="flex justify-around items-center">
                    <p>Set 1</p>
                    <div className="text-center space-y-2">
                      <p>Weight</p>
                      <p>120</p>
                    </div>
                    <div className="text-center space-y-2">
                      <p>Reps</p>
                      <p>6</p>
                    </div>
                    <Button variant="ghost">
                      <Edit />
                    </Button>
                  </div>
                  <div className="flex justify-around items-center">
                    <p>Set 1</p>
                    <div className="text-center space-y-2">
                      <p>Weight</p>
                      <p>120</p>
                    </div>
                    <div className="text-center space-y-2">
                      <p>Reps</p>
                      <p>6</p>
                    </div>
                    <Button variant="ghost">
                      <Edit />
                    </Button>
                  </div>
                  <div className="flex justify-around items-center">
                    <p>Set 1</p>
                    <div className="text-center space-y-2">
                      <p>Weight</p>
                      <p>120</p>
                    </div>
                    <div className="text-center space-y-2">
                      <p>Reps</p>
                      <p>6</p>
                    </div>
                    <Button variant="ghost">
                      <Edit />
                    </Button>
                  </div>
                </CardContent>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
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
        setActivityRecord={setActivityRecord}
      />
      <SetVolumeDialog
        activityName={activityName}
        isOpen={isSetVolumeDialog}
        setIsOpen={setIsSetVolumeDialog}
        setActivityRecord={setActivityRecord}
        selectedSetData={selectedSetData}
        setSelectedSetData={setSelectedSetData}
      />
    </div>
  );
};

export default ActivityCards;
