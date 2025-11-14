"use client";

import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { SquarePlus } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { isSameDay, format } from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import TrainingSessionDialog from "./TrainingSessionDialog";
import { fetcher } from "@/lib/fetcher";
import SessionList from "./SessionList";

const API_ENDPOINT = "/api/training-sessions";

const TrainingSessions = () => {
  const { data, mutate } = useSWR(API_ENDPOINT, fetcher);
  const [isTrainingSessionDialog, setIsTrainingSessionDialog] = useState(false);

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
          date={date}
          mutate={mutate}
        />
      </div>
      <SessionList
        sessionData={data}
        API_ENDPOINT={API_ENDPOINT}
        mutate={mutate}
        date={date}
      />
    </div>
  );
};

export default TrainingSessions;
