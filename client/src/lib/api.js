import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000",  // ✅ jar asel
});

export const updateProfile = async (id, data, token) => {
  const res = await axios.put(
    `http://localhost:5000/api/profile/update/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});