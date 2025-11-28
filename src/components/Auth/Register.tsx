import React, { memo } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useRegisterHook from "../../hooks/useRegisterHook";
import "../../styles/register.css";
import { Link } from "react-router-dom";

const Register: React.FC = () => {
  const {
    formik,
    loading,
    error,
    preview,
    successMsg,
    onImage,
    showPassword,
    togglePassword,
  } = useRegisterHook();

  return (
    <div className="register-container">
      <div className="register-card">
        <h3>Register</h3>

        {error && <div className="alert alert-danger">{error}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        <form onSubmit={formik.handleSubmit}>
          {/* NAME */}
          <div className="mb-2">
            <label className="form-label">
              Name <span className="text-danger">*</span>
            </label>
            <input
              className={`form-control ${
                formik.touched.name && formik.errors.name ? "is-invalid" : ""
              }`}
              {...formik.getFieldProps("name")}
              autoComplete="off"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="invalid-feedback">{formik.errors.name}</div>
            )}
          </div>

          {/* USERNAME */}
          <div className="mb-2">
            <label className="form-label">
              Username <span className="text-danger">*</span>
            </label>
            <input
              className={`form-control ${
                formik.touched.username && formik.errors.username
                  ? "is-invalid"
                  : ""
              }`}
              {...formik.getFieldProps("username")}
              autoComplete="off"
            />
            {formik.touched.username && formik.errors.username && (
              <div className="invalid-feedback">{formik.errors.username}</div>
            )}
          </div>

          {/* EMAIL */}
          <div className="mb-2">
            <label className="form-label">
              Email <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              className={`form-control ${
                formik.touched.email && formik.errors.email ? "is-invalid" : ""
              }`}
              {...formik.getFieldProps("email")}
              autoComplete="off"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="invalid-feedback">{formik.errors.email}</div>
            )}
          </div>

          {/* CONTACT */}
          <div className="mb-2">
            <label className="form-label">Contact Number</label>
            <input
              className="form-control"
              type="number"
              min={0}
              {...formik.getFieldProps("contact")}
              autoComplete="off"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-2">
            <label className="form-label">
              Password <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${
                  formik.touched.password && formik.errors.password
                    ? "is-invalid"
                    : ""
                }`}
                {...formik.getFieldProps("password")}
                autoComplete="off"
              />

              <span
                className="input-group-text"
                style={{ cursor: "pointer" }}
                onClick={togglePassword}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            {formik.touched.password && formik.errors.password && (
              <div className="invalid-feedback d-block">
                {formik.errors.password}
              </div>
            )}
          </div>

          {/* IMAGE UPLOAD */}
          <div className="mb-2">
            <label className="form-label">Profile Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={onImage}
            />

            {preview && (
              <img src={preview} className="profile-preview" alt="preview" />
            )}
          </div>

          <button
            className="btn btn-primary my-3"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <div className="text-center">
            Already have account ? <Link to="/login">Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(Register);
