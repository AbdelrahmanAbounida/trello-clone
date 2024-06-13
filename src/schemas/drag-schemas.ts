// ************************
// Task Card
// ************************

import { Activity, Column, Task } from "@prisma/client";

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

export interface TaskWithcolumn extends Task {
  column: ColumnWithTasks;
}
// export interface TaskWithColumnWithActivities extends Task {
//   column: ColumnWithTasks;
//   activities: Activity
// }

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
