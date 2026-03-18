import type { SignInDto } from 'src/features/auth/types/auth-dtos';
import { axiosInstance } from 'src/shared/api/axios-instance';
import type { ResponseBase } from 'src/shared/types/response-base.interface';
import { handleServiceError } from 'src/shared/utils/handle-service-error.util';

const baseUrl = `/auth`;

export class AuthService {
    private constructor() {}

    static async signIn(signInDto: SignInDto): Promise<ResponseBase> {
        try {
            const signInResponse: ResponseBase = (
                await axiosInstance.post(`${baseUrl}/sign-in`, signInDto)
            ).data;
    
            return signInResponse;
        } catch (error) {
            return handleServiceError(error);
        }
    }
    
    static async authorize() {
        try {
            const authorizeResponse: ResponseBase = (await axiosInstance.get(`${baseUrl}/authorize`))
                .data;
    
            return authorizeResponse;
        } catch (error) {
            return handleServiceError(error);
        }
    }
    
    static async signOut(): Promise<ResponseBase> {
        try {
            const response: ResponseBase = (await axiosInstance.post(`${baseUrl}/sign-out`)).data;
    
            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }
}
