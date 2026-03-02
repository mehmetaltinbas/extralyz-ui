import { axiosInstance } from 'src/shared/api/axiosInstance';
import type { SignInDto } from 'src/features/auth/types/auth-dtos';
import type { ResponseBase } from 'src/shared/types/response-base';

const baseUrl = `/auth`;

async function signIn(signInDto: SignInDto): Promise<ResponseBase> {
    const signInResponse: ResponseBase = (
        await axiosInstance.post(`${baseUrl}/sign-in`, signInDto)
    ).data;
    return signInResponse;
}

async function authorize() {
    const authorizeResponse: ResponseBase = (await axiosInstance.get(`${baseUrl}/authorize`))
        .data;
    return authorizeResponse;
}

export const authService = {
    signIn,
    authorize,
};
