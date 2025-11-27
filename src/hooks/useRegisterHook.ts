import { useFormik } from "formik";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAuthHook from "./useAuthHook";
import { registerValidation } from "../validation/registerValidation";
import type { RootState } from "../store/store";
import { useSelector } from "react-redux";

const MAX_WIDTH = 100;

const useRegisterHook = () => {
  const navigate = useNavigate();
  const { handleRegisterFun, clear } = useAuthHook();
  const { loading, error } = useSelector((s: RootState) => s.auth);

  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

useEffect(() => {
    clear();
    return () => {
      clear();
    };
  }, [clear]);

  const togglePassword = () => setShowPassword((prev) => !prev);

 
  const compressImage = useCallback((file: File) => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const scaleSize = MAX_WIDTH / img.width;

          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          const compressed = canvas.toDataURL("image/jpeg", 0.5);
          resolve(compressed);
        };
      };

      reader.readAsDataURL(file);
    });
  }, []);

  const onImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const compressedImage = await compressImage(file);
    setPreview(compressedImage);
    setFileName(compressedImage);
  };


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
        profileImage: fileName ?? null, 
      };

      try {
        await handleRegisterFun(payload);
        setSuccessMsg("Registration successful! You can now log in.");
        resetForm();
        setPreview(null);
        setFileName(null);

        // Navigate only AFTER success message shows briefly
        setTimeout(() => navigate("/login"), 500);
      } catch (err: any) {
        console.error(err?.message);
      }
    },
  });

  return {
    formik,
    loading,
    error,
    preview,
    successMsg,
    onImage,
    showPassword,
    togglePassword,
  };
}

export default useRegisterHook;
