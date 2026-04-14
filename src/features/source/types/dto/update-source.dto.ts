import type { SourceVisibility } from 'src/features/source/enums/source-visibility.enum';

export interface UpdateSourceDto {
    title?: string;
    rawText?: string;
    visibility?: SourceVisibility;
}
