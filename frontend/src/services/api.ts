import axios from "axios";
import { getToken } from "./auth";

export const api = axios.create({
  baseURL: "http://127.0.0.1:3001",
});

// api.interceptors.request.use(async (config) => {
//   try {
//     console.log(localStorage.getItem("&app-token"));
//     const token = await localStorage.getItem('&app-token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   } catch (error) {
//     console.log(error);
//   }
// });
