import { PLAN_TIER_RANK } from 'src/features/subscription/constants/plan-tier-rank.constant';
import type { PlanName } from 'src/features/subscription/enums/plan-name.enum';
import type { Plan } from 'src/features/subscription/types/plan.interface';
import { Button } from 'src/shared/components/Button';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

export function PlanActionButton({
    plan,
    currentPlanName,
    isCanceled,
    onUpgradeClick,
    onDowngradeClick,
}: {
    plan: Plan;
    currentPlanName: PlanName;
    isCanceled: boolean;
    onUpgradeClick: (planName: PlanName) => void;
    onDowngradeClick: (planName: PlanName) => void;
}) {
    const isCurrentPlan = plan.name === currentPlanName;
    const planRank = PLAN_TIER_RANK[plan.name];
    const currentRank = PLAN_TIER_RANK[currentPlanName];

    return isCurrentPlan ? (
        <span className="text-xs font-medium text-accent px-3 py-1.5 border border-accent rounded-full">
            Current Plan
        </span>
    ) : planRank > currentRank ? (
        <Button
            variant={ButtonVariant.PRIMARY}
            size={ButtonSize.SM}
            onClick={() => onUpgradeClick(plan.name)}
        >
            Upgrade
        </Button>
    ) : planRank < currentRank ? (
        <Button
            variant={ButtonVariant.OUTLINE}
            size={ButtonSize.SM}
            onClick={() => onDowngradeClick(plan.name)}
            disabled={isCanceled}
        >
            Downgrade
        </Button>
    ) : null;
}
