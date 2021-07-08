import axios from "axios";
import { parseCookies } from "nookies";

let cookies = parseCookies();

export const api = axios.create({
  baseURL: "http://10.120.49.181:3001",
  headers: {
    authorization: `Bearer ${cookies["feedback.token"]}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.defaults.headers.common[
  "authorization"
] = `Bearer ${cookies["feedback.token"]}`;
