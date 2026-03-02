import type { SectionBuilderStrategy } from 'src/features/workspace/strategies/section-builder/section-builder-strategy.interface';

export const SourcesPropsBuilderStrategy: SectionBuilderStrategy = {
    buildProps: async (tab) => {
        return {};
    },
};
