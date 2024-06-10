"use client";
import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  useSensor,
  useSensors,
  KeyboardSensor,
  Announcements,
  UniqueIdentifier,
  TouchSensor,
  MouseSensor,
  useDndContext,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { cva } from "class-variance-authority";
import { ScrollBar } from "@/components/ui/scroll-area";
import { Column, Task } from "@prisma/client";
import { coordinateGetter, hasDraggableData } from "@/utils/drag-utils";
import { BoardColumn } from "./column";
import { TaskCard } from "./task-card";
import { ColumnWithTasks } from "@/schemas/drag-schemas";

// const defaultCols = [
//   {
//     id: uuid4(),
//     boardId: uuid4(),
//     createdAt: new Date(),
//     position: 1,
//     title: "Test Column",
//     updatedAt: new Date(),
//   },
//   {
//     id: uuid4(),
//     boardId: uuid4(),
//     createdAt: new Date(),
//     position: 1,
//     title: "Test Column2",
//     updatedAt: new Date(),
//   },
// ] satisfies Column[];

// const initialTasks = [
//   {
//     id: uuid4(),
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     columnId: defaultCols[0].id,
//     description: "Card one description",
//     title: "Card one",
//   },
//   {
//     id: uuid4(),
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     columnId: defaultCols[0].id,
//     description: "Card one description",
//     title: "Card two",
//   },
//   {
//     id: uuid4(),
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     columnId: defaultCols[1].id,
//     description: "Card one description",
//     title: "Card three",
//   },
// ] satisfies Task[];

export type ColumnId = string; //(typeof defaultCols)[number]["id"];

