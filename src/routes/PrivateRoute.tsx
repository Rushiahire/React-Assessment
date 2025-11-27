import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: any) => {
  const login = window.localStorage.getItem("login");

  return login ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
