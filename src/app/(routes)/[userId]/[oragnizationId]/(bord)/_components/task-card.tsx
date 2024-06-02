import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { LuGripVertical } from "react-icons/lu";
import { Badge } from "@/components/ui/badge";
import { TaskCardProps, TaskDragData } from "@/schemas/drag";

export function TaskCard({ task, isOverlay }: TaskCardProps) {
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
        over: "ring-2 opacity-30 ring-green-500",
        overlay: "ring-2 ring-green-500",
      },
    },
  });

  return (
    <Card
      {...attributes} //
      {...listeners}
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
        className: "cursor-grab",
      })}
    >
      <CardHeader className="px-3 py-3 space-between flex flex-row border-b-2 border-secondary relative">
        {/** no need for this button if we gonna move listner to whole card  */}
        <Button
          variant={"ghost"}
          // {...attributes}
          // {...listeners}
          className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
        >
          <span className="sr-only">Move task</span>
          <LuGripVertical />
        </Button>
        <Badge variant={"outline"} className="ml-auto font-semibold">
          Task
        </Badge>
      </CardHeader>
      <CardContent className="px-3 pt-3 pb-6 text-left whitespace-pre-wrap">
        {task.title}
      </CardContent>
    </Card>
  );
}
