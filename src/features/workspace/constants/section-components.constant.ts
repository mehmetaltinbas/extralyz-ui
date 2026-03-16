import React from 'react';
import { ExerciseSetPage } from 'src/features/exercise-set/pages/ExerciseSetPage';
import { ExerciseSetPaperEvaluationPage } from 'src/features/exercise-set/pages/ExerciseSetPaperEvaluationPage';
import { ExerciseSetPracticePage } from 'src/features/exercise-set/pages/ExerciseSetPracticePage';
import { ExerciseSetsPage } from 'src/features/exercise-set/pages/ExerciseSetsPage';
import { SourcePage } from 'src/features/source/pages/SourcePage';
import { SourcesPage } from 'src/features/source/pages/SourcesPage';
import { Section } from 'src/features/workspace/enums/section.enum';

export const SECTION_COMPONENTS: Record<Section, React.ComponentType<any>> = {
    [Section.SOURCES]: SourcesPage,
    [Section.SOURCE]: SourcePage,
    [Section.EXERCISE_SETS]: ExerciseSetsPage,
    [Section.EXERCISE_SET]: ExerciseSetPage,
    [Section.EXERCISE_SET_PRACTICE]: ExerciseSetPracticePage,
    [Section.EXERCISE_SET_PAPER_EVALUATION]: ExerciseSetPaperEvaluationPage,
};