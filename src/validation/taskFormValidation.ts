import * as Yup from 'yup';

export const taskFormValidation = Yup.object({
      taskName: Yup.string().min(2).max(60).required("Task name required"),
      priority: Yup.string().oneOf(["low", "medium", "high"]).required(),
      deadline: Yup.string().required("Deadline required"),
})