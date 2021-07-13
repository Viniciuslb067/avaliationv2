import axios from "axios";
import { parseCookies } from "nookies";

const { "feedback.token": token } = parseCookies();

export const api = axios.create({
  baseURL: "http://10.120.49.181:3001",
});

console.log(`Bearer ${token}`)

axios.defaults.headers.common['Content-Type'] = `Bearer ${token}`;

// api.interceptors.request.use(
//   (config) => {
//     console.log(config)
//     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );
