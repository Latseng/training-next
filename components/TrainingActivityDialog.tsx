import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Undo2 } from "lucide-react";

interface TainingActivityDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setActivityCategory: (category: string) => void;
  activityCategory: string;
  setActivityName: (name: string) => void;
  // setExerciseSetting: (exercise: string) => void
  // program: "strength" | "power" | "endurance" | "other";
}

// const programMap: Record<TainingActivityDialogProps["program"], string> = {
//   strength: "肌力",
//   power: "爆發力",
//   endurance: "耐力",
//   other: "其他",
// };

const strength = {
  upper: [
    "前蹲舉",
    "背蹲舉",
    "分腿蹲",
    "後腳抬高蹲",
    "側蹲",
    "羅馬尼亞式硬舉",
    "硬舉",
    "相撲硬舉",
    "早安運動",
    "單腳羅馬尼亞式硬舉",
  ],
  lower: ["臥推", "肩推", "伏地挺身", "划船", "引體向上"],
};
const power = [
  "反跳窄抓舉",
  "反跳上膊",
  "爆發式頸後推",
  "爆發式頸前推／爆發上推",
  "寬站姿單手抓舉",
  "窄站姿單手抓舉",
  "跳箱訓練",
];

const TrainingActivityDialog = ({
  isOpen,
  setIsOpen,
  setActivityCategory,
  activityCategory,
  setActivityName,
}: TainingActivityDialogProps) => {
  
  const handleActivitySelected = (name:string) => {
    setActivityName(name)
    setIsOpen(false)
  }
  // const handleCreateTrainingProgram = (exercise: string) => {
  //   setIsOpen(false)
  //   setExerciseSetting(exercise);
  //   // setExercises(prev => [...prev, exercise]);
  // }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        setIsOpen(isOpen);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>訓練項目</DialogTitle>
          <DialogDescription>設定動作項目</DialogDescription>
        </DialogHeader>
        {activityCategory === "" && (
          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={() => setActivityCategory("strength")}>
              肌力
            </Button>
            <Button onClick={() => setActivityCategory("power")}>爆發力</Button>
            <Button onClick={() => setActivityCategory("endurance")}>
              耐力
            </Button>
            <Button disabled onClick={() => setActivityCategory("other")}>
              其他
            </Button>
          </div>
        )}
        {activityCategory === "strength" && (
          <>
            <div>
              <p className="m-2">下肢</p>
              <div className="m-2 flex flex-wrap gap-4">
                {strength.upper.map((item, index) => (
                  <Button key={index} onClick={() => handleActivitySelected(item)}>
                    {item}
                  </Button>
                ))}
              </div>
            </div>
            <hr />
            <div>
              <p className="m-2">上肢</p>
              <div className="m-2 flex flex-wrap gap-4">
                {strength.lower.map((item, index) => (
                  <Button
                    key={index}
                    onClick={() => handleActivitySelected(item)}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}
        {activityCategory === "power" && (
          <div className="flex flex-wrap gap-4">
            {power.map((item, index) => (
              <Button key={index} onClick={() => handleActivitySelected(item)}>
                {item}
              </Button>
            ))}
          </div>
        )}
        {activityCategory !== "" && (
          <DialogFooter>
            <Button variant="outline" onClick={() => setActivityCategory("")}>
              <Undo2 />
              返回
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TrainingActivityDialog;
