import { useAuth } from "@/store/auth-store";
import axios from "axios";
import { error } from "console";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: "http://localhost:8888",
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    toast.error(error?.response?.data?.error);

    return Promise.reject(error);
  }
);

export const controlApi = axios.create({
  baseURL: "http://localhost:8888",
});

controlApi.interceptors.request.use(
  (config) => {
    const accessToken = useAuth.getState().accessToken;
    if (accessToken.length) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

controlApi.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const prevRequest = error?.config;
    const refreshToken = useAuth.getState().refreshToken;
    const login = useAuth.getState().login;
    const logout = useAuth.getState().logout;

    if (error?.response?.status === 403 && !prevRequest?.sent && refreshToken) {
      prevRequest.sent = true;
      try {
        const refreshResponse = await api.post("/refresh", {
          refresh_token: refreshToken,
        });

        const data = refreshResponse.data;
        login({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        });

        prevRequest.headers["Authorization"] = `Bearer ${data.access_token}`;
        return controlApi(prevRequest);
      } catch (error) {
        logout();
      }
    }

    toast("error accures", {
      description: JSON.stringify(error),
      action: {
        label: "Undo",
        onClick: () => null,
      },
    });

    return Promise.reject(error);
  }
);
