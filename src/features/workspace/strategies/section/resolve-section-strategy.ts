import { Section } from 'src/features/workspace/enums/section.enum';
import { ExerciseSetPracticeSectionStrategy } from 'src/features/workspace/strategies/section/implementations/exercise-set-practice-section.strategy';
import { ExerciseSetSectionStrategy } from 'src/features/workspace/strategies/section/implementations/exercise-set-section.strategy';
import { ExerciseSetsSectionStrategy } from 'src/features/workspace/strategies/section/implementations/exercise-sets-section.strategy';
import { SourceSectionStrategy } from 'src/features/workspace/strategies/section/implementations/source-section.strategy';
import { SourcesSectionStrategy } from 'src/features/workspace/strategies/section/implementations/sources-section.strategy';
import type { SectionStrategy } from 'src/features/workspace/strategies/section/section-strategy.interface';

const map: Map<Section, SectionStrategy> = new Map([
    [Section.SOURCES, SourcesSectionStrategy],
    [Section.SOURCE, SourceSectionStrategy],
    [Section.EXERCISE_SETS, ExerciseSetsSectionStrategy],
    [Section.EXERCISE_SET, ExerciseSetSectionStrategy],
    [Section.EXERCISE_SET_PRACTICE, ExerciseSetPracticeSectionStrategy],
]);

export function resolveSectionStrategy(
    section: Section
): SectionStrategy | undefined {
    return map.get(section);
}
