"use client";

import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { isSameDay, format } from "date-fns";
import { zhTW } from "date-fns/locale";

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

const API_ENDPOINT = "/training-sessions";

const TrainingSessions = () => {
   const [date, setDate] = useState<Date>(new Date());
  const params = new URLSearchParams();

  params.append("start_date", format(date, "yyyy-MM-dd"));

  const swrKey = `${API_ENDPOINT}/with-activities?${params.toString()}`;
  const { data, mutate } = useSWR(swrKey, fetcher);
  
  const [isTrainingSessionDialog, setIsTrainingSessionDialog] = useState(false);

  const formatDateDisplay = (selectedDate: Date) => {
    if (isSameDay(selectedDate, new Date())) {
      return "今天";
    }

    return format(selectedDate, "MM/dd");
  };

  return (
    <div className="md:px-4 md:py-4">
      <div className="flex flex-col items-center my-4">
        <div className="space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="lg" className="text-xl">
                <CalendarIcon />
                {formatDateDisplay(date)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                locale={zhTW}
              />
            </PopoverContent>
          </Popover>
          <Button onClick={() => setIsTrainingSessionDialog(true)}>
            <Plus />
            新增訓練計畫
          </Button>
        </div>
      </div>
      <SessionList
        sessionData={data}
        API_ENDPOINT={API_ENDPOINT}
        mutate={mutate}
        date={date}
      />
      <TrainingSessionDialog
        isOpen={isTrainingSessionDialog}
        setIsOpen={setIsTrainingSessionDialog}
        date={date}
        mutate={mutate}
      />
    </div>
  );
};

export default TrainingSessions;
