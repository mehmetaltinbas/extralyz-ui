import type React from "react";
import type { ExerciseAnswerEvaluationResult } from "src/features/exercise-set/types/response/evaluate-answers.response";
import { MULTIPLE_CHOICE_CHOICES_COUNT } from "src/features/exercise/constants/multiple-choice-choices-count.constant";
import { ExerciseType } from "src/features/exercise/enum/exercise-type.enum";
import { MultipleChoiceCreateForm } from "src/features/exercise/strategies/type/components/create-form/MultipleChoiceCreateForm";
import { MultipleChoiceExerciseCard } from "src/features/exercise/strategies/type/components/exercise-card/MultipleChoiceExerciseCard";
import { MultipleChoiceExerciseEvaluationCard } from "src/features/exercise/strategies/type/components/exercise-evaluation-card/MultipleChoiceExerciseEvaluationCard";
import { MultipleChoiceExercisePracticeCard } from "src/features/exercise/strategies/type/components/exercise-practice-card/MultipleChoiceExercisePracticeCard";
import { MultipleChoiceUpdateForm } from "src/features/exercise/strategies/type/components/update-form/MultipleChoiceUpdateForm";
import type { ExerciseTypeStrategy } from "src/features/exercise/strategies/type/exercise-type-strategy.interface";
import type { CreateExerciseDto } from "src/features/exercise/types/dto/create-exercise.dto";
import type { UpdateExerciseDto } from "src/features/exercise/types/dto/update-exercise.dto";
import type { Exercise } from "src/features/exercise/types/exercise.interface";

export class MultipleChoiceExerciseTypeStrategy implements ExerciseTypeStrategy {
    type = ExerciseType.MULTIPLE_CHOICE;

    changeCreateExerciseDto(setDto: (value: React.SetStateAction<CreateExerciseDto>) => void): void {
        setDto(prev => ({
            ...prev,
            type: ExerciseType.MULTIPLE_CHOICE,
            solution: undefined,
            choices: Array(MULTIPLE_CHOICE_CHOICES_COUNT).fill(''),
            correctChoiceIndex: 0,
        }));
    }

    getRestOfCreateExerciseForm(dto: CreateExerciseDto, setDto: (value: React.SetStateAction<CreateExerciseDto>) => void): React.JSX.Element {
       return (
            <MultipleChoiceCreateForm
                dto={dto}
                setDto={setDto}
            />
       );
    }

    changeUpdateExerciseDto(setDto: (value: React.SetStateAction<UpdateExerciseDto>) => void): void {
        setDto(prev => ({
            ...prev,
            type: ExerciseType.MULTIPLE_CHOICE,
            solution: undefined,
            choices: Array(MULTIPLE_CHOICE_CHOICES_COUNT).fill(''),
            correctChoiceIndex: 0,
        }));
    }

    getRestOfUpdateExerciseForm(dto: UpdateExerciseDto, setDto: (value: React.SetStateAction<UpdateExerciseDto>) => void): React.JSX.Element {
        return (
            <MultipleChoiceUpdateForm
                dto={dto}
                setDto={setDto}
            />
        );
    }

    getRestOfExerciseCard(exercise: Exercise, isAnswersHidden: boolean) {
        return (
            <MultipleChoiceExerciseCard
                exercise={exercise}
                isAnswersHidden={isAnswersHidden}
            />
        );
    }

    getRestOfExercisePracticeCard(exercise: Exercise, index: number, recordAnswer: (exerciseId: string, answer: string | number) => void, shuffleChoices?: boolean) {
        return (
            <MultipleChoiceExercisePracticeCard
                exercise={exercise}
                index={index}
                recordAnswer={recordAnswer}
                shuffleChoices={shuffleChoices}
            />
        );
    }

    getRestOfExerciseEvaluationCard(exercise: Exercise, evaluation: ExerciseAnswerEvaluationResult) {
        return (
            <MultipleChoiceExerciseEvaluationCard
                exercise={exercise}
                evaluation={evaluation}
            />
        );
    }
}
