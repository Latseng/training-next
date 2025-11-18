export interface Exercise {
  name: string; // 訓練動作名稱 (例如：深蹲、臥推)
  weight: number; // 強度（重量）
  sets: number; // 組數
  reps: number; // 次數
}

export interface TrainingSession {
  id: string;
  user_id: string;
  title: string;
  note: string;
  date: string;
  activities: TrainingActivity[]
  create_at: string;
}

export type TrainingSessionCreateRequest = Omit<TrainingSession, "id" | "create_at" | "user_id" | "activities">;

export interface TrainingActivity {
  id: string;
  session_id: string;
  name: string;
  category: string;
  description: string;
  records: ActivityRecord[]
}

export interface ActivityRecord {
  id: string;
  setNumber: number;
  activityId?: string;
  weight: number;
  repetition: number;
}
