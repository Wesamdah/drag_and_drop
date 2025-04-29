import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function TaskCard({ task, deleteTask, UpdateTask }) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

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
      type: "task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-mainBackground-color p-2.5 h-25 min-h-25 flex items-center text-left rounded-xl cursor-grab border border-rose-500 opacity-50 "
      ></div>
    );
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className=" relative bg-mainBackground-color h-25 min-h-25 flex items-center text-left rounded-xl cursor-grab "
      >
        <textarea
          value={task.content}
          onChange={(e) => UpdateTask(task.id, e.target.value)}
          autoFocus
          placeholder="Task Content Here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              toggleEditMode();
            }
          }}
          className="resize-none h-full w-full p-2.5 border-none rounded-xl bg-transparent cursor-grab hover:ring-1 hover:ring-rose-500 focus:outline-none"
        ></textarea>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      onClick={toggleEditMode}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      className=" relative bg-mainBackground-color p-2.5 h-25 min-h-25 flex items-center text-left rounded-xl task hover:ring-1 hover:ring-rose-500 cursor-grab "
    >
      <p className="my-auto h-[90%] w-full overflow-x-auto overflow-y-auto whitespace-pre-wrap">
        {task.content}
      </p>
      {mouseIsOver && (
        <button
          onClick={() => deleteTask(task.id)}
          className="absolute p-2 bg-cloumnBackground-color rounded-xl  right-4 top-1/2 -translate-y-1/2 cursor-pointer opacity-60 hover:opacity-100 "
        >
          <Icon
            icon={"cuida:trash-outline"}
            className=" text-white text-2xl  "
          />
        </button>
      )}
    </div>
  );
}
