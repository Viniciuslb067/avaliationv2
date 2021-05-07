import axios from "axios";

export const api = axios.create({
  baseURL: "http://10.120.48.53:3001",
});