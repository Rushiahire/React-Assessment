// src/pages/auth/Register.tsx
import { useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector } from "react-redux";
import useAuthHook from "../../hooks/useAuthHook";
import type { RootState } from "../../store/store";
import "../../styles/register.css";
import { registerValidation } from "../../validation/registerValidation";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { auth, handleRegisterFun, clear } = useAuthHook();
  const { loading, error } = useSelector((s: RootState) => s.auth);

  const [profileImage, setProfileImage] = useState<string | undefined>(
    undefined
  );
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // clear global error when component mounts/unmounts
  useEffect(() => {
    clear();
    return () => {
      clear();
    };
  }, [clear]);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const onImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfileImage(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      email: "",
      contact: "",
      password: "",
    },

    validationSchema: registerValidation,

    onSubmit: async (values, { resetForm }) => {
      setSuccessMsg(null);

      const payload = {
        ...values,
        profileImage,
      };

      try {
        // CALL the hook function directly — it returns a promise (unwrapped)
        const result = await handleRegisterFun(payload);
        // success (result will be whatever your thunk returns)

        setSuccessMsg("Registration successful! You can now log in.");
        resetForm();
        setProfileImage(undefined);
        navigate("/login");
      } catch (err: any) {
        // err will be the rejectWithValue or thrown error from the thunk
        // you already show auth.error from redux; but show a local fallback as well
        const message = err?.message || "Registration failed";
        // optional: reset captcha if you had one / or perform any other cleanup
        console.error("Register error:", message);
        // auth.error is already set by the slice; no need to set local state unless you want
      }
    },
  });

  return (
    <div className="register-container">
      <div className="register-card">
        <h3>Register</h3>

        {/* Global Errors */}
        {error && <div className="alert alert-danger">{error}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        <form onSubmit={formik.handleSubmit}>
          {/* NAME */}
          <div className="mb-2">
            <label className="form-label">Name *</label>
            <input
              className={`form-control ${
                formik.touched.name && formik.errors.name ? "is-invalid" : ""
              }`}
              {...formik.getFieldProps("name")}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="invalid-feedback">{formik.errors.name}</div>
            )}
          </div>

          {/* USERNAME */}
          <div className="mb-2">
            <label className="form-label">Username *</label>
            <input
              className={`form-control ${
                formik.touched.username && formik.errors.username
                  ? "is-invalid"
                  : ""
              }`}
              {...formik.getFieldProps("username")}
            />
            {formik.touched.username && formik.errors.username && (
              <div className="invalid-feedback">{formik.errors.username}</div>
            )}
          </div>

          {/* EMAIL */}
          <div className="mb-2">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className={`form-control ${
                formik.touched.email && formik.errors.email ? "is-invalid" : ""
              }`}
              {...formik.getFieldProps("email")}
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
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-2">
            <label className="form-label">Password *</label>

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${
                  formik.touched.password && formik.errors.password
                    ? "is-invalid"
                    : ""
                }`}
                {...formik.getFieldProps("password")}
                autoComplete="new-password"
              />

              <span
                className="input-group-text"
                style={{ cursor: "pointer" }}
                onClick={togglePassword}
                role="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
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

          {/* PROFILE IMAGE */}
          <div className="mb-2">
            <label className="form-label">Profile Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={onImage}
            />

            {profileImage && (
              <img
                src={profileImage}
                className="profile-preview"
                alt="preview"
              />
            )}
          </div>

          <button
            className="btn btn-primary my-3"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
