import React from 'react';
import { ExerciseDifficulty } from 'src/features/exercise/enum/exercise-difficulty.enum';
import { ExerciseType } from 'src/features/exercise/enum/exercise-type.enum';
import { exerciseService } from 'src/features/exercise/services/exercise.service';
import type { CreateExerciseDto } from 'src/features/exercise/types/dto/create-exercise.dto';
import { Button } from 'src/shared/components/Button';
import { ButtonVariants } from 'src/shared/enums/button-variants.enum';

export function CreateExerciseForm({
    isHidden,
    setIsHidden,
    setIsPopUpActive,
    toggle,
    setIsLoadingPageHidden,
    refreshData,
    exerciseSetId,
}: {
    isHidden: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPopUpActive: React.Dispatch<React.SetStateAction<boolean>>;
    toggle: () => void;
    setIsLoadingPageHidden: React.Dispatch<React.SetStateAction<boolean>>;
    refreshData: () => Promise<void>;
    exerciseSetId: string;
}) {
    const initialDto: CreateExerciseDto = {
        type: ExerciseType.MCQ,
        difficulty: ExerciseDifficulty.MEDIUM,
        prompt: '',
        solution: '',
        choices: ['', '', '', '', ''],
        correctChoiceIndex: 0,
    };
    const [createExerciseDto, setCreateExerciseDto] = React.useState<CreateExerciseDto>(initialDto);

    React.useEffect(() => {
        setCreateExerciseDto(initialDto);
    }, [isHidden, createExerciseDto.type]);

    async function createExercise() {
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        const response = await exerciseService.createByExerciseSetId(
            exerciseSetId,
            createExerciseDto
        );

        await refreshData();

        setIsLoadingPageHidden(true);

        if (!response.isSuccess) alert(response.message);

        setIsPopUpActive(false);
    }

    function onChangeForEnum(event: React.ChangeEvent<HTMLSelectElement>) {
        const selectElement = event.currentTarget;
        if (!Object.keys(createExerciseDto).includes(selectElement.name)) {
            return;
        }
        if (
            !(Object.values(ExerciseType) as string[]).includes(selectElement.value) &&
            !(Object.values(ExerciseDifficulty) as string[]).includes(selectElement.value)
        ) {
            return;
        }
        setCreateExerciseDto({
            ...createExerciseDto,
            [selectElement.name]: selectElement.value,
        });
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
                    value={createExerciseDto.type}
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
                    value={createExerciseDto.difficulty}
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
                    value={createExerciseDto.prompt}
                    onChange={(e) =>
                        setCreateExerciseDto({
                            ...createExerciseDto,
                            prompt: e.currentTarget.value,
                        })
                    }
                    className="w-64 py-[2px] px-2 border rounded-[10px]"
                />
            </div>
            {createExerciseDto.type === ExerciseType.MCQ && (
                <>
                    <div className="flex justify-start items-center gap-2">
                        <p>A: </p>
                        <input
                            value={createExerciseDto.choices![0]}
                            onChange={(e) =>
                                setCreateExerciseDto({
                                    ...createExerciseDto,
                                    choices: [
                                        e.currentTarget.value,
                                        ...createExerciseDto.choices!.slice(1),
                                    ],
                                })
                            }
                            className="w-64 py-[2px] px-2 border rounded-[10px]"
                        />
                    </div>
                    <div className="flex justify-start items-center gap-2">
                        <p>B: </p>
                        <input
                            value={createExerciseDto.choices![1]}
                            onChange={(e) =>
                                setCreateExerciseDto({
                                    ...createExerciseDto,
                                    choices: [
                                        ...createExerciseDto.choices!.slice(0, 1),
                                        e.currentTarget.value,
                                        ...createExerciseDto.choices!.slice(2),
                                    ],
                                })
                            }
                            className="w-64 py-[2px] px-2 border rounded-[10px]"
                        />
                    </div>
                    <div className="flex justify-start items-center gap-2">
                        <p>C: </p>
                        <input
                            value={createExerciseDto.choices![2]}
                            onChange={(e) =>
                                setCreateExerciseDto({
                                    ...createExerciseDto,
                                    choices: [
                                        ...createExerciseDto.choices!.slice(0, 2),
                                        e.currentTarget.value,
                                        ...createExerciseDto.choices!.slice(3),
                                    ],
                                })
                            }
                            className="w-64 py-[2px] px-2 border rounded-[10px]"
                        />
                    </div>
                    <div className="flex justify-start items-center gap-2">
                        <p>D: </p>
                        <input
                            value={createExerciseDto.choices![3]}
                            onChange={(e) =>
                                setCreateExerciseDto({
                                    ...createExerciseDto,
                                    choices: [
                                        ...createExerciseDto.choices!.slice(0, 3),
                                        e.currentTarget.value,
                                        ...createExerciseDto.choices!.slice(4),
                                    ],
                                })
                            }
                            className="w-64 py-[2px] px-2 border rounded-[10px]"
                        />
                    </div>
                    <div className="flex justify-start items-center gap-2">
                        <p>E: </p>
                        <input
                            value={createExerciseDto.choices![4]}
                            onChange={(e) =>
                                setCreateExerciseDto({
                                    ...createExerciseDto,
                                    choices: [
                                        ...createExerciseDto.choices!.slice(0, 4),
                                        e.currentTarget.value,
                                    ],
                                })
                            }
                            className="w-64 py-[2px] px-2 border rounded-[10px]"
                        />
                    </div>
                    <div className="flex justify-start items-center gap-2">
                        <p>correct choice: </p>
                        <select
                            name="correctChoiceIndex"
                            value={createExerciseDto.correctChoiceIndex}
                            onChange={(e) =>
                                setCreateExerciseDto({
                                    ...createExerciseDto,
                                    correctChoiceIndex: Number(e.currentTarget.value),
                                })
                            }
                            className="py-[2px] px-2 border rounded-[10px]"
                        >
                            <option value={0}>A</option>
                            <option value={1}>B</option>
                            <option value={2}>C</option>
                            <option value={3}>D</option>
                            <option value={4}>E</option>
                        </select>
                    </div>
                </>
            )}
            {createExerciseDto.type === ExerciseType.TRUE_FALSE && (
                <>
                    <div className="flex justify-start items-center gap-2">
                        <p>correct choice: </p>
                        <select
                            name="correctChoiceIndex"
                            value={createExerciseDto.correctChoiceIndex}
                            onChange={(e) =>
                                setCreateExerciseDto({
                                    ...createExerciseDto,
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
            {createExerciseDto.type === ExerciseType.OPEN_ENDED && (
                <div className="flex justify-start items-center gap-2">
                    <p>solution: </p>
                    <input
                        value={createExerciseDto.solution}
                        onChange={(e) =>
                            setCreateExerciseDto({
                                ...createExerciseDto,
                                solution: e.currentTarget.value,
                            })
                        }
                        className="w-64 py-[2px] px-2 border rounded-[10px]"
                    />
                </div>
            )}
            <Button
                variant={ButtonVariants.PRIMARY}
                onClick={async (event) => await createExercise()}
            >
                Generate
            </Button>
        </div>
    );
}
