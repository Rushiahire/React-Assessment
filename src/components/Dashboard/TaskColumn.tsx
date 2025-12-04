import React from "react";
import { Badge } from "react-bootstrap";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import TaskCard from "../Cards/TaskCard";
import type { Task } from "../../types/types";

const TaskColumn = ({ title, idx, tasks, onEdit, onMove, onDelete }: any) => {
  return (
    <div className="col-12 col-md-6 col-lg-3 mb-3">
      <div className="card h-100">
        <div className="card-body d-flex flex-column">
          <h6 className="card-title d-flex justify-content-between align-items-center">
            <span>{title}</span>
            <Badge bg="secondary">{tasks.length}</Badge>
          </h6>

          <Droppable droppableId={String(idx)}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="mt-2 flex-grow-1 overflow-auto"
                style={{ minHeight: 100, maxHeight: "60vh" }}
              >
                {tasks.map((task: Task, index: number) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(prov) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                      >
                        <TaskCard
                          task={task}
                          onEdit={() => onEdit(task)}
                          onMove={(stage) => onMove(task.id, stage)}
                          onDelete={() => onDelete(task.id)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TaskColumn, (prev, next) => {
  return (
    prev.title === next.title &&
    prev.idx === next.idx &&
    prev.tasks === next.tasks // prevents re-render unless tasks array changes
  );
});
