import axios from "axios";

export const api = axios.create({
  baseURL: "http://10.120.48.53:3001",
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
