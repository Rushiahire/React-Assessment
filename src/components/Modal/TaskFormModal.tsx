import { memo } from "react";
import { Form, Modal } from "react-bootstrap";
import useTaskForm from "../../hooks/useTaskForm";

const TaskFormModal = ({ show, onHide, editingTaskId }: any) => {
  const { todayDate, editingTask, formik } = useTaskForm({
    editingTaskId,
    show,
    onClose: onHide,
  });

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{editingTask ? "Edit Task" : "Create Task"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          {/* Task Name */}
          <Form.Group className="mb-2">
            <Form.Label>
              Task Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              name="taskName"
              value={formik.values.taskName}
              onChange={formik.handleChange}
              autoComplete="off"
            />
            {formik.touched.taskName && formik.errors.taskName && (
              <div className="text-danger small">{formik.errors.taskName}</div>
            )}
          </Form.Group>

          {/* Priority */}
          <Form.Group className="mb-2">
            <Form.Label>Priority</Form.Label>
            <Form.Select
              name="priority"
              value={formik.values.priority}
              onChange={formik.handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Form.Select>
          </Form.Group>

          {/* Deadline */}
          <Form.Group className="mb-2">
            <Form.Label>
              Deadline <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="date"
              name="deadline"
              min={todayDate}
              value={formik.values.deadline}
              onChange={formik.handleChange}
            />
            {formik.touched.deadline && formik.errors.deadline && (
              <div className="text-danger small">{formik.errors.deadline}</div>
            )}
          </Form.Group>

          {/* Buttons */}
          <div className="d-flex justify-content-end mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary w-50 me-2"
              onClick={onHide}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-outline-secondary w-50">
              {editingTask ? "Save" : "Create"}
            </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default memo(TaskFormModal);
