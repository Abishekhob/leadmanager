import React from "react";
import { useNavigate } from "react-router-dom";

const SessionExpired = () => {
  const navigate = useNavigate();

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <div className="shadow p-5 rounded bg-white" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="text-danger fw-bold mb-3 text-center">
          Session Expired
        </h2>
        <p className="mb-4 text-center">Please log in again to continue.</p>
        <div className="text-center">
          <button
            onClick={() => navigate("/login")}
            className="btn btn-primary"
          >
            Login Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpired;
