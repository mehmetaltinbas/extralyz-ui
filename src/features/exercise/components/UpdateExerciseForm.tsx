import React from 'react';
import { ExerciseDifficulty } from 'src/features/exercise/enum/exercise-difficulty.enum';
import { ExerciseType } from 'src/features/exercise/enum/exercise-type.enum';
import { ExerciseService } from 'src/features/exercise/services/exercise.service';
import { exerciseTypeFactory } from 'src/features/exercise/strategies/type/exercise-type.factory';
import type { UpdateExerciseDto } from 'src/features/exercise/types/dto/update-exercise.dto';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import { Button } from 'src/shared/components/Button';
import { Modal } from 'src/shared/components/Modal';
import { Textarea } from 'src/shared/components/Textarea';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useBreakpoint } from 'src/shared/hooks/use-breakpoint.hook';
import { camelToTitleCase } from 'src/shared/utils/camel-to-title-case.util';

export function UpdateExerciseForm({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    setIsLoadingPageHidden,
    onClose,
    refreshData,
    exercise
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    refreshData: () => void;
    exercise: Exercise;
}) {
    const initialDto: UpdateExerciseDto = {
        type: exercise.type,
        difficulty: exercise.difficulty,
        stem: exercise.prompt,
        solution: exercise.solution,
        choices: exercise.choices,
        correctChoiceIndex: exercise.correctChoiceIndex,
    };
    const [dto, setDto] = React.useState<UpdateExerciseDto>(initialDto);

    const activeStrategy = exerciseTypeFactory.resolveStrategy(dto.type ?? exercise.type);

    const isSubmittingRef = React.useRef(false);

    const { isMobile } = useBreakpoint();

    React.useEffect(() => {
        if (isHidden && !isSubmittingRef.current) {
            setDto(initialDto);
        }
    }, [isHidden, exercise]);

    async function update() {
        isSubmittingRef.current = true;
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await ExerciseService.updateById(
                exercise._id,
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

    function changeExerciseType(type: ExerciseType) {
        const strategy = exerciseTypeFactory.resolveStrategy(type);

        if (!strategy) {
            alert(`The type ${type} is not a valid exercise type.`);
            return;
        }

        strategy.changeUpdateExerciseDto(setDto);
    }

    function onChangeForEnum(event: React.ChangeEvent<HTMLSelectElement>) {
        const selectElement = event.currentTarget;

        if (!Object.keys(dto).includes(selectElement.name)) return;

        if (
            !(Object.values(ExerciseType) as string[]).includes(selectElement.value) &&
            !(Object.values(ExerciseDifficulty) as string[]).includes(selectElement.value)
        ) {
            return;
        } else if ((Object.values(ExerciseType) as string[]).includes(selectElement.value) && dto.type !== selectElement.value) {
            changeExerciseType(selectElement.value as ExerciseType);
        } else {
            setDto({
                ...dto,
                [selectElement.name]: selectElement.value,
            });
        }
    }

    return (
        <Modal isHidden={isHidden} onClose={onClose}>
            <div className='absolute left-2 top-1'>
                <p className='font-bold'>{exercise.order + 1}</p>
            </div>

            <div className="flex justify-start items-center gap-2">
                <p>Type: </p>
                <select
                    name="type"
                    value={dto.type}
                    onChange={(e) => onChangeForEnum(e)}
                    className="py-[2px] px-2 border rounded-[10px] bg-surface text-text-primary"
                >
                    {Object.values(ExerciseType).map((exerciseTypeValue, index) => (
                        <option key={`exercise-type-value-${index}`} value={exerciseTypeValue}>{camelToTitleCase(exerciseTypeValue)}</option>
                    ))}
                </select>
            </div>

            <div className="flex justify-start items-center gap-2">
                <p>Difficulty: </p>
                <select
                    name="difficulty"
                    value={dto.difficulty}
                    onChange={(e) => onChangeForEnum(e)}
                    className="py-[2px] px-2 border rounded-[10px] bg-surface text-text-primary"
                >
                    {Object.values(ExerciseDifficulty).map((exerciseDifficultyValue, index) => (
                        <option key={`exercise-difficulty-value-${index}`} value={exerciseDifficultyValue}>{camelToTitleCase(exerciseDifficultyValue)}</option>
                    ))}
                </select>
            </div>

            <div className="w-64 sm:w-96 flex justify-start items-center gap-2">
                <p>Stem: </p>
                <Textarea
                    value={dto.stem}
                    onChange={(e) =>
                        setDto({
                            ...dto,
                            stem: e.currentTarget.value,
                        })
                    }
                    rows={isMobile ? 1 : 2}
                />
            </div>

            {activeStrategy?.getRestOfUpdateExerciseForm(dto, setDto)}

            <Button
                variant={ButtonVariant.PRIMARY}
                onClick={async (event) => await update()}
            >
                Update
            </Button>
        </Modal>
    );
}
