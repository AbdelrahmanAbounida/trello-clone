import {
  ColumnWithTasks,
  TaskWithColumnWithActivities,
  TaskWithcolumn,
} from "@/schemas/drag-schemas";
import { Task } from "@prisma/client";
import { create } from "zustand";

type BoardStore = {
  // tasks
  taskToBeShown: TaskWithColumnWithActivities | null;
  setTaskTobeShow: (task: TaskWithColumnWithActivities | null) => void;
  setcolTasks: (newTasks: Task[], col: ColumnWithTasks) => void; // update tasks position in a col

  // cols
  cols: ColumnWithTasks[];
  addCols: (newCols: ColumnWithTasks[]) => void; // on adding new col
  setCols: (allCols: ColumnWithTasks[]) => void; // on dragging cols
};

export const useCurrentBoard = create<BoardStore>((set) => ({
  // cols
  cols: [],
  addCols(newCol) {
    // set({cols: [...this.cols,newCol]})
    set((state) => ({ cols: [...state.cols, ...newCol] }));
  },
  setCols(allCols) {
    set({ cols: allCols });
  },
  // task
  taskToBeShown: null,
  setTaskTobeShow(task) {
    set({ taskToBeShown: task });
  },
  setcolTasks(newTasks, newCol) {
    if (!newCol) return;
    set((state) => ({
      cols: state.cols.map((column) =>
        column.id == newCol.id ? { ...column, tasks: newTasks } : column
      ),
    }));
  },
}));
