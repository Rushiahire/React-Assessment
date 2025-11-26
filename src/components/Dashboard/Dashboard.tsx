import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import React, { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import {
  loadTasks,
  localMove,
  patchTask,
  removeTask,
} from "../../store/slices/taskSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import type { Task } from "../../types/types";
import TaskCard from "../Cards/TaskCard";
import TaskFormModal from "../Modal/TaskFormModal";
import Navbar from "../Navbar";
import "../../styles/dashboard.css";
import { IoMdAdd } from "react-icons/io";
import TaskSummary from "./TaskSummary";

const STAGE_TITLES = ["Backlog", "To Do", "Ongoing", "Done"];

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((s: any) => s.tasks?.items);
  const currentUser = useAppSelector((s: any) => s.auth?.currentUser);
  const loading = useAppSelector((s) => s.tasks?.loading);

  const [showModal, setShowModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4">
        <TaskSummary />

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
                      <Badge bg="secondary">{tasksByStage(idx)?.length}</Badge>
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
                                          })
                                        );
                                      }}
                                      onDelete={() => {
                                        if (window.confirm("Delete task?"))
                                          dispatch(removeTask(task.id));
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

          {/* --- TRASH DROP AREA (OUTSIDE GRID) --- */}
          <Droppable droppableId="trash">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ pointerEvents: "none" }} // accept drops but ignore clicks
              >
                <div
                  style={{
                    position: "fixed",
                    right: "20px",
                    bottom: "20px",
                    width: "140px",
                    height: "90px",
                    zIndex: 2000,
                    display: isDragging ? "flex" : "none",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "2px dashed crimson",
                    borderRadius: 10,
                    background: snapshot.isDraggingOver ? "#ffe6e6" : "white",
                    fontSize: 12,
                    gap: 5,
                  }}
                >
                  <i
                    className="bi bi-trash3"
                    style={{ fontSize: 22, color: "crimson" }}
                  ></i>
                  Drop to Delete
                </div>

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <TaskFormModal
          show={showModal}
          onHide={() => setShowModal(false)}
          editingTaskId={editingTaskId}
        />
      </div>
    </>
  );
};

export default Dashboard;
