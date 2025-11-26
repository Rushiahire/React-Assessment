import React from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import useDashboardHook from "../hooks/useDashboardHook";

const Dashboard: React.FC = () => {
  const user = useSelector((s: any) => s.auth.currentUser);
  const currentUser = localStorage.getItem("login");

  const {} = useDashboardHook();

  if (!currentUser) {
    return (
      <div className="alert alert-info">
        Please login or register to access the Kanban dashboard.
      </div>
    );
  }

  return (
    <>
      <div>
        <Navbar />
        <h2>Welcome to your Dashboard, {user?.name}!</h2>
        <p>
          This demo stores users in a JSON file (`db.json`) via{" "}
          <strong>json-server</strong>. You are logged in as{" "}
          <strong>{user?.username}</strong>.
        </p>
        <div className="card">
          <div className="card-body">
            <p>
              Kanban board features (tasks, columns, drag & drop) can be
              implemented and persisted similarly in DB endpoints (e.g.{" "}
              <code>/boards</code>, <code>/tasks</code>).
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
