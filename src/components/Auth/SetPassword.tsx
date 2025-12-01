import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useCallback, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { BASE } from "../../services/config";
import { login } from "../../store/slices/authSlice";
import { useAppDispatch } from "../../store/store";

const validationSchema = Yup.object({
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
});

const SetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const email = location.state?.email;
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  if (!email) {
    return (
      <>
        <div className="d-flex flex-column align-items-center py-5">
          <div className="px-5 text-center bold">Invalid access</div>
          <a href="/login" className="text-center">
            Login
          </a>
        </div>
      </>
    );
  }

  /** Correct login function */
  const handleLoginFun = useCallback(
    (identifier: string, password: string) =>
      dispatch(login({ identifier, password })).unwrap(),
    [dispatch]
  );

  const handleSubmit = async (values: any) => {
    try {
      // 1. Find user by email
      const { data: arr } = await axios.get(`${BASE}/users`, {
        params: { email },
      });

      const user = arr[0];
      if (!user) {
        toast.error("User not found");
        return;
      }

      // 2. Save new password and convert provider → local
      await axios.patch(`${BASE}/users/${user.id}`, {
        password: values.password,
        provider: "local",
      });

      //   toast.success("Password created successfully!");

      // 3. Auto Login with new password
      try {
        const loggedInUser = await handleLoginFun(email, values.password);

        localStorage.setItem("login", loggedInUser.id);
        toast.success("Logged in successfully!");
        navigate("/");
      } catch (e) {
        toast.error("Password saved, please login manually.");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="login-container ">
      <div className="login-card p-5">
        <h3>Create Password</h3>
        <p className="text-muted">
          Email: <strong>{email}</strong>
        </p>

        <Formik
          initialValues={{ password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-2">
                <label className="form-label">
                  New Password <span className="text-danger">*</span>
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
              </div>

              <ErrorMessage
                name="password"
                component="div"
                className="invalid-feedback d-block"
              />

              <button
                type="submit"
                className="btn btn-primary mt-3 w-100"
                disabled={isSubmitting}
              >
                Save Password
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SetPassword;
