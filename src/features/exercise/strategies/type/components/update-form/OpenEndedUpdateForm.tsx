import type React from "react";
import type { UpdateExerciseDto } from "src/features/exercise/types/dto/update-exercise.dto";

export function OpenEndedUpdateForm({ dto, setDto }: {
    dto: UpdateExerciseDto;
    setDto: (value: React.SetStateAction<UpdateExerciseDto>) => void;
}) {
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
