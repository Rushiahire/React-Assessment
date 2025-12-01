import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import React, { Suspense, useState } from "react";
import { Badge } from "react-bootstrap";
import { IoMdAdd } from "react-icons/io";
import { useDispatch } from "react-redux";
import useDashboardHook from "../../hooks/useDashboardHook";
import { localMove, patchTask, removeTask } from "../../store/slices/taskSlice";
import "../../styles/dashboard.css";
import type { Task } from "../../types/types";
import TaskCard from "../Cards/TaskCard";
import Loader from "../common/Loader";
import ConfirmModal from "../common/ConfirmModal";
const TaskFormModal = React.lazy(() => import("../Modal/TaskFormModal"));
const TaskSummary = React.lazy(() => import("./TaskSummary"));

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const {
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
  } = useDashboardHook();

  return (
    <>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <div className="container-fluid py-4">
          <Suspense fallback={<Loader />}>
            <TaskSummary />
          </Suspense>

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
            {/* --- TASK COLUMNS --- */}
            <div className="row gx-3">
              {STAGE_TITLES.map((title, idx) => (
                <div key={idx} className="col-12 col-md-6 col-lg-3 mb-3">
                  <div className="card h-100">
                    <div className="card-body d-flex flex-column">
                      <h6 className="card-title d-flex justify-content-between align-items-center">
                        <span>{title}</span>
                        <Badge bg="secondary">
                          {tasksByStage(idx)?.length}
                        </Badge>
                      </h6>

                      <Droppable droppableId={String(idx)}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="mt-2 flex-grow-1 overflow-auto"
                            style={{ minHeight: 120, maxHeight: "60vh" }}
                          >
                            {tasksByStage(idx)?.map(
                              (task: Task, index: number) => (
                                <Draggable
                                  key={task.id}
                                  draggableId={task.id}
                                  index={index}
                                >
                                  {(prov) => (
                                    <div
                                      ref={prov.innerRef}
                                      {...prov.draggableProps}
                                      {...prov.dragHandleProps}
                                    >
                                      <TaskCard
                                        task={task}
                                        onEdit={() => {
                                          setEditingTaskId(task.id);
                                          setShowModal(true);
                                        }}
                                        onMove={(newStage) => {
                                          dispatch(
                                            localMove({
                                              id: task.id,
                                              newStage,
                                            } as any)
                                          );
                                          dispatch(
                                            patchTask({
                                              id: task.id,
                                              data: { stage: newStage },
                                            }) as any
                                          );
                                        }}
                                        onDelete={() => {
                                          setConfirmDeleteId(task.id); // open confirm modal
                                        }}
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              )
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* TRASH DROP AREA (OUTSIDE GRID) */}
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
                    opacity: isDragging ? 0.9 : 0, // fade out
                    visibility: isDragging ? "visible" : "hidden", // keep active
                    transition: "opacity 0.2s ease-in-out",
                  }}
                >
                  <i
                    className="bi bi-trash3"
                    style={{ fontSize: 22, color: "crimson" }}
                  />
                  {!snapshot.isDraggingOver && "Drop to Delete"}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

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