export function KanbanBoard({
  boardColumns,
}: {
  boardColumns: ColumnWithTasks[];
}) {
  const [columns, setColumns] = useState<ColumnWithTasks[]>(boardColumns);
  const pickedUpTaskColumn = useRef<ColumnId | null>(null);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useState<Task[]>([]);

  const [activeColumn, setActiveColumn] = useState<ColumnWithTasks | null>(
    null
  );
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter,
    })
  );

  return (
    <DndContext
      //   accessibility={{
      //     announcements,
      //   }}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <BoardContainer>
        <SortableContext items={columnsId}>
          {columns.map((col) => (
            <BoardColumn
              key={col.id}
              column={col}
              tasks={col?.tasks.filter((task) => task.columnId === col.id)}
            />
          ))}
        </SortableContext>
      </BoardContainer>

      {/** overlay */}
      {"document" in window &&
        createPortal(
          <DragOverlay>
            {/** 1- for dragging column  */}
            {activeColumn && (
              <BoardColumn
                isOverlay
                column={activeColumn}
                tasks={tasks?.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {/** 2- for dragging task */}
            {activeTask && <TaskCard task={activeTask} isOverlay />}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === "Column") {
      setActiveColumn(data.column);
      return;
    }

    if (data?.type === "Task") {
      setActiveTask(data.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;

    if (activeId === overId) return;

    const isActiveAColumn = activeData?.type === "Column";
    if (!isActiveAColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveATask = activeData?.type === "Task";
    const isOverATask = overData?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        const activeTask = tasks[activeIndex];
        const overTask = tasks[overIndex];
        if (
          activeTask &&
          overTask &&
          activeTask.columnId !== overTask.columnId
        ) {
          activeTask.columnId = overTask.columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = overData?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const activeTask = tasks[activeIndex];
        if (activeTask) {
          activeTask.columnId = overId as ColumnId;
          return arrayMove(tasks, activeIndex, activeIndex);
        }
        return tasks;
      });
    }
  }
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  const variations = cva("px-2 md:px-0 flex lg:justify-center pb-4", {
    variants: {
      dragging: {
        default: "snap-x snap-mandatory",
        active: "snap-none",
      },
    },
  });

  return (
    <ScrollArea
      className={variations({
        dragging: dndContext.active ? "active" : "default",
        className: "w-full ",
      })}
    >
      <div className="flex gap-4 items-center flex-row justify-start pl-10  w-full">
        {children}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

// function getDraggingTaskData(taskId: UniqueIdentifier, columnId: ColumnId) {
//   const tasksInColumn = tasks.filter((task) => task.columnId === columnId);
//   const taskPosition = tasksInColumn.findIndex((task) => task.id === taskId);
//   const column = columns.find((col) => col.id === columnId);
//   return {
//     tasksInColumn,
//     taskPosition,
//     column,
//   };
// }

//   const announcements: Announcements = {
//     onDragStart({ active }) {
//       if (!hasDraggableData(active)) return;
//       if (active.data.current?.type === "Column") {
//         const startColumnIdx = columnsId.findIndex((id) => id === active.id);
//         const startColumn = columns[startColumnIdx];
//         return `Picked up Column ${startColumn?.title} at position: ${
//           startColumnIdx + 1
//         } of ${columnsId.length}`;
//       } else if (active.data.current?.type === "Task") {
//         pickedUpTaskColumn.current = active.data.current.task.columnId;
//         const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
//           active.id,
//           pickedUpTaskColumn.current
//         );
//         return `Picked up Task ${
//           active.data.current.task.description
//         } at position: ${taskPosition + 1} of ${
//           tasksInColumn.length
//         } in column ${column?.title}`;
//       }
//     },
//     onDragOver({ active, over }) {
//       if (!hasDraggableData(active) || !hasDraggableData(over)) return;

//       if (
//         active.data.current?.type === "Column" &&
//         over.data.current?.type === "Column"
//       ) {
//         const overColumnIdx = columnsId.findIndex((id) => id === over.id);
//         return `Column ${active.data.current.column.title} was moved over ${
//           over.data.current.column.title
//         } at position ${overColumnIdx + 1} of ${columnsId.length}`;
//       } else if (
//         active.data.current?.type === "Task" &&
//         over.data.current?.type === "Task"
//       ) {
//         const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
//           over.id,
//           over.data.current.task.columnId
//         );
//         if (over.data.current.task.columnId !== pickedUpTaskColumn.current) {
//           return `Task ${
//             active.data.current.task.description
//           } was moved over column ${column?.title} in position ${
//             taskPosition + 1
//           } of ${tasksInColumn.length}`;
//         }
//         return `Task was moved over position ${taskPosition + 1} of ${
//           tasksInColumn.length
//         } in column ${column?.title}`;
//       }
//     },
//     onDragEnd({ active, over }) {
//       if (!hasDraggableData(active) || !hasDraggableData(over)) {
//         pickedUpTaskColumn.current = null;
//         return;
//       }
//       if (
//         active.data.current?.type === "Column" &&
//         over.data.current?.type === "Column"
//       ) {
//         const overColumnPosition = columnsId.findIndex((id) => id === over.id);

//         return `Column ${
//           active.data.current.column.title
//         } was dropped into position ${overColumnPosition + 1} of ${
//           columnsId.length
//         }`;
//       } else if (
//         active.data.current?.type === "Task" &&
//         over.data.current?.type === "Task"
//       ) {
//         const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
//           over.id,
//           over.data.current.task.columnId
//         );
//         if (over.data.current.task.columnId !== pickedUpTaskColumn.current) {
//           return `Task was dropped into column ${column?.title} in position ${
//             taskPosition + 1
//           } of ${tasksInColumn.length}`;
//         }
//         return `Task was dropped into position ${taskPosition + 1} of ${
//           tasksInColumn.length
//         } in column ${column?.title}`;
//       }
//       pickedUpTaskColumn.current = null;
//     },
//     onDragCancel({ active }) {
//       pickedUpTaskColumn.current = null;
//       if (!hasDraggableData(active)) return;
//       return `Dragging ${active.data.current?.type} cancelled.`;
//     },
//   };
