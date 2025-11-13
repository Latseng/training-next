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
  date: string
  create_at: string
}

export type TrainingSessionCreateRequest = Omit<TrainingSession, "id" | "create_at" | "user_id">;

export interface TrainingActivity {
  name: string;
  category: string;
  description: string;
}

export interface ActivityRecords {
  set: number;
  weight: number;
  repetition: number;
}
