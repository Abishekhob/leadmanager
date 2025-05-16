import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from "../axiosInstance"; // your custom Axios setup

const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = searchParams.get("token");

  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await axiosInstance.post("api/users/auth/validate-invite", { token });
        if (res.data.success) {
          setTokenValid(true);
        } else {
          setError("Invalid or expired token.");
        }
      } catch (err) {
        setError("Invalid or expired token.");
      }
    };
    if (token) validateToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axiosInstance.post("api/users/auth/set-password", {
        token,
        password,
      });

      if (res.data.success) {
        alert("Password set successfully! You can now log in.");
        navigate("/login");
      } else {
        setError("Something went wrong");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    }
  };

  if (error) return <div className="alert alert-danger p-4">{error}</div>;

  if (!tokenValid) return <div className="p-4">Validating token...</div>;

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Set Your Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="password"
              placeholder="New Password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Confirm Password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            Set Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;
