export type Task = {
  id: number;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "done";
  created_at: string;
  updated_at: string;
  _isOptimistic?: boolean; // Flag to identify optimistic updates
};
