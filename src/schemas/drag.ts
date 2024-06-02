// ************************
// Task Card
// ************************

import { Column, Task } from "@prisma/client";

export interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}
export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

// ************************
// Column
// ************************

export type ColumnType = "Column";

export interface ColumnDragData {
  type: ColumnType;
  column: Column;
}

export interface BoardColumnProps {
  column: Column;
  tasks: Task[];
  isOverlay?: boolean;
}
