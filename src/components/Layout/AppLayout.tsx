import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";

const AppLayout = () => {
  return (
    <>
      <Navbar />
      <main className="container-fluid py-3">
        <Outlet />
      </main>
    </>
  );
};

export default AppLayout;
