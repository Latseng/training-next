"use client";

import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { CirclePlus, SquarePlus, Trash2, X } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { isSameDay, format } from "date-fns";
import { zhTW } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import TrainingItemDialog from "./TrainingItemDialog";
import { Exercise, TrainingActivity } from "@/lib/types";
import TrainingVolumeDialog from "./TrainingVolumeDialog";
import TrainingSessionDialog from "./TrainingSessionDialog";
import { fetcher } from "@/lib/fetcher";

interface TrainingSessionState {
  title: string;
  date: string;
  note: string;
}

const TrainingPrograms = () => {
  const { data, error, isLoading } = useSWR(
    "/training-sessions",
    fetcher
  );
  console.log(data);
  
  const [trainingCardOpen, setTrainingCardOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [programCardOpen, setProgramCardOpen] = useState(false);
  const [isTrainingSessionDialog, setIsTrainingSessionDialog] = useState(false);
  const [trainingSession, setTrainingSession] = useState<TrainingSessionState>({
    title: "",
    date: "",
    note: "",
  });
  const [isTrainingItemDialogOpen, setIsTrainingItemDialogOpen] =
    useState(false);
  const [isTrainingVolumeDialogOpen, setIsTrainingVolumeDialogOpen] =
    useState(false);
  const [tainingProgram, setTrainingProgram] = useState<
    "strength" | "power" | "endurance" | "other"
  >("strength");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseSetting, setExerciseSetting] = useState("");
  const [trainingActivities, setTrainingActivities] = useState<
    TrainingActivity[]
  >([]);

  const [date, setDate] = useState<Date>(new Date());

  const formatDateDisplay = (selectedDate: Date) => {
    // 1. 判斷是否為「今天」
    // isSameDay 會自動比較 selectedDate 與 new Date() (當前時間) 的日期部分，並忽略時間
    if (isSameDay(selectedDate, new Date())) {
      return "今天";
    }

    // 2. 格式化日期
    // 注意：date-fns 的格式字串為 'MM/dd' (大寫 M for 月份，小寫 d for 日期)
    return format(selectedDate, "MM/dd");
  };

  const handleTrainingActivitySetting = (category: string) => {
    setSelectedActivity(category);
  };

  const handleTrainingItemDialogOpen = (
    program: "strength" | "power" | "endurance" | "other"
  ) => {
    setIsTrainingItemDialogOpen(true);
    setTrainingProgram(program);
  };
  const handleVolumeSetting = () => {
    setIsTrainingVolumeDialogOpen(true);
  };
  const handleDeleteExercise = (exercise) => {
    console.log("刪除");
  };

  return (
    <div className="px-4 md:py-4">
      <div className="flex flex-col items-center">
        <h2 className="mb-4 text-2xl">
          訓練日
          <Popover>
            <PopoverTrigger className="mx-2" asChild>
              <Button variant="outline" size="lg" className="text-xl">
                <CalendarIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
              />
            </PopoverContent>
          </Popover>
          {formatDateDisplay(date)}
        </h2>
        <Button
          className="text-blue-700 hover:text-blue-900"
          onClick={() => setIsTrainingSessionDialog(true)}
          variant="ghost"
          size="icon-2xl"
          asChild
        >
          <SquarePlus strokeWidth={1.2} />
        </Button>
        <p className="text-gray-500 font-semibold text-lg md:text-xl">
          新增訓練
        </p>
        <TrainingSessionDialog
          isOpen={isTrainingSessionDialog}
          setIsOpen={setIsTrainingSessionDialog}
          setTrainingSession={setTrainingSession}
          date={date}
        />
      </div>
      {!trainingActivities.length ? (
        <div className="flex flex-col items-center">
          <h3>今天沒有訓練計劃...</h3>
        </div>
      ) : (
        <div>訓練清單</div>
      )}
      <TrainingItemDialog
        isOpen={isTrainingItemDialogOpen}
        setIsOpen={setIsTrainingItemDialogOpen}
        program={tainingProgram}
        setExerciseSetting={setExerciseSetting}
      />
      <TrainingVolumeDialog
        isOpen={isTrainingVolumeDialogOpen}
        setIsOpen={setIsTrainingVolumeDialogOpen}
        exercise={exerciseSetting}
        setTrainingSessios={setTrainingActivities}
      />
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>範例</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
        {data ? (
          data.map((item, index) => (
            <AccordionItem key={item.id} value={`訓練 ${index + 1}`}>
              <div className="flex items-center justify-between">
                <AccordionTrigger>{item.title !== "" ? item.title : `訓練 ${index + 1}`}</AccordionTrigger>
                <Button
                  className="hover:bg-red-500 hover:text-white"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteExercise(index)}
                >
                  <Trash2 />
                </Button>
              </div>
              <AccordionContent>
                <Button></Button>
              </AccordionContent>
            </AccordionItem>
          ))
        ) : (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        )}
      </Accordion>
    </div>
  );
};

export default TrainingPrograms;
