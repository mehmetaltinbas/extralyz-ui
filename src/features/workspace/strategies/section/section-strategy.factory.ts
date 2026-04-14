import { Section } from 'src/features/workspace/enums/section.enum';
import { ExerciseSetPaperEvaluationSectionStrategy } from 'src/features/workspace/strategies/section/implementations/exercise-set-paper-evaluation-section.strategy';
import { ExerciseSetPracticeSectionStrategy } from 'src/features/workspace/strategies/section/implementations/exercise-set-practice-section.strategy';
import { ExerciseSetSectionStrategy } from 'src/features/workspace/strategies/section/implementations/exercise-set-section.strategy';
import { ExerciseSetsSectionStrategy } from 'src/features/workspace/strategies/section/implementations/exercise-sets-section.strategy';
import { PublicExerciseSetPaperEvaluationSectionStrategy } from 'src/features/workspace/strategies/section/implementations/public-exercise-set-paper-evaluation-section.strategy';
import { PublicExerciseSetPracticeSectionStrategy } from 'src/features/workspace/strategies/section/implementations/public-exercise-set-practice-section.strategy';
import { PublicExerciseSetSectionStrategy } from 'src/features/workspace/strategies/section/implementations/public-exercise-set-section.strategy';
import { PublicSourceSectionStrategy } from 'src/features/workspace/strategies/section/implementations/public-source-section.strategy';
import { SourceSectionStrategy } from 'src/features/workspace/strategies/section/implementations/source-section.strategy';
import { SourcesSectionStrategy } from 'src/features/workspace/strategies/section/implementations/sources-section.strategy';
import type { SectionStrategy } from 'src/features/workspace/strategies/section/section-strategy.interface';
import type { StrategyFactory } from 'src/shared/types/strategy-factory.interface';

const map: Map<Section, SectionStrategy> = new Map<Section, SectionStrategy>([
    [Section.SOURCES, new SourcesSectionStrategy()],
    [Section.SOURCE, new SourceSectionStrategy()],
    [Section.EXERCISE_SETS, new ExerciseSetsSectionStrategy()],
    [Section.EXERCISE_SET, new ExerciseSetSectionStrategy()],
    [Section.EXERCISE_SET_PRACTICE, new ExerciseSetPracticeSectionStrategy()],
    [Section.EXERCISE_SET_PAPER_EVALUATION, new ExerciseSetPaperEvaluationSectionStrategy()],
    [Section.PUBLIC_EXERCISE_SET, new PublicExerciseSetSectionStrategy()],
    [Section.PUBLIC_EXERCISE_SET_PRACTICE, new PublicExerciseSetPracticeSectionStrategy()],
    [Section.PUBLIC_EXERCISE_SET_PAPER_EVALUATION, new PublicExerciseSetPaperEvaluationSectionStrategy()],
    [Section.PUBLIC_SOURCE, new PublicSourceSectionStrategy()],
]);

export const sectionStrategyFactory: StrategyFactory<Section, SectionStrategy> = {
    resolveStrategy(kind: Section): SectionStrategy | undefined {
        return map.get(kind);
    },
};
