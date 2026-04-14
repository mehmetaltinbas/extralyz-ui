import type { SourceVisibility } from 'src/features/source/enums/source-visibility.enum';

export interface CreateSourceDto {
    type: string;
    title?: string;
    rawText?: string;
    url?: string;
    visibility?: SourceVisibility;
}
