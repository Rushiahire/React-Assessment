import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect } from "react";
import "./styles/globals.css";
import { useDispatch } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { setUser } from "./store/slices/authSlice";
import { ToastContainer } from "react-toastify";
import ErrorBoundary from "./components/ErrorBoundary";

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const saved = localStorage.getItem("currentUser");
    if (saved) {
      try {
        dispatch(setUser(JSON.parse(saved)));
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
  }, []);
  return (
    <>
      <ErrorBoundary>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          draggable={true}
        />
        <AppRoutes />
      </ErrorBoundary>
    </>
  );
};

export default App;
