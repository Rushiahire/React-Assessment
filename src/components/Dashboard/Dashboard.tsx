import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import React, { Suspense, useCallback } from "react";
import { IoMdAdd } from "react-icons/io";
import useDashboardHook from "../../hooks/useDashboardHook";
import { localMove, patchTask, removeTask } from "../../store/slices/taskSlice";
import { useAppDispatch } from "../../store/store";
import type { Task } from "../../types/types";
import ConfirmModal from "../common/ConfirmModal";
import Loader from "../common/Loader";
import TaskColumn from "./TaskColumn";

const TaskFormModal = React.lazy(() => import("../Modal/TaskFormModal"));
const TaskSummary = React.lazy(() => import("./TaskSummary"));

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    loading,
    STAGE_TITLES,
    tasksByStage,
    showModal,
    editingTaskId,
    setEditingTaskId,
    setShowModal,
    onDragStart,
    onDragEnd,
    confirmDeleteId,
    setConfirmDeleteId,
    isDragging,
  } = useDashboardHook();

  const handleEdit = useCallback((task: Task) => {
    setEditingTaskId(task.id);
    setShowModal(true);
  }, []);

  const handleMove = useCallback((id: number, newStage: any) => {
    dispatch(localMove({ id, newStage }) as any);

    dispatch(patchTask({ id, data: { stage: newStage } }) as any);
  }, []);

  const handleDelete = useCallback((id: any) => {
    setConfirmDeleteId(id);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="container-fluid py-4">
          <Suspense fallback={<Loader />}>
            <TaskSummary />
          </Suspense>

          {/* Create Task button */}
          <div className="d-flex justify-content-end align-items-center mb-3">
            <button
              className="btn btn-outline-secondary py-0 px-2 fs-6"
              onClick={() => {
                setEditingTaskId(null);
                setShowModal(true);
              }}
            >
              Create Task <IoMdAdd size={16} />
            </button>
          </div>

          <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <div className="row gx-3">
              {STAGE_TITLES.map((title, idx) => (
                <TaskColumn
                  key={idx}
                  title={title}
                  idx={idx}
                  tasks={tasksByStage(idx)}
                  onEdit={handleEdit}
                  onMove={handleMove}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* trash drop area */}
            <Droppable droppableId="trash">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    position: "fixed",
                    right: "20px",
                    bottom: "20px",
                    width: "140px",
                    height: "90px",
                    zIndex: 2000,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "2px dashed crimson",
                    borderRadius: 10,
                    background: snapshot.isDraggingOver ? "#ffe6e6" : "white",
                    opacity: isDragging ? 0.9 : 0,
                    visibility: isDragging ? "visible" : "hidden",
                    transition: "opacity 0.2s ease-in-out",
                  }}
                >
                  <i
                    className="bi bi-trash3"
                    style={{ fontSize: 22, color: "crimson" }}
                  />
                  {!snapshot.isDraggingOver && "Drop to Delete"}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* modal */}
          <Suspense fallback={<Loader />}>
            <TaskFormModal
              show={showModal}
              onHide={() => setShowModal(false)}
              editingTaskId={editingTaskId}
            />
          </Suspense>
        </div>
      )}

      <ConfirmModal
        show={!!confirmDeleteId}
        title="Delete Task?"
        message="Are you sure you want to delete this task?"
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={() => {
          dispatch(removeTask(confirmDeleteId!) as any);
          setConfirmDeleteId(null);
        }}
      />
    </>
  );
};

export default Dashboard;
