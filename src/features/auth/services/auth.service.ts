import type { ForgotPasswordDto } from 'src/features/auth/types/dto/forgot-password.dto';
import type { GoogleSignInDto } from 'src/features/auth/types/dto/google-sign-in.dto';
import type { ResendVerificationDto } from 'src/features/auth/types/dto/resend-verification.dto';
import type { ResetPasswordDto } from 'src/features/auth/types/dto/reset-password.dto';
import type { SignInDto } from 'src/features/auth/types/dto/sign-in.dto';
import type { SignUpUserDto } from 'src/features/auth/types/dto/sign-up.dto';
import type { VerifyEmailDto } from 'src/features/auth/types/dto/verify-email.dto';
import type { SignInResponse } from 'src/features/auth/types/response/sign-in.response';
import { axiosInstance } from 'src/shared/api/axios-instance';
import type { ResponseBase } from 'src/shared/types/response-base.interface';
import { handleServiceError } from 'src/shared/utils/handle-service-error.util';

const baseUrl = `/auth`;

export class AuthService {
    private constructor() {}
    
    static async signUp(signUpUserDto: SignUpUserDto): Promise<ResponseBase> {
        try {
            const response = (await axiosInstance.post(`${baseUrl}/sign-up`, signUpUserDto)).data;
    
            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async signIn(signInDto: SignInDto): Promise<SignInResponse> {
        try {
            const signInResponse: SignInResponse = (
                await axiosInstance.post(`${baseUrl}/sign-in`, signInDto)
            ).data;

            console.log("signInResponse: ", signInResponse);
            return signInResponse;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async googleSignIn(dto: GoogleSignInDto): Promise<SignInResponse> {
        try {
            const response: SignInResponse = (
                await axiosInstance.post(`${baseUrl}/google-sign-in`, dto)
            ).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async verifyEmail(dto: VerifyEmailDto): Promise<ResponseBase> {
        try {
            const response = (await axiosInstance.post(`${baseUrl}/verify-email`, dto)).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async resendVerification(dto: ResendVerificationDto): Promise<ResponseBase> {
        try {
            const response = (await axiosInstance.post(`${baseUrl}/resend-verification`, dto)).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }
    
    static async forgotPassword(dto: ForgotPasswordDto): Promise<ResponseBase> {
        try {
            const response = (await axiosInstance.post(`${baseUrl}/forgot-password`, dto)).data;

            return response;
        } catch (error) {
            return handleServiceError(error);
        }
    }

    static async resetPassword(dto: ResetPasswordDto): Promise<ResponseBase> {
        try {
            const response = (await axiosInstance.post(`${baseUrl}/reset-password`, dto)).data;

            return response;
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
