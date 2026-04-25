import type React from "react";
import { MULTIPLE_CHOICE_CHOICES_COUNT } from "src/features/exercise/constants/multiple-choice-choices-count.constant";
import type { UpdateExerciseDto } from "src/features/exercise/types/dto/update-exercise.dto";
import { Textarea } from "src/shared/components/Textarea";
import { useBreakpoint } from "src/shared/hooks/use-breakpoint.hook";
import { getAlphabetLetter } from "src/shared/utils/get-alphabet-letter.util";

export function MultipleChoiceUpdateForm({ dto, setDto }: {
    dto: UpdateExerciseDto;
    setDto: (value: React.SetStateAction<UpdateExerciseDto>) => void;
}) {
    const { isMobile } = useBreakpoint();

    return (
        <>
            {Array.from({ length: MULTIPLE_CHOICE_CHOICES_COUNT }).map((value, index) => (
                <div 
                    key={`choice-${index}`}
                    className="w-72 sm:w-108 flex justify-start items-center gap-2"
                >
                    <p>{getAlphabetLetter(index)}</p>
                    <Textarea
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
                        rows={isMobile ? 1 : 2}
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
                    className="py-[2px] px-2 border rounded-[10px] bg-surface text-text-primary"
                >
                    {Array.from({ length: MULTIPLE_CHOICE_CHOICES_COUNT }).map((value, index) => (
                        <option value={index}>{getAlphabetLetter(index)}</option>
                    ))}
                </select>
            </div>
        </>
    );
}
