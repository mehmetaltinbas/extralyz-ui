import type { PlanName } from 'src/features/subscription/enums/plan-name.enum';

export interface Plan {
    _id: string;
    name: PlanName;
    monthlyPrice: number;
    currency: string;
    monthlyCredits: number;
    maximumCredits: number;
    maxSources: number;
    maxExerciseSets: number;
}
