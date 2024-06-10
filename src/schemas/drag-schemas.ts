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
export interface ColumnWithTasks extends Column {
  tasks: Task[];
}

export type ColumnType = "Column";

export interface ColumnDragData {
  type: ColumnType;
  column: ColumnWithTasks;
}

export interface BoardColumnProps {
  column: ColumnWithTasks;
  tasks: Task[];
  isOverlay?: boolean;
}
