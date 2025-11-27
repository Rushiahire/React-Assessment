import { useCallback, useMemo, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { loadTasks, localMove, removeTask, patchTask } from "../store/slices/taskSlice";
import type { DropResult } from "@hello-pangea/dnd";
import type { Task } from "../types/types";
import { setUser } from "../store/slices/authSlice";

export const STAGE_TITLES = ["Backlog", "To Do", "Ongoing", "Done"];

const useDashboardHook = () =>{
 
  

  const dispatch = useAppDispatch();
  const tasks = useAppSelector((s: any) => s.tasks?.items);
  const currentUser = useAppSelector((s: any) => s.auth?.currentUser);
  const loading = useAppSelector((s) => s.tasks?.loading);

  const [showModal, setShowModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("currentUser");
    if (saved) {
      try {
        dispatch(setUser(JSON.parse(saved)));
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
  }, []);
  useEffect(() => {
    if (currentUser) dispatch(loadTasks(currentUser.id));
  }, [currentUser]);

  const tasksByStage = (stage: number) =>
    tasks?.filter((t: Task) => t.stage === stage);

  const onDragStart = () => setIsDragging(true);

  const onDragEnd = (result: DropResult) => {
    setIsDragging(false);
    const { destination, source, draggableId } = result;
    if (!destination) return;

    // --- DELETE ACTION ---
    if (destination.droppableId === "trash") {
      const confirmDelete = window.confirm("Delete this task?");
      if (confirmDelete) {
        dispatch(removeTask(draggableId));
      }
      return;
    }

    // Same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Move stage
    const newStage = Number(destination.droppableId);
    dispatch(localMove({ id: draggableId, newStage } as any));
    dispatch(patchTask({ id: draggableId, data: { stage: newStage } }));
  };

  return {
    tasks,
    loading,
    STAGE_TITLES,
    tasksByStage,
    showModal,
    editingTaskId,
    isDragging,
    setEditingTaskId,
    setShowModal,
    onDragStart,
    onDragEnd,
  };
}

export default useDashboardHook;