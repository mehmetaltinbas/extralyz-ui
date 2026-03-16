import type React from "react";
import type { UpdateExerciseDto } from "src/features/exercise/types/dto/update-exercise.dto";
import { Textarea } from "src/shared/components/Textarea";

export function OpenEndedUpdateForm({ dto, setDto }: {
    dto: UpdateExerciseDto;
    setDto: (value: React.SetStateAction<UpdateExerciseDto>) => void;
}) {
    return (
        <div className="flex justify-start items-center gap-2">
            <p>solution: </p>
            <Textarea
                value={dto.solution}
                onChange={(e) =>
                    setDto({
                        ...dto,
                        solution: e.currentTarget.value,
                    })
                }
            />
        </div>
    );
}
