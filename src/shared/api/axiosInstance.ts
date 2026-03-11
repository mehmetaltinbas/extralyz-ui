import axios, { AxiosError } from 'axios';

const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
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
            const appUrl = import.meta.env.VITE_UI_URL;

            if (window.location.href !== appUrl && window.location.href !== `${appUrl}/`) {
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
