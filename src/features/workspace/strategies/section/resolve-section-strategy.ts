import { Section } from 'src/features/workspace/enums/section.enum';
import { ExerciseSetPaperEvaluationSectionStrategy } from 'src/features/workspace/strategies/section/implementations/exercise-set-paper-evaluation-section.strategy';
import { ExerciseSetPracticeSectionStrategy } from 'src/features/workspace/strategies/section/implementations/exercise-set-practice-section.strategy';
import { ExerciseSetSectionStrategy } from 'src/features/workspace/strategies/section/implementations/exercise-set-section.strategy';
import { ExerciseSetsSectionStrategy } from 'src/features/workspace/strategies/section/implementations/exercise-sets-section.strategy';
import { SourceSectionStrategy } from 'src/features/workspace/strategies/section/implementations/source-section.strategy';
import { SourcesSectionStrategy } from 'src/features/workspace/strategies/section/implementations/sources-section.strategy';
import type { SectionStrategy } from 'src/features/workspace/strategies/section/section-strategy.interface';

const map: Map<Section, SectionStrategy> = new Map([
    [Section.SOURCES, new SourcesSectionStrategy()],
    [Section.SOURCE, new SourceSectionStrategy()],
    [Section.EXERCISE_SETS, new ExerciseSetsSectionStrategy()],
    [Section.EXERCISE_SET, new ExerciseSetSectionStrategy()],
    [Section.EXERCISE_SET_PRACTICE, new ExerciseSetPracticeSectionStrategy()],
    [Section.EXERCISE_SET_PAPER_EVALUATION, new ExerciseSetPaperEvaluationSectionStrategy()],
]);

export function resolveSectionStrategy(
    section: Section
): SectionStrategy | undefined {
    return map.get(section);
}
