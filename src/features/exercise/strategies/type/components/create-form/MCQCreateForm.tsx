import type React from "react";
import { MCQ_CHOICES_COUNT } from "src/features/exercise/constants/mcq-choices-count.constant";
import type { CreateExerciseDto } from "src/features/exercise/types/dto/create-exercise.dto";
import { Textarea } from "src/shared/components/Textarea";
import { getAlphabetLetter } from "src/shared/utils/get-alphabet-letter.util";

export function MCQCreateForm({ dto, setDto }: {
    dto: CreateExerciseDto;
    setDto: (value: React.SetStateAction<CreateExerciseDto>) => void;
}) {
    return (
        <>
            {Array.from({ length: MCQ_CHOICES_COUNT }).map((value, index) => (
                <div 
                    key={`choice-${index}`}
                    className="w-80 flex justify-start items-center gap-2"
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
}