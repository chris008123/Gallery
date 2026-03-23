import axios from "axios";

// ✅ Create Axios instance
const API = axios.create({
  baseURL: "https://gallery-w4pj.onrender.com/api",
  withCredentials: true // important for CORS + cookies (future-proof)
});

// ✅ Attach token to every request
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`; // ✅ proper format
    }

    return req;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle responses globally (optional but powerful)
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);

      // Optional: auto logout if token is invalid
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        // window.location.href = "/login"; // optional redirect
      }
    } else {
      console.error("Network Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default API;