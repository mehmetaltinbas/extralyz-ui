import type React from "react";
import type { ExerciseAnswerEvaluationResult } from "src/features/exercise-set/types/response/evaluate-answers.response";
import { ExerciseType } from "src/features/exercise/enum/exercise-type.enum";
import { OpenEndedCreateForm } from "src/features/exercise/strategies/type/components/create-form/OpenEndedCreateForm";
import { OpenEndedExerciseCard } from "src/features/exercise/strategies/type/components/exercise-card/OpenEndedExerciseCard";
import { OpenEndedExerciseEvaluationCard } from "src/features/exercise/strategies/type/components/exercise-evaluation-card/OpenEndedExerciseEvaluationCard";
import { OpenEndedExercisePracticeCard } from "src/features/exercise/strategies/type/components/exercise-practice-card/OpenEndedExercisePracticeCard";
import { OpenEndedUpdateForm } from "src/features/exercise/strategies/type/components/update-form/OpenEndedUpdateForm";
import type { ExerciseTypeStrategy } from "src/features/exercise/strategies/type/exercise-type-strategy.interface";
import type { CreateExerciseDto } from "src/features/exercise/types/dto/create-exercise.dto";
import type { UpdateExerciseDto } from "src/features/exercise/types/dto/update-exercise.dto";
import type { Exercise } from "src/features/exercise/types/exercise.interface";

export class OpenEndedExerciseTypeStrategy implements ExerciseTypeStrategy {
    type = ExerciseType.OPEN_ENDED;

    changeCreateExerciseDto(setDto: (value: React.SetStateAction<CreateExerciseDto>) => void): void {
        setDto(prev => ({
            ...prev,
            type: ExerciseType.OPEN_ENDED,
            solution: '',
            choices: undefined,
            correctChoiceIndex: undefined,
        }));
    }

    getRestOfCreateExerciseForm(dto: CreateExerciseDto, setDto: (value: React.SetStateAction<CreateExerciseDto>) => void): React.JSX.Element {
        return (
            <OpenEndedCreateForm
                dto={dto}
                setDto={setDto}
            />
        );
    }

    changeUpdateExerciseDto(setDto: (value: React.SetStateAction<UpdateExerciseDto>) => void): void {
        setDto(prev => ({
            ...prev,
            type: ExerciseType.OPEN_ENDED,
            solution: '',
            choices: undefined,
            correctChoiceIndex: undefined,
        }));
    }

    getRestOfUpdateExerciseForm(dto: UpdateExerciseDto, setDto: (value: React.SetStateAction<UpdateExerciseDto>) => void): React.JSX.Element {
        return (
            <OpenEndedUpdateForm
                dto={dto}
                setDto={setDto}
            />
        );
    }

    getRestOfExerciseCard(exercise: Exercise, isAnswersHidden: boolean) {
        return (
            <OpenEndedExerciseCard
                exercise={exercise}
                isAnswersHidden={isAnswersHidden}
            />
        );
    }

    getRestOfExercisePracticeCard(exercise: Exercise, index: number, recordAnswer: (exerciseId: string, answer: string | number) => void, _shuffleChoices?: boolean) {
        return (
            <OpenEndedExercisePracticeCard
                exercise={exercise}
                index={index}
                recordAnswer={recordAnswer}
            />
        );
    }

    getRestOfExerciseEvaluationCard(exercise: Exercise, evaluation: ExerciseAnswerEvaluationResult) {
        return (
            <OpenEndedExerciseEvaluationCard
                exercise={exercise}
                evaluation={evaluation}
            />
        );
    }
}
