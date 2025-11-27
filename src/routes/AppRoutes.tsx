import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Loader from "../components/common/Loader";
import NotFoundPage from "../components/NoFoundPage";
import ProtectedRoute from "./PrivateRoute";
import AppLayout from "../components/Layout/AppLayout";

const Login = React.lazy(() => import("../components/Auth/Login"));
const Register = React.lazy(() => import("../components/Auth/Register"));
const Dashboard = React.lazy(() => import("../components/Dashboard/Dashboard"));

const AppRoutes = () => {
  const currentUser = useSelector((s: any) => s?.auth?.currentUser);

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route
            path="/login"
            element={currentUser ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={currentUser ? <Navigate to="/" /> : <Register />}
          />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
          </Route>

          {/* NOT FOUND */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
