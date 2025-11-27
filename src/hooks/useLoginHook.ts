import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import useAuthHook from "./useAuthHook";
import { useNavigate } from "react-router-dom";

const useLoginHook = () => {
  const { auth, handleLoginFun } = useAuthHook();
  const navigate = useNavigate();

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (auth.currentUser) navigate("/");
  }, [auth.currentUser, navigate]);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  /** Memoized initial values */
  const initialValues = useMemo(
    () => ({
      identifier: "",
      password: "",
    }),
    []
  );

  /** Form Submit Handler */
  const handleSubmit = useCallback(
    async (values: typeof initialValues) => {
      if (!captchaToken) {
        toast.error("Please verify that you're not a robot.");
        return;
      }

      const result = await handleLoginFun(values.identifier, values.password);
      if (result) {
        toast.success("Login successful");
        localStorage.setItem("login", result.id);
        navigate("/");
      }
    },
    [captchaToken, handleLoginFun, navigate]
  );

  return {
    auth,
    initialValues,
    handleSubmit,
    showPassword,
    togglePassword,
    setCaptchaToken,
  };
};

export default useLoginHook;
