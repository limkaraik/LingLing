import axios from 'axios';

export const frontEndUrl = `http://localhost:3000/`;

export const baseUrl = `http://localhost:5000/`;

export default axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});
