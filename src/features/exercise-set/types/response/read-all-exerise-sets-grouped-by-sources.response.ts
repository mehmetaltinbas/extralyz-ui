import type { ExtendedSource } from 'src/features/source/types/extended-source.interface';
import type { ResponseBase } from 'src/shared/types/response-base.interface';

export interface ReadAllExerciseSetsGroupedBySources extends ResponseBase {
    sources?: ExtendedSource[];
}
