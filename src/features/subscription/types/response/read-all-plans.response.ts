import type { ResponseBase } from 'src/shared/types/response-base.interface';
import type { Plan } from 'src/features/subscription/types/plan.interface';

export interface ReadAllPlansResponse extends ResponseBase {
    plans?: Plan[];
}
