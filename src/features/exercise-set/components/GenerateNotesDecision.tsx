import { ExerciseSetEstimateService } from 'src/features/exercise-set/services/exercise-set-estimate.service';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { Button } from 'src/shared/components/Button';
import { InsufficientCreditsNotice } from 'src/shared/components/InsufficientCreditsNotice';
import { Modal } from 'src/shared/components/Modal';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useCreditEstimate } from 'src/shared/hooks/use-credit-estimate.hook';

export function GenerateNotesDecision({
    isHidden,
    onClose,
    onConfirm,
    onBeforeNavigateToBilling,
    exerciseSet,
    isGenerating,
}: {
    isHidden: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onBeforeNavigateToBilling?: () => void;
    exerciseSet: ExerciseSet;
    isGenerating: boolean;
}) {
    const {
        credits,
        creditBalance,
        isEstimating,
        isInsufficient,
        buttonLabel,
    } = useCreditEstimate({
        isEnabled: !isHidden,
        estimateFn: () => ExerciseSetEstimateService.estimateGenerateNotes(exerciseSet._id),
        actionLabel: 'Generate',
        deps: [exerciseSet._id],
    });

    return (
        <Modal isHidden={isHidden} onClose={onClose}>
            <div className="flex flex-col items-center gap-3 max-w-[400px]">
                <h2 className="text-base font-semibold text-center">Generate Notes</h2>
                <p className="text-sm text-text-secondary text-center">
                    AI will summarise this exercise set into a structured notes source. The generated notes can be linked back to this exercise set so you can study from them later.
                </p>

                {isInsufficient ? (
                    <InsufficientCreditsNotice
                        needed={credits}
                        balance={creditBalance}
                        onBeforeNavigate={onBeforeNavigateToBilling}
                    />
                ) : (
                    <Button
                        variant={ButtonVariant.PRIMARY}
                        disabled={isEstimating || isGenerating}
                        onClick={onConfirm}
                    >
                        {isGenerating ? 'Generating…' : buttonLabel}
                    </Button>
                )}
            </div>
        </Modal>
    );
}
