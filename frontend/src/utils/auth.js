import { toast } from 'react-toastify';

// Email and password validation
export const validateLoginForm = ({ email, password }) => {
    if (!email || !password) {
        toast.error('Email and password are required');
        return false;
    }

    if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        toast.error('Please enter a valid email address');
        return false;
    }

    return true;
};

// Centralized login handler
export const loginUser = async (form, navigate) => {
    try {
        const response = await axios.post('http://localhost:8080/api/auth/login', form, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
        });

        const { token, role, userId } = response.data;

        // Store token and role in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("userId", userId);

        // Navigate based on role
        if (role === "ADMIN") {
            navigate('/admin-dashboard');
        } else if (role === 'USER' || role === 'PROPOSAL_CREATOR') {
            navigate('/user-dashboard');
        } else {
            console.warn("⚠️ Unknown role, staying on login.");
        }

        toast.success('Login successful');
    } catch (err) {
        const message = err.response?.data?.message || 'Invalid email or password';
        toast.error(message);
        console.error("❌ Login failed:", err);
    }
};
