import React, { useMemo, useState } from "react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Icon } from "@iconify/react";
import TaskCard from "./TaskCard";

export default function ColumnContainer({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  UpdateTask,
}) {
  const [editMode, setEditMode] = useState(false);
  const tasksId = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: "column", column },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className=" select-none bg-cloumnBackground-color w-88 h-125 max-h-125 rounded-md flex flex-col border-rose-500 opacity-40 border-2"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className=" select-none bg-cloumnBackground-color w-88 h-125 max-h-125 rounded-md flex flex-col"
    >
      <div
        //   Added them here because I want drag from the title
        {...listeners}
        {...attributes}
        onClick={() => setEditMode(true)}
        className="flex justify-between bg-mainBackground-color text-lg h-15 cursor-grab rounded-md rounded-b-none p-3 font-bold border-cloumnBackground-color border-4"
      >
        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-cloumnBackground-color px-2 py-1 text-sm rounded-full">
            {tasks.length}
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
              className="bg-black border rounded outline-none px-2 focus:border-rose-500"
            />
          )}
        </div>
        <button
          className="flex justify-center items-center hover:bg-cloumnBackground-color px-2 py-2 cursor-pointer rounded"
          onClick={() => deleteColumn(column.id)}
        >
          <Icon
            icon={"cuida:trash-outline"}
            className="text-2xl text-gray-500 hover:text-white"
          />
        </button>
      </div>
      <div className="flex flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto flex-grow">
        <SortableContext items={tasksId}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              UpdateTask={UpdateTask}
            />
          ))}
        </SortableContext>
      </div>
      <button
        onClick={() => createTask(column.id)}
        className="flex gap-2 items-center border-cloumnBackground-color border-2 rounded-md p-4 cursor-pointer hover:bg-mainBackground-color hover:text-red-500 active:bg-black"
      >
        {<Icon icon={"basil:add-outline"} className="text-2xl" />}
        Add Task
      </button>
    </div>
  );
}
