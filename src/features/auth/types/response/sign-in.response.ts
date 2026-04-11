import type { ResponseBase } from 'src/shared/types/response-base.interface';

export interface SignInResponse extends ResponseBase {
    isEmailVerificationRequired?: boolean;
    email?: string;
}
