import React from "react";
import { useNavigate } from "react-router-dom";

const SessionExpired = () => {
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
      <h2 className="text-danger fw-bold mb-3">
        Session Expired
      </h2>
      <p className="mb-4">Please log in again to continue.</p>
      <button
        onClick={() => navigate("/login")}
        className="btn btn-primary"
      >
        Login Again
      </button>
    </div>
  );
};

export default SessionExpired;
