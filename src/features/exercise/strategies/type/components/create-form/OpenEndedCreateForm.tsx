import type React from "react";
import type { CreateExerciseDto } from "src/features/exercise/types/dto/create-exercise.dto";

export function OpenEndedCreateForm({ dto, setDto }: {
    dto: CreateExerciseDto;
    setDto: (value: React.SetStateAction<CreateExerciseDto>) => void;
}) {
    return(
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
