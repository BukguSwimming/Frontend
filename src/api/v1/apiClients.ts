import axios from 'axios';

export const apiClient = axios.create({
  //2025 06 17 강병오 SSL 적용위해 추가
  baseURL: '/api/bukguswim/v1',
  withCredentials: true,
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');

  config.headers = config.headers ?? {};

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const serverApiClient = axios.create({
  // api 삭제
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`,
  withCredentials: true,
});