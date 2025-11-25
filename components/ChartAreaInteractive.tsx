"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
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
import { BotMessageSquare, Check, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ChatBox } from "./ChatBox";
import { ChatInput } from "./ChatInput";
import { useChatStore } from "@/stores/chat-store";
import { format } from "date-fns";

import { API_PROXY } from "@/lib/fetcher";

import { v4 as uuidv4 } from "uuid";
import { AlertMessageDialog } from "./AlertMessageDialog";

type DateRange = {
  from: Date;
  to: Date;
};

interface Props {
  chartData: RangeRecord[];
  range: DateRange;
  setRange: (dateRange: DateRange) => void;
}

const COLORS = [
  "#1D4ED8", // 藍
  "#DC2626", // 紅
  "#059669", // 綠
  "#D97706", // 橘
  "#7C3AED", // 紫
  "#DB2777", // 粉
  "#0891B2", // 青
  "#CA8A04", // 黃/金
  // 輔助對比色
  "#BE185D", // 洋紅
  "#475569", // 灰/中性
  "#65A30D", // Lime 綠
  "#92400E", // 棕
];

const TIME_RANGES = [
  { label: "過去 2 週", days: 14 },
  { label: "過去 1 個月", days: 30 },
  { label: "過去 3 個月", days: 90 },
  { label: "過去 6 個月", days: 180 },
  { label: "過去 1 年", days: 365 },
  { label: "過去 3 年", days: 1095 },
];

export function ChartAreaInteractive({ chartData, setRange, range }: Props) {
  const [days, setDays] = useState("14");
  const [isChatWithAI, setIsChatWithAI] = useState(false);
  const [hasCarryData, setHasCarryData] = useState(false);
  const [isReplyLoading, setIsRelyLoading] = useState(false);
  const [isAlertMessageDialogOpen, setIsAlertMessageDialogOpen] =
    useState(false);
  const today = new Date();

  const handleRangeChange = (dateRange: string) => {
    setDays(dateRange);

    const daysNum = Number(dateRange);
    const from = subDays(today, daysNum);
    const to = today;
    setRange({ from, to });
  };

  const activityKeys = useMemo(() => {
    const keys = new Set<string>();
    chartData.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (key !== "date") keys.add(key);
      });
    });
    return Array.from(keys);
  }, [chartData]);

  // 動態生成 Config
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    activityKeys.forEach((key, index) => {
      config[key] = {
        label: key,
        color: COLORS[index % COLORS.length],
      };
    });
    return config;
  }, [activityKeys]);

  const { messages, addMessage, updateLoadingMessage } = useChatStore();

  async function handleSend(text: string) {
    setIsRelyLoading(true);
    addMessage({ id: uuidv4(), role: "user", content: text });

    const loadingMessageId = uuidv4();

    addMessage({
      id: loadingMessageId,
      role: "model",
      content: "",
      isLoading: true,
    });

    const payload: {
      message: string;
      range?: { start_date: string; end_date: string };
    } = {
      message: text,
    };

    if (hasCarryData) {
      const dateRange = {
        start_date: format(range.from, "yyyy-MM-dd"),
        end_date: format(range.to, "yyyy-MM-dd"),
      };
      payload.range = dateRange;
    }

    try {
      const res = await fetch(`${API_PROXY}/analysis/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        updateLoadingMessage(loadingMessageId, "發生預期外錯誤！請重新再試");
        throw new Error("API 請求失敗");
      }

      const data = await res.json();
      console.log(data);

      updateLoadingMessage(loadingMessageId, data.reply);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRelyLoading(false);
    }
  }

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
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 space-y-4">
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
                type="monotone"
                fill={`url(#fill${key})`}
                stroke={chartConfig[key]?.color}
                strokeWidth={2}
                connectNulls={true}
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
        <div className="flex justify-between">
          {isChatWithAI ? (
            <Button size="sm" variant="ghost" onClick={() => setIsChatWithAI(false)}>
              <X />
              取消對談
            </Button>
          ) : (
            <Button onClick={() => setIsAlertMessageDialogOpen(true)}>
              <BotMessageSquare />
              詢問AI教練
            </Button>
          )}

          {isChatWithAI && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHasCarryData((prev) => !prev)}
            >
              <Check
                strokeWidth={5}
                className={hasCarryData ? `text-green-500` : "text-gray-300"}
              />
              帶入以上區間資料
            </Button>
          )}
        </div>
        {isChatWithAI && (
          <>
            <p className="text-sm italic text-red-400">
              與AI的對話內容將不會儲存，請自行保留相關資料。
            </p>
            <ChatBox messages={messages}>
              <ChatInput onSend={handleSend} isReplyLoading={isReplyLoading} />
            </ChatBox>
          </>
        )}
      </CardContent>
      <AlertMessageDialog
        isOpen={isAlertMessageDialogOpen}
        setIsOpen={setIsAlertMessageDialogOpen}
        setIsChatWithAI={setIsChatWithAI}
      />
    </Card>
  );
}
