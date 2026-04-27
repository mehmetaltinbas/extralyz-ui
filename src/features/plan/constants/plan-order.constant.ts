import { PlanName } from "src/features/plan/enums/plan-name.enum";

export const PLAN_ORDER = Object.values(PlanName)
  .reduce((accumulator, planName, index) => {
    accumulator[planName as PlanName] = index;
    return accumulator;
  }, {} as Record<PlanName, number>);
