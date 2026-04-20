import type { PlanName } from 'src/features/subscription/enums/plan-name.enum';

export interface DowngradeSubscriptionDto {
    newPlanName: PlanName;
}
