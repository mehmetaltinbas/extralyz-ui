import type { ResponseBase } from 'src/shared/types/response-base.interface';

export interface UpdateUserResponse extends ResponseBase {
    emailVerificationRequired?: boolean;
}
