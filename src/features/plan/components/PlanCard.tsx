import type React from 'react';
import { PLAN_TIER_RANK } from 'src/features/subscription/constants/plan-tier-rank.constant';
import { PLUS_FEATURES } from 'src/features/subscription/constants/plus-features.constant';
import { PlanName } from 'src/features/subscription/enums/plan-name.enum';
import type { Plan } from 'src/features/subscription/types/plan.interface';
import { formatLimit } from 'src/features/subscription/utils/format-limit.util';

export function PlanCard({
    plan,
    isCurrentPlan,
    actionSlot,
}: {
    plan: Plan;
    isCurrentPlan: boolean;
    actionSlot: React.ReactNode;
}) {
    const showPlusFeatures = PLAN_TIER_RANK[plan.name] >= PLAN_TIER_RANK[PlanName.PLUS];

    return (
        <div
            className={`flex flex-col gap-3 p-4 rounded-lg border ${
                isCurrentPlan ? 'border-accent bg-surface' : 'border-border bg-surface'
            }`}
        >
            <div className="flex flex-col gap-1">
                <h3 className="text-base font-semibold capitalize">{plan.name}</h3>
                <p className="text-xl font-bold">
                    {plan.monthlyPrice === 0
                        ? 'Free'
                        : `${plan.monthlyPrice} ${plan.currency}/mo`}
                </p>
            </div>

            <div className="flex flex-col gap-1.5 text-sm text-text-secondary">
                <p>{plan.monthlyCredits} credits/month</p>
                <p>Max {plan.maximumCredits} credits</p>
                <p>{formatLimit(plan.maxSources)} sources</p>
                <p>{formatLimit(plan.maxExerciseSets)} exercise sets</p>
            </div>

            {showPlusFeatures && (
                <div className="flex flex-col gap-1 text-sm border-t border-border pt-2">
                    {PLUS_FEATURES.map((feature) => (
                        <p key={feature} className="text-text-secondary">
                            + {feature}
                        </p>
                    ))}
                </div>
            )}

            <div className="mt-auto pt-2 flex justify-center">{actionSlot}</div>
        </div>
    );
}
