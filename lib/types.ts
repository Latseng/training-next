export interface Exercise {
  name: string;
  weight: number;
  sets: number;
  reps: number;
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
  setNumber?: number;
  activityId?: string;
  weight: number;
  repetition: number;
}

export interface Message {
  id: string;
  content: string;
  isLoading?: boolean;
  role: "user" | "model";
}

export type ChatStore = {
  messages: Message[];
  addMessage: (message: Message) => void;
  updateLoadingMessage: (loadingId: string, newContent: string) => void;
  reset: () => void;
};