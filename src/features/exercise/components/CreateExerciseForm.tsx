import React from 'react';
import { ExerciseSetType } from 'src/features/exercise-set/enums/exercise-set-type.enum';
import { ExerciseSetDifficulty } from 'src/features/exercise-set/enums/exericse-set-difficulty.enum';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { MCQ_CHOICES_COUNT } from 'src/features/exercise/constants/mcq-choices-count.constant';
import { ExerciseDifficulty } from 'src/features/exercise/enum/exercise-difficulty.enum';
import { ExerciseType } from 'src/features/exercise/enum/exercise-type.enum';
import { ExerciseService } from 'src/features/exercise/services/exercise.service';
import { resolveExerciseTypeStrategy } from 'src/features/exercise/strategies/type/resolve-exercise-type-strategy';
import type { CreateExerciseDto } from 'src/features/exercise/types/dto/create-exercise.dto';
import { Button } from 'src/shared/components/Button';
import { Modal } from 'src/shared/components/Modal';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';

export function CreateExerciseForm({
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
    const initialDto: CreateExerciseDto = {
        type: exerciseSet.type === ExerciseSetType.MIX ? ExerciseType.MCQ : exerciseSet.type as ExerciseType,
        difficulty: exerciseSet.difficulty === ExerciseSetDifficulty.MIX ? ExerciseDifficulty.MEDIUM : exerciseSet.difficulty as ExerciseDifficulty,
        prompt: '',
        solution: undefined,
        choices: Array(MCQ_CHOICES_COUNT).fill(''),
        correctChoiceIndex: 0,
    };
    const [dto, setDto] = React.useState<CreateExerciseDto>(initialDto);

    const activeStrategy = resolveExerciseTypeStrategy(dto.type);

    React.useEffect(() => {
        setDto(initialDto);
    }, [isHidden]);

    async function create() {
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await ExerciseService.createByExerciseSetId(
                exerciseSet._id,
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

        strategy.changeCreateExerciseDto(setDto);
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
                <textarea
                    value={dto.prompt}
                    onChange={(e) =>
                        setDto({
                            ...dto,
                            prompt: e.currentTarget.value,
                        })
                    }
                    className="w-96 py-[2px] px-2 border rounded-[10px]"
                />
            </div>

            {activeStrategy?.getRestOfCreateExerciseForm(dto, setDto)}

            <Button
                variant={ButtonVariant.PRIMARY}
                onClick={async (event) => await create()}
            >
                Generate
            </Button>
        </Modal>
    );
}
