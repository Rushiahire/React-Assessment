import { Droppable } from "@hello-pangea/dnd";
import React, { memo } from "react";

const TrashDroppable = (isDragging: any) => {
  return (
    <>
      <div className="col-12">
        <Droppable droppableId="trash">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`position-fixed end-0 bottom-0 me-4 mb-4`}
              style={{
                zIndex: 1050,
                width: 120,
                height: 80,
                display: isDragging ? "block" : "none",
              }}
            >
              <div className="card text-center bg-light border-danger h-100 d-flex align-items-center justify-content-center">
                <div>
                  <i
                    className="bi bi-trash3"
                    style={{ fontSize: 20, color: "crimson" }}
                  ></i>
                  <div style={{ fontSize: 12 }}>Drop to delete</div>
                </div>
              </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </>
  );
};

export default memo(TrashDroppable);
