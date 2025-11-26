import React, { useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";

const AddTask = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const focusRef = useRef<HTMLInputElement | null>(null);

  const formik = useFormik({
    initialValues: {
      taskName: "",
      deadline: "",
      priority: "",
    },
    validationSchema: Yup.object({
      taskName: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .max(15, "Name must be 15 characters or less")
        .required("Name is required"),
      deadline: Yup.string().required("Date is required"),
      priority: Yup.string().required("Priority is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const loginId = window.localStorage.getItem("login");

      // dispatch(addTask({ loginId, values }));

      resetForm();
      navigate("/");
    },
  });

  useEffect(() => {
    if (focusRef.current) focusRef.current.focus();
  }, []);

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="card shadow-lg p-4 border-0 rounded-4">
          <h3 className="text-center mb-4 text-primary fw-bold">
            Add New Task
          </h3>

          <form onSubmit={formik.handleSubmit}>
            {/* Task Name */}
            <div className="mb-3">
              <label htmlFor="taskName" className="form-label fw-semibold">
                Task Name
              </label>
              <input
                id="taskName"
                name="taskName"
                type="text"
                className={`form-control ${
                  formik.touched.taskName && formik.errors.taskName
                    ? "is-invalid"
                    : ""
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.taskName}
                placeholder="Enter task name..."
                ref={focusRef}
              />
              {formik.touched.taskName && formik.errors.taskName && (
                <div className="invalid-feedback">{formik.errors.taskName}</div>
              )}
            </div>

            {/* Deadline */}
            <div className="mb-3">
              <label htmlFor="deadline" className="form-label fw-semibold">
                Deadline
              </label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                className={`form-control ${
                  formik.touched.deadline && formik.errors.deadline
                    ? "is-invalid"
                    : ""
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.deadline}
              />
              {formik.touched.deadline && formik.errors.deadline && (
                <div className="invalid-feedback">{formik.errors.deadline}</div>
              )}
            </div>

            {/* Priority */}
            <div className="mb-3">
              <label htmlFor="priority" className="form-label fw-semibold">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                className={`form-select ${
                  formik.touched.priority && formik.errors.priority
                    ? "is-invalid"
                    : ""
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.priority}
              >
                <option value="">Select priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {formik.touched.priority && formik.errors.priority && (
                <div className="invalid-feedback">{formik.errors.priority}</div>
              )}
            </div>

            <div className="row">
              <div className="col-7">
                <button
                  type="submit"
                  className="btn btn-primary btn-sm px-3 py-1 rounded-3"
                >
                  Add Task
                </button>
              </div>
              <div className="col-5 text-end">
                <Link
                  to="/"
                  className="btn btn-outline-secondary btn-sm px-3 rounded-3"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
