import React from 'react';
import { ExerciseSetDifficulty } from 'src/features/exercise-set/enums/exericse-set-difficulty.enum';
import { ExerciseSetType } from 'src/features/exercise-set/enums/exercise-set-type.enum';
import { ExerciseSetService } from 'src/features/exercise-set/services/exercise-set.service';
import type { GenerateAdditionalExercisesDto } from 'src/features/exercise-set/types/dto/generate-additional-exercises.dto';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { Button } from 'src/shared/components/Button';
import { Modal } from 'src/shared/components/Modal';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { camelToTitleCase } from 'src/shared/utils/camel-to-title-case.util';
import { Input } from 'src/shared/components/Input';
import { InputType } from 'src/shared/enums/input-type.enum';
import { ExerciseGenerationMode } from 'src/features/exercise-set/enums/exercise-generation-mode.enum';
import { InformationText } from 'src/shared/components/InformationText';
import { useBreakpoint } from 'src/shared/hooks/use-breakpoint.hook';
import { InformationTextSize } from 'src/shared/enums/information-text-size.enum';

export function GenerateAdditionalExercisesForm({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    onClose,
    setIsLoadingPageHidden,
    refreshData,
    exerciseSet,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
    refreshData: () => void;
    exerciseSet: ExerciseSet;
}) {
    const initialDto: GenerateAdditionalExercisesDto = {
        type: exerciseSet.type as ExerciseSetType,
        difficulty: exerciseSet.difficulty as ExerciseSetDifficulty,
        count: 5,
        generationMode: ExerciseGenerationMode.DIRECT_RECALL
    };
    const [dto, setDto] = React.useState<GenerateAdditionalExercisesDto>(initialDto);
    const [countStr, setCountStr] = React.useState(String(initialDto.count));

    const { isDesktop } = useBreakpoint();

    const isSubmittingRef = React.useRef(false);

    React.useEffect(() => {
        if (isHidden && !isSubmittingRef.current) {
            setDto(initialDto);
            setCountStr(String(initialDto.count));
        }
    }, [isHidden]);

    async function generate() {
        const estimate = await ExerciseSetService.estimateAdditional(exerciseSet._id, dto);

        if (estimate.isSuccess && estimate.credits && estimate.credits > 0) {
            const confirmed = confirm(`This will cost ${estimate.credits} credits. Proceed?`);
            if (!confirmed) return;
        }

        isSubmittingRef.current = true;
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await ExerciseSetService.generateAdditional(
                exerciseSet._id,
                dto
            );

            if (!response.isSuccess) {
                alert(response.message);
                isSubmittingRef.current = false;
                setIsHidden(false);
            } else {
                isSubmittingRef.current = false;
                refreshData();
                setIsPopUpActive(false);
            }
        } catch (error) {
            alert('internal error');
            isSubmittingRef.current = false;
            setIsHidden(false);
        } finally {
            setIsLoadingPageHidden(true);
        }
    }

    return (
        <Modal isHidden={isHidden} onClose={onClose}>
            <div className="flex justify-start items-center gap-2">
                <p>type: </p>
                <select
                    name="type"
                    value={dto.type}
                    onChange={(e) => setDto({ ...dto, type: e.currentTarget.value as ExerciseSetType })}
                    className="py-[2px] px-2 border rounded-[10px] bg-surface text-text-primary"
                >
                    {Object.values(ExerciseSetType).map((value, index) => (
                        <option key={`exercise-set-type-${index}`} value={value}>{camelToTitleCase(value)}</option>
                    ))}
                </select>
            </div>

            <div className="flex justify-start items-center gap-2">
                <p>difficulty: </p>
                <select
                    name="difficulty"
                    value={dto.difficulty}
                    onChange={(e) => setDto({ ...dto, difficulty: e.currentTarget.value as ExerciseSetDifficulty })}
                    className="py-[2px] px-2 border rounded-[10px] bg-surface text-text-primary"
                >
                    {Object.values(ExerciseSetDifficulty).map((value, index) => (
                        <option key={`exercise-set-difficulty-${index}`} value={value}>{camelToTitleCase(value)}</option>
                    ))}
                </select>
            </div>

            <div className="flex justify-start items-center gap-2">
                <p>count: </p>
                <Input
                    type={InputType.NUMBER}
                    value={countStr}
                    onChange={(e) => {
                        setCountStr(e.currentTarget.value);
                        setDto({ ...dto, count: e.currentTarget.value === '' ? 0 : Number(e.currentTarget.value) });
                    }}
                />
            </div>

            <div className="flex justify-start items-center gap-2">
                <p>Focus: </p>
                <select
                    name="generationMode"
                    value={dto.generationMode}
                    onChange={(e) => setDto({ ...dto, generationMode: e.target.value as ExerciseGenerationMode })}
                    className="py-[2px] px-2 border rounded-[10px] bg-surface text-text-primary"
                >
                    {Object.values(ExerciseGenerationMode).map((value, index) => (
                        <option key={`generation-mode-${index}`} value={value}>{camelToTitleCase(value)}</option>
                    ))}
                </select>
            </div>

            <InformationText
                size={isDesktop ? InformationTextSize.MD : InformationTextSize.SM}
                text={
                    dto.generationMode === ExerciseGenerationMode.DIRECT_RECALL
                        ? "Focuses on facts and definitions found directly in your source."
                        : "Focuses on applying concepts to NEW examples and scenarios not in the text."
                }
            />

            <Button
                variant={ButtonVariant.PRIMARY}
                onClick={async () => await generate()}
            >
                Generate
            </Button>
        </Modal>
    );
}
