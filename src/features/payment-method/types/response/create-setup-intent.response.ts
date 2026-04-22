import type { ResponseBase } from 'src/shared/types/response-base.interface';

export interface CreateSetupIntentResponse extends ResponseBase {
    clientSecret?: string;
}
