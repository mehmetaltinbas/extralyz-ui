import type React from "react";
import type { ExerciseType } from "src/features/exercise/enum/exercise-type.enum";
import type { CreateExerciseDto } from "src/features/exercise/types/dto/create-exercise.dto";
import type { UpdateExerciseDto } from "src/features/exercise/types/dto/update-exercise.dto";

export interface ExerciseTypeStrategy {
    type: ExerciseType;

    changeCreateExerciseDto: (setDto: (value: React.SetStateAction<CreateExerciseDto>) => void
) => void;
    getRestOfCreateExerciseForm: (dto: CreateExerciseDto, setDto: (value: React.SetStateAction<CreateExerciseDto>) => void) => React.JSX.Element;
    changeUpdateExerciseDto: (setDto: (value: React.SetStateAction<UpdateExerciseDto>) => void
) => void;
    getRestOfUpdateExerciseForm: (dto: UpdateExerciseDto, setDto: (value: React.SetStateAction<UpdateExerciseDto>) => void) => React.JSX.Element;
}