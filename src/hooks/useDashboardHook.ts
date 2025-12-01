import type { DropResult } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import type { Task } from "../types/types";
import { setUser } from "../store/slices/authSlice";
import {
  loadTasks,
  localMove,
  patchTask,
  removeTask,
} from "../store/slices/taskSlice";
import { useAppDispatch, useAppSelector } from "../store/store";

export const STAGE_TITLES = ["Backlog", "To Do", "Ongoing", "Done"];

const useDashboardHook = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((s: any) => s.tasks?.items);
  const currentUser = useAppSelector((s: any) => s.auth?.currentUser);
  const loading = useAppSelector((s) => s.tasks?.loading);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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
      setConfirmDeleteId(draggableId); // open confirm modal

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
    confirmDeleteId,
    setConfirmDeleteId,
  };
};

export default useDashboardHook;
