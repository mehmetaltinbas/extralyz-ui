import { PlanFeature } from "src/features/plan/enums/plan-feature.enum";
import { PlanName } from 'src/features/plan/enums/plan-name.enum';

export const PLAN_FEATURE_MINIMUM_PLAN_NAME: Record<PlanFeature, PlanName> = {
    [PlanFeature.VISION_PAPER_EXTRACT]: PlanName.PLUS,
    [PlanFeature.LECTURE_NOTES_GENERATION]: PlanName.PLUS,
    [PlanFeature.WEAK_POINT_FOCUS_PRACTICE]: PlanName.PLUS,
};
