import axios, { AxiosError } from 'axios';

function resolveBaseURL(): string {
    const apiPort = import.meta.env.VITE_API_PORT;
    if (apiPort) {
        return `${window.location.protocol}//${window.location.hostname}:${apiPort}`;
    }
    return import.meta.env.VITE_API_URL;
}

const instance = axios.create({
    baseURL: resolveBaseURL(),
    withCredentials: true,
});

instance.interceptors.response.use(
    function (response) {
        // any status code that lie within the range of 2xx cause this function to trigger
        // do something with response data
        return response;
    },
    function (error: AxiosError) {
        // any status codes that falls outside the range of 2xx cause this function to trigger
        // do something with response error
        if (error.status === 401) {
            // 401: unauthorized

            if (window.location.pathname === '/workspace') {
                window.location.href = '/';
            }
        } else if (error.status === 403) {
            // 403: forbidden
            alert('forbidden');
        }

        return Promise.reject(error);
    }
);

export const axiosInstance = instance;
