import type { ResponseBase } from 'src/shared/types/response-base.interface';

export interface CheckPriceToPayResponse extends ResponseBase {
    priceToPay?: number;
}
