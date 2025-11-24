"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { subDays } from "date-fns";
import { RangeRecord } from "@/lib/utils";
import { Button } from "./ui/button";
type DateRange = {
  from: Date;
  to: Date;
};

interface Props {
  chartData: RangeRecord[];
  setRange: (dateRange: DateRange) => void
}

// 2. 使用 Hex 色碼，確保線條一定看得到
const COLORS = [
  "#2563eb", // 藍色
  "#e11d48", // 紅色
  "#059669", // 綠色
  "#d97706", // 橘色
  "#7c3aed", // 紫色
  "#db2777", // 粉紅
  "#0891b2", // 青色
];

// 3. 定義時間區間選項對應的天數
const TIME_RANGES = [
  { label: "過去 2 週", days: 14 },
  { label: "過去 1 個月", days: 30 },
  { label: "過去 3 個月", days: 90 },
  { label: "過去 6 個月", days: 180 },
  { label: "過去 1 年", days: 365 },
  { label: "過去 3 年", days: 1095 },
];

export function ChartAreaInteractive({ chartData, setRange }: Props) {
  const [days, setDays] = React.useState("14");
  const today = new Date();
  
  const handleRangeChange = (dateRange: string) => {
    setDays(dateRange);

    const daysNum = Number(dateRange);
    const from = subDays(today, daysNum);
    const to = today;
    setRange({ from, to });
  };
  
  const activityKeys = React.useMemo(() => {
    const keys = new Set<string>();
    chartData.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (key !== "date") keys.add(key);
      });
    });
    return Array.from(keys);
  }, [chartData]);

  // 動態生成 Config
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    activityKeys.forEach((key, index) => {
      config[key] = {
        label: key,
        color: COLORS[index % COLORS.length],
      };
    });
    return config;
  }, [activityKeys]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>訓練趨勢圖</CardTitle>
          <CardDescription>各項目訓練強度變化</CardDescription>
        </div>
        <Select
          value={days}
          onValueChange={(value) => handleRangeChange(value)}
        >
          <SelectTrigger className="w-[180px] rounded-lg sm:ml-auto">
            <SelectValue placeholder="選擇時間範圍" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {TIME_RANGES.map(({ label, days }) => (
              <SelectItem
                key={label}
                value={days.toString()}
                className="rounded-lg"
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              {activityKeys.map((key) => (
                <linearGradient
                  key={key}
                  id={`fill${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={chartConfig[key]?.color}
                    stopOpacity={0.6} // 降低不透明度，因為現在圖層會重疊
                  />
                  <stop
                    offset="95%"
                    stopColor={chartConfig[key]?.color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("zh-TW", {
                  month: "numeric",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            {activityKeys.map((key) => (
              <Area
                key={key}
                dataKey={key}
                type="monotone" // 建議用 monotone，連線會比較自然
                fill={`url(#fill${key})`}
                stroke={chartConfig[key]?.color}
                strokeWidth={2}
                // 【重點 1】：移除 stackId="a"
                // stackId="a"  <-- 刪除這行

                // 【重點 2】：加入 connectNulls
                connectNulls={true}
                // 為了讓重疊時看得清楚，可以設定這行，讓該 Area 稍微浮在上方 (這行非必要，看視覺效果)
                fillOpacity={0.4}
              />
            ))}
            <ChartLegend
              content={
                <ChartLegendContent className="flex-wrap gap-2 text-[10px] sm:text-sm" />
              }
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
