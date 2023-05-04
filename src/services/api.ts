import axios from 'axios';
import { AppError } from '@utils/AppError';

const { BASE_URL } = process.env;

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      return Promise.reject(new AppError(error.response.data.detail));
    }

    return Promise.reject(error);
  }
);

export { api };
