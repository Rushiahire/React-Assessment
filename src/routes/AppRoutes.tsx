import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Loader from "../components/common/Loader";
import NotFoundPage from "../components/NoFoundPage";
import ProtectedRoute from "./PrivatedRoute";
const Login = React.lazy(() => import("../components/Auth/Login"));
const Register = React.lazy(() => import("../components/Auth/Register"));
const Dashboard = React.lazy(() => import("../components/Dashboard/Dashboard"));

const AppRoutes = () => {
  const currentUser = useSelector((s: any) => s?.auth?.currentUser);

  return (
    <>
      <BrowserRouter>
        {/* <Navbar /> */}

        <div>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<Loader />}>
                    <Dashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/register"
              element={currentUser ? <Navigate to="/" /> : <Register />}
            />
            <Route
              path="/login"
              element={currentUser ? <Navigate to="/" /> : <Login />}
            />
            {/* Catch-all for unmatched routes */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
};

export default AppRoutes;
