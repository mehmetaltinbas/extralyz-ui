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
    };
    const [dto, setDto] = React.useState<GenerateAdditionalExercisesDto>(initialDto);

    const isSubmittingRef = React.useRef(false);

    React.useEffect(() => {
        if (isHidden && !isSubmittingRef.current) {
            setDto(initialDto);
        }
    }, [isHidden]);

    async function generate() {
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
                    className="py-[2px] px-2 border rounded-[10px]"
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
                    className="py-[2px] px-2 border rounded-[10px]"
                >
                    {Object.values(ExerciseSetDifficulty).map((value, index) => (
                        <option key={`exercise-set-difficulty-${index}`} value={value}>{camelToTitleCase(value)}</option>
                    ))}
                </select>
            </div>

            <div className="flex justify-start items-center gap-2">
                <p>count: </p>
                <input
                    type="number"
                    min={1}
                    value={dto.count}
                    onChange={(e) => setDto({ ...dto, count: Number(e.currentTarget.value) })}
                    className="py-[2px] px-2 border rounded-[10px] w-20"
                />
            </div>

            <Button
                variant={ButtonVariant.PRIMARY}
                onClick={async () => await generate()}
            >
                Generate
            </Button>
        </Modal>
    );
}
