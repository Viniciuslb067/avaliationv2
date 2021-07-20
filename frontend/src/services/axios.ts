import axios from "axios";
import { parseCookies } from "nookies";

export function getAPIClient(ctx?: any) {
  const { "feedback.token": token } = parseCookies(ctx);

  const api = axios.create({
    baseURL: "http://10.120.49.181:3001",
  });

  if (token) {
    api.defaults.headers["Authorization"] = `Bearer ${token}`;
  }

  // api.interceptors.response.use(response => {
  //   return response;
  // }, error => {
  //   if(error.response.status === 401) {
  //     throw new Error("Você não possui permissão para acessar esse conteúdo")
  //   }
  //   return error;
  // })

  return api;
}
