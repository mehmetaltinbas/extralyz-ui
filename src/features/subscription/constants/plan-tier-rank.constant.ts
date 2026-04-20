import { PlanName } from "src/features/subscription/enums/plan-name.enum";

export const PLAN_TIER_RANK: Record<PlanName, number> = {
    [PlanName.FREE]: 0,
    [PlanName.PLUS]: 1,
    [PlanName.PRO]: 2,
};
