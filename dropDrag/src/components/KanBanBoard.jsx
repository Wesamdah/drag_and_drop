import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { Icon } from "@iconify/react";
import ColumnContainer from "./ColumnContainer";

export default function KanBanBoard() {
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  const [columns, setColumns] = useState([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState(null);

  const [tasks, setTasks] = useState([]);

  const sensors = useSensors(
    touchSensor,
    useSensor(
      PointerSensor,
      // we have a delete button and the drag we put it from the whole title so when click on the button dosen't work
      // so I put a rule the frag doesn't work untit you drag to 10px and that make the button work as a click event
      { activationConstraint: { distance: 10 } }
    )
  );

  const generateId = () => {
    let randomId;

    do {
      randomId = Math.floor(Math.random() * 10001);
    } while (columns.find((col) => col.id === randomId));

    return randomId;
  };

  const createNewColumn = () => {
    const columnToAdd = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  };

  const deleteColumn = (columnId) => {
    const filteredColumns = columns.filter((column) => column.id !== columnId);
    setColumns(filteredColumns);
    const newTasks = tasks.filter((task) => task.columnId !== columnId);
    setTasks(newTasks);
  };

  const updateColumn = (id, title) => {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  };

  const createTask = (columnId) => {
    const newTask = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };

    setTasks([...tasks, newTask]);
  };

  const deleteTask = (taskId) => {
    const filteredTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(filteredTasks);
  };

  const UpdateTask = (taskId, content) => {
    const newTask = tasks.map((task) => {
      if (task.id !== taskId) return task;
      return { ...task, content };
    });
    setTasks(newTask);
  };

  const onDragStart = (event) => {
    if (event.active.data.current?.type === "column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
  };

  const onDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "task";
    const isOverTask = active.data.current?.type === "task";

    if (!isActiveTask) return;

    // I'm dropping a task another task;
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        tasks[activeIndex].columnId = tasks[overIndex]?.columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverColumn = over.data.current?.type === "column";

    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }

    // I'm dropping a task over a column;
  };

  const onDragEnd = (event) => {
    setActiveColumn(null);
    const { active, over } = event;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId
      );

      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      );
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  };

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-scroll overflow-y-hidden px-10">
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        sensors={sensors}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((column) => (
                <ColumnContainer
                  key={column.id}
                  column={column}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  tasks={tasks.filter((task) => task.columnId === column.id)}
                  deleteTask={deleteTask}
                  UpdateTask={UpdateTask}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={createNewColumn}
            className=" flex  justify-items-start items-center gap-2 h-16 w-80 min-w-80 cursor-pointer rounded-lg bg-mainBackground-color  border-cloumnBackground-color border-2 p-4 ring-rose-500 hover:ring-2"
          >
            <Icon icon={"basil:add-outline"} className="text-2xl" />
            Add Column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
                deleteTask={deleteTask}
                UpdateTask={UpdateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}
