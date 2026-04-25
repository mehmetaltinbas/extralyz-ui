import type React from "react";
import type { CreateExerciseDto } from "src/features/exercise/types/dto/create-exercise.dto";

export function TrueFalseCreateForm({ dto, setDto }: {
    dto: CreateExerciseDto;
    setDto: (value: React.SetStateAction<CreateExerciseDto>) => void;
}) {
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
                    className="py-[2px] px-2 border rounded-[10px] bg-surface text-text-primary"
                >
                    <option value={0}>False</option>
                    <option value={1}>True</option>
                </select>
            </div>
        </>
    );
}