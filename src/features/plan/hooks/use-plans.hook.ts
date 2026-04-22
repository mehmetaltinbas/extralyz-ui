import React from 'react';
import { PLAN_ORDER } from 'src/features/subscription/constants/plan-order.constant';
import { PlanService } from 'src/features/subscription/services/plan.service';
import type { Plan } from 'src/features/subscription/types/plan.interface';

export function usePlans(): { plans: Plan[]; isLoading: boolean } {
    const [plans, setPlans] = React.useState<Plan[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        let cancelled = false;
        setIsLoading(true);

        PlanService.readAll().then((response) => {
            if (!cancelled) {
                if (response.isSuccess && response.plans) {
                    const sorted = [...response.plans].sort(
                        (a, b) => PLAN_ORDER.indexOf(a.name) - PLAN_ORDER.indexOf(b.name)
                    );
                    setPlans(sorted);
                }
                setIsLoading(false);
            }
        });

        return () => {
            cancelled = true;
        };
    }, []);

    return { plans, isLoading };
}
