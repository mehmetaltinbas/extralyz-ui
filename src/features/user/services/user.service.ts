import type { SignUpUserDto } from 'src/features/user/types/dto/sign-up-user.dto';
import type { UpdateUserPasswordDto } from 'src/features/user/types/dto/update-user-password.dto';
import type { UpdateUserDto } from 'src/features/user/types/dto/update-user.dto';
import type { ReadSinglePublicUserResponse } from 'src/features/user/types/response/read-single-public-user.response';
import type { ReadSingleUserResponse } from 'src/features/user/types/response/read-single-user.response';
import { axiosInstance } from 'src/shared/api/axios-instance';
import type { ResponseBase } from 'src/shared/types/response-base.interface';
import { handleServiceError } from 'src/shared/utils/handle-service-error.util';

const baseUrl = `/user`;

export class UserService {
    private constructor() {}

    static async signUp(signUpUserDto: SignUpUserDto): Promise<ResponseBase> {
        try {
            const response = (await axiosInstance.post(`${baseUrl}/signup`, signUpUserDto)).data;
    
            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }
    
    static async readByToken(): Promise<ReadSingleUserResponse> {
        try {
            const response = (await axiosInstance.get(`${baseUrl}/read-by-token`)).data;
    
            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async updateByToken(dto: UpdateUserDto): Promise<ResponseBase> {
        try {
            const response = (await axiosInstance.patch(`${baseUrl}/update-by-token`, dto)).data;
    
            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async updatePassword(dto: UpdateUserPasswordDto): Promise<ResponseBase> {
        try {
            const response = (await axiosInstance.patch(`${baseUrl}/update-password`, dto)).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async readPublicByUserName(userName: string): Promise<ReadSinglePublicUserResponse> {
        try {
            const response = (
                await axiosInstance.get(`${baseUrl}/read-by-user-name/${userName}`)
            ).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async readPublicById(id: string): Promise<ReadSinglePublicUserResponse> {
        try {
            const response = (
                await axiosInstance.get(`${baseUrl}/read-public-by-id/${id}`)
            ).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    } 
}
