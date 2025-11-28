import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import "../styles/navbar.css";

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

  console.log({ currentUser });
  return (
    <nav className="navbar navbar-light px-3 shadow-sm navbar-container">
      <Link className="navbar-brand" to="/">
        Kanban
      </Link>
      <div>
        {login ? (
          <>
            <div className="d-flex justify-content-between me-lg-2">
              {currentUser && (
                <div className="d-flex align-items-center gap-2 me-4 d-lg-block d-md-block d-none">
                  {/* Profile Image */}

                  <img
                    src={
                      currentUser.profileImage || "./public/images/download.png"
                    }
                    alt="profile"
                    className="me-2"
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #ddd",
                      cursor: "pointer",
                    }}
                  />

                  {/* Username */}
                  <span className="fw-bold">
                    {currentUser?.name && `Hi ${currentUser?.name}`}
                  </span>
                </div>
              )}
              <button
                className="btn btn-outline-secondary py-1 px-2"
                onClick={handleLogoutFun}
              >
                Logout{" "}
                <span className="ps-1">
                  <IoLogOutOutline size={20} />
                </span>
              </button>
            </div>
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
