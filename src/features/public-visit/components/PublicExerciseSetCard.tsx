import { Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ExerciseSet } from 'src/features/exercise-set/types/exercise-set.interface';

export function PublicExerciseSetCard({
    exerciseSet,
    userName,
}: {
    exerciseSet: ExerciseSet;
    userName: string;
}) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() =>
                navigate(`/user/${userName}/exercise-set/${encodeURIComponent(exerciseSet.title)}`)
            }
            className="relative w-[180px] md:w-[250px] h-[120px] md:h-[150px] cursor-pointer rounded-[10px]
            flex-shrink-0 flex flex-col justify-start items-center gap-1
            border border-border p-1
            hover:border-border-strong"
        >
            <div
                className="w-full h-[35px] border-b-1 border-border
                flex justify-center items-center"
            >
                <div className="flex-1 h-full flex justify-center items-center gap-1">
                    <Globe size={14} className="flex-shrink-0" />
                    <p className="max-w-[150px] px-2 font-serif font-semibold truncate text-sm md:text-base">
                        {exerciseSet.title}
                    </p>
                </div>
            </div>

            <p className='text-sm md:text-base'>{exerciseSet.type}</p>

            <p className='text-sm md:text-base'>{exerciseSet.count}</p>

            <p className='text-sm md:text-base'>{exerciseSet.difficulty}</p>
        </div>
    );
}
