import { useCallback, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../store/store";
import { addTask, patchTask, loadTasks } from "../store/slices/taskSlice";
import { toast } from "react-toastify";
import { taskFormValidation } from "../validation/taskFormValidation";
import type { Task } from "../types/types";

interface Props {
  editingTaskId: string | null;
  show: boolean;
  onClose: () => void;
}

const useTaskForm = ({ editingTaskId, show, onClose }: Props) => {
  const dispatch = useAppDispatch();

  const tasks = useAppSelector((s) => s.tasks.items);
  const currentUser = useAppSelector((s) => s.auth.currentUser);

  const todayDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  /** Find editing task (memoized) */
  const editingTask = useMemo(
    () => tasks?.find((t) => t.id === editingTaskId) ?? null,
    [editingTaskId, tasks]
  );

  /** Fast duplicate check (O(1) using Set) */
  const taskNamesSet = useMemo(
    () => new Set(tasks?.map((t) => t.taskName)),
    [tasks]
  );

  const checkDuplicate = useCallback(
    (name: string) => taskNamesSet.has(name),
    [taskNamesSet]
  );

  /** Formik */
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      taskName: editingTask?.taskName ?? "",
      priority: editingTask?.priority ?? "medium",
      deadline: editingTask?.deadline ?? "",
    },
    validationSchema: taskFormValidation,
    onSubmit: async (values, { resetForm }) => {
      if (!currentUser) return;
      if (editingTask) {
        // RUN DUPLICATE CHECK ONLY IF TASK NAME CHANGED
        const nameChanged = values.taskName !== editingTask.taskName;

        if (nameChanged && checkDuplicate(values.taskName)) {
          toast.error("Duplicate Entry found");
          return;
        }

        // UPDATE
        await dispatch(
          patchTask({
            id: editingTask.id,
            data: {
              taskName: values.taskName,
              priority: values.priority,
              deadline: values.deadline,
            },
          })
        );
        toast.success("Task Updated");
      } else {
        // DUPLICATE CHECK
        if (checkDuplicate(values.taskName)) {
          toast.error("Duplicate Entry found");
          return;
        }
        // CREATE
        await dispatch(
          addTask({
            taskName: values.taskName,
            priority: values.priority,
            deadline: values.deadline,
            stage: 0,
            ownerId: currentUser.id,
          })
        );

        dispatch(loadTasks(currentUser.id));
        toast.success("Task Added");
      }

      resetForm();
      onClose();
    },
  });

  /** Reset form when modal closes */
  useEffect(() => {
    if (!show) formik.resetForm();
  }, [show]);

  return {
    todayDate,
    editingTask,
    formik,
  };
};

export default useTaskForm;
