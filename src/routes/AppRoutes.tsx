import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import Dashboard from "../components/Dashboard/Dashboard";
import { useSelector } from "react-redux";
import ProtectedRoute from "./PrivatedRoute";
import { Suspense } from "react";
import Loader from "../components/common/Loader";
import AddTask from "../components/AddTask/AddTask";
import NotFoundPage from "../components/NoFoundPage";

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
