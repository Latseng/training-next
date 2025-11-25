"use client";

import { subDays } from "date-fns";
import { format } from "date-fns";

import { useEffect, useState } from "react";

import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import { RangeRecord, transformTrainingData } from "@/lib/utils";
import { ChartAreaInteractive } from "./ChartAreaInteractive";
import { Button } from "./ui/button";
import { Undo2 } from "lucide-react";
import Link from "next/link";

const API_ENDPOINT = "/training-sessions";
const today = new Date();
const initialRange = {
  from: subDays(today, 14),
  to: today,
};

export function TrainingDataAnalysis() {
  const [range, setRange] = useState(initialRange);
  const [chartData, setChartData] = useState<RangeRecord[]>([]);
  const params = new URLSearchParams();

  params.append("start_date", format(range.from, "yyyy-MM-dd"));
  params.append("end_date", format(range.to, "yyyy-MM-dd"));
  
  const swrKey = `${API_ENDPOINT}/with-activities?${params.toString()}`;

  const { data } = useSWR(swrKey, fetcher);

  useEffect(() => {
    if (data) {
      const getChartData = transformTrainingData(data, "strength");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChartData(getChartData);
    }
  }, [data]);

  return (
    <div className="p-4 md:w-5/6 mx-auto space-y-4">
      <ChartAreaInteractive chartData={chartData} setRange={setRange} range={range} />
      <Button variant="outline" asChild>
        <Link href="/">
          <Undo2 />
          返回主頁
        </Link>
      </Button>
    </div>
  );
}
