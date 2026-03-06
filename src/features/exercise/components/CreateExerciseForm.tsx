import React from 'react';
import { ExerciseSetType } from 'src/features/exercise-set/enums/exercise-set-type.enum';
import { ExerciseSetDifficulty } from 'src/features/exercise-set/enums/exericse-set-difficulty.enum';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { MCQ_CHOICES_COUNT } from 'src/features/exercise/constants/mcq-choices-count.constant';
import { ExerciseDifficulty } from 'src/features/exercise/enum/exercise-difficulty.enum';
import { ExerciseType } from 'src/features/exercise/enum/exercise-type.enum';
import { exerciseService } from 'src/features/exercise/services/exercise.service';
import type { CreateExerciseDto } from 'src/features/exercise/types/dto/create-exercise.dto';
import { Button } from 'src/shared/components/Button';
import { ButtonVariants } from 'src/shared/enums/button-variants.enum';
import { getAlphabetLetter } from 'src/shared/util/get-alphabet-letter.util';

export function CreateExerciseForm({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    toggle,
    setIsLoadingPageHidden,
    refreshData,
    exerciseSet,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    toggle: () => void;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
    refreshData: () => Promise<void>;
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

    React.useEffect(() => {
        setDto(initialDto);
    }, [isHidden]);

    async function create() {
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await exerciseService.createByExerciseSetId(
                exerciseSet._id,
                dto
            );

            await refreshData();

            if (!response.isSuccess) alert(response.message);

            setIsPopUpActive(false);
        } catch (error) {
            alert('internal error');
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
        <div
            className={`${isHidden ? 'hidden' : ''} relative border px-2 py-4 bg-white rounded-[10px]
            flex flex-col justify-center items-center gap-2`}
        >
            <div className="absolute top-1 right-1 w-full flex justify-end items-center">
                <Button variant={ButtonVariants.GHOST} onClick={(event) => toggle()}>
                    X
                </Button>
            </div>

            <div className="flex justify-start items-center gap-2 pt-4">
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

            {dto.type === ExerciseType.MCQ && (
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
                <>
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
                </>
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
                variant={ButtonVariants.PRIMARY}
                onClick={async (event) => await create()}
            >
                Generate
            </Button>
        </div>
    );
}
