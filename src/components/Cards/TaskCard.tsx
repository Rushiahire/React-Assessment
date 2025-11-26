import type { Task } from "../../types/types";
import { Button, Badge } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight, FaEdit, FaTrash } from "react-icons/fa";

const PRIORITY_BADGE = {
  low: "success",
  medium: "warning",
  high: "danger",
};

const TaskCard = ({
  task,
  onEdit,
  onMove,
  onDelete,
}: {
  task: Task;
  onEdit: () => void;
  onMove: (newStage: number) => void;
  onDelete: () => void;
}) => {
  return (
    <div className="card mb-2 shadow-sm">
      <div className="card-body p-2 d-flex align-items-start justify-content-between">
        <div style={{ flex: 1 }}>
          <div className="d-flex align-items-center justify-content-between">
            <strong>{task.taskName}</strong>
            <Badge bg={PRIORITY_BADGE[task.priority]}>{task.priority}</Badge>
          </div>
          <div style={{ fontSize: 12, color: "#666" }}>
            Due: {task.deadline}
          </div>
        </div>

        <div className="ms-2 d-flex flex-column">
          <Button
            size="sm"
            variant="light"
            onClick={() => onMove(task.stage - 1)}
            disabled={task.stage === 0}
            className="mb-1"
          >
            <FaArrowLeft />
          </Button>
          <Button
            size="sm"
            variant="light"
            onClick={() => onMove(task.stage + 1)}
            disabled={task.stage === 3}
            className="mb-1"
          >
            <FaArrowRight />
          </Button>
          <Button size="sm" variant="light" onClick={onEdit} className="mb-1">
            <FaEdit />
          </Button>
          <Button size="sm" variant="light" onClick={onDelete}>
            <FaTrash />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
