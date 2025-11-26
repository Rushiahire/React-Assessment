import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import Dashboard from "../components/Dashboard";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import PrivateRoute from "./PrivatedRoute";
import { Suspense } from "react";
import Loader from "../components/common/Loader";
import AddTask from "../components/AddTask/AddTask";

const AppRoutes = () => {
  const currentUser = useSelector((s: any) => s?.auth?.currentUser);

  return (
    <>
      <BrowserRouter>
        {/* <Navbar /> */}

        <div className="container">
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Suspense fallback={<Loader />}>
                    <Dashboard />
                  </Suspense>
                </PrivateRoute>
              }
            />
            <Route
              path="/add-task"
              element={
                <PrivateRoute>
                  <Suspense fallback={<Loader />}>
                    <AddTask />
                  </Suspense>
                </PrivateRoute>
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
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
};

export default AppRoutes;
