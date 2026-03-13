import type React from "react";
import { ExerciseType } from "src/features/exercise/enum/exercise-type.enum";
import type { ExerciseTypeStrategy } from "src/features/exercise/strategies/exercise-type-strategy.interface";
import type { CreateExerciseDto } from "src/features/exercise/types/dto/create-exercise.dto";
import type { UpdateExerciseDto } from "src/features/exercise/types/dto/update-exercise.dto";

export const OpenEndedExerciseTypeStrategy: ExerciseTypeStrategy = {
    type: ExerciseType.OPEN_ENDED,

    changeCreateExerciseDto: function (setDto: (value: React.SetStateAction<CreateExerciseDto>) => void): void {
        setDto(prev => ({
            ...prev,
            type: ExerciseType.OPEN_ENDED,
            solution: '',
            choices: undefined,
            correctChoiceIndex: undefined,
        }));
    },

    getRestOfCreateExerciseForm: (dto: CreateExerciseDto, setDto: (value: React.SetStateAction<CreateExerciseDto>) => void): React.JSX.Element => {
        return (
            <div className="flex justify-start items-center gap-2">
                <p>solution: </p>
                <textarea
                    value={dto.solution}
                    onChange={(e) =>
                        setDto({
                            ...dto,
                            solution: e.currentTarget.value,
                        })
                    }
                    className="w-96 py-[2px] px-2 border rounded-[10px]"
                />
            </div>
        );
    },

    changeUpdateExerciseDto: function (setDto: (value: React.SetStateAction<UpdateExerciseDto>) => void): void {
        setDto(prev => ({
            ...prev,
            type: ExerciseType.OPEN_ENDED,
            solution: '',
            choices: undefined,
            correctChoiceIndex: undefined,
        }));
    },

    getRestOfUpdateExerciseForm: (dto: UpdateExerciseDto, setDto: (value: React.SetStateAction<UpdateExerciseDto>) => void): React.JSX.Element => {
        return (
            <div className="flex justify-start items-center gap-2">
                <p>solution: </p>
                <textarea
                    value={dto.solution}
                    onChange={(e) =>
                        setDto({
                            ...dto,
                            solution: e.currentTarget.value,
                        })
                    }
                    className="w-96 py-[2px] px-2 border rounded-[10px]"
                />
            </div>
        );
    }
};
