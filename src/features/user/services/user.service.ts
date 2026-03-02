import type { SignUpUserDto } from 'src/features/user/types/dto/sign-up-user.dto';
import { axiosInstance } from 'src/shared/api/axiosInstance';
import type { ResponseBase } from 'src/shared/types/response-base';

const baseUrl = `/user`;

async function signUp(signUpUserDto: SignUpUserDto): Promise<ResponseBase> {
    const response = (await axiosInstance.post(`${baseUrl}/signup`, signUpUserDto)).data;

    return response;
}

export const userService = {
    signUp,
};
