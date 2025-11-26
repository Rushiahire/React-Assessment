import { useFormik } from "formik";
import { memo, useEffect } from "react";
import { Form, Modal } from "react-bootstrap";
import { addTask, loadTasks, patchTask } from "../../store/slices/taskSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { taskFormValidation } from "../../validation/taskFormValidation";
import type { Task } from "../../types/types";
import { toast } from "react-toastify";

const TaskFormModal = ({ show, onHide, editingTaskId }: any) => {
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((s: any) => s.auth?.currentUser);
  const tasks = useAppSelector((s: any) => s.tasks?.items);

  const editing = tasks?.find((t: any) => t.id === editingTaskId) ?? null;

  const checkDuplicateEntryFun = (values: Task) => {
    const isDuplicateEntry =
      tasks?.length > 0 &&
      tasks.some((data: Task) => data.taskName === values.taskName);

    console.log({ isDuplicateEntry });
    return isDuplicateEntry;
  };

  const formik: any = useFormik({
    enableReinitialize: true,
    // initialValues
    initialValues: {
      taskName: editing?.taskName ?? "",
      priority: editing?.priority ?? "medium",
      deadline: editing?.deadline ?? "",
    },

    validationSchema: taskFormValidation,
    onSubmit: (values: any, { resetForm }) => {
      console.log({ currentUser });
      if (!currentUser) return;

      const checkDuplicateEntry = checkDuplicateEntryFun(values);
      if (checkDuplicateEntry) {
        toast.error("Duplicate Entry found");
        return;
      }
      if (editing) {
        // PATCH existing task
        dispatch(
          patchTask({
            id: editing.id,
            data: {
              taskName: values.taskName,
              priority: values.priority,
              deadline: values.deadline,
            },
          } as any)
        );
      } else {
        // CREATE new task
        dispatch(
          addTask({
            taskName: values.taskName,
            priority: values.priority,
            deadline: values.deadline,
            stage: 0,
            ownerId: currentUser.id,
          })
        ).then(() => {
          if (currentUser) dispatch(loadTasks(currentUser.id)); // refresh tasks from db
        });
      }

      resetForm();
      onHide();
    },
  });

  useEffect(() => {
    if (!show) formik.resetForm();
  }, [show]);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{editing ? "Edit Task" : "Create Task"}</Modal.Title>
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
            />
            {formik.touched.taskName && formik.errors.taskName && (
              <div className="text-danger small">
                {formik?.errors?.taskName}
              </div>
            )}
          </Form.Group>

          {/* Priority */}
          <Form.Group className="mb-2">
            <Form.Label>Priority</Form.Label>
            <Form.Select
              name="priority"
              value={formik.values.priority}
              defaultValue={formik.values.priority}
              onChange={formik.handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </Form.Select>
          </Form.Group>

          {/* Deadline */}
          <Form.Group className="mb-2">
            <Form.Label>
              Deadline <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              name="deadline"
              type="date"
              value={formik.values.deadline}
              onChange={formik.handleChange}
            />
            {formik.touched.deadline && formik.errors.deadline && (
              <div className="text-danger small">{formik.errors.deadline}</div>
            )}
          </Form.Group>

          {/* Buttons */}
          <div className="d-flex justify-content-end mt-5">
            <button
              className="btn btn-outline-secondary py-1 px-2 me-2 w-100"
              onClick={onHide}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-outline-secondary py-1 px-2 fs-6 w-100"
            >
              {editing ? "Save" : "Create"}
            </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default memo(TaskFormModal);
