import axios, { AxiosError } from 'axios';

const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    withCredentials: true,
});

instance.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    },
    function (error: AxiosError) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        if (error.status === 401) {
            window.location.href = '/sign-in';
        } else if (error.status === 403) {
            alert('forbidden');
        }

        return Promise.reject(error);
    }
);

export const axiosInstance = instance;
