import React from 'react';
import { GenerateNotesFocus } from 'src/features/exercise-set/enums/generate-notes-focus.enum';
import { ExerciseSetEstimateService } from 'src/features/exercise-set/services/exercise-set-estimate.service';
import type { GenerateNotesDto } from 'src/features/exercise-set/types/dto/generate-notes.dto';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { Button } from 'src/shared/components/Button';
import { InformationText } from 'src/shared/components/InformationText';
import { InsufficientCreditsNotice } from 'src/shared/components/InsufficientCreditsNotice';
import { Modal } from 'src/shared/components/Modal';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { InformationTextSize } from 'src/shared/enums/information-text-size.enum';
import { useBreakpoint } from 'src/shared/hooks/use-breakpoint.hook';
import { useCreditEstimate } from 'src/shared/hooks/use-credit-estimate.hook';
import { camelToTitleCase } from 'src/shared/utils/camel-to-title-case.util';

export function GenerateNotesDecisionForm({
    isHidden,
    onClose,
    onConfirm,
    onBeforeNavigateToBilling,
    exerciseSet,
    isGenerating,
}: {
    isHidden: boolean;
    onClose: () => void;
    onConfirm: (dto: GenerateNotesDto) => void;
    onBeforeNavigateToBilling?: () => void;
    exerciseSet: ExerciseSet;
    isGenerating: boolean;
}) {
    const [dto, setDto] = React.useState<GenerateNotesDto>({
        focus: GenerateNotesFocus.UNIFIED,
    });
    const {
        credits,
        creditBalance,
        isEstimating,
        isInsufficient,
        buttonLabel,
    } = useCreditEstimate({
        isEnabled: !isHidden,
        estimateFn: () => ExerciseSetEstimateService.estimateGenerateNotes(exerciseSet._id, dto),
        actionLabel: 'Generate',
        deps: [exerciseSet._id],
    });

    const { isDesktop } = useBreakpoint();

    return (
        <Modal isHidden={isHidden} onClose={onClose}>
            <div className="flex flex-col items-center gap-3 max-w-[400px]">
                <h2 className="text-base font-semibold text-center">Generate Notes</h2>
                <p className="text-sm text-text-secondary text-center">
                    AI will extract notes from this exercise set into a new source.
                </p>

                <div className="flex justify-start items-center gap-2">
                    <p>Focus: </p>
                    <select
                        name="focus"
                        value={dto.focus}
                        onChange={(e) => setDto({ ...dto, focus: e.target.value as GenerateNotesFocus })}
                        className="py-[2px] px-2 border rounded-[10px] bg-surface text-text-primary"
                    >
                        {Object.values(GenerateNotesFocus).map((val, index) => (
                            <option key={`focus-${index}`} value={val}>{camelToTitleCase(val)}</option>
                        ))}
                    </select>
                </div>

                <InformationText
                    size={isDesktop ? InformationTextSize.MD : InformationTextSize.SM}
                    text={
                        dto.focus === GenerateNotesFocus.PER_EXERCISE
                            ? "Treats each exercise independently — every exercise becomes its own subtitle in the notes."
                            : "Pools all exercises together and writes one cohesive set of notes with a natural flow."
                    }
                />

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
                        onClick={() => onConfirm(dto)}
                    >
                        {isGenerating ? 'Generating…' : buttonLabel}
                    </Button>
                )}
            </div>
        </Modal>
    );
}
