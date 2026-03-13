import type React from "react";
import { ExerciseType } from "src/features/exercise/enum/exercise-type.enum";
import type { ExerciseTypeStrategy } from "src/features/exercise/strategies/exercise-type-strategy.interface";
import type { CreateExerciseDto } from "src/features/exercise/types/dto/create-exercise.dto";
import type { UpdateExerciseDto } from "src/features/exercise/types/dto/update-exercise.dto";

export const TrueFalseExerciseTypeStrategy: ExerciseTypeStrategy = {
    type: ExerciseType.TRUE_FALSE,

    changeCreateExerciseDto: function (setDto: (value: React.SetStateAction<CreateExerciseDto>) => void): void {
        setDto(prev => ({
            ...prev,
            type: ExerciseType.TRUE_FALSE,
            solution: undefined,
            choices: undefined,
            correctChoiceIndex: 0,
        }));
    },

    getRestOfCreateExerciseForm: (dto: CreateExerciseDto, setDto: (value: React.SetStateAction<CreateExerciseDto>) => void): React.JSX.Element => {
        return (
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
        );
    },

    changeUpdateExerciseDto: function (setDto: (value: React.SetStateAction<UpdateExerciseDto>) => void): void {
        setDto(prev => ({
            ...prev,
            type: ExerciseType.TRUE_FALSE,
            solution: undefined,
            choices: undefined,
            correctChoiceIndex: 0,
        }));
    },

    getRestOfUpdateExerciseForm: (dto: UpdateExerciseDto, setDto: (value: React.SetStateAction<UpdateExerciseDto>) => void): React.JSX.Element => {
        return (
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
        );
    }
};
