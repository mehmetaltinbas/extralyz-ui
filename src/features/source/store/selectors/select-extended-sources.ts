import { createSelector } from '@reduxjs/toolkit';
import type { ExtendedSource } from 'src/features/source/types/extended-source.interface';
import type { RootState } from 'src/store/store';

export const selectExtendedSources = createSelector(
    (state: RootState) => state.sources,
    (state: RootState) => state.exerciseSets,
    (sources, exerciseSets): ExtendedSource[] =>
        sources.map((source) => ({
            ...source,
            exerciseSets: exerciseSets.filter((es) => es.sourceId === source._id),
        }))
);
