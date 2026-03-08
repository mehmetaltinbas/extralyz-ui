import type { SignUpUserDto } from 'src/features/user/types/dto/sign-up-user.dto';
import type { ReadSingleUserResponse } from 'src/features/user/types/response/read-single-user.response';
import { axiosInstance } from 'src/shared/api/axiosInstance';
import type { ResponseBase } from 'src/shared/types/response-base';
import { handleServiceError } from 'src/shared/util/handle-service-error.util';

const baseUrl = `/user`;

async function signUp(signUpUserDto: SignUpUserDto): Promise<ResponseBase> {
    try {
        const response = (await axiosInstance.post(`${baseUrl}/signup`, signUpUserDto)).data;

        return response;
    } catch (error) {
        return handleServiceError(error);
    }
}

async function readByToken(): Promise<ReadSingleUserResponse> {
    try {
        const response = (await axiosInstance.get(`${baseUrl}/read-by-token`)).data;

        return response;
    } catch (error) {
        return handleServiceError(error);
    }
}

export const userService = {
    signUp,
    readByToken,
};
