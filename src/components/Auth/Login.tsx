// src/pages/auth/Login.tsx
import React, { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuthHook";
import { loginValidation } from "../../validation/loginValidation";
import { RECAPTCHA_SITE_KEY } from "../../services/config";
import "../../styles/login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login: React.FC = () => {
  const { auth, handleLoginFun } = useAuth();
  const navigate = useNavigate();

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (auth.currentUser) navigate("/");
  }, [auth.currentUser, navigate]);

  const formik = useFormik({
    initialValues: { identifier: "", password: "" },
    validationSchema: loginValidation,
    onSubmit: async (values) => {
      if (!captchaToken) {
        setCaptchaError("Please verify that you're not a robot.");
        return;
      }
      const result = await handleLoginFun(values.identifier, values.password);
      if (result) {
        navigate("/");
        localStorage.setItem("login", result.id);
      }
    },
  });

  return (
    <div className="login-container">
      <div className="login-card">
        <h3>Login</h3>

        {auth.error && <div className="alert alert-danger">{auth.error}</div>}
        {captchaError && (
          <div className="alert alert-danger">{captchaError}</div>
        )}

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-2">
            <label className="form-label">Username or Email *</label>
            <input
              className={`form-control ${
                formik.touched.identifier && formik.errors.identifier
                  ? "is-invalid"
                  : ""
              }`}
              {...formik.getFieldProps("identifier")}
              autoComplete="off"
            />
            {formik.touched.identifier && formik.errors.identifier && (
              <div className="invalid-feedback">{formik.errors.identifier}</div>
            )}
          </div>

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
                autoComplete="off"
              />
              <span
                className="input-group-text"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
              {formik.touched.password && formik.errors.password && (
                <div className="invalid-feedback d-block">
                  {formik.errors.password}
                </div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={(t) => setCaptchaToken(t)}
            />
          </div>

          <button
            className="btn btn-primary my-3"
            type="submit"
            disabled={auth.loading}
          >
            {auth.loading ? "Logging in..." : "Login"}
          </button>
          <div className="text-center">
            Didn't have an account? <Link to="/register">Signup</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
