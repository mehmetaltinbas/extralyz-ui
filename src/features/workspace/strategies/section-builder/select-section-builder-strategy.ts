import { Section } from 'src/features/workspace/enums/sections.enum';
import type { SectionBuilderStrategy } from 'src/features/workspace/strategies/section-builder/section-builder-strategy.interface';
import { ExerciseSetPracticePropsBuilderStrategy } from './strategies/exercise-set-practice-props-builder.strategy';
import { ExerciseSetPropsBuilderStrategy } from './strategies/exercise-set-props-builder.strategy';
import { ExerciseSetsPropsBuilderStrategy } from './strategies/exercise-sets-props-builder.strategy';
import { SourcePropsBuilderStrategy } from './strategies/source-props-builder.strategy';
import { SourcesPropsBuilderStrategy } from './strategies/sources-props-builder.strategy';

const map: Map<string, SectionBuilderStrategy> = new Map([
    [Section.SOURCES, SourcesPropsBuilderStrategy],
    [Section.SOURCE, SourcePropsBuilderStrategy],
    [Section.EXERCISE_SETS, ExerciseSetsPropsBuilderStrategy],
    [Section.EXERCISE_SET, ExerciseSetPropsBuilderStrategy],
    [Section.EXERCISE_SET_PRACTICE, ExerciseSetPracticePropsBuilderStrategy],
]);

export function selectSectionBuilderStrategy(
    section: string
): SectionBuilderStrategy | undefined {
    const strategy = map.get(section);
    if (!strategy) return undefined;
    return strategy;
}
