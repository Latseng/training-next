import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { TrainingSession } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface RangeRecord {
  date: string;
  // 【索引簽名】：
  // [key: string]: number | string; 表示物件可以有任意的 string 鍵 (key)
  // 且該鍵的值 (value) 必須是 number 或 string
  // 雖然所有值都是 number (重量)，但 date 是 string，
  // 所以需要用聯合型別 (Union Type): number | string
  [key: string]: number | string;
}

export function transformTrainingData(sessions: TrainingSession[], category: string) {
  // 依日期排序（由舊到新）
  const sorted = [...sessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // 轉換每一天資料
  return sorted.map((session) => {
    const { date, activities } = session;

    // 第一天的資料物件
    const rangeRecord: RangeRecord = { date };
    
    activities
      .filter((a) => a.category === category) // 僅 strength
      .forEach((activity) => {
        const maxWeight = Math.max(
          ...activity.records.map((r) => r.weight ?? 0)
        );

        // 動作名稱轉成 key（可選：你也能在這裡做英文 slug 化）
        const key = activity.name;

        rangeRecord[key] = maxWeight;
      });

    return rangeRecord;
  });
}

export function getUniqueTrainingActivities(data: RangeRecord[]) {
  const activitySet = new Set();

  data.forEach((item) => {
    // 取得物件中所有的鍵（key）
    const keys = Object.keys(item);

    keys.forEach((key) => {
      // 排除 "date" 欄位，只將其他鍵視為運動項目
      if (key !== "date") {
        activitySet.add(key);
      }
    });
  });

  // 將 Set 轉換回陣列
  return Array.from(activitySet);
}