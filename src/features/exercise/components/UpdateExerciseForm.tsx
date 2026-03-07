import React from 'react';
import { MCQ_CHOICES_COUNT } from 'src/features/exercise/constants/mcq-choices-count.constant';
import { ExerciseDifficulty } from 'src/features/exercise/enum/exercise-difficulty.enum';
import { ExerciseType } from 'src/features/exercise/enum/exercise-type.enum';
import { exerciseService } from 'src/features/exercise/services/exercise.service';
import type { UpdateExerciseDto } from 'src/features/exercise/types/dto/update-exercise.dto';
import type { Exercise } from 'src/features/exercise/types/exercise.interface';
import { Button } from 'src/shared/components/Button';
import { Modal } from 'src/shared/components/Modal';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { getAlphabetLetter } from 'src/shared/util/get-alphabet-letter.util';

export function UpdateExerciseForm({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    setIsLoadingPageHidden,
    toggle,
    refreshData,
    exercise,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
    toggle: () => void;
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

    React.useEffect(() => {
        setDto(initialDto);
    }, [isHidden, exercise]);

    async function update() {
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await exerciseService.updateById(
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

    function changeExerciseType(type: string) {
        switch (type) {
            case ExerciseType.MCQ:
                setDto(prev => ({
                    ...prev,
                    type: ExerciseType.MCQ,
                    solution: undefined,
                    choices: Array(MCQ_CHOICES_COUNT).fill(''),
                    correctChoiceIndex: 0,
                }));

                break;

            case ExerciseType.TRUE_FALSE:
                setDto(prev => ({
                    ...prev,
                    type: ExerciseType.TRUE_FALSE,
                    solution: undefined,
                    choices: undefined,
                    correctChoiceIndex: 0,
                }));

                break;

            case ExerciseType.OPEN_ENDED:
                setDto(prev => ({
                    ...prev,
                    type: ExerciseType.OPEN_ENDED,
                    solution: '',
                    choices: undefined,
                    correctChoiceIndex: undefined,
                }));

                break;
        }
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
            changeExerciseType(selectElement.value);
        } else {
            setDto({
                ...dto,
                [selectElement.name]: selectElement.value,
            });
        }
    }

    return (
        <Modal isHidden={isHidden} onClose={toggle}>
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
                <input
                    value={dto.prompt}
                    onChange={(e) =>
                        setDto({
                            ...dto,
                            prompt: e.currentTarget.value,
                        })
                    }
                    className="w-64 py-[2px] px-2 border rounded-[10px]"
                />
            </div>

            {dto.type === ExerciseType.MCQ && dto.choices && dto.choices.length === MCQ_CHOICES_COUNT && (
                <React.Fragment>
                    {Array.from({ length: MCQ_CHOICES_COUNT }).map((value, index) => (
                        <div 
                            key={`choice-${index}`}
                            className="flex justify-start items-center gap-2"
                        >
                            <p>{getAlphabetLetter(index)}</p>
                            <input
                                value={dto.choices![index]}
                                onChange={(e) =>
                                    setDto({
                                        ...dto,
                                        choices: [
                                            ...dto.choices!.slice(0, index),
                                            e.currentTarget.value,
                                            ...dto.choices!.slice(index + 1),
                                        ],
                                    })
                                }
                                className="w-64 py-[2px] px-2 border rounded-[10px]"
                            />
                        </div>
                    ))}

                    <div className="flex justify-start items-center gap-2">
                        <p>correct choice: </p>
                        <select
                            name="correctChoiceIndex"
                            value={dto.correctChoiceIndex}
                            onChange={(e) =>
                                setDto({
                                    ...dto,
                                    correctChoiceIndex: Number(e.currentTarget.value),
                                })
                            }
                            className="py-[2px] px-2 border rounded-[10px]"
                        >
                            {Array.from({ length: MCQ_CHOICES_COUNT }).map((value, index) => (
                                <option value={index}>{getAlphabetLetter(index)}</option>
                            ))}
                        </select>
                    </div>
                </React.Fragment>
            )}

            {dto.type === ExerciseType.TRUE_FALSE && (
                <React.Fragment>
                    <div className="flex justify-start items-center gap-2">
                        <p>correct choice: </p>
                        <select
                            name="correctChoiceIndex"
                            value={dto.correctChoiceIndex}
                            onChange={(e) =>
                                setDto({
                                    ...dto,
                                    correctChoiceIndex: Number(e.currentTarget.value),
                                })
                            }
                            className="py-[2px] px-2 border rounded-[10px]"
                        >
                            <option value={0}>False</option>
                            <option value={1}>True</option>
                        </select>
                    </div>
                </React.Fragment>
            )}

            {dto.type === ExerciseType.OPEN_ENDED && (
                <div className="flex justify-start items-center gap-2">
                    <p>solution: </p>
                    <input
                        value={dto.solution}
                        onChange={(e) =>
                            setDto({
                                ...dto,
                                solution: e.currentTarget.value,
                            })
                        }
                        className="w-64 py-[2px] px-2 border rounded-[10px]"
                    />
                </div>
            )}

            <Button
                variant={ButtonVariant.PRIMARY}
                onClick={async (event) => await update()}
            >
                Update
            </Button>
        </Modal>
    );
}
