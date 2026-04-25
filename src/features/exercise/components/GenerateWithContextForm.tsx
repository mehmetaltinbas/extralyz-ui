import React from 'react';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';
import { ExerciseDifficulty } from 'src/features/exercise/enum/exercise-difficulty.enum';
import { ExerciseType } from 'src/features/exercise/enum/exercise-type.enum';
import { GenerateWithContextFormStep } from 'src/features/exercise/enum/generate-with-context-form-step.enum';
import { ExerciseService } from 'src/features/exercise/services/exercise.service';
import { exerciseTypeFactory } from 'src/features/exercise/strategies/type/exercise-type.factory';
import type { CreateExerciseDto } from 'src/features/exercise/types/dto/create-exercise.dto';
import type { GenerateExerciseWithContextDto } from 'src/features/exercise/types/dto/generate-exercise-with-context.dto';
import { Button } from 'src/shared/components/Button';
import { Modal } from 'src/shared/components/Modal';
import { Textarea } from 'src/shared/components/Textarea';
import { ButtonVariant } from 'src/shared/enums/button-variant.enum';
import { useBreakpoint } from 'src/shared/hooks/use-breakpoint.hook';
import { camelToTitleCase } from 'src/shared/utils/camel-to-title-case.util';

export function GenerateWithContextForm({
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
    const initialResultDto: CreateExerciseDto = {
        type: ExerciseType.OPEN_ENDED,
        difficulty: ExerciseDifficulty.MEDIUM,
        stem: '',
    };
    const initialContextDto: GenerateExerciseWithContextDto = {
        context: '',
        type: ExerciseType.OPEN_ENDED,
        difficulty: ExerciseDifficulty.MEDIUM,
    };

    const [step, setStep] = React.useState<GenerateWithContextFormStep>(GenerateWithContextFormStep.INPUT);
    const [contextDto, setContextDto] = React.useState<GenerateExerciseWithContextDto>(initialContextDto);
    const [resultDto, setResultDto] = React.useState<CreateExerciseDto>(initialResultDto);

    const isSubmittingRef = React.useRef(false);

    const { isMobile } = useBreakpoint();

    React.useEffect(() => {
        if (isHidden && !isSubmittingRef.current) {
            setStep(GenerateWithContextFormStep.INPUT);
            setContextDto(initialContextDto);
            setResultDto(initialResultDto);
        }
    }, [isHidden]);

    async function generate() {
        isSubmittingRef.current = true;
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await ExerciseService.generateWithContext(
                exerciseSet._id,
                contextDto
            );

            if (!response.isSuccess || !response.exercise) {
                alert(response.message);
                isSubmittingRef.current = false;
                setIsHidden(false);
            } else {
                const exercise = response.exercise;
                setResultDto({
                    type: exercise.type,
                    difficulty: exercise.difficulty,
                    stem: exercise.prompt,
                    solution: exercise.solution,
                    choices: exercise.choices,
                    correctChoiceIndex: exercise.correctChoiceIndex,
                });
                setStep(GenerateWithContextFormStep.RESULT);
                isSubmittingRef.current = false;
                setIsHidden(false);
            }
        } catch (error) {
            alert('internal error');
            isSubmittingRef.current = false;
            setIsHidden(false);
        } finally {
            setIsLoadingPageHidden(true);
        }
    }

    async function create() {
        if (!resultDto) return;

        isSubmittingRef.current = true;
        setIsHidden(true);
        setIsLoadingPageHidden(false);

        try {
            const response = await ExerciseService.createByExerciseSetId(
                exerciseSet._id,
                resultDto
            );

            if (!response.isSuccess) {
                alert(response.message);
                isSubmittingRef.current = false;
                setIsHidden(false);
            } else {
                isSubmittingRef.current = false;
                refreshData();
                setIsPopUpActive(false);
            }
        } catch (error) {
            alert('internal error');
            isSubmittingRef.current = false;
            setIsHidden(false);
        } finally {
            setIsLoadingPageHidden(true);
        }
    }

    function tryAgain() {
        setStep(GenerateWithContextFormStep.INPUT);
        setResultDto(initialResultDto);
    }

    const activeStrategy = exerciseTypeFactory.resolveStrategy(resultDto.type);

    return (
        <Modal isHidden={isHidden} onClose={onClose}>
            {step === GenerateWithContextFormStep.INPUT && (
                <>
                    <div className="w-64 sm:w-96 flex flex-col gap-2">
                        <p>context: </p>
                        <Textarea
                            value={contextDto.context}
                            placeholder="Enter the text to generate an exercise from..."
                            onChange={(e) =>
                                setContextDto({
                                    ...contextDto,
                                    context: e.currentTarget.value,
                                })
                            }
                            rows={isMobile ? 3 : 5}
                        />
                    </div>

                    <div className="flex justify-start items-center gap-2">
                        <p>type: </p>
                        <select
                            name="type"
                            value={contextDto.type}
                            onChange={(e) =>
                                setContextDto({
                                    ...contextDto,
                                    type: e.currentTarget.value as ExerciseType,
                                })
                            }
                            className="py-[2px] px-2 border rounded-[10px] bg-surface text-text-primary"
                        >
                            {Object.values(ExerciseType).map((value, index) => (
                                <option key={`context-exercise-type-${index}`} value={value}>
                                    {camelToTitleCase(value)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-start items-center gap-2">
                        <p>difficulty: </p>
                        <select
                            name="difficulty"
                            value={contextDto.difficulty}
                            onChange={(e) =>
                                setContextDto({
                                    ...contextDto,
                                    difficulty: e.currentTarget.value as ExerciseDifficulty,
                                })
                            }
                            className="py-[2px] px-2 border rounded-[10px] bg-surface text-text-primary"
                        >
                            {Object.values(ExerciseDifficulty).map((value, index) => (
                                <option key={`context-exercise-difficulty-${index}`} value={value}>
                                    {camelToTitleCase(value)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Button
                        variant={ButtonVariant.PRIMARY}
                        onClick={async () => await generate()}
                    >
                        Generate
                    </Button>
                </>
            )}

            {step === GenerateWithContextFormStep.RESULT && (
                <>
                    <div className="flex justify-start items-center gap-2">
                        <p>type: </p>
                        <select
                            name="type"
                            value={resultDto.type}
                            disabled
                            className="py-[2px] px-2 border rounded-[10px] opacity-60 bg-surface text-text-primary"
                        >
                            {Object.values(ExerciseType).map((value, index) => (
                                <option key={`result-exercise-type-${index}`} value={value}>
                                    {camelToTitleCase(value)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-start items-center gap-2">
                        <p>difficulty: </p>
                        <select
                            name="difficulty"
                            value={resultDto.difficulty}
                            onChange={(e) =>
                                setResultDto({
                                    ...resultDto,
                                    difficulty: e.currentTarget.value as ExerciseDifficulty,
                                })
                            }
                            className="py-[2px] px-2 border rounded-[10px] bg-surface text-text-primary"
                        >
                            {Object.values(ExerciseDifficulty).map((value, index) => (
                                <option key={`result-exercise-difficulty-${index}`} value={value}>
                                    {camelToTitleCase(value)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-64 sm:w-96 flex justify-start items-center gap-2">
                        <p>prompt: </p>
                        <Textarea
                            value={resultDto.stem}
                            onChange={(e) =>
                                setResultDto({
                                    ...resultDto,
                                    stem: e.currentTarget.value,
                                })
                            }
                            rows={isMobile ? 1 : 2}
                        />
                    </div>

                    {activeStrategy?.getRestOfCreateExerciseForm(resultDto, setResultDto)}

                    <div className="flex gap-2">
                        <Button
                            variant={ButtonVariant.SECONDARY}
                            onClick={tryAgain}
                        >
                            Try Again
                        </Button>
                        <Button
                            variant={ButtonVariant.PRIMARY}
                            onClick={async () => await create()}
                        >
                            Create
                        </Button>
                    </div>
                </>
            )}
        </Modal>
    );
}
