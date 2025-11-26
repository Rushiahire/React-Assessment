import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { IoIosAddCircleOutline } from "react-icons/io";
import "../styles/navbar.css";
import { IoLogOutOutline } from "react-icons/io5";
// import { RootState } from "./store";

// import { RootState, useAppDispatch } from "../store";
// import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const currentUser = useSelector((s: any) => s.auth.currentUser);
  const login = localStorage.getItem("login");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogoutFun = () => {
    dispatch(logout());
    localStorage.removeItem("login");
    navigate("/login");
  };
  return (
    <nav className="navbar navbar-light px-3 shadow-sm navbar-container">
      <Link className="navbar-brand" to="/">
        Kanban
      </Link>
      <div>
        {login ? (
          <>
            {/* <span className="me-3">Hi, {currentUser?.name}</span> */}
            {/* <Link
              className="btn btn-outline-primary me-2 py-1 px-2"
              to="/add-task"
              role="button"
            >
              <span className="text">Add Task</span> <IoIosAddCircleOutline />
            </Link> */}

            <button
              className="btn btn-outline-secondary py-1 px-2"
              onClick={handleLogoutFun}
            >
              Logout{" "}
              <span className="ps-1">
                <IoLogOutOutline size={20} />
              </span>
            </button>
          </>
        ) : (
          <>
            <Link className="btn btn-outline-primary me-2" to="/login">
              Login
            </Link>
            <Link className="btn btn-primary" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
