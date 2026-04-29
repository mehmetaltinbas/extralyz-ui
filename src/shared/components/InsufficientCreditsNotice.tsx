import { useNavigate } from 'react-router-dom';
import { Button } from 'src/shared/components/Button';
import { ButtonSize } from 'src/shared/enums/button-size.enum';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

export function InsufficientCreditsNotice({
    needed,
    balance,
    onBeforeNavigate,
}: {
    needed: number;
    balance: number;
    onBeforeNavigate?: () => void;
}) {
    const navigate = useNavigate();
    const deficit = needed - balance;

    function goToBilling() {
        onBeforeNavigate?.();
        navigate('/settings/billing');
    }

    return (
        <div className="flex flex-col items-center gap-1">
            <p className="text-sm text-red-500 text-center">
                Insufficient credits — you need {deficit} more.
            </p>
            <Button
                variant={ButtonVariant.OUTLINE}
                size={ButtonSize.SM}
                onClick={goToBilling}
            >
                Upgrade plan
            </Button>
        </div>
    );
}
