import type { ResponseBase } from 'src/shared/types/response-base';
import type { ExtendedSource } from 'src/features/source/types/extended-source.interface';

export interface ReadAllExerciseSetsGroupedBySources extends ResponseBase {
    sources?: ExtendedSource[];
}
