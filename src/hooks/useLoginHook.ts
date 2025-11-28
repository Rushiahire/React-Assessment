import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthHook from "./useAuthHook";

const useLoginHook = () => {
  const { auth, handleLoginFun,handleGoogleLoginFun } = useAuthHook();
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
        toast.success("Login successfully");
        localStorage.setItem("login", result.id);
        navigate("/");
      }
    },
    [captchaToken, handleLoginFun, navigate]
  );

 
  // GOOGLE LOGIN HANDLER
  const handleGoogleLogin = async (credential: string) => {
  const payload = JSON.parse(atob(credential?.split(".")[1]));

  const email = payload.email;
  const name = payload.name;

  try {
    const user = await handleGoogleLoginFun(email, name);
    toast.success("Login with Google!");
    localStorage.setItem("login", user.id);

    navigate("/");
  } catch {
    toast.error("Google login failed");
  }
};
  return {
    auth,
    initialValues,
    handleSubmit,
    showPassword,
    togglePassword,
    setCaptchaToken,
    handleGoogleLogin
  };
};

export default useLoginHook;
