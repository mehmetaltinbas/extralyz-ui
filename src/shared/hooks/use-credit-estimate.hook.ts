import React from 'react';
import type { EstimateResponse } from 'src/shared/types/estimate.response';
import { useAppSelector } from 'src/store/hooks';

export function useCreditEstimate({
    isEnabled,
    estimateFn,
    actionLabel,
    debounceMs = 300,
    deps,
}: {
    isEnabled: boolean;
    estimateFn: () => Promise<EstimateResponse>;
    actionLabel: string;
    debounceMs?: number;
    deps: React.DependencyList;
}): {
    estimate: EstimateResponse | null;
    isEstimating: boolean;
    credits: number;
    creditBalance: number;
    isInsufficient: boolean;
    buttonLabel: string;
} {
    const creditBalance = useAppSelector((state) => state.user?.creditBalance ?? 0);

    const [estimate, setEstimate] = React.useState<EstimateResponse | null>(null);
    const [isEstimating, setIsEstimating] = React.useState(false);

    React.useEffect(() => {
        if (!isEnabled) {
            setEstimate(null);
            return;
        }

        const handle = setTimeout(async () => {
            setIsEstimating(true);
            const response = await estimateFn();
            setEstimate(response);
            setIsEstimating(false);
        }, debounceMs);

        return () => clearTimeout(handle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEnabled, ...deps]);

    const credits = estimate?.credits ?? 0;
    const isInsufficient = estimate?.isSuccess === true && credits > creditBalance;
    const buttonLabel = isEstimating
        ? `${actionLabel} (calculating…)`
        : estimate?.isSuccess && credits > 0
            ? `${actionLabel} (${credits} credits)`
            : actionLabel;

    return {
        estimate,
        isEstimating,
        credits,
        creditBalance,
        isInsufficient,
        buttonLabel,
    };
}
