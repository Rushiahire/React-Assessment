import React from "react";
import "./styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

const App: React.FC = () => {
  return (
    <>
      <AppRoutes />
    </>
  );
};

export default App;
