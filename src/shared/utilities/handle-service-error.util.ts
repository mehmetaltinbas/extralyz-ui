import axios from 'axios';
import type { ResponseBase } from "src/shared/types/response-base";

export function handleServiceError(error: unknown): ResponseBase {
    if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ResponseBase;
    }

    return { isSuccess: false, message: 'internal error' };
}
