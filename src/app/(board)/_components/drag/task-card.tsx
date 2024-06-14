"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cva } from "class-variance-authority";
import { Badge } from "@/components/ui/badge";
import {
  ColumnWithTasks,
  TaskCardProps,
  TaskDragData,
} from "@/schemas/drag-schemas";
import TaskDropdown from "../utils/task-dropdown";
import CardModal from "@/components/modals/card-modal";
import { useCurrentBoard } from "@/hooks/drag-board/use-current-board";

export function TaskCard({
  task,
  column,
  isOverlay,
}: TaskCardProps & { column: ColumnWithTasks }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    } satisfies TaskDragData,
    attributes: {
      roleDescription: "Task",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-1 opacity-30 ring-gray-400",
        overlay: "ring-1 ring-gray-400",
      },
    },
  });
  const { setTaskTobeShow } = useCurrentBoard();

  return (
    <Card
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
        className:
          "cursor-grab hover:opacity-75 opacity-100  dark:border-white/30",
      })}
      onClick={() => {
        setTaskTobeShow({ ...task, column });
      }}
    >
      <CardHeader className="px-3 py-3 space-between flex flex-row border-b-2 border-secondary relative">
        {/** no need for this button if we gonna move listner to whole card  */}
        <Badge variant={"outline"} className="mr-auto font-semibold">
          Task
        </Badge>
        <div
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
          onClick={(event) => event.stopPropagation()}
          // {...attributes}
          // {...listeners}
        >
          <TaskDropdown task={task} column={column} />
        </div>
      </CardHeader>
      <CardContent className="px-3 pt-3 pb-6 text-left whitespace-pre-wrap">
        {task.title}
      </CardContent>
    </Card>
  );
}
