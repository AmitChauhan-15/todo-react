import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

api.interceptors.request.use(function (config) {
  let token = localStorage.getItem("token") || "";
  config.headers["Authorization"] = "Bearer " + token;
  return config;
});

export default api;
