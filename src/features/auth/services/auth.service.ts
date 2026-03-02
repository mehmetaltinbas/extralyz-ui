import { axiosInstance } from 'src/shared/api/axiosInstance';
import type { SignInDto } from 'src/features/auth/types/auth-dtos';
import type { ResponseBase } from 'src/shared/types/response-base';
import { handleServiceError } from 'src/shared/utilities/handle-service-error.util';

const baseUrl = `/auth`;

async function signIn(signInDto: SignInDto): Promise<ResponseBase> {
    try {
        const signInResponse: ResponseBase = (
            await axiosInstance.post(`${baseUrl}/sign-in`, signInDto)
        ).data;

        return signInResponse;
    } catch (error) {
        return handleServiceError(error);
    }
}

async function authorize() {
    try {
        const authorizeResponse: ResponseBase = (await axiosInstance.get(`${baseUrl}/authorize`))
            .data;

        return authorizeResponse;
    } catch (error) {
        return handleServiceError(error);
    }
}

export const authService = {
    signIn,
    authorize,
};
