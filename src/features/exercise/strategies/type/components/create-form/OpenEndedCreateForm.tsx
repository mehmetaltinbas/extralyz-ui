import type React from "react";
import type { CreateExerciseDto } from "src/features/exercise/types/dto/create-exercise.dto";
import { Textarea } from "src/shared/components/Textarea";

export function OpenEndedCreateForm({ dto, setDto }: {
    dto: CreateExerciseDto;
    setDto: (value: React.SetStateAction<CreateExerciseDto>) => void;
}) {
    return(
        <div className="w-72 sm:w-108 flex justify-start items-center gap-2">
            <p>solution: </p>
            <Textarea
                value={dto.solution}
                onChange={(e) =>
                    setDto({
                        ...dto,
                        solution: e.currentTarget.value,
                    })
                }
                rows={4}
            />
        </div>
    );
}
