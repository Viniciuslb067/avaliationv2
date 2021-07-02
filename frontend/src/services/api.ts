import Router from "next/router";
import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: "https://10.120.49.181:3001",
});
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response.status === 401) {
      Router.push("/"); 
    }
  }
);

