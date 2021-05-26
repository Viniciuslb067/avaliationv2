import Router from "next/router";
import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";

let cookies = parseCookies();
let failedRequestQueue = [];

export const api = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    Authorization: `Bearer ${cookies["feedback.token"]}`,
  },
});
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response.status === 301) {
      Router.push("/");
    }
  }
);
