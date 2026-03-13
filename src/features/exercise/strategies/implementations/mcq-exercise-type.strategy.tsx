import type React from "react";
import { MCQ_CHOICES_COUNT } from "src/features/exercise/constants/mcq-choices-count.constant";
import { ExerciseType } from "src/features/exercise/enum/exercise-type.enum";
import type { ExerciseTypeStrategy } from "src/features/exercise/strategies/exercise-type-strategy.interface";
import type { CreateExerciseDto } from "src/features/exercise/types/dto/create-exercise.dto";
import type { UpdateExerciseDto } from "src/features/exercise/types/dto/update-exercise.dto";
import { getAlphabetLetter } from "src/shared/utils/get-alphabet-letter.util";

export const McqExerciseTypeStrategy: ExerciseTypeStrategy = {
    type: ExerciseType.MCQ,

    changeCreateExerciseDto: (setDto: (value: React.SetStateAction<CreateExerciseDto>) => void, ): void => {
        setDto(prev => ({
            ...prev,
            type: ExerciseType.MCQ,
            solution: undefined,
            choices: Array(MCQ_CHOICES_COUNT).fill(''),
            correctChoiceIndex: 0,
        }));
    },
    
    getRestOfCreateExerciseForm: (dto: CreateExerciseDto, setDto: (value: React.SetStateAction<CreateExerciseDto>) => void): React.JSX.Element => {
       return (
            <>
                {Array.from({ length: MCQ_CHOICES_COUNT }).map((value, index) => (
                    <div 
                        key={`choice-${index}`}
                        className="flex justify-start items-center gap-2"
                    >
                        <p>{getAlphabetLetter(index)}</p>
                        <textarea
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
                            className="w-96 py-[2px] px-2 border rounded-[10px]"
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
                            <option key={`mcq-choice-${index}`} value={index}>{getAlphabetLetter(index)}</option>
                        ))}
                    </select>
                </div>
            </>
       );
    },

    changeUpdateExerciseDto: (setDto: (value: React.SetStateAction<UpdateExerciseDto>) => void, ): void => {
        setDto(prev => ({
            ...prev,
            type: ExerciseType.MCQ,
            solution: undefined,
            choices: Array(MCQ_CHOICES_COUNT).fill(''),
            correctChoiceIndex: 0,
        }));
    },

    getRestOfUpdateExerciseForm: (dto: UpdateExerciseDto, setDto: (value: React.SetStateAction<UpdateExerciseDto>) => void): React.JSX.Element => {
        return (
            <>
                {Array.from({ length: MCQ_CHOICES_COUNT }).map((value, index) => (
                    <div 
                        key={`choice-${index}`}
                        className="flex justify-start items-center gap-2"
                    >
                        <p>{getAlphabetLetter(index)}</p>
                        <textarea
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
                            className="w-96 py-[2px] px-2 border rounded-[10px]"
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
            </>
        );
    }
};
