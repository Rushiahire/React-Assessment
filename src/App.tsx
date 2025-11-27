import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import ErrorBoundary from "./components/ErrorBoundary";
import AppRoutes from "./routes/AppRoutes";
import "./styles/globals.css";

const App: React.FC = () => {
  return (
    <>
      <ErrorBoundary>
        <ToastContainer
          position="top-right"
          autoClose={1500}
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
