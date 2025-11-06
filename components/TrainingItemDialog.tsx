import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Dispatch, SetStateAction } from "react";
import { Exercise } from "@/lib/types";

interface TainingItemDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setExercises: Dispatch<SetStateAction<Exercise[]>>;
  program: "strength" | "power" | "endurance" | "other";
}

const programMap: Record<TainingItemDialogProps["program"], string> = {
  strength: "肌力",
  power: "爆發力",
  endurance: "耐力",
  other: "其他",
};

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

const TrainingItemDialog = ({
  isOpen,
  setIsOpen,
  setExercises,
  program,
}: TainingItemDialogProps) => {
  const dialogTitle = programMap[program];

  const handleCreateTrainingProgram = (exercise: Exercise) => {
    setIsOpen(false)
    console.log(exercise);
    setExercises(prev => [...prev, exercise]);
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        setIsOpen(isOpen);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}訓練</DialogTitle>
          <DialogDescription>設定動作項目</DialogDescription>
        </DialogHeader>
        {program === "strength" && (
          <>
            <div>
              <p className="m-2">下肢</p>
              <div className="m-2 flex flex-wrap gap-4">
                {strength.upper.map((item, index) => (
                  <Button
                    key={index}
                    onClick={() =>
                      handleCreateTrainingProgram({
                        name: item,
                        weight: 0,
                        sets: 0,
                        reps: 0,
                      })
                    }
                  >
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
                    onClick={() =>
                      handleCreateTrainingProgram({
                        name: item,
                        weight: 0,
                        sets: 0,
                        reps: 0,
                      })
                    }
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}
        {program === "power" && (
          <div className="flex flex-wrap gap-4">
            {power.map((item, index) => (
              <Button
                key={index}
                onClick={() =>
                  handleCreateTrainingProgram({
                    name: item,
                    weight: 0,
                    sets: 0,
                    reps: 0,
                  })
                }
              >
                {item}
              </Button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TrainingItemDialog;
