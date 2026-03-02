import type { SignUpUserDto } from 'src/features/user/types/dto/sign-up-user.dto';
import { axiosInstance } from 'src/shared/api/axiosInstance';
import type { ResponseBase } from 'src/shared/types/response-base';
import { handleServiceError } from 'src/shared/utilities/handle-service-error.util';

const baseUrl = `/user`;

async function signUp(signUpUserDto: SignUpUserDto): Promise<ResponseBase> {
    try {
        const response = (await axiosInstance.post(`${baseUrl}/signup`, signUpUserDto)).data;

        return response;
    } catch (error) {
        return handleServiceError(error);
    }
}

export const userService = {
    signUp,
};
