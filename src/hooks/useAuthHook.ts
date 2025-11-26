// src/hooks/useAuthHook.ts
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, login, logout, clearError } from "../store/slices/authSlice";
import type { RootState, AppDispatch } from "../store/store";

const useAuthHook = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((s: RootState) => s.auth);

  // unwrap() lets components await and catch errors directly
  const handleRegisterFun = useCallback(
    (payload: any) => dispatch(register(payload)).unwrap(),
    [dispatch]
  );

  const handleLoginFun = useCallback(
    (identifier: string, password: string) =>
      dispatch(login({ identifier, password })).unwrap(),
    [dispatch]
  );

  const doLogout = useCallback(() => dispatch(logout()), [dispatch]);
  const clear = useCallback(() => dispatch(clearError()), [dispatch]);

  return {
    auth,
    handleRegisterFun,
    handleLoginFun,
    doLogout,
    clear,
  };
};

export default useAuthHook;
