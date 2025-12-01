import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:8000/api",
  baseURL: "https://codequest-app-dhy3.vercel.app/",
});

export const getContests = () => API.get("/contests");
export const loginUser = (data) => API.post("/users/login", data);
export const registerUser = (data) => API.post("/users/register", data);
export const getProfile = (token) => API.get("/users/me", {
  headers: { Authorization: `Bearer ${token}` }
});
