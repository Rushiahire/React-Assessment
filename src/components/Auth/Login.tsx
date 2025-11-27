import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { memo } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import useLoginHook from "../../hooks/useLoginHook";
import { RECAPTCHA_SITE_KEY } from "../../services/config";
import "../../styles/login.css";
import { loginValidation } from "../../validation/loginValidation";

const Login: React.FC = () => {
  const {
    auth,
    initialValues,
    handleSubmit,
    showPassword,
    togglePassword,
    setCaptchaToken,
  } = useLoginHook();

  return (
    <div className="login-container">
      <div className="login-card">
        <h3>Login</h3>

        {auth.error && <div className="alert alert-danger">{auth.error}</div>}

        <Formik
          initialValues={initialValues}
          validationSchema={loginValidation}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* Identifier */}
              <div className="mb-2">
                <label className="form-label">
                  Username or Email <span className="text-danger">*</span>
                </label>
                <Field
                  name="identifier"
                  className="form-control"
                  autoComplete="off"
                />
                <ErrorMessage
                  name="identifier"
                  component="div"
                  className="invalid-feedback d-block"
                />
              </div>

              {/* Password */}
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

                  {/* Toggle Icon */}
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

              {/* Captcha */}
              <div className="mb-3 mt-4">
                <ReCAPTCHA
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={setCaptchaToken}
                />
              </div>

              <button
                className="btn btn-primary my-3"
                type="submit"
                disabled={auth.loading || isSubmitting}
              >
                {auth.loading ? "Logging in..." : "Login"}
              </button>

              <div className="text-center">
                Don't have an account? <Link to="/register">Signup</Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default memo(Login);
