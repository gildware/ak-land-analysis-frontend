import axios, { AxiosInstance } from "axios";

const baseURL: string = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});
