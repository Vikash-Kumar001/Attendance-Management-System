import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  withCredentials: true, // Optional, if you're using cookies
});

export default instance;
