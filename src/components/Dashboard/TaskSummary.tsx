import { useAppSelector } from "../../store/store";
import type { Task } from "../../types/types";

const TaskSummary = () => {
  const tasks = useAppSelector((s: any) => s.tasks?.items);
  const loading = useAppSelector((s) => s.tasks?.loading);

  // store tasks data in variables
  const createdTask = tasks?.length;
  const completedTask = tasks?.filter((task: Task) => task.stage === 3).length;
  const pendingTask = tasks.filter((task: Task) =>
    [0, 1, 2].includes(task.stage)
  ).length;
  return (
    <>
      <div className="row">
        <div className="col">
          {loading ? (
            <span className="loader"></span>
          ) : (
            <div
              className="alert alert-primary fs-5 text-center fw-bold"
              role="alert"
            >
              Created Task <span className="fs-4 ps-2">{createdTask}</span>
            </div>
          )}
        </div>

        <div className="col">
          {loading ? (
            <span className="loader"></span>
          ) : (
            <div
              className="alert alert-warning fs-5 text-center fw-bold"
              role="alert"
            >
              Pending Task <span className="fs-4 ps-2">{pendingTask}</span>
            </div>
          )}
        </div>
        <div className="col">
          {loading ? (
            <span className="loader"></span>
          ) : (
            <div
              className="alert alert-success fs-5 text-center fw-bold"
              role="alert"
            >
              Completed Task <span className="fs-4 ps-2">{completedTask}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TaskSummary;
