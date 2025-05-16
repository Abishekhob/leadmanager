import { jwtDecode } from "jwt-decode"; // ✅

export function isTokenExpired(token) {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch (err) {
    return true;
  }
}
