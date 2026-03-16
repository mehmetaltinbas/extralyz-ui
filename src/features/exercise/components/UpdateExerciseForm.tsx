import React from 'react';
import { ExerciseDifficulty } from 'src/features/exercise/enum/exercise-difficulty.enum';
import { ExerciseType } from 'src/features/exercise/enum/exercise-type.enum';
import { ExerciseService } from 'src/features/exercise/services/exercise.service';
import { resolveExerciseTypeStrategy } from 'src/features/exercise/strategies/type/resolve-exercise-type-strategy';
import type { UpdateExerciseDto } from 'src/features/exercise/types/dto/update-exercise.dto';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import { Button } from 'src/shared/components/Button';
import { Modal } from 'src/shared/components/Modal';
import { Textarea } from 'src/shared/components/Textarea';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

export function UpdateExerciseForm({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    setIsLoadingPageHidden,
    onClose,
    refreshData,
    exercise,
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
        prompt: exercise.prompt,
        solution: exercise.solution,
        choices: exercise.choices,
        correctChoiceIndex: exercise.correctChoiceIndex,
    };
    const [dto, setDto] = React.useState<UpdateExerciseDto>(initialDto);

    const activeStrategy = resolveExerciseTypeStrategy(dto.type ?? exercise.type);

    React.useEffect(() => {
        setDto(initialDto);
    }, [isHidden, exercise]);

    async function update() {
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await ExerciseService.updateById(
                exercise._id,
                dto
            );

            if (!response.isSuccess) {
                alert(response.message);
                setIsHidden(false);
            } else {
                refreshData();
                setIsPopUpActive(false);
            }
        } catch (error) {
            alert('internal error');
            setIsHidden(false);
        } finally {
            setIsLoadingPageHidden(true);
        }
    }

    function changeExerciseType(type: ExerciseType) {
        const strategy = resolveExerciseTypeStrategy(type);

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
            <div className="flex justify-start items-center gap-2">
                <p>type: </p>
                <select
                    name="type"
                    value={dto.type}
                    onChange={(e) => onChangeForEnum(e)}
                    className="py-[2px] px-2 border rounded-[10px]"
                >
                    <option value={ExerciseType.MCQ}>Multiple Choice</option>
                    <option value={ExerciseType.TRUE_FALSE}>True False</option>
                    <option value={ExerciseType.OPEN_ENDED}>Open Ended</option>
                </select>
            </div>

            <div className="flex justify-start items-center gap-2">
                <p>difficulty: </p>
                <select
                    name="difficulty"
                    value={dto.difficulty}
                    onChange={(e) => onChangeForEnum(e)}
                    className="py-[2px] px-2 border rounded-[10px]"
                >
                    <option value={ExerciseDifficulty.EASY}>Easy</option>
                    <option value={ExerciseDifficulty.MEDIUM}>Medium</option>
                    <option value={ExerciseDifficulty.HARD}>Hard</option>
                </select>
            </div>

            <div className="flex justify-start items-center gap-2">
                <p>prompt: </p>
                <Textarea
                    value={dto.prompt}
                    onChange={(e) =>
                        setDto({
                            ...dto,
                            prompt: e.currentTarget.value,
                        })
                    }
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
