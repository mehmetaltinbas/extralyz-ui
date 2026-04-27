import type { PlanName } from 'src/features/plan/enums/plan-name.enum';

export interface DowngradeSubscriptionDto {
    newPlanName: PlanName;
}
