import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { memo } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import useRegisterHook from "../../hooks/useRegisterHook";
import "../../styles/register.css";
import { registerValidation } from "../../validation/registerValidation";

const Register: React.FC = () => {
  const {
    loading,
    error,
    preview,
    successMsg,
    onImage,
    showPassword,
    togglePassword,
    initialValues,
    handleSubmit,
  } = useRegisterHook();

  return (
    <div className="register-container">
      <div className="register-card">
        <h3>Register</h3>

        {error && <div className="alert alert-danger">{error}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        <Formik
          initialValues={initialValues}
          validationSchema={registerValidation}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* NAME */}
              <div className="mb-2">
                <label className="form-label">
                  Name <span className="text-danger">*</span>
                </label>

                <Field
                  name="name"
                  className="form-control"
                  autoComplete="off"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="invalid-feedback d-block"
                />
              </div>

              {/* USERNAME */}
              <div className="mb-2">
                <label className="form-label">
                  Username <span className="text-danger">*</span>
                </label>

                <Field
                  name="username"
                  className="form-control"
                  autoComplete="off"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="invalid-feedback d-block"
                />
              </div>

              {/* EMAIL */}
              <div className="mb-2">
                <label className="form-label">
                  Email <span className="text-danger">*</span>
                </label>

                <Field
                  type="email"
                  name="email"
                  className="form-control"
                  autoComplete="off"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="invalid-feedback d-block"
                />
              </div>

              {/* CONTACT */}
              <div className="mb-2">
                <label className="form-label">Contact Number</label>

                <Field
                  type="number"
                  name="contact"
                  min={0}
                  className="form-control"
                  autoComplete="off"
                />

                <ErrorMessage
                  name="contact"
                  component="div"
                  className="invalid-feedback d-block"
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-2">
                <label className="form-label">
                  Password <span className="text-danger">*</span>
                </label>

                <div className="input-group">
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    autoComplete="off"
                  />

                  <span
                    className="input-group-text password-toggle"
                    onClick={togglePassword}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>

                <ErrorMessage
                  name="password"
                  component="div"
                  className="invalid-feedback d-block"
                />
              </div>

              {/* IMAGE UPLOAD */}
              <div className="mb-2">
                <label className="form-label">Profile Image (optional)</label>

                {/* File input cannot be Field → stays normal input */}
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={onImage}
                />

                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    className="profile-preview"
                  />
                )}
              </div>

              {/* SUBMIT BUTTON */}
              <button
                className="btn btn-primary my-3 w-100"
                type="submit"
                disabled={loading || isSubmitting}
              >
                {loading ? "Registering..." : "Register"}
              </button>

              {/* LINK */}
              <div className="text-center">
                Already have an account? <Link to="/login">Sign In</Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default memo(Register);
