import type { ResponseBase } from 'src/shared/types/response-base.interface';

export interface EstimateResponse extends ResponseBase {
    credits?: number;
    breakdown?: Record<string, number>;
}
