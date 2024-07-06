import axios from "axios";
import Cookies from "js-cookie";
import { User } from "./auth";

export const api = axios.create({
  baseURL: "http://localhost:8888",
});

api.interceptors.request.use(
  (config) => {
    const auth = Cookies.get("auth");

    if (!auth) {
      return config;
    }

    const user = JSON.parse(auth) as User;

    config.headers.Authorization = `Bearer ${user.token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
