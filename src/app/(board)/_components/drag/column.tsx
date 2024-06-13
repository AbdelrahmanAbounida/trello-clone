import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import { cva } from "class-variance-authority";
import { LuGripVertical } from "react-icons/lu";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskCard } from "./task-card";
import { BoardColumnProps, ColumnDragData } from "@/schemas/drag-schemas";
import {
  DotIcon,
  DotsHorizontalIcon,
  DotsVerticalIcon,
} from "@radix-ui/react-icons";
import ColumnDropdown from "../utils/col-dropdown";
import EmptyTask from "../utils/empty-task";
import { Input } from "@/components/ui/input";
import { renameCol } from "@/actions/col/update-cols";
import toast from "react-hot-toast";

export function BoardColumn({ column, tasks, isOverlay }: BoardColumnProps) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task?.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.title}`,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva(
    "  bg-[#F3F2F5] w-[350px] max-h-full h-auto flex flex-col flex-shrink-0 snap-center", //  bg-primary-foreground
    {
      variants: {
        dragging: {
          default: "border-2 border-transparent",
          over: "ring-2 opacity-30",
          overlay: "ring-2 ring-primary",
        },
      },
    }
  );

  // new col title
  const [newcolTitle, setnewcolTitle] = useState(column.title);

  const handleupdateColtitle = async () => {
    try {
      const res = await renameCol({ colId: column.id, newtitle: newcolTitle });

      if (res?.error) {
        toast.error(res?.details);
      } else {
        toast.success("List renamed successfully");
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <Card
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
        className: "cursor-grab ",
      })}
    >
      <CardHeader
        // any child u wanna prevent drag on
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
        className="p-4 font-semibold border-b-2 text-left flex flex-row cursor-default justify-between items-center"
      >
        {/* <span className="">{column.title}</span> */}
        <Input
          className="border-0 shadow-none font-semibold text-md  focus:border-2"
          value={newcolTitle}
          onChange={(e) => setnewcolTitle(e.target.value)}
          onBlur={handleupdateColtitle}
        />
        {/** col dropdown */}
        <ColumnDropdown column={column} />
      </CardHeader>
      <ScrollArea
        // {...attributes} {...listeners}
        className="drag-area"
      >
        <CardContent className="flex flex-grow flex-col gap-2 p-2  ">
          <SortableContext items={tasksIds}>
            {tasks.map((task) => (
              <TaskCard column={column} key={task?.id} task={task} />
            ))}
            <EmptyTask columnId={column.id} newPos={tasks.length!} />
          </SortableContext>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
